<script setup>
/**
 * 文档页面主组件
 * 整合侧边栏导航和内容展示功能
 */
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navigation from '@/components/Navigation.vue'
import DocsSidebar from '@/components/DocsSidebar.vue'
import DocsContent from '@/components/DocsContent.vue'

// 路由相关
const route = useRoute()
const router = useRouter()

/**
 * 文档路径与标题的映射表
 * 用于根据当前文档路径显示对应的页面标题
 */
const titleMap = {
  // 快速上手相关文档
  "/getting-started/overview": "概览",
  "/getting-started/install-update": "安装与更新",
  "/getting-started/quick-start": "快速入门",
  
  // Inline Operations 功能相关文档
  "/inline-operations/overview": "概览",
  "/inline-operations/scenario": "使用场景",
  
  // 侧边栏对话功能相关文档
  "/sidebar-chat/overview": "概览",
  "/sidebar-chat/ask-mode/overview": "Ask模式 - 概览",
  "/sidebar-chat/ask-mode/adopt-code": "Ask模式 - 采纳代码",
  "/sidebar-chat/agent-mode/overview": "Agent模式 - 概览",
  "/sidebar-chat/agent-mode/tools": "Agent模式 - 工具列表",
  "/sidebar-chat/custom-agent/overview": "自定义 Agent - 概览",
  "/sidebar-chat/custom-agent/conversation": "自定义 Agent - 对话管理",
  "/sidebar-chat/custom-agent/shortcuts": "自定义 Agent - 快捷方式",
  
  // 上下文管理相关文档
  "/context/overview": "概览",
  "/context/index": "索引",
  "/context/symbols/file": "@ File",
  "/context/symbols/folder": "@ Folder",
  "/context/symbols/codebase": "@ CodeBase",
  "/context/symbols/web": "@ Web",
  "/context/symbols/linter-error": "@ linter error",
  "/context/symbols/rules": "@ rules",
  "/context/symbols/docs": "@ Docs",
  "/context/symbols/url": "@ URL",
  "/context/symbols/diff": "@ Diff",
  "/context/code-snippet": "代码片段添加至上下文",
  "/context/terminal": "终端内容添加至上下文",
  
  // 设置相关文档
  "/settings/general": "通用设置",
  "/settings/index-config": "索引配置",
  "/settings/chat": "Chat",
  "/settings/prompt/system-prompt": "System Prompt",
  "/settings/prompt/custom-prompt": "自定义 Prompt",
  "/settings/rules": "Rules配置",
  "/settings/mcp": "MCP",
  "/settings/unit-test": "单元测试",
  
  // 常见问题解答
  "/faq/security/privacy-statement": "用户隐私安全声明",
  "/faq/security/ai-content-label": "AI内容标识",
}
  
// 当前文档路径
const currentPath = ref('')

/**
 * 设置页面标题
 */
const setTitle = (path) => {
  const title = titleMap[path] || "CatPaw 用户手册"
  document.title = `${title} | CatPaw 用户手册`
}
  
/**
 * 处理导航事件
 */
const handleNavigate = (path) => {
  currentPath.value = path
  setTitle(path)

  // 更新 URL hash，但不触发页面刷新
  const newHash = `#${path}`
  if (window.location.hash !== newHash) {
    window.history.pushState(null, '', newHash)
  }
}

/**
 * 从 URL hash 获取初始路径
 */
const getInitialPath = () => {
  const hash = window.location.hash.slice(1)
  return hash || '/getting-started/overview'
}
  
/**
 * 组件挂载时的初始化
 */
onMounted(() => {
  // 设置初始路径
  const initialPath = getInitialPath()
  currentPath.value = initialPath
  setTitle(initialPath)

  // 监听浏览器前进后退
  window.addEventListener('popstate', () => {
    const path = getInitialPath()
    currentPath.value = path
    setTitle(path)
  })
})
</script>

<template>
  <!-- 文档页面容器 -->
  <div class="guides-page">
    <!-- 顶部导航栏 -->
    <Navigation :transparent="false" />
    
    <!-- 主内容区域 -->
    <div class="guides-main">
      <!-- 左侧导航栏 -->
      <DocsSidebar
        :current-path="currentPath"
        @navigate="handleNavigate"
      />
      
      <!-- 右侧内容区域 -->
      <DocsContent
        :current-path="currentPath"
        @navigate="handleNavigate"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
/**
 * Guides 页面样式 - 本地文档系统
 * 左侧导航栏 + 右侧内容区域的文档展示布局
 */

// 布局变量
$nav-height: 64px;

.guides-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding-top: 64px; // 为固定的顶部导航栏留出空间
}

/**
 * 主内容区域
 * 为固定的左侧导航栏留出空间
 */
.guides-main {
  flex: 1;
  display: flex;
  min-height: calc(100vh - #{$nav-height});
  width: 100%;
  margin-left: 260px; // 为左侧固定导航栏留出空间
}

// 响应式设计
@media (max-width: 1200px) {
  .guides-main {
    margin-left: 0; // 小屏幕时移除左边距
  }
}

@media (max-width: 768px) {
  .guides-page {
    padding-top: 64px; // 保持与桌面端一致的导航栏高度
  }

  .guides-main {
    min-height: calc(100vh - 64px);
    flex-direction: column;
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .guides-page {
    padding-top: 56px; // 移动端导航栏高度
  }

  .guides-main {
    min-height: calc(100vh - 56px);
  }
}
</style>
