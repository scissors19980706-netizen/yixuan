<script setup>
/**
 * CatPaw IDE 下载页面
 * 提供不同平台的下载选项
 */
import { ref } from 'vue'
import Navigation from '@/components/Navigation.vue'

/**
 * 下载平台配置
 */
const downloadOptions = ref([
  {
    id: 'mac-silicon',
    title: 'Mac Apple Silicon',
    description: '适用于搭载 Apple 芯片的 Mac电脑',
    platform: 'mac',
    downloadUrl: '#', // 替换为实际下载链接
    isRecommended: true
  },
  {
    id: 'mac-intel',
    title: 'Mac Intel',
    description: '适用于搭载 Intel 芯片的 Mac电脑',
    platform: 'mac',
    downloadUrl: '#', // 替换为实际下载链接
    isRecommended: false
  },
  {
    id: 'windows',
    title: 'Windows x64',
    description: '适用于 Windows 64 位的电脑',
    platform: 'windows',
    downloadUrl: '#', // 替换为实际下载链接
    isRecommended: false
  }
])

/**
 * 处理下载点击事件
 * @param {Object} option - 下载选项
 */
const handleDownload = (option) => {
  // 这里可以添加下载统计或其他逻辑
  console.log(`下载 ${option.title}`)
  if (option.downloadUrl !== '#') {
    window.open(option.downloadUrl, '_blank')
  }
}
</script>

<template>
  <div class="download-page">
    <!-- 头部导航 -->
    <Navigation />

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="content-container">
        <!-- 页面标题 -->
        <div class="page-title">
          <h1>CatPaw IDE 下载</h1>
        </div>

        <!-- 下载选项列表 -->
        <div class="download-options">
          <div 
            v-for="option in downloadOptions" 
            :key="option.id"
            class="download-card"
            :class="{ 'recommended': option.isRecommended }"
            @click="handleDownload(option)"
          >
            <div class="card-content">
              <h3 class="platform-title">{{ option.title }}</h3>
              <div class="bottom-row">
                <p class="platform-description">{{ option.description }}</p>
                <div class="download-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="22" height="22" viewBox="0 0 22 22">
                    <g>
                      <g transform="matrix(1,0,0,-1,0,39.875)">
                        <path d="M17.875,19.9375L4.125,19.9375C3.7453042,19.9375,3.4375,20.2453042,3.4375,20.625C3.4375,21.0046959,3.7453042,21.3125,4.125,21.3125L17.875,21.3125C18.254696,21.3125,18.5625,21.0046959,18.5625,20.625C18.5625,20.2453042,18.254696,19.9375,17.875,19.9375ZM11.8321438,23.0725081L18.375063,30.007367000000002C18.495445,30.134961,18.5625,30.303747,18.5625,30.479167C18.5625,30.858862000000002,18.254696,31.166667,17.875,31.166667C17.685727999999997,31.166667,17.504827,31.088635,17.374938999999998,30.950967L11.6875,24.922832L11.6875,37.583334C11.6875,37.96303,11.3796954,38.270834,11,38.270834C10.6203041,38.270834,10.3125,37.96303,10.3125,37.583334L10.3125,24.9164991L4.6244419,30.921312L4.6244419,30.921312C4.4942858999999995,31.058716,4.31379694,31.136356,4.125,31.136356C3.7453042,31.136356,3.4375,30.828552000000002,3.4375,30.448856C3.4375,30.272964,3.504916698,30.103761,3.62587819,29.976064L3.62587819,29.976064L10.1668382,23.0708523Q10.5062704,22.712518,10.999847899999999,22.7130084Q11.4934244,22.7134988,11.8321438,23.0725081Z" fill-rule="evenodd" fill="#656A72" fill-opacity="1"/>
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- 装饰性背景图案已移除 -->
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 全局样式重置 */
.download-page {
  min-height: 100vh;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 导航栏已移至独立组件 */

/* 主要内容样式 */
.main-content {
  padding: 80px 24px;
}

.content-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  text-align: left;
  margin-bottom: 60px;
}

.page-title h1 {
  font-size: 36px;
  font-weight: 500;
  color: #2c3e50;
  margin: 0;
}

/* 下载选项样式 */
.download-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.download-card {
  background-color: #f8f8f8;
  border-radius: 0px;
  padding: 32px 32px 32px 32px; /* 顶部32px，左边32px，底部0（通过元素margin-bottom控制），加上margin-left: 4px = 36px */
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 0px solid transparent;
  /* 移除动画效果 */
  z-index: 5;
}

/* Hover效果 - 背景图片固定，通过裁剪实现从左向右显示 */
.download-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/download_card_hover.png');
  background-size: contain;
  background-position: right center;
  background-repeat: no-repeat;
  clip-path: inset(0 0 0 100%);
  /* 移除背景动画效果 */
  z-index: 1;
}

.download-card:hover::before {
  clip-path: inset(0 0 0 0%);
}

/* 内容区域背景竖线 */
.content-container::before {
  content: '';
  position: fixed;
  left: calc(50% - 400px);
  top: 0;
  height: 100vh;
  width: 1px;
  background: repeating-linear-gradient(
    to bottom,
    #E1E1E1 0px,
    #E1E1E1 8px,
    transparent 8px,
    transparent 16px
  );
  z-index: 1;
  pointer-events: none;
}

/* 右边背景竖线 */
.content-container::after {
  content: '';
  position: fixed;
  right: calc(50% - 400px);
  top: 0;
  height: 100vh;
  width: 1px;
  background: repeating-linear-gradient(
    to bottom,
    #E1E1E1 0px,
    #E1E1E1 8px,
    transparent 8px,
    transparent 16px
  );
  z-index: 1;
  pointer-events: none;
}

/* 自适应等距横线系统 */
.download-page {
  /* 定义横线间距变量 */
  --line-spacing: calc(100vh / 8); /* 将页面高度分为8等份 */
  --line-offset: calc(var(--line-spacing) * 0.3); /* 起始偏移量 */
}

/* 横线1 */
.page-title::before {
  content: '';
  position: fixed;
  left: 0;
  right: 0;
  top: calc(var(--line-offset) + var(--line-spacing) * 0);
  height: 1px;
  background: repeating-linear-gradient(
    to right,
    #E1E1E1 0px,
    #E1E1E1 8px,
    transparent 8px,
    transparent 16px
  );
  z-index: 0;
  pointer-events: none;
}

/* 横线2 */
.page-title::after {
  content: '';
  position: fixed;
  left: 0;
  right: 0;
  top: calc(var(--line-offset) + var(--line-spacing) * 1);
  height: 1px;
  background: repeating-linear-gradient(
    to right,
    #E1E1E1 0px,
    #E1E1E1 8px,
    transparent 8px,
    transparent 16px
  );
  z-index: 0;
  pointer-events: none;
}

/* 横线3 */
.download-options::before {
  content: '';
  position: fixed;
  left: 0;
  right: 0;
  top: calc(var(--line-offset) + var(--line-spacing) * 2);
  height: 1px;
  background: repeating-linear-gradient(
    to right,
    #E1E1E1 0px,
    #E1E1E1 8px,
    transparent 8px,
    transparent 16px
  );
  z-index: 0;
  pointer-events: none;
}

/* 横线4 */
.download-options::after {
  content: '';
  position: fixed;
  left: 0;
  right: 0;
  top: calc(var(--line-offset) + var(--line-spacing) * 3);
  height: 1px;
  background: repeating-linear-gradient(
    to right,
    #E1E1E1 0px,
    #E1E1E1 8px,
    transparent 8px,
    transparent 16px
  );
  z-index: 0;
  pointer-events: none;
}

/* 横线5 */
.main-content::before {
  content: '';
  position: fixed;
  left: 0;
  right: 0;
  top: calc(var(--line-offset) + var(--line-spacing) * 4);
  height: 1px;
  background: repeating-linear-gradient(
    to right,
    #E1E1E1 0px,
    #E1E1E1 8px,
    transparent 8px,
    transparent 16px
  );
  z-index: 0;
  pointer-events: none;
}

/* 横线6 */
.main-content::after {
  content: '';
  position: fixed;
  left: 0;
  right: 0;
  top: calc(var(--line-offset) + var(--line-spacing) * 5);
  height: 1px;
  background: repeating-linear-gradient(
    to right,
    #E1E1E1 0px,
    #E1E1E1 8px,
    transparent 8px,
    transparent 16px
  );
  z-index: 0;
  pointer-events: none;
}

/* 横线7 */
.download-page::before {
  content: '';
  position: fixed;
  left: 0;
  right: 0;
  top: calc(var(--line-offset) + var(--line-spacing) * 6);
  height: 1px;
  background: repeating-linear-gradient(
    to right,
    #E1E1E1 0px,
    #E1E1E1 8px,
    transparent 8px,
    transparent 16px
  );
  z-index: 0;
  pointer-events: none;
}

/* 横线8 */
.download-page::after {
  content: '';
  position: fixed;
  left: 0;
  right: 0;
  top: calc(var(--line-offset) + var(--line-spacing) * 7);
  height: 1px;
  background: repeating-linear-gradient(
    to right,
    #E1E1E1 0px,
    #E1E1E1 8px,
    transparent 8px,
    transparent 16px
  );
  z-index: 0;
  pointer-events: none;
}


.card-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.platform-title {
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 32px;
  font-weight: 500; /* medium */
  color: rgba(17, 25, 37, 0.65); /* 65% of #111925 */
  margin: 0;
  margin-top: -2px; 
  margin-left: 0px; /* 离左边36px通过padding + 4px实现 */
  margin-bottom: 8px;
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.platform-description {
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 18px;
  font-weight: 400; /* regular */
  color: rgba(17, 25, 37, 0.65); /* 65% of #111925 */
  margin: 0;
  margin-left: 4px; /* 与标题对齐 */
  line-height: 1.5;
  flex-grow: 1;
}

.download-icon {
  color: #656A72;
  flex-shrink: 0;
}

/* 装饰性背景图案样式已移除 */

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 40px 16px;
  }
  
  .page-title h1 {
    font-size: 28px;
  }
  
  .download-card {
    padding: 24px;
  }
  
  .platform-title {
    font-size: 20px;
  }
  
  /* 调整横线间距以适应移动端 */
  .download-page {
    --line-spacing: calc(100vh / 6); /* 移动端减少横线数量 */
    --line-offset: calc(var(--line-spacing) * 0.2);
  }
  
  /* 隐藏部分横线以保持简洁 */
  .main-content::before,
  .main-content::after,
  .download-page::before,
  .download-page::after {
    display: none;
  }
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  /* 超小屏幕进一步减少横线 */
  .download-page {
    --line-spacing: calc(100vh / 4);
    --line-offset: calc(var(--line-spacing) * 0.1);
  }
  
  /* 只保留最重要的横线 */
  .download-options::after,
  .main-content::before,
  .main-content::after,
  .download-page::before,
  .download-page::after {
    display: none;
  }
}
</style>