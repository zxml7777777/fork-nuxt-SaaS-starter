<template>
  <div class="language-switcher">
    <UDropdown :items="dropdownItems" :popper="{ placement: 'bottom-end' }">
      <UButton
        color="gray"
        variant="ghost"
        :loading="isLanguageSwitching"
        :disabled="isLanguageSwitching"
        class="flex items-center gap-1"
      >
        <span v-if="currentLocale === 'en'" class="mr-1">🇺🇸</span>
        <span v-else-if="currentLocale === 'zh'" class="mr-1">🇨🇳</span>
        <span>{{ currentLocaleName }}</span>
        <UIcon name="i-heroicons-chevron-down-20-solid" class="ml-1" />
      </UButton>
    </UDropdown>
  </div>
</template>

<script setup lang="ts">
import type { DropdownItem } from '#ui/types'
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()
const localeCookie = useCookie('i18n_redirected')
const nuxtApp = useNuxtApp()

type LocaleCode = 'en' | 'zh'

// 注入全局语言切换方法和状态
const globalSwitchLocale = inject<(code: LocaleCode) => void>('switchLocale')
const isLanguageSwitching = inject('isLanguageSwitching', ref(false))

const currentLocale = computed(() => locale.value)
const availableLocales = computed(() => (locales.value as any[]))

// 获取当前语言的名称
const currentLocaleName = computed(() => {
  const current = availableLocales.value.find(l => l.code === currentLocale.value)
  return current?.name || currentLocale.value
})

// 构建下拉菜单项
const localeItems = computed(() => {
  return availableLocales.value.map(loc => {
    let icon = ''
    if (loc.code === 'en') icon = '🇺🇸'
    else if (loc.code === 'zh') icon = '🇨🇳'
    
    return {
      label: loc.name,
      icon,
      click: () => switchLanguage(loc.code),
      disabled: loc.code === currentLocale.value || isLanguageSwitching.value,
      active: loc.code === currentLocale.value
    }
  })
})

// 格式化为UDropdown需要的格式
const dropdownItems = computed<DropdownItem[][]>(() => {
  return [localeItems.value as unknown as DropdownItem[]]
})

const switchLanguage = async (localeCode: string) => {
  if (localeCode === currentLocale.value) return
  
  console.log(`Switching language to: ${localeCode}`);
  isLanguageSwitching.value = true;
  
  try {
    // 先加载新语言的翻译，优先使用preloadTranslations，兼容preloadBaseTranslations
    if (nuxtApp.$preloadTranslations) {
      await nuxtApp.$preloadTranslations(localeCode);
    } else if (nuxtApp.$preloadBaseTranslations) {
      await nuxtApp.$preloadBaseTranslations(localeCode);
    } else {
      console.warn('No translation preload function available');
    }
    
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
}

@media (max-width: 640px) {
  .language-switcher {
    justify-content: flex-start;
  }
}
</style> 