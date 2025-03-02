<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'
import { useRoute } from 'nuxt/app'
import { useLocalePath, useI18n } from '#imports'

const route = useRoute()
const localePath = useLocalePath()
const { locale, t } = useI18n()

defineProps<{
  item: NavItem;
}>();

// 使用i18n翻译导航标题
const translateNavTitle = (title: string) => {
  // 如果是默认语言（英文），直接返回原标题
  if (locale.value === 'en') {
    return title;
  }
  
  // 转换标题为小写并移除空格，用于构建翻译键
  const normalizedTitle = title.toLowerCase().replace(/\s+/g, '');
  
  // 尝试从不同的翻译键获取翻译
  const translationKeys = [
    // 1. 尝试从navigation命名空间获取特定键（处理特殊情况）
    ...(title === "Getting Started" ? ['navigation.gettingStarted'] : []),
    ...(title === "Configuration" ? ['navigation.configuration'] : []),
    // 2. 尝试从当前页面的navigation命名空间获取
    `navigation.${normalizedTitle}`,
    // 3. 尝试从ui.sections命名空间获取
    `ui.sections.${normalizedTitle}`
  ];
  
  // 依次尝试每个翻译键
  for (const key of translationKeys) {
    try {
      const translation = t(key);
      // 如果翻译存在且不等于键本身，则返回翻译
      if (translation && translation !== key) {
        return translation;
      }
    } catch (e) {
      // 忽略不存在的键错误，继续尝试下一个键
      continue;
    }
  }
  
  // 所有尝试都失败，返回原始标题
  return title;
}
</script>

<template>
  <li>
    <NuxtLink
      v-if="!item.children || item.children.length === 0"
      :to="localePath(item._path)"
      :class="[
        route.path === item._path ? 'bg-gray-50' : 'hover:bg-gray-50',
        'block rounded-md py-2 pr-2 pl-10 text-sm leading-6 font-semibold text-gray-700',
      ]"
    >
      {{ translateNavTitle(item.title) }}
    </NuxtLink>
    <HeadlessDisclosure as="div" v-else v-slot="{ open }" :default-open="true">
      <HeadlessDisclosureButton
        :class="[
          'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700',
        ]"
      >
        <UIcon
          name="i-heroicons-chevron-right"
          :class="[
            open ? 'rotate-90 text-gray-500' : 'text-gray-400',
            'h-5 w-5 shrink-0',
          ]"
          aria-hidden="true"
        />
        {{ translateNavTitle(item.title) }}
      </HeadlessDisclosureButton>
      <Transition name="fade">
        <HeadlessDisclosurePanel as="ul" class="mt-1 px-2 ml-2">
          <li v-for="subItem in item.children" :key="subItem._path">
            <NavigationItem v-if="subItem.children" :item="subItem" />
            <NuxtLink
              v-else
              :to="localePath(subItem._path)"
              :class="[
                route.path === subItem._path
                  ? 'border-indigo-500'
                  : 'hover:bg-gray-50',
                'block py-1 pr-2 pl-9 text-sm leading-6 text-gray-500 border-l',
              ]"
            >
              {{ translateNavTitle(subItem.title) }}
            </NuxtLink>
          </li>
        </HeadlessDisclosurePanel>
      </Transition>
    </HeadlessDisclosure>
  </li>
</template>
