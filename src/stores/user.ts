// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref('')

  const setToken = (value: string) => {
    token.value = value
  }

  return {
    token,
    setToken,
  }
})
