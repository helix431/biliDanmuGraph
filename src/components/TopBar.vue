<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { onMounted, ref } from 'vue'

const form = ref({
  bvid: '',
  token: ''
})

const isTokenValid = ref(true)
const showTokenField = ref(false)

const formRef = ref<FormInstance>()

const validateToken = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入token'))
  }

  if (!isTokenValid.value) {
    return callback(new Error('token无效'))
  }

  callback()
}

const rules = ref({
  bvid: [{ required: true, message: '请输入bvid', trigger: 'blur' }],
  token: [{ validator: validateToken, trigger: 'blur' }]
})

const onSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      showTokenField.value = false

      console.log('valid')
    } else {
      showTokenField.value = true
    }
  })
}

const onCheckToken = () => {
  showTokenField.value = !showTokenField.value
}

onMounted(() => {})
</script>

<template>
  <el-form :inline="true" :model="form" :rules="rules" ref="formRef">
    <el-form-item class="bvidField" prop="bvid">
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

    <el-form-item class="tokenField" prop="token">
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
