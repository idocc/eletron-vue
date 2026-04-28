<script setup>
import { useUserStore } from '@/stores/index';

const userStore = useUserStore()

console.error(userStore.token)
</script>

<template>
  <RouterView />
</template>