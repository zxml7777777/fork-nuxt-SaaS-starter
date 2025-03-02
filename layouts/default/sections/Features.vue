<script setup>
const { t, locale } = useI18n();

// 定义后备的feature items
const fallbackFeatures = [
  {
    title: "优雅设计",
    description: "简约而不简单的界面设计，为您的创意提供完美展示。"
  },
  {
    title: "闪电部署",
    description: "一键部署应用到云端，无需复杂配置。"
  },
  {
    title: "无缝集成",
    description: "与您喜爱的工具和服务完美融合，提升工作效率。"
  },
  {
    title: "卓越性能",
    description: "强大的性能支持，轻松应对数百万用户访问。"
  }
];

// 英文版后备内容
const fallbackFeaturesEn = [
  {
    title: "Elegant Design",
    description: "Simple yet sophisticated interface design that perfectly showcases your creativity."
  },
  {
    title: "Lightning Deployment",
    description: "Deploy your app to the cloud with a single click, no complex configuration required."
  },
  {
    title: "Seamless Integration",
    description: "Perfectly integrates with your favorite tools and services to enhance productivity."
  },
  {
    title: "Outstanding Performance",
    description: "Powerful performance support that easily handles millions of user visits."
  }
];

// 获取当前语言的feature items
const featureItems = computed(() => {
  try {
    // 尝试从i18n获取
    const items = t('components.sections.features.items', [], { returnObjects: true });
    console.log('Feature items from i18n:', items);
    
    // 检查items是否为有效数组
    if (Array.isArray(items) && items.length > 0) {
      return items;
    }
    
    // 如果无效，使用后备内容
    return locale.value === 'en' ? fallbackFeaturesEn : fallbackFeatures;
  } catch (error) {
    console.error('Error getting feature items:', error);
    return locale.value === 'en' ? fallbackFeaturesEn : fallbackFeatures;
  }
});

// 定义不同的图标
const icons = [
  'i-simple-icons-apple',
  'i-simple-icons-vercel',
  'i-simple-icons-figma',
  'i-simple-icons-amazonaws'
];

// 获取图标
const getIcon = (index) => {
  return icons[index] || 'i-simple-icons-apple';
};
</script>
<template>
  <div class="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
    <div class="mx-auto max-w-2xl lg:text-center">
      <h2 class="text-base font-semibold leading-7 text-zinc-600">
        {{ t('components.sections.features.title') }}
      </h2>
      <p
        class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
      >
        {{ t('components.sections.features.subtitle') }}
      </p>
      <p class="mt-6 text-lg leading-8 text-slate-600">
        {{ t('components.sections.features.description') }}
      </p>
    </div>
    <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
      <dl
        class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16"
      >
        <div
          v-for="(feature, index) in featureItems"
          :key="index"
          class="relative pl-16"
        >
          <dt class="text-base font-semibold leading-7 text-slate-900">
            <div
              class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-600"
            >
              <UIcon
                :name="getIcon(index)"
                class="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </div>
            {{ feature.title || `Feature ${index + 1}` }}
          </dt>
          <dd class="mt-2 text-base leading-7 text-slate-600">
            {{ feature.description || 'Description not available.' }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>
