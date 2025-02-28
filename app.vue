<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAppConfig, useHead, useSeoMeta, provide } from '#imports';
import { useRuntimeConfig } from 'nuxt/app';
import { provideHeadlessUseId, useId } from '#imports';

provideHeadlessUseId(() => useId());
const { locale, locales } = useI18n();
const { seo } = useAppConfig();
const publicConfig = useRuntimeConfig().public;

type LocaleType = 'en' | 'zh';

// 提供全局语言切换方法
const switchLocale = (code: LocaleType) => {
  locale.value = code;
};

// 提供给所有组件使用
provide('switchLocale', switchLocale);

useHead({
  link: [{ rel: "icon", href: "/favicon.ico" }],
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
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>
