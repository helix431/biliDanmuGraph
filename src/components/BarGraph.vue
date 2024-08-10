<script setup lang="ts">
import { useDataStore } from '@/stores/data'
import type { PlotData } from '@/types/data'
import { computed, onMounted, ref } from 'vue'

const barPlotRef = ref()

const barPlotHeight = ref(0)

const dataStore = useDataStore()

const barHeight = computed(() => {
  const counts = dataStore.plotDataList.map((item) => item.count)
  const height = barPlotHeight.value / Math.max(...counts)
  return height
})

const onClick = (clickedItem: PlotData) => {
  const foundItem = dataStore.plotDataList.find((item) => item.index === clickedItem.index)
  if (!foundItem) return
  foundItem.clicked = true
}

onMounted(() => {
  barPlotHeight.value = barPlotRef.value.offsetHeight
})
</script>

<template>
  <div
    class="barPlot"
    ref="barPlotRef"
    :style="{
      width: dataStore.plotDataList.length * 4 + 'px',
    }"
  >
    <div
      class="bar"
      v-for="item in dataStore.plotDataList"
      :style="{
        height: item.count * barHeight + 'px',
        backgroundColor: item.clicked ? 'orange' : 'lightskyblue'
      }"
      @click="onClick(item)"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.barPlot {
  display: flex;
  align-items: end;
  height: 100%;
  .bar {
    width: 4px;

    &:hover {
      background-color: red !important;
    }
  }
}
</style>
