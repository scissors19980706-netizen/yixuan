<script setup>
</script>

<template>
  <div class="layout">
    <!-- <SiteHeader /> -->
    <router-view />
  </div>
  
</template>

<style scoped>
.layout { 
  min-height: 100vh; /* 使用最小高度而不是固定高度 */
  display: flex; 
  flex-direction: column; 
}
.layout :deep(main) { 
  flex: 1; 
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}
</style>

