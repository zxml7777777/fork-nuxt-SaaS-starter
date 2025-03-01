<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAppConfig, useHead, useSeoMeta, provide } from '#imports';
import { useRuntimeConfig } from 'nuxt/app';
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

// 全局状态
const isAppLoading = ref(false);
const isLanguageSwitching = ref(false);
provide('isAppLoading', isAppLoading);
provide('isLanguageSwitching', isLanguageSwitching);

type LocaleType = 'en' | 'zh';

// 预加载语言资源函数
const preloadLocaleResources = async (localeCode: LocaleType) => {
  try {
    // 检查URL中是否有reload参数，用于强制重新加载翻译文件
    const forceReload = window.location.href.includes('reload=true');
    const timestamp = new Date().getTime();
    
    // 清除可能的模块缓存
    try {
      // 尝试重置Vue I18n相关缓存
      // 使用any类型绕过TypeScript类型检查
      const win = window as any;
      if (win.__VUE_I18N_FULL_INSTALL__) {
        win.__VUE_I18N_FULL_INSTALL__ = false;
        setTimeout(() => {
          win.__VUE_I18N_FULL_INSTALL__ = true;
        }, 0);
      }
    } catch (e) {
      console.warn('Failed to reset Vue I18n:', e);
    }
    
    // 预加载基本翻译文件 - 移除时间戳参数
    try {
      console.log(`Loading base locale file for ${localeCode}`);
      // 尝试两种可能的路径
      try {
        const baseModule = await import(`~/i18n/locales/${localeCode}.json`);
        console.log('Successfully loaded base locale file from i18n/locales path:', baseModule);
      } catch (innerError) {
        console.warn(`Failed to load from i18n/locales path, trying locales path...`);
        const baseModule = await import(`~/locales/${localeCode}.json`);
        console.log('Successfully loaded base locale file from locales path:', baseModule);
      }
    } catch (e) {
      console.error(`Failed to load base locale file for ${localeCode}:`, e);
    }
    
    // 尝试预加载组件翻译文件 - 移除时间戳参数
    const componentFiles = [
      'header', 'footer', 'dashboard', 'hero', 
      'auth', 'features', 'pricing', 'faq'
    ];
    
    console.log(`Loading component files for ${localeCode}...`);
    await Promise.allSettled(
      componentFiles.map(component => {
        console.log(`Attempting to load component: ${component} for ${localeCode}`);
        // 尝试两种可能的路径
        return import(`~/i18n/locales/components/${localeCode}/${component}.json`)
          .then(module => {
            console.log(`Successfully loaded component from i18n path: ${component} for ${localeCode}`);
            return module;
          })
          .catch((err) => {
            console.warn(`Failed to load from i18n path, trying locales path for ${component}...`);
            return import(`~/locales/components/${localeCode}/${component}.json`)
              .then(module => {
                console.log(`Successfully loaded component from locales path: ${component} for ${localeCode}`);
                return module;
              })
              .catch((innerErr) => {
                console.warn(`Failed to load component locale file ${component} for ${localeCode} from both paths:`, innerErr);
                return {}; // 忽略不存在的文件
              });
          });
      })
    );
    
    // 如果是强制重新加载，清除URL中的reload参数
    if (forceReload && window.history && window.history.replaceState) {
      const cleanUrl = window.location.href
        .replace(/[&?]reload=true/, '')
        .replace(/[&?]_=\d+/, '')
        .replace(/[&?]nocache=\d+/, '');
      window.history.replaceState({}, document.title, cleanUrl);
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to preload resources for locale ${localeCode}:`, error);
    return false;
  }
};

// 检查并应用保存的语言设置
onMounted(async () => {
  // 设置加载状态
  isAppLoading.value = true;
  
  const savedLocale = localeCookie.value as LocaleType;
  const browserLocale = navigator.language.startsWith('zh') ? 'zh' : 'en';
  const detectedLocale = savedLocale || browserLocale;
  
  // 检查URL中是否有强制重新加载的参数
  const forceReload = window.location.href.includes('reload=true');
  
  // 如果检测到的语言与当前语言不同，或者需要强制重新加载，预加载并切换
  if ((detectedLocale && detectedLocale !== locale.value) || forceReload) {
    await preloadLocaleResources(detectedLocale || locale.value as LocaleType);
    locale.value = detectedLocale || locale.value;
    localeCookie.value = detectedLocale || locale.value;
  } else {
    // 预加载当前语言资源
    await preloadLocaleResources(locale.value as LocaleType);
  }
  
  // 重置加载状态
  isAppLoading.value = false;
  
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
  
  // 预加载新语言资源
  await preloadLocaleResources(code);
  
  // 设置当前语言
  locale.value = code;
  
  // 保存语言设置到cookie
  localeCookie.value = code;
  
  // 延迟重置状态，确保DOM已更新
  setTimeout(() => {
    isLanguageSwitching.value = false;
  }, 300);
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
  if (locale.value === 'zh' && currentPath.startsWith('/zh')) {
    pathWithoutLocale = currentPath.substring(3) || '/';
  }
  
  // 为每种语言生成URL
  (locales.value as any[]).forEach(loc => {
    const localeCode = loc.code as LocaleType;
    const localeIso = loc.iso;
    let url = baseUrl;
    
    if (localeCode === 'en') {
      // 英文是默认语言，不添加前缀
      url += pathWithoutLocale;
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
    href: `${baseUrl}${pathWithoutLocale}`
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
