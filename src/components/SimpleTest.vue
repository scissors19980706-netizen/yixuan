<template>
  <div class="simple-test">
    <h2>简单测试组件</h2>
    <p>如果你能看到这个文字，说明Vue组件系统正常工作</p>
    <div class="test-image">
      <img 
        :src="testImageUrl" 
        alt="测试图片"
        @load="onImageLoad"
        @error="onImageError"
        style="max-width: 200px; height: auto;"
      />
    </div>
    <p>图片加载状态: {{ imageLoadStatus }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const testImageUrl = 'https://s3plus.sankuai.com/catpaw-external-resources/home/hero-background/layer1.png'
const imageLoadStatus = ref('加载中...')

const onImageLoad = () => {
  imageLoadStatus.value = '加载成功'
  console.log('测试图片加载成功')
}

const onImageError = (event) => {
  imageLoadStatus.value = '加载失败'
  console.error('测试图片加载失败:', event.target.src)
}
</script>

<style scoped>
.simple-test {
  padding: 20px;
  border: 2px solid #ccc;
  margin: 20px;
  background: #f9f9f9;
}

.test-image {
  margin: 10px 0;
}
</style>
