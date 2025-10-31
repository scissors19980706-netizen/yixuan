<script setup>
/**
 * 文档内容展示组件
 * 负责加载和渲染 Markdown 文档内容
 */
import { ref, computed, watch, onMounted } from 'vue'
import { marked } from 'marked'
// 优化 highlight.js 导入 - 只导入核心库和常用语言
import hljs from 'highlight.js/lib/core'
// 按需导入常用语言
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml' // 用于 HTML
import markdown from 'highlight.js/lib/languages/markdown'

// 注册需要的语言
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash) // bash 的别名
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('markdown', markdown)

// 导入所有文档内容 - 改为动态导入
// import gettingStartedOverview from '../docs/getting-started/overview.md?raw'
// import gettingStartedInstall from '../docs/getting-started/install-update.md?raw'
// import gettingStartedQuickStart from '../docs/getting-started/quick-start.md?raw'
// import sidebarChatOverview from '../docs/sidebar-chat/overview.md?raw'
// import inlineOperationsOverview from '../docs/inline-operations/overview.md?raw'
// import contextOverview from '../docs/context/overview.md?raw'

/**
 * 动态导入文档内容的映射表
 * 使用动态 import() 实现按需加载
 */
const docsImportMap = {
  '/getting-started/overview': () => import('../docs/getting-started/overview.md?raw'),
  '/getting-started/install-update': () => import('../docs/getting-started/install-update.md?raw'),
  '/getting-started/quick-start': () => import('../docs/getting-started/quick-start.md?raw'),
  '/sidebar-chat/overview': () => import('../docs/sidebar-chat/overview.md?raw'),
  '/inline-operations/overview': () => import('../docs/inline-operations/overview.md?raw'),
  '/context/overview': () => import('../docs/context/overview.md?raw'),
}

/**
 * 文档导航结构 - 与DocsSidebar保持一致
 * 用于生成上一个/下一个文档的导航
 */
const navigationStructure = [
  {
    title: '快速上手',
    key: 'getting-started',
    children: [
      { title: '概览', path: '/getting-started/overview' },
      { title: '安装与更新', path: '/getting-started/install-update' },
      { title: '快速入门', path: '/getting-started/quick-start' }
    ]
  },
  {
    title: 'Inline Edit',
    key: 'inline-operations',
    children: [
      { title: '概览', path: '/inline-operations/overview' },
      { title: '使用场景', path: '/inline-operations/scenario' }
    ]
  },
  {
    title: 'Chat Agent',
    key: 'sidebar-chat',
    children: [
      { title: '概览', path: '/sidebar-chat/overview' },
      {
        title: 'Ask',
        children: [
          { title: '概览', path: '/sidebar-chat/ask-mode/overview' },
          { title: '采纳代码', path: '/sidebar-chat/ask-mode/adopt-code' }
        ]
      },
      {
        title: 'Agent',
        children: [
          { title: '概览', path: '/sidebar-chat/agent-mode/overview' },
          { title: '工具列表', path: '/sidebar-chat/agent-mode/tools' }
        ]
      },
      {
        title: '自定义Agent',
        children: [
          { title: '概览', path: '/sidebar-chat/custom-agent/overview' },
          { title: '对话管理', path: '/sidebar-chat/custom-agent/conversation' },
          { title: '快捷方式', path: '/sidebar-chat/custom-agent/shortcuts' }
        ]
      }
    ]
  },
  {
    title: '上下文',
    key: 'context',
    children: [
      { title: '概览', path: '/context/overview' },
      { title: '索引', path: '/context/index' },
      {
        title: '@ Symbols',
        children: [
          { title: '@ File', path: '/context/symbols/file' },
          { title: '@ Folder', path: '/context/symbols/folder' },
          { title: '@ CodeBase', path: '/context/symbols/codebase' },
          { title: '@ Web', path: '/context/symbols/web' },
          { title: '@ linter error', path: '/context/symbols/linter-error' },
          { title: '@ rules', path: '/context/symbols/rules' },
          { title: '@ Docs', path: '/context/symbols/docs' },
          { title: '@ URL', path: '/context/symbols/url' },
          { title: '@ Diff', path: '/context/symbols/diff' }
        ]
      },
      { title: '代码片段添加至上下文', path: '/context/code-snippet' },
      { title: '终端内容添加至上下文', path: '/context/terminal' }
    ]
  },
  {
    title: '工具台',
    key: 'tools',
    children: [
      { title: '概览', path: '/tools/overview' },
      { title: 'PR', path: '/tools/pr' },
      { title: '工作流', path: '/tools/workflow' }
    ]
  },
  {
    title: '设置',
    key: 'settings',
    children: [
      { title: '通用设置', path: '/settings/general' },
      { title: '索引配置', path: '/settings/index-config' },
      { title: 'Chat', path: '/settings/chat' },
      {
        title: 'Prompt设置',
        children: [
          { title: 'System Prompt', path: '/settings/prompt/system-prompt' },
          { title: '自定义 Prompt', path: '/settings/prompt/custom-prompt' }
        ]
      },
      { title: 'Rules配置', path: '/settings/rules' },
      { title: 'MCP', path: '/settings/mcp' },
      { title: '单元测试', path: '/settings/unit-test' }
    ]
  },
  {
    title: 'FAQ',
    key: 'faq',
    children: [
      {
        title: '安全/隐私',
        children: [
          { title: '用户隐私安全声明', path: '/faq/security/privacy-statement' },
          { title: 'AI内容标识', path: '/faq/security/ai-content-label' }
        ]
      }
    ]
  }
]

// 定义组件属性
const props = defineProps({
  currentPath: {
    type: String,
    required: true
  }
})

// 定义事件
const emit = defineEmits(['navigate'])

// 响应式数据
const content = ref('')
const loading = ref(false)
const error = ref(null)
const tableOfContents = ref([])

/**
 * 扁平化导航结构，获取所有文档页面的线性列表
 */
const flattenNavigation = (structure) => {
  const result = []

  const traverse = (items) => {
    items.forEach(item => {
      if (item.path) {
        result.push({
          title: item.title,
          path: item.path
        })
      }
      if (item.children) {
        traverse(item.children)
      }
    })
  }

  traverse(structure)
  return result
}

// 获取扁平化的文档列表
const flatDocsList = flattenNavigation(navigationStructure)

/**
 * 计算当前文档的上一个和下一个文档
 */
const navigationInfo = computed(() => {
  if (!props.currentPath) {
    return { prev: null, next: null }
  }

  const currentIndex = flatDocsList.findIndex(doc => doc.path === props.currentPath)

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  return {
    prev: currentIndex > 0 ? flatDocsList[currentIndex - 1] : null,
    next: currentIndex < flatDocsList.length - 1 ? flatDocsList[currentIndex + 1] : null
  }
})

/**
 * 配置 marked 选项
 * 启用代码高亮和其他功能
 */
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (err) {
        console.warn('代码高亮失败:', err)
      }
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true
})

/**
 * 解析 markdown 内容中的标题，生成目录
 */
const parseTableOfContents = (markdownContent) => {
  const headings = []
  const lines = markdownContent.split('\n')

  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const title = match[2].trim()
      const id = title
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // 保留中文、英文、数字、空格和连字符
        .replace(/\s+/g, '-') // 空格替换为连字符
        .replace(/-+/g, '-') // 多个连字符合并为一个
        .replace(/^-|-$/g, '') // 去掉开头和结尾的连字符

      headings.push({
        level,
        title,
        id: id || `heading-${index}`,
        line: index
      })
    }
  })

  return headings
}

/**
 * 为 HTML 内容中的标题添加 ID
 */
const addHeadingIds = (htmlContent, headings) => {
  let result = htmlContent

  headings.forEach((heading) => {
    // 匹配对应级别的标题标签
    const regex = new RegExp(`<h${heading.level}>(.*?${heading.title}.*?)</h${heading.level}>`, 'i')
    const replacement = `<h${heading.level} id="${heading.id}">$1</h${heading.level}>`
    result = result.replace(regex, replacement)
  })

  return result
}

/**
 * 根据路径获取文档内容
 */
const loadContent = async (path) => {
  if (!path) return

  loading.value = true
  error.value = null

  try {
    // 从动态导入映射表中获取文档内容
    const importFunction = docsImportMap[path]

    if (importFunction) {
      // 动态导入文档内容
      const module = await importFunction()
      const markdownContent = module.default

      // 解析目录
      const headings = parseTableOfContents(markdownContent)
      tableOfContents.value = headings

      // 解析 markdown 为 HTML
      let htmlContent = marked(markdownContent)

      // 为标题添加 ID
      htmlContent = addHeadingIds(htmlContent, headings)

      content.value = htmlContent
    } else {
      throw new Error(`文档不存在: ${path}`)
    }

  } catch (err) {
    console.error('加载文档失败:', err)
    error.value = err.message
    content.value = getErrorContent(path)
    tableOfContents.value = []
  } finally {
    loading.value = false
  }
}

/**
 * 获取错误页面内容
 */
const getErrorContent = (path) => {
  return `
    <div class="error-content">
      <h2>文档未找到</h2>
      <p>抱歉，无法找到路径 <code>${path}</code> 对应的文档。</p>
      <p>可能的原因：</p>
      <ul>
        <li>文档文件不存在</li>
        <li>文档尚未创建</li>
        <li>路径配置错误</li>
      </ul>
      <p>可用的文档路径：</p>
      <ul>
        ${Object.keys(docsImportMap).map(docPath => `<li><code>${docPath}</code></li>`).join('')}
      </ul>
    </div>
  `
}

/**
 * 获取默认内容（当没有选择文档时）
 */
const getDefaultContent = () => {
  return `
    <div class="welcome-content">
      <h1>欢迎使用 CatPaw 用户手册</h1>
      <p>CatPaw 是一款强大的 AI 编程助手，为开发者提供智能的代码补全、对话交互和开发工具集成。</p>

      <h2>快速导航</h2>
      <div class="quick-links">
        <div class="link-card">
          <h3>🚀 快速上手</h3>
          <p>了解如何安装和配置 CatPaw</p>
        </div>
        <div class="link-card">
          <h3>💬 Chat Agent</h3>
          <p>学习如何与 AI 助手进行有效对话</p>
        </div>
        <div class="link-card">
          <h3>⚡ Inline Edit</h3>
          <p>掌握代码编辑器中的 AI 操作</p>
        </div>
        <div class="link-card">
          <h3>🔍 上下文管理</h3>
          <p>优化 AI 理解代码上下文的能力</p>
        </div>
      </div>

      <p>请从左侧导航栏选择您感兴趣的主题开始阅读。</p>
    </div>
  `
}

/**
 * 计算显示的内容
 */
const displayContent = computed(() => {
  if (loading.value) {
    return '<div class="loading-content"><div class="spinner"></div><p>正在加载文档...</p></div>'
  }

  if (!props.currentPath) {
    return getDefaultContent()
  }

  return content.value || getErrorContent(props.currentPath)
})

/**
 * 监听路径变化，自动加载对应文档
 */
watch(() => props.currentPath, (newPath) => {
  if (newPath) {
    loadContent(newPath)
  }
}, { immediate: true })

/**
 * 跳转到指定标题
 */
const scrollToHeading = (headingId) => {
  const element = document.getElementById(headingId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

/**
 * 处理文档导航
 */
const handleDocNavigation = (path) => {
  // 触发父组件的导航事件
  emit('navigate', path)
}

/**
 * 组件挂载后的处理
 */
onMounted(() => {
  // 如果有初始路径，加载对应文档
  if (props.currentPath) {
    loadContent(props.currentPath)
  }
})
</script>

<template>
  <div class="docs-content">
    <!-- 内容区域 -->
    <div class="content-wrapper">
      <article
        class="markdown-content"
        v-html="displayContent"
      ></article>

      <!-- 文档导航按钮 -->
      <nav class="doc-navigation" v-if="props.currentPath">
        <!-- 上一个文档 -->
        <div class="nav-item prev" v-if="navigationInfo.prev">
          <button
            class="nav-button"
            @click="handleDocNavigation(navigationInfo.prev.path)"
          >
            <svg class="nav-icon" viewBox="0 0 16 16">
              <path d="M10 2L4 8l6 6" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            <div class="nav-content">
              <span class="nav-label">上一个文档</span>
              <span class="nav-title">{{ navigationInfo.prev.title }}</span>
            </div>
          </button>
        </div>

        <!-- 占位符，保持右侧按钮对齐 -->
        <div class="nav-spacer" v-else></div>

        <!-- 下一个文档 -->
        <div class="nav-item next" v-if="navigationInfo.next">
          <button
            class="nav-button"
            @click="handleDocNavigation(navigationInfo.next.path)"
          >
            <div class="nav-content">
              <span class="nav-label">下一个文档</span>
              <span class="nav-title">{{ navigationInfo.next.title }}</span>
            </div>
            <svg class="nav-icon" viewBox="0 0 16 16">
              <path d="M6 2l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </button>
        </div>
      </nav>
    </div>

    <!-- 右侧目录导航 -->
    <div class="content-toc" v-if="tableOfContents.length > 0">
      <div class="toc-header">
        <h4>本页目录</h4>
      </div>
      <nav class="toc-nav">
        <ul class="toc-list">
          <li
            v-for="heading in tableOfContents"
            :key="heading.id"
            :class="`toc-level-${heading.level}`"
            class="toc-item"
          >
            <a
              :href="`#${heading.id}`"
              @click.prevent="scrollToHeading(heading.id)"
              class="toc-link"
            >
              {{ heading.title }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped lang="scss">
/**
 * 文档内容区域样式
 * 提供清晰的阅读体验和代码高亮
 */

.docs-content {
  flex: 1;
  display: flex;
  height: 100%;
  background: white;
}

/**
 * 主内容区域
 */
.content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f8f9fa;
  }

  &::-webkit-scrollbar-thumb {
    background: #dee2e6;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #adb5bd;
  }
}

/**
 * Markdown 内容样式
 */
.markdown-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 48px;
  line-height: 1.6;
  color: #2c3e50;

  // 标题样式
  h1, h2, h3, h4, h5, h6 {
    margin-top: 2em;
    margin-bottom: 1em;
    font-weight: 600;
    line-height: 1.25;
    color: #1a202c;

    &:first-child {
      margin-top: 0;
    }
  }

  h1 {
    font-size: 2.25em;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 0.5em;
  }

  h2 {
    font-size: 1.75em;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.3em;
  }

  h3 {
    font-size: 1.5em;
  }

  h4 {
    font-size: 1.25em;
  }

  // 段落样式
  p {
    margin-bottom: 1em;
    color: #4a5568;
  }

  // 链接样式
  a {
    color: #0ff7ae;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all 0.2s ease;

    &:hover {
      border-bottom-color: #0ff7ae;
    }
  }

  // 列表样式
  ul, ol {
    margin-bottom: 1em;
    padding-left: 2em;

    li {
      margin-bottom: 0.5em;
      color: #4a5568;
    }
  }

  // 代码样式
  code {
    background: #f7fafc;
    color: #e53e3e;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  }

  pre {
    background: #2d3748;
    color: #e2e8f0;
    padding: 1.5em;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1.5em 0;

    code {
      background: transparent;
      color: inherit;
      padding: 0;
      font-size: 0.875em;
    }
  }

  // 引用样式
  blockquote {
    border-left: 4px solid #0ff7ae;
    background: #f0fdf4;
    padding: 1em 1.5em;
    margin: 1.5em 0;

    p {
      margin: 0;
      color: #2d3748;
    }
  }

  // 表格样式
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5em 0;

    th, td {
      border: 1px solid #e2e8f0;
      padding: 0.75em;
      text-align: left;
    }

    th {
      background: #f7fafc;
      font-weight: 600;
      color: #2d3748;
    }

    tr:nth-child(even) {
      background: #f9fafb;
    }
  }

  // 图片样式
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1em 0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  // 分割线样式
  hr {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 2em 0;
  }
}

/**
 * 文档导航按钮样式
 */
.doc-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 3em 0 2em 0;
  padding: 2em 0;
  border-top: 1px solid #e2e8f0;
  width: 100%;
  max-width: 800px; /* 与markdown-content保持一致 */

  .nav-item {
    flex: 0 0 auto;

    &.prev {
      // 左侧按钮
    }

    &.next {
      // 右侧按钮
    }
  }

  .nav-spacer {
    flex: 1;
  }

  .nav-button {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    color: inherit;
    font-family: inherit;

    &:hover {
      border-color: #0ff7ae;
      background: #f0fdf4;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(15, 247, 174, 0.15);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .nav-icon {
    width: 16px;
    height: 16px;
    color: #6b7280;
    transition: color 0.2s ease;
    flex-shrink: 0;
  }

  .nav-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;

    .nav-label {
      font-size: 12px;
      color: #9ca3af;
      margin-bottom: 2px;
      font-weight: 500;
    }

    .nav-title {
      font-size: 14px;
      color: #374151;
      font-weight: 500;
      line-height: 1.3;
    }
  }

  // 右侧按钮的内容右对齐
  .nav-item.next {
    .nav-content {
      align-items: flex-end;
      text-align: right;
    }
  }

  // 悬停时图标颜色变化
  .nav-button:hover .nav-icon {
    color: #0ff7ae;
  }

  .nav-button:hover .nav-title {
    color: #0ff7ae;
  }
}

// 导航按钮响应式设计
@media (max-width: 768px) {
  .doc-navigation {
    flex-direction: column;
    gap: 16px;

    .nav-item {
      width: 100%;

      &.prev, &.next {
        margin: 0;
      }
    }

    .nav-spacer {
      display: none;
    }

    .nav-button {
      width: 100%;
      justify-content: center;
    }

    .nav-item.next .nav-content {
      align-items: center;
      text-align: center;
    }
  }
}

/**
 * 特殊内容样式
 */
.welcome-content {
  .quick-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5em;
    margin: 2em 0;
  }

  .link-card {
    background: #f8f9fa;
    padding: 1.5em;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    transition: all 0.2s ease;

    &:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }

    h3 {
      margin: 0 0 0.5em 0;
      color: #2c3e50;
      font-size: 1.1em;
    }

    p {
      margin: 0;
      color: #6c757d;
      font-size: 0.9em;
    }
  }
}

.error-content {
  text-align: center;
  padding: 3em 2em;
  color: #6c757d;

  h2 {
    color: #e74c3c;
    margin-bottom: 1em;
  }

  code {
    background: #f8f9fa;
    padding: 0.2em 0.5em;
    border-radius: 4px;
    color: #e74c3c;
  }
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #6c757d;

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #0ff7ae;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1em;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/**
 * 右侧目录导航
 * 固定在右侧，不随内容滚动
 */
.content-toc {
  width: 200px;
  background: #f8f9fa;
  border-left: 1px solid #e9ecef;
  padding: 2em 1.5em;
  position: fixed;
  right: 0;
  top: 64px; /* 固定导航栏高度 */
  height: calc(100vh - 64px);
  overflow-y: auto;
  z-index: 10;

  .toc-header {
    h4 {
      margin: 0 0 1em 0;
      font-size: 0.9em;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  .toc-nav {
    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;

      .toc-item {
        margin: 0;

        .toc-link {
          display: block;
          padding: 4px 0;
          color: #6c757d;
          text-decoration: none;
          font-size: 13px;
          line-height: 1.4;
          border-left: 2px solid transparent;
          padding-left: 8px;
          transition: all 0.2s ease;

          &:hover {
            color: #0ff7ae;
            border-left-color: #0ff7ae;
            background: rgba(15, 247, 174, 0.05);
          }
        }

        // 不同级别的标题缩进
        &.toc-level-1 .toc-link {
          font-weight: 600;
          font-size: 14px;
          color: #2c3e50;
        }

        &.toc-level-2 .toc-link {
          padding-left: 16px;
          font-weight: 500;
        }

        &.toc-level-3 .toc-link {
          padding-left: 24px;
          font-size: 12px;
        }

        &.toc-level-4 .toc-link {
          padding-left: 32px;
          font-size: 12px;
        }

        &.toc-level-5 .toc-link {
          padding-left: 40px;
          font-size: 11px;
        }

        &.toc-level-6 .toc-link {
          padding-left: 48px;
          font-size: 11px;
        }
      }
    }
  }
}

/**
 * 响应式设计
 */
@media (max-width: 1200px) {
  .content-toc {
    display: none;
  }
}

@media (max-width: 480px) {
  .content-toc {
    top: 56px; // 移动端导航栏高度
    height: calc(100vh - 56px);
  }
}

@media (max-width: 768px) {
  .markdown-content {
    padding: 24px 20px;
  }

  .welcome-content .quick-links {
    grid-template-columns: 1fr;
  }
}
</style>

<!-- 引入代码高亮样式 -->
<style>
@import 'highlight.js/styles/github.css';
</style>
