<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'
defineProps<{
  navigation: NavItem[];
}>();
</script>
<template>
  <nav class="flex flex-1 flex-col">
    <ul role="list" class="flex flex-1 flex-col gap-y-7">
      <li>
        <ul role="list" class="-mx-2 space-y-1">
          <NavigationItem
            v-for="item in navigation"
            :key="item._path"
            :item="item"
          />
        </ul>
      </li>
    </ul>
  </nav>
</template>
