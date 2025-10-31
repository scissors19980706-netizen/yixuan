<script setup>
/**
 * ContactPopup 联系我们弹窗组件
 * 统一的联系我们弹窗，支持桌面端和移动端
 */
import { defineProps, defineEmits, ref, watch } from 'vue'

/**
 * 组件属性定义
 */
const props = defineProps({
  /**
   * 是否显示弹窗
   */
  visible: {
    type: Boolean,
    default: false
  },
  /**
   * 弹窗类型：'desktop' | 'mobile'
   */
  type: {
    type: String,
    default: 'desktop',
    validator: (value) => ['desktop', 'mobile'].includes(value)
  },
  /**
   * 是否显示关闭按钮（移动端专用）
   */
  showCloseButton: {
    type: Boolean,
    default: true
  }
})

/**
 * 组件事件定义
 */
const emit = defineEmits(['update:visible', 'close'])

/**
 * 内部弹窗显示状态
 */
const isVisible = ref(props.visible)

/**
 * 监听外部visible变化
 */
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
})

/**
 * 监听内部visible变化，同步到外部
 */
watch(isVisible, (newVal) => {
  emit('update:visible', newVal)
  if (!newVal) {
    emit('close')
  }
})

/**
 * 关闭弹窗
 */
const closePopup = () => {
  isVisible.value = false
}

/**
 * 处理遮罩层点击
 */
const handleOverlayClick = () => {
  if (props.type === 'mobile') {
    closePopup()
  }
}

/**
 * 处理弹窗内容点击，阻止事件冒泡
 */
const handleContentClick = (event) => {
  event.stopPropagation()
}
</script>

<template>
  <!-- 移动端遮罩层 -->
  <div 
    v-if="isVisible && type === 'mobile'" 
    class="mobile-popup-overlay"
    @click="handleOverlayClick"
  >
    <div 
      class="contact-popup mobile-contact-popup"
      @click="handleContentClick"
    >
      <div class="contact-popup-content">
        <div class="contact-popup-header">
          <div class="contact-placeholder-text">
            扫码添加微信客服
          </div>
          <button 
            v-if="showCloseButton" 
            class="popup-close-btn" 
            @click="closePopup"
          >
            ×
          </button>
        </div>
        <div class="contact-qr-placeholder">
          <div class="qr-code-placeholder">
            <div class="qr-placeholder-icon">📱</div>
            <div class="qr-placeholder-text">二维码占位符</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 桌面端弹窗 -->
  <div 
    v-if="isVisible && type === 'desktop'" 
    class="contact-popup desktop-contact-popup"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <div class="contact-popup-content">
      <div class="contact-placeholder-text">
        扫码添加微信客服
      </div>
      <div class="contact-qr-placeholder">
        <div class="qr-code-placeholder">
          <div class="qr-placeholder-icon">📱</div>
          <div class="qr-placeholder-text">二维码占位符</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 桌面端联系我们弹窗样式 */
.desktop-contact-popup {
  position: absolute;
  top: 100%; /* 在按钮下方 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001; /* 比导航栏z-index (1000) 更高 */
  pointer-events: auto;
  animation: contactPopupFadeIn 0.3s ease-out;
  /* 确保弹窗相对于按钮居中 */
  margin-top: 8px; /* 与按钮保持小间距 */
  white-space: nowrap; /* 防止文字换行影响布局 */
}

.contact-popup-content {
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.03);
  padding: 20px;
  min-width: 160px;
  max-width: 240px;
  text-align: center;
  /* 弹窗内容与按钮对齐 */
  margin: 0 auto;
}

.contact-placeholder-text {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16px;
  line-height: 1.4;
}

.contact-qr-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.qr-code-placeholder {
  width: 120px;
  height: 120px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
}



.qr-placeholder-text {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 11px;
  color: #999999;
  text-align: center;
  line-height: 1.2;
}

/* 弹窗淡入动画 */
@keyframes contactPopupFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 移动端弹窗遮罩层 */
.mobile-popup-overlay {
  position: fixed;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: contactPopupFadeIn 0.3s ease-out;
  /* 确保遮罩层完全脱离父容器 */
  margin: 0 !important;
  padding: 0 !important;
  transform: none !important;
}

/* 移动端弹窗样式调整 */
.mobile-contact-popup {
  /* 移动端特殊样式 */
  width: 240px; /* 调整宽度以适应160px二维码 */
  max-width: 90vw; /* 确保在小屏幕上不超出 */
  position: relative;
  background: transparent;
  border-radius: 8px;
  margin: 0; /* 移除margin，让flexbox处理居中 */
  /* 确保弹窗不会被父容器样式影响 */
  top: auto !important;
  left: auto !important;
  right: auto !important;
  bottom: auto !important;
  transform: none !important;
}

/* 移动端弹窗头部样式 */
.contact-popup-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0px;
  position: relative;
  min-height: 40px;
}

/* 移动端关闭按钮样式 */
.popup-close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #666666;
  cursor: pointer;
  padding: 0px;
  line-height: 1;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: top;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  position: absolute;
  top: 0;
  right: 0;
}

.popup-close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333333;
}

/* 移动端弹窗内容样式 */
.mobile-contact-popup .contact-popup-content {
  min-width: auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  margin: 0;
  width: 100%;
  box-sizing: border-box;
}

/* 移动端弹窗文字样式调整 */
.mobile-contact-popup .contact-placeholder-text {
  font-size: 14px;
}

/* 移动端二维码占位符样式调整 */
.mobile-contact-popup .qr-code-placeholder {
  width: 160px;
  height: 160px;
}

.mobile-contact-popup .qr-placeholder-icon {
  font-size: 28px;
}

.mobile-contact-popup .qr-placeholder-text {
  font-size: 11px;
}

/* 小屏幕响应式优化 */
@media (max-width: 480px) {
  .mobile-popup-overlay {
    padding: 10px;
  }
  
  .mobile-contact-popup {
    width: 220px;
    max-width: 95vw;
  }
  
  .mobile-contact-popup .contact-popup-content {
    padding: 20px;
  }
  
  .mobile-contact-popup .qr-code-placeholder {
    width: 140px;
    height: 140px;
  }
  
  .mobile-contact-popup .qr-placeholder-icon {
    font-size: 20px;
  }
  
  .mobile-contact-popup .qr-placeholder-text {
    font-size: 9px;
  }
}
</style>
