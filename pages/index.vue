<script setup lang="ts">
import CTA from "~/layouts/default/sections/CTA.vue";
import Features from "~/layouts/default/sections/Features.vue";
import Hero from "~/layouts/default/sections/Hero.vue";
import PoweredBy from "~/layouts/default/sections/PoweredBy.vue";
import { useI18n } from 'vue-i18n';

const { seo } = useAppConfig();
const { t, locale } = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

// 全局状态
const isAppLoading = inject('isAppLoading', ref(false));
const isLanguageSwitching = inject('isLanguageSwitching', ref(false));

// 确保i18n资源已加载
const { pending } = useAsyncData('home-i18n', async () => {
  // 等待i18n资源加载完成
  await nextTick();
  return true;
});

// 页面加载完成时，重置全局状态
onMounted(() => {
  isAppLoading.value = false;
  isLanguageSwitching.value = false;
  document.documentElement.classList.remove('page-transitioning');
  
  // 移除错误处理逻辑
});

// 定义页面过渡效果
definePageMeta({
  pageTransition: {
    name: 'page-transition',
    mode: 'out-in'
  }
});

useSeoMeta({
  title: seo?.siteName,
  ogTitle: seo?.siteName,
  twitterTitle: seo?.siteName,
  description: t('hero.description'),
  ogDescription: t('hero.description'),
  twitterDescription: t('hero.description'),
});
</script>
<template>
  <main class="isolate">
    <!-- 显示加载状态 -->
    <div v-if="pending && !isLanguageSwitching" class="flex justify-center items-center py-24 sm:py-32">
      <ULoading />
    </div>
    
    <Transition name="fade-slide" mode="out-in" appear>
      <div v-if="!pending" key="content">
        <!-- Hero section -->
        <Hero />

        <!-- Logo cloud -->
        <PoweredBy />

        <!-- Features section -->
        <Features />

        <!-- CTA section -->
        <CTA />
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
