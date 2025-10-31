<script setup>
/**
 * 更新日志页面
 * 展示CatPaw产品的版本更新历史
 */
import { ref } from 'vue'
import Navigation from '../components/Navigation.vue'

/**
 * 历史版本更新日志的展开状态
 */
const isHistoryExpanded = ref(false)

/**
 * 切换历史版本更新日志的展开/收起状态
 */
const toggleHistory = () => {
  isHistoryExpanded.value = !isHistoryExpanded.value
}
</script>

<template>
  <div class="changelog-page">
    <!-- 导航栏 -->
    <Navigation />
    
    <!-- 页面内容 -->
    <main class="changelog-content">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">版本更新日志</h1>
        <div class="title-divider"></div>
      </div>
      
      <!-- 时间轴容器 -->
      <div class="timeline-container">
        <!-- v 2025.6.x (进行中) -->
        <div class="timeline-item">
          <!-- 左侧时间轴 -->
          <div class="timeline-left">
            <div class="timeline-dot current"></div>
            <div class="timeline-line"></div>
            <div class="timeline-info">
              <h2 class="version-title">v 2025.6.x</h2>
              <span class="version-date">2025年9月1日</span>
              <span class="version-status ongoing">进行中</span>
            </div>
          </div>
          
          <!-- 右侧内容 -->
          <div class="timeline-right">
            <div class="version-content">
              
              <!-- 功能上新 -->
              <div class="feature-section">
                <h3 class="section-title">功能上新</h3>
                
                <!-- Agent 优化 -->
                <div class="feature-category">
                  <h4 class="category-title">Agent 优化</h4>
                  
                  <!-- 添加上下文 -->
                  <div class="feature-item">
                    <h5 class="feature-subtitle">添加上下文</h5>
                    <ul class="feature-list">
                      <li>支持添加图片文件，优化无类型文件的展示样式</li>
                      <li>支持从目录树拖拽文件到输入框作为上下文</li>
                      <li><code>@folder</code> 优化为携带目录树结构/所有文件</li>
                      <li><code>@diff</code> 列表新增 PR（Pull Request）列表，可 <code>@unmerged</code>、<code>@unclosed</code> PRs</li>
                    </ul>
                  </div>
                  
                  <!-- 其他Agent功能 -->
                  <ul class="feature-list">
                    <li>支持 SubAgent：在配置中开启后，Agent 自动调用 SubAgent 处理大型任务，执行搜索、修改文件等操作</li>
                    <li>支持 To-dos 列表：在配置中开启后，Agent 自动为复杂任务生成 To-do List 并展示其执行状态</li>
                  </ul>
                  
                  <!-- 展示优化 -->
                  <div class="feature-item">
                    <h5 class="feature-subtitle">展示优化</h5>
                    <ul class="feature-list">
                      <li>支持 Mermaid 和 Plantuml SVG/代码格式展示</li>
                      <li>对话轮次过多时，历史对话消息自动折叠避免页面卡顿，用户可滚动到消息顶部点击"加载更早消息"展开历史消息</li>
                      <li>对话中输出代码块支持"显示代码/显示diff"模式切换</li>
                      <li>支持对话窗口持久化：CatPaw 打开时自动恢复上次未关闭的对话</li>
                      <li>对话时隐藏侧边栏右上角按钮，页面展示更简洁</li>
                    </ul>
                  </div>
                  
                  <!-- 自定义Agent配置 -->
                  <ul class="feature-list">
                    <li>自定义 Agent 支持配置默认文档：使用此模式时，对话中按需召回 Agent</li>
                  </ul>
                </div>
                
                <!-- Apply 优化 -->
                <div class="feature-category">
                  <h4 class="category-title">Apply 优化</h4>
                  <ul class="feature-list">
                    <li>打开历史对话时，当前对话窗口中"applying"状态的代码默认"Accept"，历史对话的"apply list"恢复并展示</li>
                    <li>编辑区域底部"applying bar"中的 diff 文件切换按钮支持循环切换</li>
                    <li>手动 apply 代码块无返回路径时绑定到 apply 的文件路径</li>
                  </ul>
                </div>
              </div>
              
              <!-- 问题修复 -->
              <div class="bugfix-section">
                <h3 class="section-title">问题修复</h3>
                <ul class="bugfix-list">
                  <li>修复 Agent 工具调用卡死、新增自定义 Agent 关闭 CatPaw 后消失、<code>.gitignore</code> 文件包含特殊格式导致项目索引异常、MCP 服务名+工具超出模型长度要求可能报错等问题（Agent 稳定性问题）</li>
                  <li>修复 IDEA 卡死、登录异常、编辑器稳定性问题，修复 Terminal 输出过多导致历史记录展示崩溃</li>
                </ul>
                
                <!-- apply 问题修复 -->
                <div class="feature-item">
                  <h5 class="feature-subtitle">apply 问题修复</h5>
                  <ul class="bugfix-list">
                    <li>修复编辑器底部 apply bar 文件切换卡死问题</li>
                    <li>修复新建文件后 apply 代码报错问题</li>
                    <li>修复 apply 后"Project disposed"和"autolmport disabled"未恢复问题</li>
                    <li>修复对话中无新代码块生成时 apply list 状态仍显示"generating"问题</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 版本分割线 -->
        <div class="version-divider"></div>
        
        <!-- v 2025.6.30 -->
        <div class="timeline-item">
          <!-- 左侧时间轴 -->
          <div class="timeline-left">
            <div class="timeline-dot"></div>
            <div class="timeline-line"></div>
            <div class="timeline-info">
              <h2 class="version-title">v 2025.6.30</h2>
              <span class="version-date">2025年6月30日</span>
              <span class="version-status completed">已全量</span>
            </div>
          </div>
          
          <!-- 右侧内容 -->
          <div class="timeline-right">
            <div class="version-content">
              <div class="feature-section">
                <h3 class="section-title">功能上新</h3>
                <ul class="feature-list">
                  <li>自定义 Agent 支持配置默认文档，使用此模式时对话中按需召回 Agent</li>
                </ul>
              </div>

              <div class="bugfix-section">
                <h3 class="section-title">问题修复</h3>
                <ul class="bugfix-list">
                  <li>修复 Agent 工具调用卡死、新增自定义 Agent 关闭 CatPaw 后消失、<code>.gitignore</code> 文件包含特殊格式导致项目索引异常、MCP 服务名+工具超出模型长度要求可能报错等问题（Agent 稳定性问题）</li>
                </ul>

                <div class="feature-item">
                  <h5 class="feature-subtitle">apply 问题修复</h5>
                  <ul class="bugfix-list">
                    <li>修复编辑器底部 apply bar 文件切换卡死问题</li>
                    <li>修复新建文件后 apply 代码报错问题</li>
                    <li>修复 apply 后"Project disposed"和"autolmport disabled"未恢复问题</li>
                    <li>修复对话中无新代码块生成时 apply list 状态仍显示"generating"问题</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 版本分割线 -->
        <div class="version-divider"></div>
        
        <!-- v 2025.6.21 -->
        <div class="timeline-item">
          <!-- 左侧时间轴 -->
          <div class="timeline-left">
            <div class="timeline-dot"></div>
            <div class="timeline-line last"></div>
            <div class="timeline-info">
              <h2 class="version-title">v 2025.6.21</h2>
              <span class="version-date">2025年6月21日</span>
              <span class="version-status completed">已全量</span>
            </div>
          </div>
          
          <!-- 右侧内容 -->
          <div class="timeline-right">
            <div class="version-content">
              <div class="feature-section">
                <h3 class="section-title">功能上新</h3>
                <ul class="feature-list">
                  <li>自定义 Agent 支持配置默认文档，使用此模式时对话中按需召回 Agent</li>
                </ul>
              </div>

              <div class="bugfix-section">
                <h3 class="section-title">问题修复</h3>
                <ul class="bugfix-list">
                  <li>修复 Agent 工具调用卡死、新增自定义 Agent 关闭 CatPaw 后消失、<code>.gitignore</code> 文件包含特殊格式导致项目索引异常、MCP 服务名+工具超出模型长度要求可能报错等问题（Agent 稳定性问题）</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 页面整体样式 */
.changelog-page {
  min-height: 100vh;
  background-color: #ffffff;
}

/* 页面内容样式 */
.changelog-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 104px 20px 40px 20px; /* 顶部增加64px导航栏高度 + 40px原有间距 */
}

/* 页面标题样式 */
.page-header {
  text-align: left;
  margin-bottom: 60px;
  margin-left: 20px; /* 与timeline-right保持一致的左边距 */
}

.page-title {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 36px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

/* 标题分割线样式 */
.title-divider {
  width: 100%;
  height: 1px;
  background: #D8D8D8;
  margin-top: 36px;
  position: relative;
}

/* 时间轴容器样式 */
.timeline-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  margin-left: 20px; /* 与page-header保持一致的左边距 */
}

/* 时间轴项目样式 */
.timeline-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 60px;
  position: relative;
}

/* 版本分割线样式 */
.version-divider {
  width: 100%;
  height: 1px;
  background: #D8D8D8;
  margin: 40px 0;
  position: relative;

}


/* 左侧时间轴样式 */
.timeline-left {
  flex: 0 0 300px;
  position: relative;
  padding-right: 40px;
  display: flex;
  flex-direction: column;
}


/* 时间轴信息样式 */
.timeline-info {
  position: absolute;
  text-align: left;

}

.version-title {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size:18px;
  font-weight: 500;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.version-date {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 14px;
  color: #6c757d;
  display: inline-block;
  margin-right: 8px;
}

.version-status {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
  display: inline-block;
}

.version-status.ongoing {
  background: #e9f6fd;
  color: #334b7e;
}

.version-status.completed {
  background: #eceef1;
  color: #646971;
}

/* 右侧内容样式 */
.timeline-right {
  flex: 1;
  margin-left: 20px;
}

.version-content {
  background: #ffffff;
  transition: all 0.3s ease;
  position: relative;
  margin-top: 0;
  padding-top: 0;
}




/* 功能上新和问题修复区域样式 */
.feature-section,
.bugfix-section {
  margin-bottom: 24px;
}

.section-title {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #111925;
  margin: 0 0 32px 0;
  padding-left: 0px;
}

/* 功能分类样式 */
.feature-category {
  margin-bottom: 20px;
}

.category-title {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin: 0 0 12px 0;
  position: relative;
  padding-left: 16px;
  margin-left: 0px;
}

.category-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.75em;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: #656a72;
  border-radius: 50%;
}

.feature-item {
  margin-bottom: 16px;
}

.feature-subtitle {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #495057;
  margin: 0 0 8px 0;
  position: relative;
  padding-left: 16px;
  margin-left: 12px;
}

.feature-subtitle::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.75em;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border: 0.5px solid #656a72;
  border-radius: 50%;
  background: transparent;
}

/* 列表样式 */
.feature-list,
.bugfix-list {
  margin: 0;
  margin-left: 24px;
  padding-left: 20px;
  list-style: none;
}

.feature-list li,
.bugfix-list li {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #495057;
  margin-bottom: 8px;
  position: relative;
}

.feature-list li::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 0.75em;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: #656a72;
}

.bugfix-list li::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 0.75em;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: #656a72;
}

/* 代码样式 */
code {
  background: #f8f9fa;
  color: #e83e8c;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  border: 1px solid #e9ecef;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .changelog-content {
    padding: 84px 16px 20px 16px; /* 顶部增加64px导航栏高度 + 20px原有间距 */
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .page-header {
    margin-left: 0; /* 移动端取消左边距 */
  }
  
  .timeline-container {
    margin-left: 0; /* 移动端取消左边距 */
  }
  
  .title-divider {
    width: 100%;
    height: 1px;
  }
  
  .version-divider {
    display: none; /* 小屏时隐藏版本分割线 */
  }
  
  .timeline-item {
    flex-direction: column;
    margin-bottom: 40px;
  }
  
  .timeline-left {
    flex: none;
    width: 100%;
    padding-right: 0;
    padding-bottom: 20px;
    align-items: flex-start;
    border-bottom: 1px solid #D8D8D8; /* 保持与桌面版一致的分割线颜色 */
    position: relative;
    z-index: 1; /* 确保timeline信息在上层 */
  }
  
  .timeline-dot {
    margin-bottom: 8px;
  }
  
  .timeline-line {
    display: none;
  }
  
  .timeline-info {
    margin-left: 0; /* 移动端取消左边距 */
    position: static; /* 小屏时使用静态定位，避免被遮挡 */
    width: 100%;
  }
  
  .timeline-right {
    margin-left: 0;
    margin-top: 20px;
    position: relative;
    z-index: 0; /* 确保右侧内容在底层 */
  }
  
  .version-content::before,
  .version-content::after {
    display: none;
  }
  
  .version-content {
    padding: 24px;
  }
  
  .version-title {
    font-size: 18px;
  }
  
  .section-title {
    font-size: 16px;
  }
  
  .category-title {
    font-size: 15px;
  }
  
  .feature-subtitle {
    font-size: 14px;
  }
  
  .feature-list li,
  .bugfix-list li {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .changelog-content {
    padding: 72px 12px 16px 12px; /* 顶部增加56px小屏幕导航栏高度 + 16px原有间距 */
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-header {
    margin-left: 0; /* 小屏幕取消左边距 */
  }
  
  .timeline-container {
    margin-left: 0; /* 小屏幕取消左边距 */
  }
  
  .title-divider {
    width: 100%;
    height: 1px;
    margin-top: 12px;
  }
  
  .version-divider {
    display: none; /* 小屏时隐藏版本分割线 */
  }
  
  .timeline-left {
    padding-bottom: 16px;
  }
  
  .timeline-info {
    margin-left: 0; /* 小屏幕取消左边距 */
  }
  
  .version-content {
    padding: 20px;
  }
  
  .version-title {
    font-size: 16px;
  }
  
  .section-title {
    font-size: 15px;
  }
  
  .category-title {
    font-size: 14px;
  }
  
  .feature-subtitle {
    font-size: 13px;
  }
  
  .feature-list li,
  .bugfix-list li {
    font-size: 12px;
  }
}
</style>
