<template>
  <div class="language-switcher">
    <UButton
      v-for="locale in availableLocales"
      :key="locale.code"
      :variant="locale.code === currentLocale ? 'solid' : 'outline'"
      :color="locale.code === currentLocale ? 'primary' : 'gray'"
      size="sm"
      class="mx-1 relative overflow-hidden"
      @click="switchLanguage(locale.code)"
      :disabled="isLanguageSwitching"
    >
      <span :key="locale.code" class="inline-flex items-center">
        <span v-if="locale.code === 'en'" class="mr-1">🇺🇸</span>
        <span v-else-if="locale.code === 'zh'" class="mr-1">🇨🇳</span>
        {{ locale.name }}
      </span>
    </UButton>
  </div>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()
const localeCookie = useCookie('i18n_redirected')
const { $preloadTranslations } = useNuxtApp()

type LocaleCode = 'en' | 'zh'

// 注入全局语言切换方法和状态
const globalSwitchLocale = inject<(code: LocaleCode) => void>('switchLocale')
const isLanguageSwitching = inject('isLanguageSwitching', ref(false))

const currentLocale = computed(() => locale.value)
const availableLocales = computed(() => (locales.value as any[]))

const switchLanguage = async (localeCode: string) => {
  if (localeCode === currentLocale.value) return
  
  console.log(`Switching language to: ${localeCode}`);
  isLanguageSwitching.value = true;
  
  try {
    // 先加载新语言的翻译
    await $preloadTranslations(localeCode);
    
    // 保存语言设置到cookie
    localeCookie.value = localeCode;
    
    // 然后切换语言
    locale.value = localeCode as LocaleCode;
    
    // 使用全局语言切换方法
    if (globalSwitchLocale) {
      console.log('Using global switchLocale method');
      await globalSwitchLocale(localeCode as LocaleCode);
    }
    
    // 获取当前路由对应的本地化路径
    const path = switchLocalePath(localeCode as LocaleCode);
    console.log('Current route:', router.currentRoute.value.fullPath);
    console.log('Localized path from switchLocalePath:', path);
    
    if (path) {
      console.log(`Navigating to localized path: ${path}`);
      
      // 添加强制刷新参数，避免hydration mismatch
      const navigatePath = path + (path.includes('?') ? '&' : '?') + '_ts=' + Date.now();
      console.log(`Final navigation path with timestamp: ${navigatePath}`);
      
      // 强制刷新页面以确保导航数据重新加载
      window.location.href = navigatePath;
    } else {
      console.warn('No localized path found, reloading page');
      // 如果没有找到本地化路径，尝试刷新页面
      window.location.href = window.location.pathname + 
        (window.location.pathname.includes('?') ? '&' : '?') + 
        '_locale=' + localeCode + '&_ts=' + Date.now();
    }
  } catch (error) {
    console.error('Error during language switch:', error);
  } finally {
    isLanguageSwitching.value = false;
  }
}

// 组件挂载时确保cookie和当前语言一致
onMounted(() => {
  if (localeCookie.value && localeCookie.value !== locale.value) {
    console.log(`Cookie language (${localeCookie.value}) differs from current (${locale.value}), updating locale`);
    locale.value = localeCookie.value as LocaleCode;
  }
});
</script>

<style scoped>
.language-switcher {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem 0;
}

@media (max-width: 640px) {
  .language-switcher {
    justify-content: flex-start;
  }
}
</style> 