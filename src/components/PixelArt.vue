<template>
  <div class="pixel-art-container">
    <!-- Canvas渲染区域 - 全屏 -->
    <div class="canvas-container">
      <canvas 
        ref="canvas" 
        :width="canvasWidth" 
        :height="canvasHeight"
        class="pixel-canvas"
        @mousemove="handleMouseMove"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @pointermove="handleMouseMove"
        @pointerenter="handleMouseEnter"
        @pointerleave="handleMouseLeave"
      ></canvas>
      
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <div class="loading-text">处理中... {{ loadingProgress }}%</div>
        <div class="loading-bar">
          <div class="loading-progress" :style="{ width: loadingProgress + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- 参数控制面板 - 固定在底部 -->
    <div class="controls-panel">
      <div class="control-group">
        <h3>像素化设置</h3>
        <div class="control-item">
          <label>网格大小: {{ props.gridSize }}px</label>
          <input 
            type="range" 
            min="8" 
            max="120" 
            step="4" 
            :value="props.gridSize"
            @input="emit('update:gridSize', Number($event.target.value))"
            class="slider"
          />
        </div>
        <div class="control-item">
          <label>Tile形状:</label>
          <select :value="props.shape" @change="emit('update:shape', $event.target.value)" class="select">
            <option value="square">方形</option>
            <option value="circle">圆形</option>
          </select>
        </div>
        <div class="control-item">
          <label>Tile缩放: {{ props.tileScale }}x</label>
          <input 
            type="range" 
            min="0.1" 
            max="2" 
            step="0.1" 
            :value="props.tileScale"
            @input="emit('update:tileScale', Number($event.target.value))"
            class="slider"
          />
        </div>
        <div class="control-item">
          <label>Tile颜色:</label>
          <input type="color" :value="props.tileColor" @input="emit('update:tileColor', $event.target.value)" class="color-picker" />
        </div>
        <div class="control-item">
          <label>背景颜色:</label>
          <input type="color" :value="props.backgroundColor" @input="emit('update:backgroundColor', $event.target.value)" class="color-picker" />
        </div>
      </div>

      <div class="control-group">
        <h3>滤镜设置</h3>
        <div class="control-item">
          <label>亮度: {{ props.brightness }}</label>
          <input 
            type="range" 
            min="-127" 
            max="127" 
            step="1" 
            :value="props.brightness"
            @input="emit('update:brightness', Number($event.target.value))"
            class="slider"
          />
        </div>
        <div class="control-item">
          <label>抖动效果:</label>
          <select :value="props.ditherType" @change="emit('update:ditherType', $event.target.value)" class="select">
            <option value="none">无</option>
            <option value="bayer">Bayer抖动</option>
            <option value="floyd-steinberg">Floyd-Steinberg抖动</option>
            <option value="atkinson">Atkinson抖动</option>
          </select>
        </div>
        <div class="control-item">
          <label>灰阶等级: {{ props.grayLevels }}</label>
          <input 
            type="range" 
            min="2" 
            max="32" 
            step="1" 
            :value="props.grayLevels"
            @input="emit('update:grayLevels', Number($event.target.value))"
            class="slider"
          />
        </div>
        <div class="control-item">
          <label>抖动强度: {{ props.ditherStrength }}%</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="5" 
            :value="props.ditherStrength"
            @input="emit('update:ditherStrength', Number($event.target.value))"
            class="slider"
          />
        </div>
        <div class="control-item">
          <label>对比度: {{ props.contrast }}</label>
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="0.1" 
            :value="props.contrast"
            @input="emit('update:contrast', Number($event.target.value))"
            class="slider"
          />
        </div>
        <div class="control-item">
          <label>模糊: {{ props.blur }}</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="1" 
            :value="props.blur"
            @input="emit('update:blur', Number($event.target.value))"
            class="slider"
          />
        </div>
        <div class="control-item">
          <label>锐化: {{ props.sharpness }}</label>
          <input 
            type="range" 
            min="-100" 
            max="0" 
            step="1" 
            :value="props.sharpness"
            @input="emit('update:sharpness', Number($event.target.value))"
            class="slider"
          />
        </div>
        <div class="control-item">
          <label>
            <input type="checkbox" :checked="props.invert" @change="emit('update:invert', $event.target.checked)" class="checkbox" />
            反色
          </label>
        </div>
        <div class="control-item">
          <label>亮度对比度: {{ props.brightnessContrast }}x</label>
          <input 
            type="range" 
            min="0.5" 
            max="2.0" 
            step="0.1" 
            :value="props.brightnessContrast"
            @input="emit('update:brightnessContrast', Number($event.target.value))"
            class="slider"
          />
        </div>
      </div>

      <div class="control-group">
        <h3>动画设置</h3>
        <div class="control-item">
          <label>
            <input type="checkbox" v-model="enableAnimation" class="checkbox" />
            启用动态效果
          </label>
        </div>
        <div class="control-item">
          <label>动画速度: {{ animationSpeed }}x</label>
          <input 
            type="range" 
            min="0.1" 
            max="3" 
            step="0.1" 
            v-model="animationSpeed" 
            class="slider"
          />
        </div>
        <div class="control-item">
          <label>避开半径: {{ avoidanceRadius }}px</label>
          <input 
            type="range" 
            min="20" 
            max="200" 
            step="10" 
            v-model="avoidanceRadius" 
            class="slider"
          />
        </div>
        <div class="control-item">
          <label>最大位移: {{ maxDisplacement }}px</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            step="1" 
            v-model="maxDisplacement" 
            class="slider"
          />
        </div>
      </div>

      <div class="control-group">
        <h3>图片上传</h3>
        <input 
          type="file" 
          @change="handleFileUpload" 
          accept="image/*" 
          class="file-input"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

// Props定义
const props = defineProps({
  imageSrc: {
    type: String,
    default: ''
  },
  gridSize: {
    type: Number,
    default: 4
  },
  shape: {
    type: String,
    default: 'square' // "square" | "circle"
  },
  tileScale: {
    type: Number,
    default: 1
  },
  tileColor: {
    type: String,
    default: '#0FF7AE'
  },
  backgroundColor: {
    type: String,
    default: '#000000'
  },
  brightness: {
    type: Number,
    default: -10 // -127 ~ +127
  },
  contrast: {
    type: Number,
    default: 2 // 0 ~ 2
  },
  blur: {
    type: Number,
    default: 100 // 0 ~ 100
  },
  sharpness: {
    type: Number,
    default: 0 // -100 ~ 0
  },
  invert: {
    type: Boolean,
    default: false
  },
  brightnessContrast: {
    type: Number,
    default: 0.5 // 亮度对比度强度：0.5-2.0
  },
  ditherType: {
    type: String,
    default: 'none' // "none" | "bayer" | "floyd-steinberg"
  },
  grayLevels: {
    type: Number,
    default: 8 // 灰阶等级数量：2-32
  },
  ditherStrength: {
    type: Number,
    default: 100 // 抖动强度：0-100%
  }
})

// Emit定义
const emit = defineEmits([
  'update:gridSize',
  'update:shape', 
  'update:tileScale',
  'update:tileColor',
  'update:backgroundColor',
  'update:brightness',
  'update:contrast',
  'update:blur',
  'update:sharpness',
  'update:invert',
  'update:brightnessContrast',
  'update:ditherType',
  'update:grayLevels',
  'update:ditherStrength'
])

// 响应式数据
const canvas = ref(null)
const canvasWidth = ref(800)
const canvasHeight = ref(600)
const originalImage = ref(null)
const processedImage = ref(null)
const isLoading = ref(false)
const loadingProgress = ref(0)

// 动态效果相关
const mousePosition = ref({ x: 0, y: 0 })
const isMouseOver = ref(false)
const animationId = ref(null)
const particles = ref([])
const enableAnimation = ref(true)
const animationSpeed = ref(1.0)
const avoidanceRadius = ref(140)
const maxDisplacement = ref(5) // 最大位移距离

// 防抖处理
let processTimeout = null

const debouncedProcessImage = () => {
  if (processTimeout) {
    clearTimeout(processTimeout)
  }
  processTimeout = setTimeout(() => {
    if (originalImage.value) {
      processImage()
    }
  }, 100) // 100ms防抖
}

// 监听所有参数变化
watch([
  () => props.gridSize,
  () => props.shape,
  () => props.tileScale,
  () => props.tileColor,
  () => props.backgroundColor,
  () => props.brightness,
  () => props.contrast,
  () => props.blur,
  () => props.sharpness,
  () => props.invert,
  () => props.brightnessContrast,
  () => props.ditherType,
  () => props.grayLevels,
  () => props.ditherStrength
], debouncedProcessImage, { deep: true })

/**
 * 处理文件上传
 */
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      loadImage(e.target.result)
    }
    reader.readAsDataURL(file)
  }
}

/**
 * 加载图片
 */
const loadImage = (src) => {
  isLoading.value = true
  loadingProgress.value = 0
  
  const img = new Image()
  img.crossOrigin = 'anonymous'
  
  img.onload = () => {
    originalImage.value = img
    canvasWidth.value = img.width
    canvasHeight.value = img.height
    loadingProgress.value = 50
    processImage()
  }
  
  img.onerror = () => {
    isLoading.value = false
    console.error('图片加载失败')
  }
  
  img.src = src
}

/**
 * 应用滤镜到图片
 */
const applyFilters = (imageData) => {
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height
  
  // 应用亮度和对比度
  for (let i = 0; i < data.length; i += 4) {
    // 对比度调整: new = α * old + β
    let r = props.contrast * data[i] + props.brightness
    let g = props.contrast * data[i + 1] + props.brightness
    let b = props.contrast * data[i + 2] + props.brightness
    
    // 限制在0-255范围内
    data[i] = Math.max(0, Math.min(255, r))
    data[i + 1] = Math.max(0, Math.min(255, g))
    data[i + 2] = Math.max(0, Math.min(255, b))
  }
  
  // 应用抖动效果
  if (props.ditherType === 'bayer') {
    applyBayerDithering(imageData, width, height)
  } else if (props.ditherType === 'floyd-steinberg') {
    applyFloydSteinbergDithering(imageData, width, height)
  } else if (props.ditherType === 'atkinson') {
    applyAtkinsonDithering(imageData, width, height)
  } else {
    // 无抖动时，应用反色
    if (props.invert) {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]     // R
        data[i + 1] = 255 - data[i + 1] // G
        data[i + 2] = 255 - data[i + 2] // B
      }
    }
  }
  
  return imageData
}

/**
 * 应用 Bayer 有序抖动算法
 * @param {ImageData} imageData - 图像数据
 * @param {number} width - 图像宽度
 * @param {number} height - 图像高度
 */
const applyBayerDithering = (imageData, width, height) => {
  const data = imageData.data
  
  // 使用8x8 Bayer矩阵以获得更平滑的效果
  const bayer = [
    [0, 32,  8, 40,  2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44,  4, 36, 14, 46,  6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43,  1, 33,  9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47,  7, 39, 13, 45,  5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21]
  ]
  const N = 8

  // 计算灰阶等级
  const grayLevels = Math.max(2, Math.min(256, props.grayLevels))
  const levelStep = 255 / (grayLevels - 1)

  // 按像素处理
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      
      // 使用像素坐标计算阈值
      const threshold = (bayer[y % N][x % N] / (N * N)) * 256
      
      // 改进的抖动计算，使用更平滑的插值
      const quantizedGray = Math.round(gray / levelStep) * levelStep
      const error = gray - quantizedGray
      const ditherFactor = (props.ditherStrength / 100) * 0.8
      const ditheredGray = quantizedGray + error * (threshold / 255) * ditherFactor
      
      // 量化到最近的灰阶等级
      let newVal = Math.round(Math.max(0, Math.min(255, ditheredGray)) / levelStep) * levelStep
      
      // 如果启用颜色翻转，则反转颜色
      if (props.invert) {
        newVal = 255 - newVal
      }
      
      data[i] = newVal     // R
      data[i + 1] = newVal // G
      data[i + 2] = newVal // B
    }
  }
}

/**
 * 应用 Floyd-Steinberg 抖动算法
 * @param {ImageData} imageData - 图像数据
 * @param {number} width - 图像宽度
 * @param {number} height - 图像高度
 */
const applyFloydSteinbergDithering = (imageData, width, height) => {
  const data = imageData.data
  
  // 计算灰阶等级
  const grayLevels = Math.max(2, Math.min(256, props.grayLevels))
  const levelStep = 255 / (grayLevels - 1)
  
  // 创建错误扩散数组
  const errorBuffer = new Array(width * height).fill(0)
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      
      // 添加之前的错误
      const adjustedGray = gray + errorBuffer[y * width + x]
      
      // 改进的量化：使用更平滑的阈值
      const threshold = levelStep / 2
      let newVal
      if (adjustedGray < threshold) {
        newVal = 0
      } else {
        newVal = Math.round(adjustedGray / levelStep) * levelStep
        newVal = Math.max(levelStep, Math.min(255, newVal))
      }
      
      // 如果启用颜色翻转，则反转颜色
      if (props.invert) {
        newVal = 255 - newVal
      }
      
      // 计算量化错误
      const error = adjustedGray - newVal
      
      // 改进的误差扩散权重，产生更平滑的效果
      const ditherFactor = props.ditherStrength / 100
      if (x + 1 < width) {
        errorBuffer[y * width + (x + 1)] += error * 0.4375 * ditherFactor  // 7/16
      }
      if (y + 1 < height) {
        if (x > 0) {
          errorBuffer[(y + 1) * width + (x - 1)] += error * 0.1875 * ditherFactor  // 3/16
        }
        errorBuffer[(y + 1) * width + x] += error * 0.3125 * ditherFactor  // 5/16
        if (x + 1 < width) {
          errorBuffer[(y + 1) * width + (x + 1)] += error * 0.0625 * ditherFactor  // 1/16
        }
      }
      
      data[i] = newVal     // R
      data[i + 1] = newVal // G
      data[i + 2] = newVal // B
    }
  }
}

/**
 * 应用 Atkinson 抖动算法
 * @param {ImageData} imageData - 图像数据
 * @param {number} width - 图像宽度
 * @param {number} height - 图像高度
 */
const applyAtkinsonDithering = (imageData, width, height) => {
  const data = imageData.data
  
  // 计算灰阶等级
  const grayLevels = Math.max(2, Math.min(256, props.grayLevels))
  const levelStep = 255 / (grayLevels - 1)
  
  // 创建错误扩散数组
  const errorBuffer = new Array(width * height).fill(0)
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      
      // 添加之前的错误
      const adjustedGray = gray + errorBuffer[y * width + x]
      
      // 量化到最近的灰阶等级
      let newVal = Math.round(adjustedGray / levelStep) * levelStep
      newVal = Math.max(0, Math.min(255, newVal))
      
      // 如果启用颜色翻转，则反转颜色
      if (props.invert) {
        newVal = 255 - newVal
      }
      
      // 计算量化错误
      const error = adjustedGray - newVal
      
      // Atkinson误差扩散模式 - 扩散到6个相邻像素，权重更均匀
      const ditherFactor = props.ditherStrength / 100
      const errorSixth = (error / 8) * ditherFactor  // 总权重为8，所以每个像素的权重是1/8
      
      if (x + 1 < width) {
        errorBuffer[y * width + (x + 1)] += errorSixth
      }
      if (x + 2 < width) {
        errorBuffer[y * width + (x + 2)] += errorSixth
      }
      if (y + 1 < height) {
        if (x > 0) {
          errorBuffer[(y + 1) * width + (x - 1)] += errorSixth
        }
        errorBuffer[(y + 1) * width + x] += errorSixth
        if (x + 1 < width) {
          errorBuffer[(y + 1) * width + (x + 1)] += errorSixth
        }
      }
      if (y + 2 < height) {
        errorBuffer[(y + 2) * width + x] += errorSixth
      }
      
      data[i] = newVal     // R
      data[i + 1] = newVal // G
      data[i + 2] = newVal // B
    }
  }
}

/**
 * 计算亮度值
 */
const calculateLuminance = (r, g, b) => {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * 处理鼠标移动事件 - 优化快速移动响应
 */
let mouseMoveTimeout = null

const handleMouseMove = (event) => {
  if (!canvas.value) return
  
  // 立即更新鼠标位置，不进行节流
  const rect = canvas.value.getBoundingClientRect()
  const canvasWidth = canvas.value.width
  const canvasHeight = canvas.value.height
  
  // 计算鼠标在canvas中的相对位置（0-1）
  const relativeX = (event.clientX - rect.left) / rect.width
  const relativeY = (event.clientY - rect.top) / rect.height
  
  // 转换为canvas内部坐标
  const mouseX = relativeX * canvasWidth
  const mouseY = relativeY * canvasHeight
  
  mousePosition.value = {
    x: mouseX,
    y: mouseY
  }
  
  // 使用防抖来减少过度的动画更新
  if (mouseMoveTimeout) {
    clearTimeout(mouseMoveTimeout)
  }
  
  mouseMoveTimeout = setTimeout(() => {
    // 确保动画在鼠标停止移动后继续运行一段时间
    if (enableAnimation.value && isMouseOver.value) {
      startAnimation()
    }
  }, 50)
}

/**
 * 处理鼠标进入事件
 */
const handleMouseEnter = () => {
  isMouseOver.value = true
  if (enableAnimation.value) {
    startAnimation()
  }
}

/**
 * 处理鼠标离开事件
 */
const handleMouseLeave = () => {
  isMouseOver.value = false
  stopAnimation()
}

/**
 * 开始动画 - 优化快速响应
 */
let lastRenderTime = 0
const targetFPS = 120 // 提高帧率以更好响应快速移动
const frameInterval = 1000 / targetFPS

const startAnimation = () => {
  if (animationId.value) return
  
  const animate = (currentTime) => {
    if (enableAnimation.value && isMouseOver.value) {
      // 减少帧率限制，提高响应性
      if (currentTime - lastRenderTime >= frameInterval) {
        updateParticles()
        renderPixelArt()
        lastRenderTime = currentTime
      }
      animationId.value = requestAnimationFrame(animate)
    }
  }
  animationId.value = requestAnimationFrame(animate)
}

/**
 * 停止动画
 */
const stopAnimation = () => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
    animationId.value = null
  }
}

/**
 * 更新粒子位置 - 优化性能
 */
const updateParticles = () => {
  if (!particles.value.length) return
  
  const mouseX = mousePosition.value.x
  const mouseY = mousePosition.value.y
  const avoidanceRadiusSquared = avoidanceRadius.value * avoidanceRadius.value
  
  particles.value.forEach(particle => {
    // 使用平方距离避免开方运算
    const dx = particle.x - mouseX
    const dy = particle.y - mouseY
    const distanceSquared = dx * dx + dy * dy
    
     // 如果在避开半径内，计算避开力
     if (distanceSquared < avoidanceRadiusSquared && distanceSquared > 0) {
       const distance = Math.sqrt(distanceSquared)
       const force = (avoidanceRadius.value - distance) / avoidanceRadius.value
       
       // 预计算三角函数值 - 增加响应速度（2倍）
       const invDistance = 1 / distance
       const avoidX = dx * invDistance * force * animationSpeed.value * 0.6
       const avoidY = dy * invDistance * force * animationSpeed.value * 0.6
       
       // 更新位置
       particle.x += avoidX
       particle.y += avoidY
       
       // 减少随机性计算 - 进一步降低随机移动
       if (Math.random() < 0.15) {
         particle.x += (Math.random() - 0.5) * animationSpeed.value * 0.03
         particle.y += (Math.random() - 0.5) * animationSpeed.value * 0.03
       }
     } else {
       // 不在避开半径内，向原始位置移动 - 增加回归速度（2倍）
       const returnForce = 0.4 * animationSpeed.value
       particle.x += (particle.originalX - particle.x) * returnForce
       particle.y += (particle.originalY - particle.y) * returnForce
     }
     
     // 限制最大位移距离
     const displacementX = particle.x - particle.originalX
     const displacementY = particle.y - particle.originalY
     const displacementDistance = Math.sqrt(displacementX * displacementX + displacementY * displacementY)
     
     if (displacementDistance > maxDisplacement.value) {
       const scale = maxDisplacement.value / displacementDistance
       particle.x = particle.originalX + displacementX * scale
       particle.y = particle.originalY + displacementY * scale
       
       // 调试信息 - 偶尔输出
       if (Math.random() < 0.001) {
         console.log('Particle displacement limited:', {
           displacementDistance: displacementDistance,
           maxDisplacement: maxDisplacement.value,
           scale: scale
         })
       }
     }
     
     // 使用canvas实际尺寸进行边界检查
     const actualCanvasWidth = canvas.value ? canvas.value.width : canvasWidth.value
     const actualCanvasHeight = canvas.value ? canvas.value.height : canvasHeight.value
     
     particle.x = Math.max(0, Math.min(actualCanvasWidth, particle.x))
     particle.y = Math.max(0, Math.min(actualCanvasHeight, particle.y))
  })
}

/**
 * 绘制像素化效果
 */
const renderPixelArt = () => {
  if (!canvas.value || !processedImage.value) return
  
  const ctx = canvas.value.getContext('2d')
  const width = canvasWidth.value
  const height = canvasHeight.value
  
  // 限制最大渲染尺寸以提高性能
  const maxSize = 1200
  const scale = Math.min(1, maxSize / Math.max(width, height))
  const renderWidth = Math.floor(width * scale)
  const renderHeight = Math.floor(height * scale)
  
  // 设置canvas尺寸
  canvas.value.width = renderWidth
  canvas.value.height = renderHeight
  
  // 优化渲染质量
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  
  // 清空画布
  ctx.fillStyle = props.backgroundColor
  ctx.fillRect(0, 0, renderWidth, renderHeight)
  
  // 获取处理后的图片数据
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  tempCanvas.width = renderWidth
  tempCanvas.height = renderHeight
  tempCtx.drawImage(processedImage.value, 0, 0, renderWidth, renderHeight)
  const imageData = tempCtx.getImageData(0, 0, renderWidth, renderHeight)
  
  // 像素化处理
  const gridSize = Math.max(2, Math.floor(props.gridSize * scale))
  const tileScale = props.tileScale
  
  // 如果启用了动画且鼠标在画布上，使用动态粒子渲染
  if (enableAnimation.value && isMouseOver.value && particles.value.length > 0) {
    renderDynamicParticles(ctx, renderWidth, renderHeight, imageData)
  } else {
    // 静态渲染
    renderStaticPixels(ctx, renderWidth, renderHeight, imageData, gridSize, tileScale)
  }
  
  // 绘制光标中心的渐变圆形
  if (isMouseOver.value) {
    drawCursorGradient(ctx, renderWidth, renderHeight)
  }
}

/**
 * 绘制光标中心的渐变圆形
 */
const drawCursorGradient = (ctx, renderWidth, renderHeight) => {
  const mouseX = mousePosition.value.x
  const mouseY = mousePosition.value.y
  
  // 创建径向渐变
  const gradient = ctx.createRadialGradient(
    mouseX, mouseY, 0,           // 内圆中心点和半径
    mouseX, mouseY, avoidanceRadius.value  // 外圆中心点和半径
  )
  
  // 设置渐变颜色：从中心透明到边缘半透明
  gradient.addColorStop(0, 'rgba(15, 247, 174, 0.3)')    // 中心：半透明青色
  gradient.addColorStop(0.5, 'rgba(15, 247, 174, 0.1)')  // 中间：更透明
  gradient.addColorStop(1, 'rgba(15, 247, 174, 0)')      // 边缘：完全透明
  
  // 绘制渐变圆形
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(mouseX, mouseY, avoidanceRadius.value, 0, Math.PI * 2)
  ctx.fill()
}

/**
 * 渲染动态粒子
 */
const renderDynamicParticles = (ctx, renderWidth, renderHeight, imageData) => {
  particles.value.forEach(particle => {
    // 获取粒子位置对应的像素颜色
    const x = Math.floor(particle.x)
    const y = Math.floor(particle.y)
    
    if (x >= 0 && x < renderWidth && y >= 0 && y < renderHeight) {
      const pixelIndex = (y * renderWidth + x) * 4
      const r = imageData.data[pixelIndex]
      const g = imageData.data[pixelIndex + 1]
      const b = imageData.data[pixelIndex + 2]
      
      // 计算亮度
      const luminance = calculateLuminance(r, g, b)
      const normalizedLuminance = luminance / 255
      
      // 根据亮度计算tile大小 - 深色部分粒子更小，亮色部分粒子更大
      // 使用可调节的对比度强度
      const minSize = 0.2 * props.brightnessContrast
      const maxSize = 0.2 + 1.3 * props.brightnessContrast
      const brightnessMultiplier = minSize + (maxSize - minSize) * normalizedLuminance
      const baseSize = particle.originalSize * brightnessMultiplier
      const tileSize = Math.max(1, Math.round(baseSize))
      
      // 设置颜色
      ctx.fillStyle = props.tileColor
      
      // 对齐到像素边界，减少毛糙
      const alignedX = Math.round(particle.x)
      const alignedY = Math.round(particle.y)
      
      // 绘制tile
      if (props.shape === 'circle') {
        ctx.beginPath()
        ctx.arc(alignedX, alignedY, tileSize / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // 方形 - 确保尺寸为整数
        const halfSize = Math.round(tileSize / 2)
        const size = halfSize * 2
        ctx.fillRect(
          alignedX - halfSize, 
          alignedY - halfSize, 
          size, 
          size
        )
      }
    }
  })
}

/**
 * 渲染静态像素
 */
const renderStaticPixels = (ctx, renderWidth, renderHeight, imageData, gridSize, tileScale) => {
  // 增加粒子间距，让粒子更分散
  const spacingMultiplier = 1.2 // 增加20%的间距
  const adjustedGridSize = gridSize * spacingMultiplier
  
  // 使用requestAnimationFrame分批处理以提高性能
  const processBatch = (startY, endY) => {
    for (let y = startY; y < endY && y < renderHeight; y += adjustedGridSize) {
      for (let x = 0; x < renderWidth; x += adjustedGridSize) {
        // 计算当前网格的平均亮度
        let totalR = 0, totalG = 0, totalB = 0
        let pixelCount = 0
        
        for (let dy = 0; dy < gridSize && y + dy < renderHeight; dy++) {
          for (let dx = 0; dx < gridSize && x + dx < renderWidth; dx++) {
            const pixelIndex = ((y + dy) * renderWidth + (x + dx)) * 4
            totalR += imageData.data[pixelIndex]
            totalG += imageData.data[pixelIndex + 1]
            totalB += imageData.data[pixelIndex + 2]
            pixelCount++
          }
        }
        
        const avgR = totalR / pixelCount
        const avgG = totalG / pixelCount
        const avgB = totalB / pixelCount
        
        // 计算亮度
        const luminance = calculateLuminance(avgR, avgG, avgB)
        
        // 根据亮度计算tile大小 - 深色部分粒子更小，亮色部分粒子更大
        // 使用可调节的对比度强度
        const normalizedLuminance = luminance / 255
        const minSize = 0.2 * props.brightnessContrast
        const maxSize = 0.2 + 1.3 * props.brightnessContrast
        const brightnessMultiplier = minSize + (maxSize - minSize) * normalizedLuminance
        const baseSize = gridSize * tileScale * brightnessMultiplier
        const tileSize = Math.max(1, Math.round(baseSize))
        
        // 设置颜色
        ctx.fillStyle = props.tileColor
        
        // 绘制tile - 对齐到像素边界
        const centerX = Math.round(x + adjustedGridSize / 2)
        const centerY = Math.round(y + adjustedGridSize / 2)
        
        if (props.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(centerX, centerY, tileSize / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // 方形 - 确保尺寸为整数
          const halfSize = Math.round(tileSize / 2)
          const size = halfSize * 2
          ctx.fillRect(
            centerX - halfSize, 
            centerY - halfSize, 
            size, 
            size
          )
        }
      }
    }
  }
  
  // 分批处理以提高性能
  const batchSize = Math.max(1, Math.floor(renderHeight / adjustedGridSize / 4))
  let currentY = 0
  
  const processNextBatch = () => {
    const endY = Math.min(currentY + batchSize * adjustedGridSize, renderHeight)
    processBatch(currentY, endY)
    currentY = endY
    
    if (currentY < renderHeight) {
      requestAnimationFrame(processNextBatch)
    }
  }
  
  processNextBatch()
}

/**
 * 初始化粒子系统
 */
const initializeParticles = (renderWidth, renderHeight, gridSize) => {
  particles.value = []
  
  // 增加粒子间距，让粒子更分散
  const spacingMultiplier = 1.2 // 增加20%的间距
  const adjustedGridSize = gridSize * spacingMultiplier
  
  // 根据调整后的网格大小创建粒子
  for (let y = 0; y < renderHeight; y += adjustedGridSize) {
    for (let x = 0; x < renderWidth; x += adjustedGridSize) {
      particles.value.push({
        x: x + adjustedGridSize / 2,
        y: y + adjustedGridSize / 2,
        originalX: x + adjustedGridSize / 2,
        originalY: y + adjustedGridSize / 2,
        originalSize: gridSize * props.tileScale,
        vx: 0,
        vy: 0
      })
    }
  }
}

/**
 * 处理图片
 */
const processImage = async () => {
  if (!originalImage.value) return
  
  try {
    loadingProgress.value = 60
    
    // 创建临时canvas来处理图片
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    tempCanvas.width = originalImage.value.width
    tempCanvas.height = originalImage.value.height
    
    // 绘制原图
    tempCtx.drawImage(originalImage.value, 0, 0)
    loadingProgress.value = 70
    
    // 获取图片数据
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
    loadingProgress.value = 80
    
    // 应用滤镜
    const filteredData = applyFilters(imageData)
    loadingProgress.value = 90
    
    // 创建处理后的图片
    const processedCanvas = document.createElement('canvas')
    const processedCtx = processedCanvas.getContext('2d')
    processedCanvas.width = tempCanvas.width
    processedCanvas.height = tempCanvas.height
    processedCtx.putImageData(filteredData, 0, 0)
    
    // 转换为图片对象
    processedImage.value = new Image()
    processedImage.value.onload = () => {
      loadingProgress.value = 100
      nextTick(() => {
        // 初始化粒子系统
        const maxSize = 1200
        const scale = Math.min(1, maxSize / Math.max(originalImage.value.width, originalImage.value.height))
        const renderWidth = Math.floor(originalImage.value.width * scale)
        const renderHeight = Math.floor(originalImage.value.height * scale)
        const gridSize = Math.max(2, Math.floor(props.gridSize * scale))
        
        // 只在粒子数量变化或首次加载时重新初始化
        if (particles.value.length === 0 || 
            particles.value.length !== Math.floor(renderWidth / gridSize) * Math.floor(renderHeight / gridSize)) {
          initializeParticles(renderWidth, renderHeight, gridSize)
        }
        
        renderPixelArt()
        isLoading.value = false
      })
    }
    processedImage.value.src = processedCanvas.toDataURL()
    
  } catch (error) {
    console.error('图片处理失败:', error)
    isLoading.value = false
  }
}

// 处理窗口大小变化
const handleResize = () => {
  // 计算合适的canvas尺寸，保持比例
  const maxWidth = Math.min(1200, window.innerWidth - 40)
  const maxHeight = Math.min(800, window.innerHeight - 200)
  
  if (originalImage.value) {
    const aspectRatio = originalImage.value.width / originalImage.value.height
    if (maxWidth / maxHeight > aspectRatio) {
      canvasHeight.value = maxHeight
      canvasWidth.value = maxHeight * aspectRatio
    } else {
      canvasWidth.value = maxWidth
      canvasHeight.value = maxWidth / aspectRatio
    }
    processImage()
  } else {
    canvasWidth.value = maxWidth
    canvasHeight.value = maxHeight
  }
}

onMounted(() => {
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
  
  // 如果有默认图片，延迟加载以提高初始页面速度
  if (props.imageSrc) {
    // 使用setTimeout延迟加载，让页面先渲染
    setTimeout(() => {
      loadImage(props.imageSrc)
    }, 100)
  }
})

// 组件卸载时清理动画
onUnmounted(() => {
  stopAnimation()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.pixel-art-container {
  width: 100%;
  min-height: 100vh;
  background: #000000;
  display: flex;
  flex-direction: column;
}

.controls-panel {
  background: #1a1a1a;
  padding: 20px;
  display: flex;
  gap: 40px;
  overflow-x: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
}

.control-group {
  flex: 0 0 auto;
  min-width: 200px;
  background: rgba(42, 42, 42, 0.8);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.control-group h3 {
  color: #0FF7AE;
  font-size: 16px;
  margin: 0 0 16px 0;
  font-family: 'PingFang SC', '苹方简', sans-serif;
}

.control-item {
  margin-bottom: 16px;
}

.control-item label {
  display: block;
  color: #ffffff;
  font-size: 14px;
  margin-bottom: 8px;
  font-family: 'PingFang SC', '苹方简', sans-serif;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #333;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0FF7AE;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  background: #0DE6A0;
  transform: scale(1.1);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0FF7AE;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #555;
  border-radius: 6px;
  background: #333;
  color: #ffffff;
  font-size: 14px;
  font-family: 'PingFang SC', '苹方简', sans-serif;
}

.color-picker {
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
}

.checkbox {
  margin-right: 8px;
  transform: scale(1.2);
}

.file-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #555;
  border-radius: 6px;
  background: #333;
  color: #ffffff;
  font-size: 14px;
  font-family: 'PingFang SC', '苹方简', sans-serif;
}

.canvas-container {
  flex: 1;
  display: block;
  background: #000000;
  width: 100%;
  height: 100%;
  position: relative;
}

.pixel-canvas {
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  image-rendering: auto;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  image-rendering: pixelated;
  -ms-interpolation-mode: nearest-neighbor;
}

/* 加载状态样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #333;
  border-top: 4px solid #0FF7AE;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  font-family: 'PingFang SC', '苹方简', sans-serif;
}

.loading-bar {
  width: 200px;
  height: 4px;
  background: #333;
  border-radius: 2px;
  overflow: hidden;
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, #0FF7AE, #0DE6A0);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .controls-panel {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
  
  .control-group {
    min-width: auto;
    width: 100%;
  }
  
  .canvas-container {
    min-height: 50vh;
  }
}
</style>
