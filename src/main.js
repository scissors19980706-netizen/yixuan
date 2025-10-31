import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createAppRouter } from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)
app.use(Antd)
app.use(createAppRouter())
app.mount('#app')

