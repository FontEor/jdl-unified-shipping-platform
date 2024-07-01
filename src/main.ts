import { createApp } from 'vue'
import { store } from './store'
import router from './router'
import 'element-plus/dist/index.css'
import '@/assets/styles/index.scss'
import '@/assets/styles/element/index.scss'
import ElementPlus from 'element-plus'
import App from './App.vue'

import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'
import './utils/resizeObserver'
zhCn.el.pagination.total = '共{total}条记录'
zhCn.el.pagination.goto = '跳转'

createApp(App).use(router).use(store).use(ElementPlus, { locale: zhCn }).mount('#app')
