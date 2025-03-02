<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types';
import Header from "./docs/Header.vue";
import LanguageSwitcher from "~/components/LanguageSwitcher.vue";

const { locale } = useI18n();

// 使用 ref 和 computed 使导航数据对语言变化做出反应
const navigationData = ref<NavItem[] | null>(null);
const navigationItems = computed(() => {
  if (navigationData.value && navigationData.value.length > 0) {
    return navigationData.value[0].children as NavItem[];
  }
  return [] as NavItem[];
});

// 加载导航数据的函数
const loadNavigation = async () => {
  const { data } = await useAsyncData<NavItem[]>(
    `navigation-${locale.value}`, // 使用带有语言的键，确保每次语言变化时都重新获取
    () => fetchContentNavigation(queryContent(locale.value === 'zh' ? '/zh' : '/'))
  );
  navigationData.value = data.value;
};

// 初始加载
await loadNavigation();

// 监听语言变化，重新加载导航
watch(locale, async () => {
  await loadNavigation();
}, { immediate: false });

provide("navigation", navigationItems);
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - Nuxt SaaS Starter`
      : "Nuxt SaaS Starter";
  },
});
</script>
<template>
  <div class="bg-white">
    <Header />
    <main class="min-h-[calc(100vh-4em)]">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="flex flex-col lg:grid lg:grid-cols-10 lg:gap-8">
          <!-- LEFT -->
          <div class="lg:col-span-2">
            <aside
              class="hidden overflow-y-auto lg:block lg:max-h-[calc(100vh-4em)] lg:sticky lg:top-[4em] py-8 lg:px-4 lg:-mx-4"
            >
              <div class="relative">
                <DocsNavigationTree
                  v-if="navigationItems"
                  :navigation="navigationItems"
                />
              </div>
            </aside>
          </div>
          <!-- CENTER/RIGHT -->
          <div class="lg:col-span-8">
            <slot />
          </div>
        </div>
      </div>
    </main>
    <ClientOnly>
      <LazyDocsSearchMenu />
    </ClientOnly>
  </div>
</template>
