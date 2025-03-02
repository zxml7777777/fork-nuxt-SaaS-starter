<script setup lang="ts">
import { splitByCase, upperFirst } from "scule";
import NavigationItem from '~/components/docs/NavigationItem.vue';

const route = useRoute();
const { seo } = useAppConfig();
const { t } = useI18n();

// 全局状态
const isAppLoading = inject('isAppLoading', ref(false));
const isLanguageSwitching = inject('isLanguageSwitching', ref(false));

// 确保i18n资源已加载
const { pending: i18nPending } = useAsyncData('docs-i18n', async () => {
  // 等待i18n资源加载完成
  await nextTick();
  return true;
});

const { data: page, pending: pagePending } = await useAsyncData(route.path, () =>
  queryContent(route.path).findOne()
);

// 合并所有加载状态
const isLoading = computed(() => i18nPending.value || pagePending.value || isLanguageSwitching.value);

// 页面加载完成时，重置全局状态
onMounted(() => {
  isAppLoading.value = false;
  isLanguageSwitching.value = false;
  document.documentElement.classList.remove('page-transitioning');
});

// 定义页面过渡效果
definePageMeta({
  layout: "docs",
  pageTransition: {
    name: 'page-transition',
    mode: 'out-in'
  }
});

if (!page.value && !isLoading.value && !isLanguageSwitching.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

if (page.value?.redirect && page.value.redirect !== route.path && !isLoading.value && !isLanguageSwitching.value)
  navigateTo(page.value.redirect);

const { data: surround, pending: surroundPending } = await useAsyncData(`${route.path}-surround`, () =>
  queryContent()
    .where({ _extension: "md", navigation: { $ne: false } })
    .only(["title", "description", "_path"])
    .findSurround(withoutTrailingSlash(route.path))
    .then(data => data || [])
);

// 处理surround可能为null的情况
const safetyCheckedSurround = computed(() => surround.value || []);

const headline = computed(() => page.value ? findPageHeadline(page.value) : '');
function findPageHeadline(page: any): string {
  return page._dir?.title
    ? page._dir.title
    : splitByCase(page._dir)
        .map((p: string) => upperFirst(p))
        .join(" ");
}

// 只有在页面加载完成后才设置SEO元数据
if (page.value) {
  useSeoMeta({
    titleTemplate: `%s - ${seo?.siteName} - Docs`,
    title: page.value.title,
    ogTitle: `${page.value.title} - ${seo?.siteName} - Docs`,
    twitterTitle: `${page.value.title} - ${seo?.siteName} - Docs`,
    description: page.value.description,
    ogDescription: page.value.description,
    twitterDescription: page.value.description,
  });
  defineOgImageComponent("Nuxt", {
    title: page.value.title,
    description: page.value.description,
  });
}
</script>
<template>
  <div>
    <!-- 显示加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center py-24 sm:py-32">
      <ULoading />
    </div>
    
    <Transition name="fade-slide" mode="out-in" appear>
      <div v-if="page && !isLoading" key="content" class="flex flex-col lg:grid lg:grid-cols-10 lg:gap-8">
        <div class="lg:col-span-8">
          <div class="relative border-b border-gray-200 dark:border-gray-800 py-8">
            <div
              class="mb-3 text-sm/6 font-semibold text-primary flex items-center gap-1.5"
            >
              {{ headline }}
            </div>
            <div class="flex flex-col lg:flex-row items-start gap-6">
              <!---->
              <div class="flex-1">
                <div
                  class="flex flex-col lg:flex-row lg:items-center lg:justify-between"
                >
                  <h1
                    class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight"
                  >
                    {{ page?.title }}
                  </h1>
                  <!---->
                </div>
                <div class="mt-4 text-lg text-gray-500 dark:text-gray-400">
                  {{ page?.description }}
                </div>
              </div>
            </div>
          </div>
          <div class="mt-8 pb-24 prose prose-primary dark:prose-invert max-w-none">
            <ContentRenderer v-if="page?.body" :value="page" />
            <DocsSurround :surround="safetyCheckedSurround" />
          </div>
        </div>
        <div class="lg:col-span-2 order-first lg:order-last"></div>
      </div>
    </Transition>
  </div>
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
