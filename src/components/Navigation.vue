<script setup>
/**
 * Navigation 导航栏组件
 * 提供统一的页面头部导航功能
 */
import { defineProps, ref } from 'vue'
import ContactPopup from './ContactPopup.vue'

/**
 * 组件属性定义
 */
const props = defineProps({
  /**
   * 是否为透明背景模式
   */
  transparent: {
    type: Boolean,
    default: false
  }
})

/**
 * 联系我们弹窗状态管理
 */
const isContactPopupVisible = ref(false)

/**
 * 移动端汉堡菜单状态管理
 */
const isMobileMenuOpen = ref(false)

/**
 * 显示联系我们弹窗
 */
const showContactPopup = () => {
  isContactPopupVisible.value = true
}

/**
 * 隐藏联系我们弹窗
 */
const hideContactPopup = () => {
  isContactPopupVisible.value = false
}

/**
 * 导航菜单配置
 */
const navigationItems = [
  {
    name: '用户手册',
    path: '/guides'
  },
  {
    name: '更新日志',
    path: '/changelog'
  },
  {
    name: '联系我们',
    href: '#',
    external: true
  }

]

/**
 * 处理外部链接点击
 * @param {string} href - 链接地址
 */
const handleExternalLink = (href) => {
  if (href !== '#') {
    window.open(href, '_blank')
  }
}

/**
 * 切换移动端菜单显示状态
 */
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

/**
 * 处理移动端导航项点击
 * @param {string} type - 导航项类型
 */
const handleMobileNavClick = (type) => {
  if (type === 'guides') {
    // 跳转到用户手册页面
    window.location.href = '/guides'
  } else if (type === 'changelog') {
    // 跳转到更新日志页面
    window.location.href = '/changelog'
  } else if (type === 'download') {
    // 跳转到下载页面
    window.location.href = '/download'
  } else if (type === 'contact') {
    // 显示联系我们弹窗
    showContactPopup()
  }
  // 点击导航项后关闭移动端菜单
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header class="navigation" :class="{ 'transparent': transparent }">
    <div class="nav-content">
      <!-- Logo -->
      <div class="nav-icon">
        <router-link to="/" class="logo">
          <img src="@/assets/logo_black.svg" alt="CatPaw" />
        </router-link>
      </div>
      
      <!-- 导航菜单（居中显示） -->
      <nav class="nav-menu">
        <template v-for="item in navigationItems" :key="item.name">
          <!-- 内部路由链接 -->
          <router-link 
            v-if="!item.external" 
            :to="item.path" 
            class="nav-link"
          >
            {{ item.name }}
          </router-link>
          
          <!-- 联系我们特殊处理 -->
          <div 
            v-else-if="item.name === '联系我们'"
            class="contact-link-wrapper"
            @mouseenter="showContactPopup"
            @mouseleave="hideContactPopup"
          >
            <a 
              :href="item.href"
              class="nav-link contact-link"
              @click.prevent="handleExternalLink(item.href)"
            >
              {{ item.name }}
            </a>
            
            <!-- 联系我们弹窗 -->
            <ContactPopup 
              v-model:visible="isContactPopupVisible"
              type="desktop"
              @mouseenter="showContactPopup"
              @mouseleave="hideContactPopup"
            />
          </div>
          
          <!-- 其他外部链接 -->
          <a 
            v-else
            :href="item.href"
            class="nav-link"
            @click.prevent="handleExternalLink(item.href)"
          >
            {{ item.name }}
          </a>
        </template>
      </nav>
      
      <!-- 下载按钮（桌面端） -->
      <div class="nav-download desktop-download">
        <router-link to="/download" class="download-btn">
          下载
        </router-link>
      </div>
      
      <!-- 移动端汉堡菜单按钮 -->
      <div class="hamburger-container">
        <button 
          class="hamburger-btn" 
          @click="toggleMobileMenu"
          :class="{ 'active': isMobileMenuOpen }"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>
    
    <!-- 移动端下拉菜单 -->
    <div 
      class="mobile-menu" 
      :class="{ 'mobile-menu-open': isMobileMenuOpen }"
    >
      <div class="mobile-menu-content">
        <button class="mobile-nav-btn" @click="handleMobileNavClick('guides')">
          用户手册
        </button>
        <button class="mobile-nav-btn" @click="handleMobileNavClick('changelog')">
          更新日志
        </button>
        <button class="mobile-nav-btn" @click="handleMobileNavClick('contact')">
          联系我们
        </button>
        
        <!-- 移动端联系我们弹窗 -->
        <ContactPopup 
          v-model:visible="isContactPopupVisible"
          type="mobile"
          :show-close-button="true"
        />
        <button class="mobile-nav-btn mobile-download-btn" @click="handleMobileNavClick('download')">
          下载
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* 导航栏样式 - 固定在顶部 */
.navigation {
  background-color: #ffffff;
  border-bottom: 1px solid #e9ecef;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 100;
  transition: all 0.3s ease;
}

.navigation.transparent {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom-color: rgba(233, 236, 239, 0.5);
}

.nav-content {
  width: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  height: 64px;
  position: relative;
}

/* Logo 样式 */
.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #2c3e50;
  font-weight: 600;
  font-size: 20px;
  transition: color 0.2s ease;
  margin-left: 92px;
  z-index: 1;
}



.logo img {
  height: 32px;
  margin-right: 8px;
}

.logo-text {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 导航菜单样式 */
.nav-menu {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 66px;
}

.nav-link {
  text-decoration: none;
  color: #6c757d;
  font-weight: 500;
  font-size: 14px;
  transition: color 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: #2c3e50;
}

.nav-link.router-link-active {
  color: #000000;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;

}

/* 联系我们链接包装器 */
.contact-link-wrapper {
  position: relative;
}


/* 下载按钮样式 */
.nav-download {
  position: absolute;
  right: 0px;
  display: flex;
  align-items: center;
}

.download-btn {
  background-color: #111925;
  color: white;
  padding: 0 70px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 14px;
  transition: all 0.2s ease;
  text-decoration: none;
}

.download-btn:hover {
  background-color: #111925;
  color: #ffffff;
}

/* 汉堡菜单按钮样式 */
.hamburger-btn {
  display: none; /* 默认隐藏，在移动端显示 */
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
  pointer-events: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .logo {
    margin-left: 16px;
  }
  
  /* 隐藏桌面端下载按钮 */
  .desktop-download {
    display: none;
  }
  
  /* 显示汉堡菜单按钮 */
  .hamburger-btn {
    display: flex;
  }
  
  .nav-menu {
    display: none;
  }
  
  .logo-text {
    display: none;
  }
  
  /* 确保logo和hamburger按钮在移动端垂直居中 */
  .nav-icon {
    display: flex;
    align-items: center;
    height: 100%;
  }
  
  .hamburger-container {
    display: flex;
    align-items: center;
    height: 100%;
  }
}

@media (max-width: 480px) {
  .navigation {
    height: 56px; /* 移动端导航栏高度 */
  }

  .nav-content {
    height: 56px;
  }
  
  .logo img {
    height: 28px;
  }
  
  /* 确保logo和hamburger按钮在小屏幕也垂直居中 */
  .nav-icon {
    display: flex;
    align-items: center;
    height: 100%;
  }
  
  .hamburger-container {
    display: flex;
    align-items: center;
    height: 100%;
  }
  
  /* 确保汉堡菜单在小屏幕也显示 */
  .hamburger-btn {
    display: flex;
    margin-right: 16px;
  }
  
  /* 小屏幕移动端菜单位置调整 */
  .mobile-menu {
    top: 56px; /* 小屏幕导航栏高度 */
  }
}

.hamburger-line {
  width: 100%;
  height: 2px;
  background-color: #000000;
  border-radius: 0px;
  transition: all 0.3s ease;
  transform-origin: center;
}

/* 汉堡菜单激活状态 */
.hamburger-btn.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.hamburger-btn.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger-btn.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* 汉堡按钮容器 */
.hamburger-container {
  position: absolute;
  right: 0px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  pointer-events: auto;
}

/* 移动端下拉菜单样式 */
.mobile-menu {
  position: fixed;
  top: 64px; /* 导航栏高度 */
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: none;
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
  pointer-events: none;
}

.mobile-menu.mobile-menu-open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.mobile-menu-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-nav-btn {
  background: transparent;
  color: #000000;
  border: none;
  border-radius: 0;
  padding: 12px 16px;
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  pointer-events: auto;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  outline: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.mobile-nav-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #000000;
}

.mobile-nav-btn:focus {
  outline: none;
}

.mobile-download-btn {
  background: #111925;
  color: white;
  border-radius: 4px;
  text-align: center;
  font-weight: 500;
}

.mobile-download-btn:hover {
  background: #111925;
  color: white;
}


/* 移动端导航菜单（可选择性添加汉堡菜单） */
@media (max-width: 768px) {
  .nav-menu-mobile {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    background-color: white;
    border-bottom: 1px solid #e9ecef;
    padding: 16px 24px;
    display: none;
  }
  
  .nav-menu-mobile.active {
    display: block;
  }
  
  .nav-menu-mobile .nav-link {
    display: block;
    padding: 12px 0;
    border-bottom: 1px solid #f8f9fa;
  }
}
</style>
