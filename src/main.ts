import { createApp } from 'vue'
import { createPinia } from 'pinia'
import persistedState from 'pinia-plugin-persistedstate'

import 'normalize.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'

const app = createApp(App)

const pinia = createPinia()
pinia.use(persistedState)
app.use(pinia)

app.use(ElementPlus)

app.mount('#app')
