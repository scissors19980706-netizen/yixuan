<template>
  <div 
    class="mask-image-container"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    ref="containerRef"
  >
    <!-- 底图（默认显示） -->
    <div class="image-layer background-layer">
      <img 
        :src="backgroundImage" 
        :alt="backgroundAlt"
        class="full-image"
        @load="onBackgroundImageLoad"
        @error="onBackgroundImageError"
      />
    </div>
    
    <!-- 顶图（默认隐藏，通过遮罩显示） -->
    <div 
      class="image-layer foreground-layer"
      :style="maskStyle"
    >
      <img 
        :src="foregroundImage" 
        :alt="foregroundAlt"
        class="full-image"
        @load="onForegroundImageLoad"
        @error="onForegroundImageError"
      />
    </div>
    
    <!-- 橙色渐变层（跟随光标） -->
    <div 
      class="image-layer orange-gradient-layer"
      :style="gradientStyle"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * 鼠标遮罩图片组件
 * 实现两层图片，鼠标移动时在光标位置显示圆形遮罩区域
 */

// Props 定义
const props = defineProps({
  /**
   * 底图路径
   */
  backgroundImage: {
    type: String,
    required: true
  },
  /**
   * 顶图路径
   */
  foregroundImage: {
    type: String,
    required: true
  },
  /**
   * 底图 alt 属性
   */
  backgroundAlt: {
    type: String,
    default: '背景图片'
  },
  /**
   * 顶图 alt 属性
   */
  foregroundAlt: {
    type: String,
    default: '前景图片'
  },
  /**
   * 遮罩半径（像素）
   */
  maskRadius: {
    type: Number,
    default: 50
  }
})

// 响应式数据
const containerRef = ref(null)
const mousePosition = ref({ x: 0, y: 0 })
const targetPosition = ref({ x: 0, y: 0 }) // 目标位置（鼠标实际位置）
const velocity = ref({ x: 0, y: 0 }) // 速度向量，用于惯性效果
const lastMouseTime = ref(0) // 上次鼠标移动时间
const isMouseInside = ref(false)
const animationId = ref(null) // 动画帧ID
const isTouchDevice = ref(false) // 是否为触摸设备
const isTouching = ref(false) // 是否正在触摸

/**
 * 计算遮罩样式
 * 使用 radial-gradient 创建环形渐变展开效果
 * 中心透明度为 0，圆形边缘透明度为 0，形成环形显示区域
 */
const maskStyle = computed(() => {
  const { x, y } = mousePosition.value
  
  if (!isMouseInside.value && !isTouching.value && (Math.abs(velocity.value.x) < 0.1 && Math.abs(velocity.value.y) < 0.1)) {
    // 鼠标不在容器内且没有触摸且没有惯性时，完全隐藏顶图
    return {
      maskImage: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 100%)',
      WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 100%)'
    }
  }
  
  // 确保坐标值是有效的数字
  const safeX = isNaN(x) ? 0 : Math.round(x * 100) / 100
  const safeY = isNaN(y) ? 0 : Math.round(y * 100) / 100
  
  // 扩大半径两倍
  const radius = props.maskRadius * 2
  // 渐变过渡区域（让边缘更柔和）
  const transitionWidth = radius * 0.3
  
  // 创建中心到边缘的渐变效果：中心完全显示 -> 在20%处降到40% -> 逐渐透明 -> 边缘完全透明
  const gradient = `radial-gradient(circle at ${safeX}px ${safeY}px, 
    black 0%, 
    rgba(0,0,0,0.6) ${radius * 0.2}px,
    rgba(0,0,0,0.4) ${radius * 0.4}px,
    rgba(0,0,0,0.2) ${radius * 0.6}px,
    rgba(0,0,0,0.1) ${radius * 0.8}px,
    rgba(0,0,0,0.05) ${radius * 0.9}px,
    transparent ${radius}px)`
  
  return {
    maskImage: gradient,
    WebkitMaskImage: gradient
  }
})

/**
 * 计算橙色渐变样式
 * 在光标位置创建环形橙色径向渐变，与新的遮罩效果相匹配
 */
const gradientStyle = computed(() => {
  const { x, y } = mousePosition.value
  
  if (!isMouseInside.value && !isTouching.value && (Math.abs(velocity.value.x) < 0.1 && Math.abs(velocity.value.y) < 0.1)) {
    // 鼠标不在容器内且没有触摸且没有惯性时，完全透明
    return {
      background: 'transparent'
    }
  }
  
  // 确保坐标值是有效的数字
  const safeX = isNaN(x) ? 0 : Math.round(x * 100) / 100
  const safeY = isNaN(y) ? 0 : Math.round(y * 100) / 100
  
  // 扩大半径两倍，与遮罩半径保持一致
  const radius = props.maskRadius * 2
  
  // 创建中心到边缘的橙色径向渐变，与遮罩效果相匹配
  // 中心橙色光晕最强 -> 逐渐减弱 -> 边缘透明（透明度减少一半）
  const orangeGradient = `radial-gradient(circle at ${safeX}px ${safeY}px, 
    rgba(255, 140, 0, 0.2) 0%, 
    rgba(255, 165, 0, 0.175) ${radius * 0.2}px,
    rgba(255, 200, 0, 0.15) ${radius * 0.4}px,
    rgba(255, 200, 0, 0.1) ${radius * 0.6}px,
    rgba(255, 200, 0, 0.05) ${radius * 0.8}px,
    rgba(255, 200, 0, 0.025) ${radius * 0.9}px,
    transparent ${radius}px)`
  
  return {
    background: orangeGradient
  }
})

/**
 * 平滑动画函数
 * 使用自适应插值算法和惯性效果让遮罩位置平滑跟随鼠标
 */
const smoothAnimation = () => {
  const current = mousePosition.value
  const target = targetPosition.value
  const currentTime = performance.now()
  
  // 计算到目标的距离和方向
  const dx = target.x - current.x
  const dy = target.y - current.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  // 惯性衰减因子
  const dampingFactor = 0.95
  
  if (isMouseInside.value || isTouching.value) {
    // 鼠标在容器内或正在触摸，正常跟随
    if (distance < 2) {
      // 距离很小时直接设置为目标位置
      mousePosition.value = { ...target }
      velocity.value = { x: 0, y: 0 }
    } else {
      // 自适应插值因子：距离越大，跟随越快
      // 基础插值因子 + 距离相关的加速度
      const baseLerpFactor = 0.15
      const distanceBoost = Math.min(distance * 0.002, 0.25) // 最大额外加速0.25
      const adaptiveLerpFactor = Math.min(baseLerpFactor + distanceBoost, 0.4)
      
      // 计算新位置
      const newX = current.x + dx * adaptiveLerpFactor
      const newY = current.y + dy * adaptiveLerpFactor
      
      // 更新速度（用于惯性效果）
      const deltaX = newX - current.x
      const deltaY = newY - current.y
      
      velocity.value = {
        x: deltaX * 0.7 + velocity.value.x * 0.3,
        y: deltaY * 0.7 + velocity.value.y * 0.3
      }
      
      mousePosition.value = { x: newX, y: newY }
    }
    
    lastMouseTime.value = currentTime
  } else {
    // 鼠标离开容器或触摸结束，应用惯性效果
    const timeSinceLastMove = currentTime - lastMouseTime.value
    
    // 如果刚离开不久（800ms内）且有足够的速度，继续惯性移动
    if (timeSinceLastMove < 800 && (Math.abs(velocity.value.x) > 0.05 || Math.abs(velocity.value.y) > 0.05)) {
      mousePosition.value = {
        x: current.x + velocity.value.x,
        y: current.y + velocity.value.y
      }
      
      // 应用阻尼，逐渐减慢速度
      velocity.value = {
        x: velocity.value.x * dampingFactor,
        y: velocity.value.y * dampingFactor
      }
    } else {
      // 停止动画
      velocity.value = { x: 0, y: 0 }
      animationId.value = null
      return
    }
  }
  
  // 继续动画
  animationId.value = requestAnimationFrame(smoothAnimation)
}

/**
 * 开始平滑动画
 */
const startSmoothAnimation = () => {
  if (animationId.value) return // 避免重复启动
  animationId.value = requestAnimationFrame(smoothAnimation)
}

/**
 * 停止平滑动画
 */
const stopSmoothAnimation = () => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
    animationId.value = null
  }
}

/**
 * 处理鼠标移动事件
 * @param {MouseEvent} event - 鼠标事件
 */
const handleMouseMove = (event) => {
  if (!containerRef.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  
  // 更新目标位置（鼠标实际位置）
  const newTargetX = event.clientX - rect.left
  const newTargetY = event.clientY - rect.top
  
  targetPosition.value = {
    x: newTargetX,
    y: newTargetY
  }
  
  // 如果是第一次进入，设置初始位置但保持一点距离感
  if (!isMouseInside.value) {
    // 不直接设置为鼠标位置，而是设置为稍微偏移的位置，创造追赶效果
    const offsetDistance = 30
    const angle = Math.random() * Math.PI * 2
    mousePosition.value = {
      x: newTargetX + Math.cos(angle) * offsetDistance,
      y: newTargetY + Math.sin(angle) * offsetDistance
    }
    velocity.value = { x: 0, y: 0 }
  }
  
  isMouseInside.value = true
  
  // 确保动画始终运行
  if (!animationId.value) {
    startSmoothAnimation()
  }
}

/**
 * 处理鼠标离开事件
 */
const handleMouseLeave = () => {
  isMouseInside.value = false
  // 不立即停止动画，让惯性效果继续
  // stopSmoothAnimation() 会在动画函数内部自动调用
}

/**
 * 处理触摸开始事件
 * @param {TouchEvent} event - 触摸事件
 */
const handleTouchStart = (event) => {
  event.preventDefault() // 防止页面滚动
  if (!containerRef.value) return
  
  const touch = event.touches[0]
  const rect = containerRef.value.getBoundingClientRect()
  
  // 更新目标位置（触摸位置）
  const newTargetX = touch.clientX - rect.left
  const newTargetY = touch.clientY - rect.top
  
  targetPosition.value = {
    x: newTargetX,
    y: newTargetY
  }
  
  // 如果是第一次触摸，设置初始位置
  if (!isTouching.value) {
    mousePosition.value = {
      x: newTargetX,
      y: newTargetY
    }
    velocity.value = { x: 0, y: 0 }
  }
  
  isTouching.value = true
  isMouseInside.value = false // 触摸时禁用鼠标状态
  
  // 确保动画始终运行
  if (!animationId.value) {
    startSmoothAnimation()
  }
}

/**
 * 处理触摸移动事件
 * @param {TouchEvent} event - 触摸事件
 */
const handleTouchMove = (event) => {
  event.preventDefault() // 防止页面滚动
  if (!containerRef.value) return
  
  const touch = event.touches[0]
  const rect = containerRef.value.getBoundingClientRect()
  
  // 更新目标位置（触摸位置）
  const newTargetX = touch.clientX - rect.left
  const newTargetY = touch.clientY - rect.top
  
  targetPosition.value = {
    x: newTargetX,
    y: newTargetY
  }
  
  // 确保动画始终运行
  if (!animationId.value) {
    startSmoothAnimation()
  }
}

/**
 * 处理触摸结束事件
 */
const handleTouchEnd = () => {
  isTouching.value = false
  // 不立即停止动画，让惯性效果继续
  // stopSmoothAnimation() 会在动画函数内部自动调用
}

/**
 * 检测是否为触摸设备
 */
const detectTouchDevice = () => {
  return 'ontouchstart' in window || 
         navigator.maxTouchPoints > 0 || 
         window.matchMedia('(pointer: coarse)').matches
}

/**
 * 背景图片加载成功
 */
const onBackgroundImageLoad = () => {
  console.log('背景图片加载成功')
}

/**
 * 背景图片加载失败
 */
const onBackgroundImageError = (event) => {
  console.error('背景图片加载失败:', event.target.src)
}

/**
 * 前景图片加载成功
 */
const onForegroundImageLoad = () => {
  console.log('前景图片加载成功')
}

/**
 * 前景图片加载失败
 */
const onForegroundImageError = (event) => {
  console.error('前景图片加载失败:', event.target.src)
}

/**
 * 处理窗口大小变化
 */
const handleResize = () => {
  // 窗口大小变化时重置状态
  isMouseInside.value = false
  isTouching.value = false
  stopSmoothAnimation()
}

onMounted(() => {
  // 检测设备类型
  isTouchDevice.value = detectTouchDevice()
  
  window.addEventListener('resize', handleResize)
  
  // 调试：检查组件是否正确挂载
  console.log('MaskImage组件已挂载')
  console.log('背景图片:', props.backgroundImage)
  console.log('前景图片:', props.foregroundImage)
  console.log('遮罩半径:', props.maskRadius)
  console.log('容器引用:', containerRef.value)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  // 组件卸载时停止动画
  stopSmoothAnimation()
})

// 暴露方法给父组件使用
defineExpose({
  handleMouseMove,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd
})
</script>

<style scoped>
.mask-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: default; /* 显示默认光标 */
  touch-action: none; /* 防止触摸时的默认行为（如滚动、缩放） */
  -webkit-touch-callout: none; /* 禁用iOS长按菜单 */
  -webkit-user-select: none; /* 禁用文本选择 */
  user-select: none;
}

.image-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 确保不影响鼠标事件 */
}

.background-layer {
  z-index: 1;
}

.foreground-layer {
  z-index: 2;
  /* 默认完全隐藏顶图，通过JavaScript动态控制遮罩 */
  mask: radial-gradient(circle at 50% 50%, transparent 0%, transparent 100%);
  -webkit-mask: radial-gradient(circle at 50% 50%, transparent 0%, transparent 100%);
  mask-size: 100% 100%;
  -webkit-mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
  /* 移除CSS过渡，使用JavaScript控制平滑动画 */
}

.orange-gradient-layer {
  z-index: 3;
  /* 橙色渐变层，跟随光标移动 */
  background: transparent;
  /* 移除CSS过渡，使用JavaScript控制平滑动画 */
  pointer-events: none; /* 确保不影响鼠标事件 */
  /* 使用混合模式增强视觉效果 */
  mix-blend-mode: overlay;
  -webkit-mix-blend-mode: overlay;
}

.full-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持响应式，图片覆盖整个容器 */
  display: block;
  pointer-events: none; /* 确保不影响鼠标事件 */
}


/* 响应式设计 */
@media (max-width: 768px) {
  .mask-image-container {
    min-height: 50vh;
  }
}

@media (max-width: 480px) {
  .mask-image-container {
    min-height: 40vh;
  }
}
</style>
