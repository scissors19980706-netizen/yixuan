<template>
  <span 
    ref="containerRef" 
    :class="parentClassName"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    style="display: inline-block; white-space: pre-wrap;"
  >
    <!-- 屏幕阅读器的真实文本 -->
    <span style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0;">
      {{ text }}
    </span>

    <!-- 显示的加密文本 -->
    <span aria-hidden="true">
      <span
        v-for="(char, index) in displayText.split('')"
        :key="index"
        :class="getCharClass(index)"
      >
        {{ char }}
      </span>
    </span>
  </span>
</template>

<script setup>
/**
 * DecryptedText - Vue版本的乱码解密文本特效组件
 * 支持鼠标悬停时的乱码解密动画效果
 */
import { ref, onMounted, onUnmounted, watch } from 'vue'

// Props定义
const props = defineProps({
  /** 要显示的文本 */
  text: {
    type: String,
    required: true
  },
  /** 动画速度（毫秒） */
  speed: {
    type: Number,
    default: 50
  },
  /** 最大迭代次数 */
  maxIterations: {
    type: Number,
    default: 10
  },
  /** 是否按顺序揭示字符 */
  sequential: {
    type: Boolean,
    default: false
  },
  /** 揭示方向：'start' | 'end' | 'center' */
  revealDirection: {
    type: String,
    default: 'start',
    validator: (value) => ['start', 'end', 'center'].includes(value)
  },
  /** 是否只使用原文本中的字符 */
  useOriginalCharsOnly: {
    type: Boolean,
    default: false
  },
  /** 用于随机生成的字符集 */
  characters: {
    type: String,
    default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+'
  },
  /** 已揭示字符的CSS类名 */
  className: {
    type: String,
    default: ''
  },
  /** 父容器的CSS类名 */
  parentClassName: {
    type: String,
    default: ''
  },
  /** 加密字符的CSS类名 */
  encryptedClassName: {
    type: String,
    default: ''
  },
  /** 触发动画的方式：'hover' | 'view' | 'both' */
  animateOn: {
    type: String,
    default: 'hover',
    validator: (value) => ['hover', 'view', 'both'].includes(value)
  }
})

// 响应式状态
const displayText = ref(props.text)
const isHovering = ref(false)
const isScrambling = ref(false)
const revealedIndices = ref(new Set())
const hasAnimated = ref(false)
const containerRef = ref(null)

// 内部状态
let interval = null
let currentIteration = 0

/**
 * 获取下一个要揭示的字符索引
 */
const getNextIndex = (revealedSet) => {
  const textLength = props.text.length
  
  switch (props.revealDirection) {
    case 'start':
      return revealedSet.size
    case 'end':
      return textLength - 1 - revealedSet.size
    case 'center': {
      const middle = Math.floor(textLength / 2)
      const offset = Math.floor(revealedSet.size / 2)
      const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1

      if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
        return nextIndex
      }

      // 如果计算的索引无效，找到第一个未揭示的字符
      for (let i = 0; i < textLength; i++) {
        if (!revealedSet.has(i)) return i
      }
      return 0
    }
    default:
      return revealedSet.size
  }
}

/**
 * 生成可用字符集
 */
const getAvailableChars = () => {
  if (props.useOriginalCharsOnly) {
    return Array.from(new Set(props.text.split(''))).filter(char => char !== ' ')
  }
  return props.characters.split('')
}

/**
 * 打乱文本，保持已揭示的字符不变
 */
const shuffleText = (originalText, currentRevealed) => {
  const availableChars = getAvailableChars()
  
  if (props.useOriginalCharsOnly) {
    const positions = originalText.split('').map((char, i) => ({
      char,
      isSpace: char === ' ',
      index: i,
      isRevealed: currentRevealed.has(i)
    }))

    const nonSpaceChars = positions.filter(p => !p.isSpace && !p.isRevealed).map(p => p.char)

    // Fisher-Yates shuffle
    for (let i = nonSpaceChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]]
    }

    let charIndex = 0
    return positions
      .map(p => {
        if (p.isSpace) return ' '
        if (p.isRevealed) return originalText[p.index]
        return nonSpaceChars[charIndex++]
      })
      .join('')
  } else {
    return originalText
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' '
        if (currentRevealed.has(i)) return originalText[i]
        return availableChars[Math.floor(Math.random() * availableChars.length)]
      })
      .join('')
  }
}

/**
 * 启动解密动画
 */
const startAnimation = () => {
  isScrambling.value = true
  currentIteration = 0
  
  interval = setInterval(() => {
    if (props.sequential) {
      // 顺序揭示模式
      if (revealedIndices.value.size < props.text.length) {
        const nextIndex = getNextIndex(revealedIndices.value)
        const newRevealed = new Set(revealedIndices.value)
        newRevealed.add(nextIndex)
        revealedIndices.value = newRevealed
        displayText.value = shuffleText(props.text, newRevealed)
      } else {
        stopAnimation()
      }
    } else {
      // 随机乱码模式
      displayText.value = shuffleText(props.text, revealedIndices.value)
      currentIteration++
      if (currentIteration >= props.maxIterations) {
        stopAnimation()
        displayText.value = props.text
      }
    }
  }, props.speed)
}

/**
 * 停止解密动画
 */
const stopAnimation = () => {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
  isScrambling.value = false
}

/**
 * 重置动画状态
 */
const resetAnimation = () => {
  stopAnimation()
  displayText.value = props.text
  revealedIndices.value = new Set()
  isScrambling.value = false
}

/**
 * 处理鼠标进入事件
 */
const handleMouseEnter = () => {
  if (props.animateOn === 'hover' || props.animateOn === 'both') {
    isHovering.value = true
  }
}

/**
 * 处理鼠标离开事件
 */
const handleMouseLeave = () => {
  if (props.animateOn === 'hover' || props.animateOn === 'both') {
    isHovering.value = false
  }
}

/**
 * 获取字符的CSS类名
 */
const getCharClass = (index) => {
  const isRevealedOrDone = revealedIndices.value.has(index) || !isScrambling.value || !isHovering.value
  return isRevealedOrDone ? props.className : props.encryptedClassName
}

/**
 * 监听悬停状态变化
 */
watch(isHovering, (newValue) => {
  if (newValue) {
    startAnimation()
  } else {
    resetAnimation()
  }
})

/**
 * 监听文本内容变化
 */
watch(() => props.text, (newText) => {
  resetAnimation()
  displayText.value = newText
})

/**
 * 设置视图交叉观察器（用于滚动触发动画）
 */
onMounted(() => {
  if (props.animateOn === 'view' || props.animateOn === 'both') {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated.value) {
          isHovering.value = true
          hasAnimated.value = true
        }
      })
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    if (containerRef.value) {
      observer.observe(containerRef.value)
    }

    // 在组件卸载时清理观察器
    onUnmounted(() => {
      if (containerRef.value) {
        observer.unobserve(containerRef.value)
      }
    })
  }
})

/**
 * 清理定时器
 */
onUnmounted(() => {
  stopAnimation()
})
</script>

<style scoped>
/* 基础样式已在template的style属性中定义 */
</style>
