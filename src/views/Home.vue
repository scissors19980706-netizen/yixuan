<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import SectionBlock from '../components/SectionBlock.vue'
import PixelArt from '../components/PixelArt.vue'
import MaskImage from '../components/MaskImage.vue'

/**
 * 首页包含 6 个粘性分区
 * 媒体位可放视频 <video> 或图片 <img>
 */

// 路由控制
const router = useRouter()

// 滚动控制
const isScrollingPaused = ref(false)

// PixelArt组件参数
const gridSize = ref(16)
const shape = ref('square')
const tileScale = ref(1.0)
const tileColor = ref('#666666')
const backgroundColor = ref('#000000')
const brightness = ref(0)
const contrast = ref(1.0)
const blur = ref(0)
const sharpness = ref(0)
const invert = ref(false)
const ditherType = ref('atkinson')
const grayLevels = ref(16)
const ditherStrength = ref(100)

// 光标动画控制参数
const animationSpeed = ref(1.0)
const avoidanceRadius = ref(100)
const maxDisplacement = ref(20)
const enableAnimation = ref(true)

/**
 * 暂停滚动动画
 */
const pauseScroll = () => {
  isScrollingPaused.value = true
}

/**
 * 恢复滚动动画
 */
const resumeScroll = () => {
  isScrollingPaused.value = false
}

/**
 * 处理导航按钮点击
 */
const handleNavClick = (type: string) => {
    if (type === 'guides') {
      router.push('/guides')
  } else if (type === 'changelog') {
    // 更新日志跳转到独立页面（如果将来需要）
    router.push('/changelog')
  } else if (type === 'contact') {
    // 联系我们跳转到独立页面（如果将来需要）
    router.push('/contact')
  }
}

onMounted(() => {
  // 组件挂载后可以添加额外的初始化逻辑
})

onUnmounted(() => {
  // 组件卸载时清理
})
</script>

<template>
  <!-- 固定导航栏 -->
  <div class="navigation-container">
    <div class="nav-icon">
      <img src="/src/assets/logo_black.svg" alt="CatPaw Logo" />
    </div>
    <div class="nav-buttons">
          <button class="nav-btn" @click="handleNavClick('guides')">用户手册</button>
      <button class="nav-btn" @click="handleNavClick('changelog')">更新日志</button>
      <button class="nav-btn" @click="handleNavClick('contact')">联系我们</button>
    </div>
  </div>
  
  <main>
    <!-- 第一个 section - #000000 -->
    <SectionBlock id="section-product" theme="dark" align="left" class="hero-section image">
      <template #title>
        <h2>
          <div>From idea to <span class="x-container">
            <span class="x-text">X</span>
          </span></div>
          <div>in seconds.</div>
        </h2>
        <div class="hero-right-text">
          <div class="brand-line">
            <span class="brand-name">CatPaw</span>
            <span class="brand-subtitle">AI编程伙伴</span>
          </div>
          <div class="brand-description">让编码更专注 更高效</div>
          <div class="button-group">
            <button class="btn-primary">
              <span>下载 CatPaw</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
        </div>
      </template>
      <template #media>
        <PixelArt 
          :image-src="'/src/assets/catpaw_background.png'"
          v-model:grid-size="gridSize"
          v-model:shape="shape"
          v-model:tile-scale="tileScale"
          v-model:tile-color="tileColor"
          v-model:background-color="backgroundColor"
          v-model:brightness="brightness"
          v-model:contrast="contrast"
          v-model:blur="blur"
          v-model:sharpness="sharpness"
          v-model:invert="invert"
          v-model:dither-type="ditherType"
          v-model:gray-levels="grayLevels"
          v-model:dither-strength="ditherStrength"
          v-model:animation-speed="animationSpeed"
          v-model:avoidance-radius="avoidanceRadius"
          v-model:max-displacement="maxDisplacement"
          v-model:enable-animation="enableAnimation"
        />
      </template>
      <p>CatPaw — AI 编程伙伴，让编码更专注、更高效。</p>
    </SectionBlock>

    <!-- section 1.5 - UI控制面板 (已隐藏) -->
    <SectionBlock id="section-controls" theme="dark" align="center" class="controls-section">
      <template #title>
        <h2>画布控制面板</h2>
      </template>
      <template #media>
        <div class="controls-panel">
          <div class="control-group">
            <label>网格大小: {{ gridSize }}</label>
            <input 
              type="range" 
              v-model="gridSize" 
              min="4" 
              max="32" 
              step="2"
              class="control-slider"
            />
          </div>
          
          <div class="control-group">
            <label>形状:</label>
            <select v-model="shape" class="control-select">
              <option value="square">方形</option>
              <option value="circle">圆形</option>
              <option value="diamond">菱形</option>
            </select>
          </div>
          
          <div class="control-group">
            <label>瓦片缩放: {{ tileScale.toFixed(1) }}</label>
            <input 
              type="range" 
              v-model="tileScale" 
              min="0.5" 
              max="2.0" 
              step="0.1"
              class="control-slider"
            />
          </div>
          
          <div class="control-group">
            <label>瓦片颜色:</label>
            <input 
              type="color" 
              v-model="tileColor" 
              class="control-color"
            />
          </div>
          
          <div class="control-group">
            <label>背景颜色:</label>
            <input 
              type="color" 
              v-model="backgroundColor" 
              class="control-color"
            />
          </div>
          
          <div class="control-group">
            <label>亮度: {{ brightness }}</label>
            <input 
              type="range" 
              v-model="brightness" 
              min="-100" 
              max="100" 
              step="1"
              class="control-slider"
            />
          </div>
          
          <div class="control-group">
            <label>对比度: {{ contrast.toFixed(1) }}</label>
            <input 
              type="range" 
              v-model="contrast" 
              min="0" 
              max="3" 
              step="0.1"
              class="control-slider"
            />
          </div>
          
          <div class="control-group">
            <label>模糊: {{ blur }}</label>
            <input 
              type="range" 
              v-model="blur" 
              min="0" 
              max="10" 
              step="1"
              class="control-slider"
            />
          </div>
          
          <div class="control-group">
            <label>锐化: {{ sharpness }}</label>
            <input 
              type="range" 
              v-model="sharpness" 
              min="0" 
              max="10" 
              step="1"
              class="control-slider"
            />
          </div>
          
          <div class="control-group">
            <label>
              <input 
                type="checkbox" 
                v-model="invert" 
                class="control-checkbox"
              />
              反色
            </label>
          </div>
          
          <div class="control-group">
            <label>动画速度: {{ animationSpeed.toFixed(1) }}</label>
            <input 
              type="range" 
              v-model="animationSpeed" 
              min="0.1" 
              max="3.0" 
              step="0.1"
              class="control-slider"
            />
          </div>
          
          <div class="control-group">
            <label>避开半径: {{ avoidanceRadius }}</label>
            <input 
              type="range" 
              v-model="avoidanceRadius" 
              min="20" 
              max="20" 
              step="5"
              class="control-slider"
            />
          </div>
          
          <div class="control-group">
            <label>最大位移: {{ maxDisplacement }}</label>
            <input 
              type="range" 
              v-model="maxDisplacement" 
              min="5" 
              max="5" 
              step="1"
              class="control-slider"
            />
          </div>
          
          <div class="control-group">
            <label>
              <input 
                type="checkbox" 
                v-model="enableAnimation" 
                class="control-checkbox"
              />
              启用动画效果
            </label>
          </div>
        </div>
      </template>
    </SectionBlock> 





  </main>
  
</template>

<style scoped>
/* 全局重置，确保没有默认边距 */
* {
  box-sizing: border-box;
}

/* 遮罩区域样式 */
.mask-section {
  width: 100%;
  height: 60vh;
  min-height: 400px;
  margin-bottom: 40px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
}

/* section2 中的遮罩区域铺满整个 section */
#section-features .mask-section {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  margin: 0;
  border-radius: 0;
  box-shadow: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

/* section2 中 MaskImage 组件的样式 */
#section-features .mask-image-container {
  width: 100%;
  height: 100%;
  position: relative;
}

#section-features .image-layer {
  width: 100%;
  height: 100%;
}

#section-features .full-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Features Grid 样式 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(15, 247, 174, 0.3);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(15, 247, 174, 0.1);
}

.feature-card .feature-icon {
  font-size: 48px;
  margin-bottom: 20px;
  display: block;
}

.feature-card h3 {
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  font-family: 'Inter', sans-serif;
}

main { 
  display: block; 
  margin: 0;
  padding: 0;
  width: 100%;
}
.btn-primary { background:#0FF7AE; color:#111; padding:10px 16px; border-radius:10px; }

/* 第一个section的背景图片样式 */

/* 确保全屏显示，移除所有可能的边距 */
.hero-section.image * {
  box-sizing: border-box !important;
}

/* 确保页面没有边距影响全屏显示 */
body, html {
  margin: 0 !important;
  padding: 0 !important;
  overflow-x: hidden !important;
}

.hero-section.image .pixel-art-container {
  width: 100vw !important;
  height: calc(100vh - 100px) !important; /* 高度减少100px */
  padding: 0 !important;
  margin: 0 !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  overflow: hidden !important;
}


.hero-section .inner {
  position: relative;
  z-index: 2;
  display: block;
  height: 100%;
  width: 100%;
  max-width: none !important;
  padding: 40px 60px;
  box-sizing: border-box;
}
.hero-section.image {
  position: relative !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
  width: 100vw !important;
  height: calc(100vh - 44px) !important; /* 高度减少44px（header高度-100px） */
  min-height: calc(100vh - 44px) !important;
  display: block !important;
  place-items: unset !important;
  box-sizing: border-box !important;
  left: 0 !important;
  top: 0 !important;
}

.hero-section.image .media {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 1;
  display: block !important;
  overflow: hidden !important;
  padding: 0 !important;
  margin: 0 !important;
}

.hero-section.image .media canvas {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: fill !important;
  display: block !important;
  max-width: none !important;
  max-height: none !important;
  padding: 0 !important;
  margin: 0 !important;
  transform: translateX(0) !important;
  border: none !important;
  outline: none !important;
}

.hero-section.image .media .canvas-container {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  display: block !important;
  justify-content: unset !important;
  align-items: unset !important;
  overflow: hidden !important;
}

/* 强制canvas占满整个屏幕 */
.hero-section.image .media .pixel-canvas {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
  max-height: none !important;
  min-width: 100% !important;
  min-height: 100% !important;
  object-fit: fill !important;
  display: block !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
  outline: none !important;
}

/* 终极解决方案 - 直接覆盖所有可能的限制 */
.hero-section.image canvas {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 1 !important;
  object-fit: fill !important;
  display: block !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
  outline: none !important;
  max-width: none !important;
  max-height: none !important;
  min-width: 100% !important;
  min-height: 100% !important;
}

/* 控制面板样式 */
.controls-section {
  background: #111111 !important;
  min-height: 100vh !important;
  padding: 60px 20px !important;
}

.controls-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  color: #0FF7AE;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-slider {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.control-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #0FF7AE;
  border-radius: 50%;
  cursor: pointer;
}

.control-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #0FF7AE;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.control-select {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
}

.control-select:focus {
  border-color: #0FF7AE;
}

.control-color {
  width: 50px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
}

.control-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #0FF7AE;
}

/* 让文字内容漂浮在图片之上 */
.hero-section .heading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  margin: 0;
  color: #ffffff;
  pointer-events: none;
}

.hero-section .heading h2 {
  color: #00cc00;
  font-family: 'Inter', sans-serif;
  font-size: 100px;
  font-weight: 500;
  letter-spacing: -0.07em;
  z-index: 99;
  margin: 0;
  position: absolute;
  top: calc(50% - 140px);
  left: calc(50% - 800px);
  transform: none;
  text-align: left;
}

.hero-section .heading h2 div {
  display: block;
  line-height: 1.2;
}

/* X字母的灰色方块容器 */
.x-container {
  display: inline-flex;
  width: 70px;
  height: 80px;
  background-color: #ffffff;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
  vertical-align: middle;
}

.x-text {
  font-family: 'Inter', sans-serif;
  font-size: 72px;
  font-weight: 700;
  color: #111925;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  text-align: center;
  margin: 0;
  padding: 0;
  transform: translateX(-2px);
}

/* 右侧品牌文字样式 */
.hero-right-text {
  position: absolute;
  top: calc(50% - 100px);
  right: 80px;
  z-index: 100;
  text-align: right;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.brand-line {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  justify-content: flex-end;
}

.brand-name {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-weight: 600;
  font-size: 32px;
  letter-spacing: 0.02em;
  color: #0FF7AE;
  line-height: 1.2;
}

.brand-subtitle {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-weight: 600;
  font-size: 32px;
  letter-spacing: 0.02em;
  color: #ffffff;
  line-height: 1.2;
}

.brand-description {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-weight: 600;
  font-size: 32px;
  letter-spacing: 0.02em;
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 24px;
}

.button-group {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

.btn-primary {
  background: #0FF7AE;
  color: #000000;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #0DE5A0;
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: #0FF7AE;
  border: 1px solid #0FF7AE;
  border-radius: 4px;
  padding: 12px 20px;
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  background: rgba(15, 247, 174, 0.1);
  transform: translateY(-1px);
}

/* 导航容器样式 */
.navigation-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 124px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 56px 16px 20px;
  background: transparent;
  z-index: 1000;
  box-sizing: border-box;
}

.nav-icon {
  flex-shrink: 0;
}

.nav-icon img {
  width: 116px;
  height: 32px;
  object-fit: contain;
}

.nav-buttons {
  display: flex;
  gap: 80px;
  flex-wrap: nowrap;
}

.nav-btn {
  background: transparent;
  color: #000000;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-btn:hover {
  background: rgba(15, 247, 174, 0.1);
  color: #0FF7AE;
  transform: translateY(-1px);
}

.hero-section .content {
  position: absolute;
  top: 50%;
  left: 60px;
  transform: translateY(calc(-50% + 80px));
  z-index: 100;
  margin: 0;
  color: #ffffff;
  font-size: 1.2rem;
  pointer-events: none;
}





/* 第二个 section 的特定样式 */
/* 确保 section2 容器有相对定位 */
#section-features {
  position: relative;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
}

/* section2 中复制的 hero 元素样式 */
#section-features .hero-right-text {
  position: absolute;
  top: 50%;
  right: 80px;
  z-index: 100;
  text-align: right;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  transform: translateY(-50%);
}

#section-features .brand-line {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  justify-content: center;
}

#section-features .brand-name {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-weight: 600;
  font-size: 32px;
  letter-spacing: 0.02em;
  color: #0FF7AE;
  line-height: 1.2;
}

#section-features .brand-subtitle {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-weight: 600;
  font-size: 32px;
  letter-spacing: 0.02em;
  color: #ffffff;
  line-height: 1.2;
}

#section-features .brand-description {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-weight: 600;
  font-size: 32px;
  letter-spacing: 0.02em;
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 24px;
}

#section-features .button-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  pointer-events: auto;
}

#section-features h2 {
  color: #000000;
  font-family: 'Inter', sans-serif;
  font-size: 100px;
  font-weight: 500;
  letter-spacing: -0.07em;
  z-index: 100;
  margin: 0;
  position: absolute;
  top: calc(50% - 140px);
  left: 60px;
  transform: none;
  text-align: left;
  pointer-events: none;
}

#section-features h2 div {
  display: block;
  line-height: 1.2;
}

#section-features .x-container {
  display: inline-flex;
  width: 70px;
  height: 80px;
  background-color: #000000;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
  vertical-align: middle;
}

#section-features .x-text {
  font-family: 'Inter', sans-serif;
  font-size: 72px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  text-align: center;
  margin: 0;
  padding: 0;
  transform: translateX(-2px);
}

/* 让标题和描述在同一行 */
.feature-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.feature-title .title-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-description {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 300px;
}

.feature-description p {
  font-size: 18px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-align: right;
  max-width: 280px;
}

.feature-icon {
  width: 38px;
  height: 38px;
  background-color: #696969;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 29px;
}

.feature-icon svg {
  width: 24px;
  height: 24px;
  color: #ffffff;
}

.feature-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.title-main {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 48px;
  line-height: 1;
  color: #CBFF00;
}

.title-sub {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-weight: 600;
  font-size: 32px;
  line-height: 1;
  color: #CBFF00;
}

.feature-demo {
  margin: 20px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

/* 三列布局样式 - 与标题和描述文字对齐 */
.three-column-section {
  width: 100%;
  max-width: calc(100% - 0px);
  height: 382px;
  display: flex;
  gap: 0.7%;
  background: #434343;
  padding: 30px;
  border-radius: 4px;
  margin: 0;
  box-sizing: border-box;
  justify-content: space-between;
}

.column {
  flex: 0 0 32.6%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  justify-content: space-between;
}

.column-image {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.column-text {
  font-size: 16px;
  font-weight: 400;
  color: #B7BABD;
  font-family: 'PingFang SC', '苹方简', sans-serif;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.text-content {
  flex: 1;
}

.text-icon {
  font-size: 16px;
  font-weight: 400;
  color: #B7BABD;
  margin-left: 10px;
}

.placeholder-box {
  width: 100%;
  height: 200px;
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 第三个section的渐变区域样式 */
.gradient-demo {
  margin: 20px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.gradient-section {
  width: 100%;
  max-width: calc(100% - 0px);
  height: 382px;
  background: linear-gradient(135deg, #CBFF00 0%, #CDFE22 100%);
  padding: 30px;
  border-radius: 4px;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gradient-content {
  text-align: center;
  color: #0b0b0b;
}

.gradient-content h4 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
  font-family: 'Inter', sans-serif;
}

.gradient-content p {
  font-size: 16px;
  font-weight: 400;
  opacity: 0.8;
  font-family: 'PingFang SC', '苹方简', sans-serif;
}

/* 第四个section的Agent区域样式 */
.agent-demo {
  margin: 20px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

/* 第五个section的Codebase区域样式 */
.codebase-demo {
  margin: 20px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.codebase-section {
  width: 100%;
  max-width: calc(100% - 0px);
  height: 58vh;
  background: transparent;
  padding: 0;
  border-radius: 0;
  border: none;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

/* 左侧内容区域 */
.codebase-content {
  flex: 0 0 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  margin-right: 12px;
  padding: 4.9vh 0 0 0;
}

/* 图标和标题区域 */
.codebase-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.codebase-icon {
  width: 38px;
  height: 38px;
  background-color: #696969;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.codebase-icon svg {
  width: 24px;
  height: 24px;
}

.codebase-titles {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.codebase-title-en {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 48px;
  line-height: 1;
  color: #CBFF00;
  margin: 0;
}

.codebase-title-cn {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-weight: 600;
  font-size: 32px;
  line-height: 1;
  color: #CBFF00;
  margin: 0;
}

/* 描述文字 */
.codebase-description {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #b7babd;
  line-height: 1.5;
  margin: 5.1vh 0 40px 0;
  width: 80%;
}

/* 编号 */
.codebase-number {
  position: absolute;
  bottom: 20px;
  left: 0;
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #CBFF00;
  z-index: 1;
}

/* 右侧占位图片区域 */
.codebase-image {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.codebase-image .placeholder-image {
  width: 100%;
  height: 100%;
  max-width: 717px;
  max-height: 444px;
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 第四个section使用纯色背景 */
#section-codebase .agent-section {
  background: #CBFF00;
}

/* 第四个section的右侧内容区域样式调整 */
#section-codebase .agent-content {
  margin-right: 0;
  margin-left: 12px;
  padding: 4.9vh 3.1% 0 0;
}

/* 第四个section的编号位置调整 */
#section-codebase .agent-number {
  right: auto;
  left: 0;
  text-align: left;
}

.agent-section {
  width: 100%;
  max-width: calc(100% - 0px);
  height: 58vh;
  background: linear-gradient(135deg, #CBFF00 0%, #CDFE22 100%);
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #000000;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

/* 左侧内容区域 */
.agent-content {
  flex: 0 0 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  margin-right: 12px;
  padding: 4.9vh 0 0 3.1%;
}

/* 图标和标题区域 */
.agent-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.agent-icon {
  width: 38px;
  height: 38px;
  background-color: #696969;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.agent-icon svg {
  width: 24px;
  height: 24px;
}

.agent-titles {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.agent-title-en {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 48px;
  line-height: 1;
  color: #000000;
  margin: 0;
}

.agent-title-cn {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-weight: 600;
  font-size: 32px;
  line-height: 1;
  color: #000000;
  margin: 0;
}

/* 描述文字 */
.agent-description {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #656A72;
  line-height: 1.5;
  margin: 5.1vh 0 40px 0;
  width: 80%;
}

/* 编号 */
.agent-number {
  position: absolute;
  bottom: 20px;
  right: 0;
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #000000;
  z-index: 1;
}

/* 右侧占位图片区域 */
.agent-image {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .three-column-section {
    width: 100%;
    height: auto;
    min-height: 382px;
  }
  
  .gradient-section {
    width: 100%;
    height: auto;
    min-height: 382px;
  }
  
  .feature-description {
    min-width: 250px;
  }
  
  .feature-description p {
    max-width: 240px;
    font-size: 16px;
  }
  
  .agent-section {
    width: 100%;
    height: 58vh;
    min-height: 300px;
  }
}

@media (max-width: 768px) {
  .feature-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .feature-description {
    min-width: auto;
    width: 100%;
    justify-content: flex-start;
  }
  
  .feature-description p {
    text-align: left;
    max-width: 100%;
    font-size: 16px;
  }

  /* Features Grid 响应式样式 */
  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px 15px;
  }

  .feature-card {
    padding: 20px 15px;
  }

  .feature-card h3 {
    font-size: 18px;
  }

  .feature-card p {
    font-size: 13px;
  }
  
  .three-column-section {
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    height: auto;
  }
  
  .gradient-section {
    padding: 20px;
    height: auto;
    min-height: 300px;
  }
  
  .gradient-content h4 {
    font-size: 20px;
  }
  
  .gradient-content p {
    font-size: 14px;
  }
  
  .agent-section {
    padding: 6px;
    height: 58vh;
    min-height: 250px;
    flex-direction: column;
    gap: 12px;
  }
  
  .agent-content {
    flex: none;
    width: 100%;
    height: auto;
    margin-right: 0;
    padding: 20px 0 0 20px;
  }
  
  .agent-image {
    flex: none;
    width: 100%;
    height: 200px;
  }
  
  .agent-title-en {
    font-size: 36px;
  }
  
  .agent-title-cn {
    font-size: 24px;
  }
  
  .agent-description {
    font-size: 16px;
    width: 100%;
  }
  
  .placeholder-box {
    height: 150px;
  }
  
  /* 导航容器响应式样式 */
  .navigation-container {
    flex-direction: column;
    gap: 16px;
    padding: 12px 16px;
  }
  
  .nav-buttons {
    justify-content: center;
    width: 100%;
    gap: 20px;
  }
  
  .nav-btn {
    flex: none;
    min-width: 60px;
    text-align: center;
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .nav-icon img {
    width: 87px;
    height: 24px;
  }
  
  /* 第五个section的响应式样式 */
  .codebase-section {
    padding: 0;
    height: 58vh;
    min-height: 250px;
    flex-direction: column;
    gap: 12px;
  }
  
  .codebase-content {
    flex: none;
    width: 100%;
    height: auto;
    margin-right: 0;
    padding: 20px 0 0 0;
  }
  
  .codebase-image {
    flex: none;
    width: 100%;
    height: 200px;
  }
  
  .codebase-title-en {
    font-size: 36px;
  }
  
  .codebase-title-cn {
    font-size: 24px;
  }
  
  .codebase-description {
    font-size: 16px;
    width: 100%;
  }
}

/* 第六个section的用户声音区域样式 */
.user-voices-section {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.user-voices-title {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #CBFF00;
  text-align: left;
  margin: 0 0 20px 0;
  padding: 0;
}

/* 第六个section的滚动列样式 */
.scrolling-columns-container {
  display: flex;
  gap: 20px;
  width: 100%;
  height: 400px;
  overflow: hidden;
  margin: 0;
}

.scrolling-column {
  flex: 1;
  height: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  animation: scrollUp 20s linear infinite;
  will-change: transform;
  height: 200%;
  position: relative;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

.scrolling-column:hover .column-content {
  animation-play-state: paused;
}

.placeholder-item {
  flex-shrink: 0;
  height: 80px;
  min-height: 80px;
  max-height: 80px;
}

.placeholder-box {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-radius: 6px;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

@keyframes scrollUp {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, -50%, 0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 遮罩区域响应式样式 */
  .mask-section {
    height: 50vh;
    min-height: 300px;
    margin-bottom: 30px;
  }
  
  .scrolling-columns-container {
    flex-direction: column;
    height: auto;
    gap: 15px;
  }
  
  .scrolling-column {
    height: 200px;
  }
  
  .column-content {
    animation: scrollUp 15s linear infinite;
  }
  
  .placeholder-item {
    height: 60px;
  }
}

@media (max-width: 480px) {
  /* 小屏幕遮罩区域样式 */
  .mask-section {
    height: 40vh;
    min-height: 250px;
    margin-bottom: 20px;
  }
}
</style>