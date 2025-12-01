import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ApiEndpoint from '../components/ApiEndpoint.vue'
import './style.css'

// 导出基础 URL 供其他组件使用
const API_BASE_URL = 'https://dbapi.muzilix.cn'

export default {
  extends: DefaultTheme,
  
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('ApiEndpoint', ApiEndpoint)
    
    // 提供全局基础 URL
    app.provide('api-base-url', API_BASE_URL)
  }
} satisfies Theme