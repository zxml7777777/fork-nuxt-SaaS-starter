<template>
  <div class="grid gap-8 sm:grid-cols-2">
    <DocsSurroundLink
      v-if="prev"
      :link="prev"
      icon="i-heroicons-arrow-left-20-solid"
    />
    <span v-else class="hidden sm:block">&nbsp;</span>
    <DocsSurroundLink
      v-if="next && isSameLanguage(next._path)"
      :link="next"
      icon="i-heroicons-arrow-right-20-solid"
      class="text-right"
    />
    <span v-else class="hidden sm:block">&nbsp;</span>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { ParsedContent } from "@nuxt/content/dist/runtime/types";
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const props = defineProps({
  surround: {
    type: Array as PropType<Pick<ParsedContent, string>[]>,
    default: () => [],
  },
});

const [prev, next] = props.surround || [];

// 检查路径是否与当前语言匹配
function isSameLanguage(path: string): boolean {
  if (!path) return false;
  
  const currentLocale = locale.value;
  // 检查路径是否与当前语言匹配
  if (currentLocale === 'zh') {
    return path.startsWith('/zh/');
  } else {
    // 英文是默认语言，路径不应该以/zh/开头
    return !path.startsWith('/zh/');
  }
}
</script>
