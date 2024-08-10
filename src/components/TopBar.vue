<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  bvid: '',
  token: ''
})

const isTokenValid = ref(false)
const showTokenField = ref(false)

const onSubmit = () => {}
const onCheckToken = () => {
  showTokenField.value = !showTokenField.value
}
</script>

<template>
  <el-form :inline="true" :model="form">
    <el-form-item class="bvidField">
      <el-input v-model="form.bvid" placeholder="bvid" clearable />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">获取</el-button>
    </el-form-item>

    <el-form-item>
      <el-button :type="isTokenValid ? 'success' : 'danger'" @click="onCheckToken"
        >token{{ isTokenValid ? '有效' : '失效' }}</el-button
      >
    </el-form-item>

    <el-form-item class="tokenField">
      <Transition name="stretch">
        <el-input v-model="form.token" placeholder="token" clearable v-if="showTokenField" />
      </Transition>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.el-form {
  width: 600px;
  .el-form-item {
    margin-bottom: 0;
    margin-right: 10px;
    &.bvidField {
      width: 140px;
    }
    &.tokenField {
      width: 240px;
    }
  }
}

.stretch-enter-active,
.stretch-leave-active {
  transition: all 0.3s;
}

.stretch-enter-from,
.stretch-leave-to {
  width: 0;
  opacity: 0;
}
</style>
