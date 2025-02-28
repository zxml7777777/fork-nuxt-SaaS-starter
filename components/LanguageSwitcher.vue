<script setup lang="ts">
const { locale } = useI18n();
const switchLocale = inject<(code: 'en' | 'zh') => void>('switchLocale');

const availableLocales = [
  { code: 'en' as const, name: 'English', flag: '🇺🇸' },
  { code: 'zh' as const, name: '中文', flag: '🇨🇳' }
];

const currentLocale = computed(() => 
  availableLocales.find(l => l.code === locale.value)
);
</script>

<template>
  <HeadlessMenu as="div" class="relative inline-block text-left">
    <HeadlessMenuButton
      class="inline-flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900 hover:text-gray-500"
    >
      <span>{{ currentLocale?.flag }}</span>
      <span>{{ currentLocale?.name }}</span>
      <UIcon
        name="i-heroicons-chevron-down"
        class="h-5 w-5 text-gray-400"
        aria-hidden="true"
      />
    </HeadlessMenuButton>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <HeadlessMenuItems
        class="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="py-1">
          <HeadlessMenuItem v-for="lang in availableLocales" :key="lang.code" v-slot="{ active }">
            <button
              @click="switchLocale(lang.code)"
              :class="[
                active ? 'bg-gray-100' : '',
                'flex w-full items-center px-4 py-2 text-sm text-gray-700 gap-x-2'
              ]"
            >
              <span>{{ lang.flag }}</span>
              <span>{{ lang.name }}</span>
            </button>
          </HeadlessMenuItem>
        </div>
      </HeadlessMenuItems>
    </transition>
  </HeadlessMenu>
</template> 