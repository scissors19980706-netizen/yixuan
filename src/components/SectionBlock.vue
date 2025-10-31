<script setup>
import { computed } from 'vue'

/**
 * 粘性分区容器，提供背景与内容插槽
 * Props:
 * - id: string 供锚点定位
 * - theme: 'dark' | 'neon' | 'light'
 * - align: 'left' | 'center' | 'right'
 */
const props = defineProps({
  id: { type: String, default: '' },
  theme: { type: String, default: 'dark' },
  align: { type: String, default: 'center' },
  customLayout: { type: Boolean, default: false }
})

const cls = computed(() => [
  'section-block',
  `theme-${props.theme}`,
  `align-${props.align}`,
  { 'custom-layout': props.customLayout }
])
</script>

<template>
  
  <section :id="props.id" :class="cls">
    <div class="inner">
      <template v-if="!props.customLayout">
        <header class="heading">
          <slot name="icon" />
          <slot name="title" />
          <slot name="subtitle" />
        </header>
        <div class="media">
          <slot name="media" />
        </div>
        <div class="content">
          <slot />
        </div>
      </template>
      <template v-else>
        <header class="heading">
          <slot name="icon" />
          <slot name="title" />
          <slot name="subtitle" />
        </header>
        <div class="media">
          <slot name="media" />
        </div>
        <div class="content">
          <slot />
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.section-block {
  scroll-snap-align: start;
  width: 100vw;
  height: 100vh; /* 全屏高度 */
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px 16px;
  border-bottom: 1px dashed rgba(255,255,255,0.1);
  box-sizing: border-box;
  z-index: 1; /* 确保层级正确 */
  margin-bottom: 0; /* 确保没有额外边距 */
  overflow-x: hidden; /* 防止水平滚动 */
}
.inner { 
  width: 100%; 
  max-width: 1200px; 
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.heading { margin-bottom: 16px; }
.media { margin: 16px 0; }
.content { color: rgba(255,255,255,0.9); }

.theme-dark { background: #000000; color:#CDFE22}
.theme-neon { background: #0FF7AE; color: #0b0b0b; }
.theme-light { background: #f7f7f7; color: #0b0b0b; }

.align-left .inner { text-align: left; }
.align-center .inner { text-align: center; }
.align-right .inner { text-align: right; }

/* 自定义布局样式 */
.custom-layout .inner {
  display: block;
}

.custom-layout .content {
  margin-top: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-block {
    padding: 20px 12px;
    height: 100vh;
  }
  .inner {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .section-block {
    padding: 16px 8px;
    height: 100vh;
  }
}
</style>