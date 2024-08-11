<script setup lang="ts">
import { getProgress } from '@/api'
import type { Progress } from '@/types/data'
import { computed, onMounted, onUnmounted, ref } from 'vue'

let timerId: number

const progress = ref<Progress>({
  total: 1,
  index: 1
})

const percentage = computed(() => {
  return ((progress.value.total - progress.value.index) / progress.value.total) * 100
})

const format = (percentage: number) => `${percentage.toFixed(0)}%`

const progressComplete = () => {
  progress.value.index = 0
  clearInterval(timerId)
}

onMounted(() => {
  timerId = setInterval(async () => {
    const res = await getProgress()
    progress.value = res

    if (res.index === 0) {
      clearInterval(timerId)
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timerId)
})

defineExpose({progressComplete})
</script>

<template>
  <el-progress :percentage="percentage" :format="format" />
</template>

<style lang="scss" scoped></style>
