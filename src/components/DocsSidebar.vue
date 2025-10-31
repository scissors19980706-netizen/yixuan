<script setup lang="ts">
/**
 * 文档侧边栏导航组件
 * 提供文档的层级导航功能
 */
import { ref, computed } from 'vue'

// 定义组件属性
const props = defineProps<{
  currentPath: string
}>()

// 定义事件
const emit = defineEmits<{
  navigate: [path: string]
}>()

/**
 * 文档导航结构配置
 * 定义了完整的文档层级结构和路径映射
 */
const navigationStructure = [
  {
    title: '快速上手',
    key: 'getting-started',
    children: [
      { title: '概览', path: '/getting-started/overview' },
      { title: '安装', path: '/getting-started/install-update' },
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

// 展开状态管理
const expandedSections = ref<Set<string>>(new Set(['getting-started']))

/**
 * 切换章节展开状态
 */
const toggleSection = (key: string) => {
  if (expandedSections.value.has(key)) {
    expandedSections.value.delete(key)
  } else {
    expandedSections.value.add(key)
  }
}

/**
 * 处理导航点击
 */
const handleNavigate = (path: string) => {
  emit('navigate', path)
}

/**
 * 检查路径是否为当前激活路径
 */
const isActivePath = (path: string) => {
  return props.currentPath === path
}

/**
 * 检查是否为当前章节
 */
const isActiveSection = (key: string) => {
  return props.currentPath.startsWith(`/${key}/`)
}

/**
 * 渲染导航项
 */
const renderNavItem = (item: any, level = 0) => {
  if (item.children) {
    return {
      ...item,
      level,
      hasChildren: true,
      isExpanded: item.key ? expandedSections.value.has(item.key) : true
    }
  }
  return {
    ...item,
    level,
    hasChildren: false
  }
}
</script>

<template>
  <div class="docs-sidebar">
    <!-- 侧边栏头部 -->
    <div class="sidebar-header">
      <h3>用户手册</h3>
    </div>

    <!-- 导航内容 -->
    <div class="sidebar-content">
      <nav class="nav-tree">
        <template v-for="section in navigationStructure" :key="section.key">
          <!-- 顶级章节 -->
          <div class="nav-section" :class="{ 'active': isActiveSection(section.key) }">
            <div
              class="section-header"
              @click="toggleSection(section.key)"
            >
              <span class="section-title">{{ section.title }}</span>
              <svg
                class="expand-icon"
                :class="{ 'expanded': expandedSections.has(section.key) }"
                viewBox="0 0 16 16"
              >
                <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </div>

            <!-- 章节内容 -->
            <div
              class="section-content"
              :class="{ 'expanded': expandedSections.has(section.key) }"
            >
              <template v-for="item in section.children" :key="item.path || item.title">
                <!-- 直接链接项 -->
                <div
                  v-if="item.path"
                  class="nav-item"
                  :class="{ 'active': isActivePath(item.path) }"
                  @click="handleNavigate(item.path)"
                >
                  {{ item.title }}
                </div>

                <!-- 子分组 -->
                <div v-else class="nav-subgroup">
                  <div class="subgroup-title">{{ item.title }}</div>
                  <div class="subgroup-items">
                    <div
                      v-for="subItem in item.children"
                      :key="subItem.path"
                      class="nav-item sub-item"
                      :class="{ 'active': isActivePath(subItem.path) }"
                      @click="handleNavigate(subItem.path)"
                    >
                      {{ subItem.title }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </nav>
    </div>
  </div>
</template>

<style scoped lang="scss">
/**
 * 文档侧边栏样式
 * 提供清晰的层级导航视觉效果
 * 固定在左侧，不随内容滚动
 */

.docs-sidebar {
  width: 260px;
  height: calc(100vh - 64px); /* 减去顶部导航栏高度 */
  background: #fafafa;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 64px; /* 固定导航栏高度 */
  z-index: 10;
}

/**
 * 侧边栏头部
 */
.sidebar-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: white;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }
}

/**
 * 侧边栏内容区域
 */
.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
}

/**
 * 导航树结构
 */
.nav-tree {
  padding: 0;
}

/**
 * 导航章节
 */
.nav-section {
  margin-bottom: 4px;

  &.active {
    .section-header {
      background: #f3f4f6;

      .section-title {
        color: #0ff7ae;
        font-weight: 600;
      }
    }
  }
}

/**
 * 章节头部
 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
  }

  .section-title {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    transition: color 0.2s ease;
  }

  .expand-icon {
    width: 12px;
    height: 12px;
    color: #9ca3af;
    transition: transform 0.2s ease;

    &.expanded {
      transform: rotate(90deg);
    }
  }
}

/**
 * 章节内容
 */
.section-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;

  &.expanded {
    max-height: 1000px; // 足够大的值来容纳内容
  }
}

/**
 * 导航项
 */
.nav-item {
  padding: 6px 24px 6px 40px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;

  &:hover {
    background: #f9fafb;
    color: #374151;
  }

  &.active {
    background: #f0fdf4;
    color: #0ff7ae;
    border-left-color: #0ff7ae;
    font-weight: 500;
  }

  &.sub-item {
    padding-left: 56px;
    font-size: 12px;
  }
}

/**
 * 子分组
 */
.nav-subgroup {
  margin: 4px 0;

  .subgroup-title {
    padding: 6px 24px 4px 40px;
    font-size: 12px;
    font-weight: 500;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .subgroup-items {
    .nav-item {
      padding-left: 56px;
    }
  }
}

/**
 * 响应式设计
 */
@media (max-width: 1200px) {
  .docs-sidebar {
    display: none; // 在中等屏幕上隐藏侧边栏
  }
}

@media (max-width: 768px) {
  .docs-sidebar {
    width: 100%;
    height: calc(100vh - 64px);
    position: fixed;
    top: 64px;
    left: 0;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    display: flex; // 在移动端重新显示

    &.mobile-open {
      transform: translateX(0);
    }
  }
}

@media (max-width: 480px) {
  .docs-sidebar {
    height: calc(100vh - 56px); // 移动端导航栏高度
    top: 56px;
  }
}
</style>
