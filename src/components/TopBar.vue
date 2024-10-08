<script setup lang="ts">
import { getData, validateCookie } from '@/api'
import { useDataStore } from '@/stores/data'
import type { Data } from '@/types/data'
import type { FormInstance } from 'element-plus'
import { onMounted, ref } from 'vue'
import ProgressBar from './ProgressBar.vue'
import TimeOffset from './TimeOffset.vue'

const dataStore = useDataStore()

const form = ref({
  bvid: dataStore.bvid,
  token: dataStore.token
})

const isTokenValid = ref(true)
const showTokenField = ref(false)
const showProgressBar = ref(false)
const progressBarRef = ref()

const formRef = ref<FormInstance>()

const validateToken = async (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入token'))
  }

  await checkToken()

  if (!isTokenValid.value) {
    return callback(new Error('token无效'))
  }

  showTokenField.value = false

  callback()
}

const rules = ref({
  bvid: [{ required: true, message: '请输入bvid', trigger: 'blur' }],
  token: [{ validator: validateToken, trigger: 'blur' }]
})

const processData = (data: Data[]) => {
  const timeData = data
    .map((item) => item.progress)
    .sort((a, b) => a - b)
    .filter((item) => item !== undefined)
  const dataMax = timeData[timeData.length - 1]

  const counts = []
  let threshold = 1000 * 6
  for (let i = 0; i < Math.ceil(dataMax / threshold); i++) {
    counts.push(0)
  }

  for (let i = 0; i < timeData.length; i++) {
    counts[Math.floor(timeData[i] / threshold)]++
  }

  return counts.map((item, index) => {
    return {
      index,
      count: item,
      clicked: false
    }
  })
}

const onSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      showTokenField.value = false

      dataStore.bvid = form.value.bvid
      dataStore.token = form.value.token

      showProgressBar.value = true

      const res = await getData(form.value.bvid)

      dataStore.title = res.title
      document.title = 'danmuGraph' + res.title

      dataStore.plotDataList = processData(res.data)

      progressBarRef.value.progressComplete()
      setTimeout(() => {
        showProgressBar.value = false
      }, 1000)
    } else {
      showTokenField.value = true
    }
  })
}

const checkToken = async () => {
  const res = await validateCookie(form.value.token)

  if (res.code === 0) {
    isTokenValid.value = true
  } else {
    isTokenValid.value = false
  }
}

const onCheckToken = async () => {
  showTokenField.value = !showTokenField.value
}

onMounted(async () => {
  document.title = 'danmuGraph' + dataStore.title || 'danmuGraph'
  await checkToken()
})
</script>

<template>
  <div class="topBar">
    <div class="topBarLeft">
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
          <Transition name="fade">
            <ProgressBar
              class="progressBar"
              ref="progressBarRef"
              v-if="showProgressBar"
            ></ProgressBar>
          </Transition>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBarRight">
      <TimeOffset></TimeOffset>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.topBar {
  display: flex;
  width: 100%;
  justify-content: space-between;
  .topBarLeft {
    .el-form {
      .el-form-item {
        margin-bottom: 0;
        margin-right: 10px;
        &.bvidField {
          width: 150px;
        }
        .progressBar {
          width: 240px;
        }
      }
    }
  }
  .topBarRight {
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

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
