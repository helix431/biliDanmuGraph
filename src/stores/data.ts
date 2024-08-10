import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDataStore = defineStore('data',
  () => {
    const bvid = ref('')
    const token = ref('')

    return { bvid, token }
  },
  {
    persist: true
  }
)
