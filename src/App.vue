<script setup lang="ts">
import TopBar from './components/TopBar.vue'
import BarGraph from './components/BarGraph.vue';
</script>

<template>
  <el-container>
    <el-header>
      <TopBar></TopBar>
    </el-header>
    <el-main>
      <BarGraph></BarGraph>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  height: 100vh;
  .el-header {
    --el-header-height: 32px;
    --el-header-padding: 0;
    margin: 5px;
  }
  .el-main {
    padding: 0;
    margin: 0 15px;

  }
}
</style>
