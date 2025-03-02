<template>
  <div>
    <div v-if="pending" class="flex justify-center items-center py-24 sm:py-32">
      <ULoading />
    </div>
    
    <div v-else>
      <h2 class="text-2xl font-semibold leading-7 text-gray-900">{{ t('dashboard.panel.title') }}</h2>
      <p class="mt-1 text-sm leading-6 text-gray-500 mb-2">
        {{ t('dashboard.panel.welcome') }}
      </p>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium">{{ t('dashboard.panel.overview') }}</h3>
          </div>
        </template>

        <div class="space-y-6">
          <div>
            <h4 class="text-base font-medium mb-2">{{ t('dashboard.panel.stats') }}</h4>
            <UiPlaceHolder class="h-24" />
          </div>
          
          <div>
            <h4 class="text-base font-medium mb-2">{{ t('dashboard.panel.activity') }}</h4>
            <p class="text-sm text-gray-500">{{ t('dashboard.panel.noActivity') }}</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { pending } = useAsyncData('dashboard-i18n', async () => {
  await nextTick();
  return true;
});

useHead({
  title: t('dashboard.panel.title'),
});

definePageMeta({
  layout: "dashboard",
});
</script>
