import type { PlotData } from '@/types/data'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDataStore = defineStore('data',
  () => {
    const bvid = ref('')
    const token = ref('')
    const title = ref('')
    const timeOffset = ref(0)

    const plotDataList = ref<PlotData[]>([])

    return { bvid, token, title, plotDataList, timeOffset }
  },
  {
    persist: true
  }
)
