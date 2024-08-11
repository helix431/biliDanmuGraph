<script setup lang="ts">
import { useDataStore } from '@/stores/data'

const dataStore = useDataStore()

const handleChange = (value: number) => {
  dataStore.timeOffset = value
}
</script>

<template>
  <el-input-number v-model="dataStore.timeOffset" @change="handleChange" />
</template>

<style lang="scss" scoped>
.el-input-number {
  width: 110px;
}
</style>
