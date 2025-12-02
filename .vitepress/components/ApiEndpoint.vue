<template>
  <div class="api-endpoint">
    <div class="endpoint-method" :class="method.toLowerCase()">{{ method }}</div>
    <div class="endpoint-url">
      <span class="base-url">{{ baseUrl }}</span><span class="path">{{ path }}</span>
    </div>
    <button class="copy-btn" @click="copyUrl">
      <span v-if="!copied">复制</span>
      <span v-else>已复制!</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义组件 Props 接口
interface Props {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  baseUrl?: string
}

// 默认基础 URL
const DEFAULT_BASE_URL = 'https://dbapi.muzilix.cn'

const props = withDefaults(defineProps<Props>(), {
  baseUrl: DEFAULT_BASE_URL
})

const copied = ref(false)
const fullUrl = ref(`${props.baseUrl}${props.path}`)

const copyUrl = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(fullUrl.value)
    copied.value = true
    
    // 2秒后恢复"复制"文字
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = fullUrl.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    copied.value = true
    
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>

<style scoped>
.api-endpoint {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  margin: 1rem 0;
  font-family: 'Monaco', 'Consolas', monospace;
  transition: all 0.2s ease;
}

.api-endpoint:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 2px 8px rgba(100, 108, 255, 0.1);
}

.endpoint-method {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  min-width: 60px;
  text-align: center;
  text-transform: uppercase;
}

.endpoint-method.get { background: #10b981; }
.endpoint-method.post { background: #f59e0b; }
.endpoint-method.put { background: #3b82f6; }
.endpoint-method.delete { background: #ef4444; }
.endpoint-method.patch { background: #8b5cf6; }

.endpoint-url {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0;
  white-space: nowrap; 
  min-width: 0; /* 关键：允许内容溢出时缩小 */
  overflow: hidden; /* 隐藏溢出的文本 */
  overflow-x: auto; /* 允许水平滚动 */
  overflow-y: hidden;
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: var(--vp-c-border) transparent;
}

.base-url {
  color: var(--vp-c-text-1);
  font-size: 0.9em;
}

.path {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.copy-btn {
  padding: 6px 12px;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  min-width: 60px;
}

.copy-btn:hover {
  background: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.copy-btn:active {
  transform: translateY(0);
}
</style>