<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAppConfig, useHead, useSeoMeta, provide } from '#imports';
import { useRuntimeConfig, useNuxtApp } from 'nuxt/app';
import { provideHeadlessUseId, useId } from '#imports';
import { useCookie } from 'nuxt/app';
import { onMounted, computed, ref, watch } from 'vue';
import { useRoute } from 'nuxt/app';

provideHeadlessUseId(() => useId());
const { locale, locales } = useI18n();
const { seo } = useAppConfig();
const publicConfig = useRuntimeConfig().public;
const localeCookie = useCookie('i18n_redirected');
const route = useRoute();
const nuxtApp = useNuxtApp();

// 全局状态
const isAppLoading = ref(false);
const isLanguageSwitching = ref(false);
provide('isAppLoading', isAppLoading);
provide('isLanguageSwitching', isLanguageSwitching);

type LocaleType = 'en' | 'zh';

// 预加载语言资源函数
const preloadLocaleResources = async (localeCode: LocaleType) => {
  // 检查URL中是否有reload参数，用于强制重新加载翻译文件
  const forceReload = window.location.href.includes('reload=true');
  
  // 清除可能的模块缓存
  // 尝试重置Vue I18n相关缓存
  // 使用any类型绕过TypeScript类型检查
  const win = window as any;
  if (win.__VUE_I18N_FULL_INSTALL__) {
    win.__VUE_I18N_FULL_INSTALL__ = false;
    setTimeout(() => {
      win.__VUE_I18N_FULL_INSTALL__ = true;
    }, 0);
  }
  
  // 使用插件提供的方法预加载所有翻译
  if (nuxtApp.$preloadTranslations) {
    await nuxtApp.$preloadTranslations(localeCode);
  } else if (nuxtApp.$preloadBaseTranslations) {
    // 兼容性处理，如果没有preloadTranslations函数，则使用preloadBaseTranslations
    await nuxtApp.$preloadBaseTranslations(localeCode);
  }
  
  // 如果是强制重新加载，清除URL中的reload参数
  if (forceReload && window.history && window.history.replaceState) {
    const url = window.location.href.replace(/[?&]reload=true/, '');
    window.history.replaceState({}, document.title, url);
  }
};

// 检查并应用保存的语言设置
onMounted(async () => {
  // 设置加载状态
  isAppLoading.value = true;
  
  try {
    const savedLocale = localeCookie.value as LocaleType;
    const browserLocale = navigator.language.startsWith('zh') ? 'zh' : 'en';
    
    // 优先使用cookie中保存的语言，如果没有则使用浏览器语言
    const detectedLocale = savedLocale || browserLocale;
    
    // 检查URL中是否有语言参数
    const urlParams = new URLSearchParams(window.location.search);
    const urlLocale = urlParams.get('_locale') as LocaleType | null;
    
    // 确定最终使用的语言：URL参数 > Cookie > 浏览器语言 > 当前语言
    const finalLocale = urlLocale || detectedLocale || locale.value;
    
    // 只有当最终语言与当前语言不同时才切换
    if (finalLocale !== locale.value) {
      // 预加载语言资源
      await preloadLocaleResources(finalLocale);
      
      // 设置当前语言
      locale.value = finalLocale;
      
      // 保存到cookie (不使用document.cookie直接设置，避免重复设置)
      if (!localeCookie.value || localeCookie.value !== finalLocale) {
        localeCookie.value = finalLocale;
      }
      
      // 更新HTML lang属性
      document.documentElement.setAttribute('lang', finalLocale);
    } else {
      // 预加载当前语言资源
      await preloadLocaleResources(locale.value as LocaleType);
    }
    
    // 清除URL中的语言参数，避免刷新时重复处理
    if (urlLocale && window.history && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete('_locale');
      url.searchParams.delete('_ts');
      window.history.replaceState({}, document.title, url.toString());
    }
  } catch {
    // 错误处理
  } finally {
    // 重置加载状态
    isAppLoading.value = false;
  }
  
  // 监听页面加载状态
  window.addEventListener('beforeunload', () => {
    isAppLoading.value = true;
  });
});

// 提供全局语言切换方法
const switchLocale = async (code: LocaleType) => {
  if (code === locale.value) return;
  
  // 设置语言切换状态
  isLanguageSwitching.value = true;
  
  try {
    // 预加载新语言资源
    await preloadLocaleResources(code);
    
    // 设置当前语言
    locale.value = code;
    
    // 保存语言设置到cookie (设置长期有效的cookie)
    localeCookie.value = code;
    document.cookie = `i18n_redirected=${code}; path=/; max-age=31536000; SameSite=Lax`;
    
    // 更新HTML lang属性
    document.documentElement.setAttribute('lang', code);
  } catch {
    // 错误处理
  } finally {
    // 延迟重置状态，确保DOM已更新
    setTimeout(() => {
      isLanguageSwitching.value = false;
    }, 300);
  }
};

// 提供给所有组件使用
provide('switchLocale', switchLocale);

// 监听语言变化，确保路由正确更新
watch(locale, (newLocale) => {
  // 更新HTML lang属性
  document.documentElement.setAttribute('lang', newLocale);
});

// 为每种语言生成当前页面的URL
const alternateUrls = computed(() => {
  const baseUrl = publicConfig.SiteUrl || 'http://localhost:3000';
  const currentPath = route.fullPath;
  const urls = [];
  
  // 获取不带语言前缀的路径
  let pathWithoutLocale = currentPath;
  
  // 修复：正确处理中文路径前缀
  if (currentPath.startsWith('/zh')) {
    // 移除/zh前缀，保留其余部分
    pathWithoutLocale = currentPath.substring(3) || '/';
  } else if (currentPath.includes('?')) {
    // 处理带查询参数的路径
    const [path, query] = currentPath.split('?');
    pathWithoutLocale = path + '?' + query;
  }
  
  // 为每种语言生成URL
  (locales.value as any[]).forEach(loc => {
    const localeCode = loc.code as LocaleType;
    const localeIso = loc.iso;
    let url = baseUrl;
    
    if (localeCode === 'en') {
      // 英文是默认语言，不添加前缀
      url += pathWithoutLocale === '/' ? '' : pathWithoutLocale;
    } else {
      // 非默认语言添加前缀
      url += `/zh${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    }
    
    urls.push({
      hrefLang: localeIso,
      href: url
    });
  });
  
  // 添加x-default
  urls.push({
    hrefLang: 'x-default',
    href: `${baseUrl}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
  });
  
  return urls;
});

useHead({
  link: [
    { rel: "icon", href: "/favicon.ico" },
    // 添加hreflang标签，指示不同语言版本之间的关系
    ...alternateUrls.value.map(({ hrefLang, href }) => ({
      rel: 'alternate',
      hrefLang,
      href
    }))
  ],
  htmlAttrs: {
    lang: locale.value,
  },
});

useSeoMeta({
  robots: "index, follow",
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  ogUrl: publicConfig.SiteUrl,
  ogType: "website",
  ogLocale: locale.value === 'en' ? 'en_US' : 'zh_CN',
  twitterCard: "summary_large_image",
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="primary" />
    <Transition name="fade" mode="out-in">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </Transition>
    <UNotifications />
  </div>
</template>

<style>
/* 页面过渡效果 */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.3s ease-out;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 淡入淡出效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 全局过渡效果 */
.layout-enter-active,
.layout-leave-active {
  transition: all 0.3s;
}

.layout-enter-from,
.layout-leave-to {
  filter: blur(1rem);
  opacity: 0;
}

/* 确保过渡效果在整个应用中生效 */
html {
  scroll-behavior: smooth;
}

body {
  transition: background-color 0.3s ease;
}
</style>
