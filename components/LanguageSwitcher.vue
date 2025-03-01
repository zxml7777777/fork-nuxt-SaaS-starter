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

type LocaleCode = 'en' | 'zh'

// 注入全局语言切换方法和状态
const globalSwitchLocale = inject<(code: LocaleCode) => void>('switchLocale')
const isLanguageSwitching = inject('isLanguageSwitching', ref(false))

const currentLocale = computed(() => locale.value)
const availableLocales = computed(() => (locales.value as any[]))

const switchLanguage = async (localeCode: string) => {
  if (localeCode === currentLocale.value) return
  
  console.log(`Switching language to: ${localeCode}`);
  
  try {
    // 手动预加载语言文件
    if (localeCode === 'zh') {
      console.log('Manually preloading Chinese language files');
      try {
        // 加载基本翻译文件
        const baseModule = await import(`~/i18n/locales/zh.json`);
        console.log('Successfully loaded zh.json:', baseModule);
        
        // 加载组件翻译文件
        const componentFiles = [
          'header', 'footer', 'dashboard', 'hero', 
          'auth', 'features', 'pricing', 'faq'
        ];
        
        await Promise.all(
          componentFiles.map(component => 
            import(`~/i18n/locales/components/zh/${component}.json`)
              .then(module => {
                console.log(`Successfully loaded component: ${component} for zh`);
                return module;
              })
              .catch(err => {
                console.warn(`Failed to load component: ${component} for zh:`, err);
                return {};
              })
          )
        );
      } catch (e) {
        console.error('Failed to manually preload Chinese language files:', e);
      }
    }
    
    // 设置当前语言
    locale.value = localeCode as LocaleCode
    
    // 保存语言设置到cookie
    localeCookie.value = localeCode
    
    // 使用全局语言切换方法
    if (globalSwitchLocale) {
      console.log('Using global switchLocale method');
      await globalSwitchLocale(localeCode as LocaleCode)
    }
    
    // 获取当前路由对应的本地化路径
    const path = switchLocalePath(localeCode as LocaleCode)
    if (path) {
      console.log(`Navigating to localized path: ${path}`);
      
      // 添加时间戳参数，强制浏览器重新请求资源，避免缓存问题
      const timestamp = new Date().getTime()
      const separator = path.includes('?') ? '&' : '?'
      
      // 使用硬刷新方式切换语言，确保所有浏览器都能正确加载翻译文件
      const finalPath = `${path}${separator}reload=true&nocache=${timestamp}`;
      
      console.log(`Final navigation path with reload: ${finalPath}`);
      
      // 使用location.replace而不是location.href，避免在历史记录中创建多余的条目
      window.location.replace(finalPath);
    }
  } catch (error) {
    console.error('Error during language switch:', error);
  }
}
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