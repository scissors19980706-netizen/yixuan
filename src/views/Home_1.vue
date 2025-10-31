<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import MaskImage from '../components/MaskImage.vue'
import DecryptedText from '../components/DecryptedText.vue'
import ContactPopup from '../components/ContactPopup.vue'
import SimpleTest from '../components/SimpleTest.vue'

/**
 * 首页 - 带MaskImage背景的版本
 * 包含导航栏和交互式背景
 */

// 路由控制
const router = useRouter()

// MaskImage组件引用
const maskImageRef = ref(null)

// 滚动状态管理
const isSecondSection = ref(false)

// 汉堡菜单状态管理
const isMobileMenuOpen = ref(false)

// 联系我们弹窗状态管理
const isContactPopupVisible = ref(false)

/**
 * 处理logo点击 - 返回主页
 */
const handleLogoClick = () => {
  router.push('/')
  // 点击logo后关闭移动端菜单
  isMobileMenuOpen.value = false
}

/**
 * 处理导航按钮点击
 */
const handleNavClick = (type) => {
  if (type === 'guides') {
    router.push('/guides')
  } else if (type === 'changelog') {
    router.push('/changelog')
  } else if (type === 'contact') {
    router.push('/contact')
  } else if (type === 'download') {
    router.push('/download')
  }
  // 点击导航项后关闭移动端菜单
  isMobileMenuOpen.value = false
}

/**
 * 切换移动端菜单显示状态
 */
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

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
 * 切换联系我们弹窗显示状态（用于移动端点击）
 */
const toggleContactPopup = () => {
  isContactPopupVisible.value = !isContactPopupVisible.value
}

/**
 * 处理滚动事件
 */
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  
  // 当滚动超过50vh时切换到第二个section的样式
  isSecondSection.value = scrollTop > windowHeight * 0.5
  
  // section2使用CSS sticky自动吸顶，无需JavaScript处理
}

// 背景图片配置
const backgroundImage = 'https://s3plus.sankuai.com/catpaw-external-resources/home/hero-background/layer1.png'
const foregroundImage = 'https://s3plus.sankuai.com/catpaw-external-resources/home/hero-background/layer2.png'

/**
 * 处理文字区域和按钮上的鼠标移动事件
 * 将鼠标事件转发给MaskImage组件
 */
const handleTextAreaMouseMove = (event) => {
  if (maskImageRef.value && maskImageRef.value.handleMouseMove) {
    // 将鼠标事件转发给MaskImage组件
    maskImageRef.value.handleMouseMove(event)
  }
}

/**
 * 处理视频播放点击
 * 目前为占位符，可以在这里添加实际的视频播放逻辑
 */
const handleVideoPlay = () => {
  // 这里可以添加实际的视频播放逻辑
  // 例如：打开模态框、跳转到视频页面、或者动态加载视频
  console.log('视频播放被点击')
  
  // 示例：可以显示一个提示
  alert('视频功能即将推出！')
}

/**
 * 组件挂载时添加滚动监听
 */
onMounted(() => {
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('scroll', handleScroll, { passive: true })
  
  // 初始检查滚动位置
  handleScroll()
  
  // 调试：检查MaskImage组件是否正确挂载
  console.log('Home组件已挂载')
  console.log('MaskImage组件引用:', maskImageRef.value)
  console.log('背景图片URL:', backgroundImage)
  console.log('前景图片URL:', foregroundImage)
})

/**
 * 组件卸载时移除滚动监听
 */
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('scroll', handleScroll)
})


</script>

<template>
  <div class="page-container">
    <!-- 上半部分：背景区域 -->
    
    <div class="hero-section">
      <!-- MaskImage 背景组件 -->
      <MaskImage 
        ref="maskImageRef"
        :background-image="backgroundImage"
        :foreground-image="foregroundImage"
        :background-alt="'CatPaw 背景'"
        :foreground-alt="'CatPaw 前景'"
        :mask-radius="140"
        class="background-mask"
      />
      
      <!-- 固定导航栏 -->
      <div class="navigation-container" :class="{ 'menu-open': isMobileMenuOpen }">
        <!-- 第一个1fr空白区域 -->
        <div class="nav-spacer"></div>

        <!-- 第一个5fr区域 - logo居左 -->
        <div class="nav-logo-section">
          <div class="nav-icon" @click="handleLogoClick">
            <img src="https://s3plus.meituan.net/catpaw-external-resources/home/logo_black_long.svg" alt="CatPaw Logo" />
          </div>
        </div>

        <!-- 12fr区域 - 导航按钮居中 -->
        <div class="nav-center-buttons desktop-nav">
          <button class="nav-btn" @click="handleNavClick('guides')">用户手册</button>
          <button class="nav-btn" @click="handleNavClick('changelog')">更新日志</button>
          <button 
            class="nav-btn contact-btn" 
            @click="handleNavClick('contact')"
            @mouseenter="showContactPopup"
            @mouseleave="hideContactPopup"
          >
            联系我们
            <!-- 桌面端联系我们弹窗 -->
            <ContactPopup 
              v-model:visible="isContactPopupVisible"
              type="desktop"
              @mouseenter="showContactPopup"
              @mouseleave="hideContactPopup"
            />
          </button>
        </div>

        <!-- 第二个5fr区域 - 下载按钮居右 -->
        <div class="nav-right-buttons">
          <!-- 桌面端下载按钮 -->
          <button 
            class="nav-btn download-btn desktop-download" 
            :class="{ 'download-btn-dark': isSecondSection }"
            @click="handleNavClick('download')"
          >
            下载
          </button>
        
          <!-- 移动端汉堡菜单按钮 -->
          <div class="hamburger-container">
            <button
              class="hamburger-btn mobile-only"
              @click="toggleMobileMenu"
              :class="{ 'active': isMobileMenuOpen }"
            >
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
            </button>
          </div>
        </div>
        
        <!-- 最后一个1fr空白区域 -->
        <div class="nav-spacer"></div>

        <!-- 移动端下拉菜单 -->
        <div 
          class="mobile-menu" 
          :class="{ 'mobile-menu-open': isMobileMenuOpen }"
        >
          <div class="mobile-menu-content">
            <button class="mobile-nav-btn" @click="handleNavClick('guides')">
              <DecryptedText 
                text="用户手册" 
                :speed="60" 
                :max-iterations="15" 
                characters="用户手册ABCD1234!?#@$%^&*()_+=" 
                className="revealed"
                encryptedClassName="encrypted"
              />
            </button>
            <button class="mobile-nav-btn" @click="handleNavClick('changelog')">
              <DecryptedText 
                text="更新日志" 
                :speed="60" 
                :max-iterations="15" 
                characters="更新日志ABCD1234!?#@$%^&*()_+=" 
                className="revealed"
                encryptedClassName="encrypted"
              />
            </button>
            <button 
              class="mobile-nav-btn contact-btn" 
              @click="toggleContactPopup"
              @mouseenter="showContactPopup"
              @mouseleave="hideContactPopup"
            >
              <DecryptedText 
                text="联系我们" 
                :speed="60" 
                :max-iterations="15" 
                characters="联系我们ABCD1234!?#@$%^&*()_+=" 
                className="revealed"
                encryptedClassName="encrypted"
              />
              <!-- 移动端联系我们弹窗 -->
              <ContactPopup 
                v-model:visible="isContactPopupVisible"
                type="mobile"
                :show-close-button="true"
              />
            </button>
            <button 
              class="mobile-nav-btn mobile-download-btn" 
              @click="handleNavClick('download')"
            >
              下载
            </button>
          </div>
        </div>
      </div>
      
      
      <!-- 英雄区域主要内容容器 - 新的grid布局 -->
      <div class="hero-main-container" @mousemove="handleTextAreaMouseMove">
        <!-- 第一个1fr空白区域 -->
        <div class="hero-spacer"></div>

        <!-- 10fr区域 - 标题图片 -->
        <div class="hero-title-section">
          <div class="hero-left-title">
            <img
              src="https://s3plus.sankuai.com/catpaw-external-resources/home/hero_title.png"
              alt="CatPaw 标题"
              class="title-placeholder"
            />
          </div>
        </div>
        
        <!-- 第一个6fr区域 - 空白 -->
        <div class="hero-spacer"></div>

        <!-- 第二个6fr区域 - 文字内容容器 -->
        <div class="hero-text-container">
          <div class="brand-line">
            <span class="brand-name">CatPaw</span>
            <span class="brand-subtitle">AI编程伙伴Agent</span>
          </div>
          <div class="brand-description">智能驱动编码，高效加速交付</div>
          <div class="button-group">
            <button class="btn-primary">
              <DecryptedText 
                text="下载 CatPaw" 
                :speed="80" 
                :max-iterations="10" 
                :sequential="false"
                className="revealed"
                encryptedClassName="encrypted"
              />
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="22" height="22" viewBox="0 0 22 22"><g><g transform="matrix(1,0,0,-1,0,39.875)"><path d="M17.875,19.9375L4.125,19.9375C3.745304,19.9375,3.4375,20.245304,3.4375,20.625C3.4375,21.0047,3.745304,21.3125,4.125,21.3125L17.875,21.3125C18.2547,21.3125,18.5625,21.0047,18.5625,20.625C18.5625,20.245304,18.2547,19.9375,17.875,19.9375ZM11.83214,23.07251L18.3751,30.0074C18.4954,30.134999999999998,18.5625,30.3037,18.5625,30.4792C18.5625,30.8589,18.2547,31.1667,17.875,31.1667C17.6857,31.1667,17.5048,31.0886,17.3749,30.951L11.6875,24.92283L11.6875,37.5833C11.6875,37.963,11.3797,38.2708,11,38.2708C10.6203,38.2708,10.3125,37.963,10.3125,37.5833L10.3125,24.9165L4.62444,30.921300000000002L4.62444,30.921300000000002C4.4942899999999995,31.0587,4.313797,31.136400000000002,4.125,31.136400000000002C3.745304,31.136400000000002,3.4375,30.8286,3.4375,30.448900000000002C3.4375,30.273,3.5049167,30.1038,3.625878,29.976100000000002L3.625878,29.976100000000002L10.16684,23.07085Q10.50627,22.71252,10.99985,22.71301Q11.49342,22.7135,11.83214,23.07251Z" fill-rule="evenodd" fill="#FFFFFF" fill-opacity="1.5"/></g></g></svg>
            </button>
            <button class="btn-secondary" @click="handleNavClick('download')">
              <DecryptedText 
                text="所有下载" 
                :speed="80" 
                :max-iterations="10" 
                :sequential="false"
                className="revealed"
                encryptedClassName="encrypted"
              />
            </button>
          </div>
        </div>
      
                <!-- 最后一个1fr空白区域 -->
        <div class="hero-spacer"></div>
      </div>

      <!-- 版权信息 - 固定在屏幕左下角 -->
      <div class="copyright-text">
        ©️2025 CatPaw. All rights reserved
      </div>

    </div>
    
    <!-- 测试组件区域 -->
    <section class="test-section">
      <SimpleTest />
    </section>

    <!-- 下半部分：内容区域 -->
    <section class="content-section" style="display: none;">
      <!-- 文字内容区域 - 不与背景重叠 -->
      <div class="text-content-area">
        <p class="section-description" style="display: none;">
          代码问答
          <span class="icon-box">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L12.09 8.26L18 10L12.09 11.74L10 18L7.91 11.74L2 10L7.91 8.26L10 2Z" fill="currentColor"/>
            </svg>
          </span>
          执行完整开发任务
        </p>
        <p class="section-subtitle" style="display: none;">
          Agent 让 idea 更快实现
        </p>
      </div>
      
      <!-- 视频容器 - 可以缩放动画 -->
      <div class="video-background-main-container">
        <!-- 背景装饰元素 -->
        <div class="section2-background">
          <div class="horizontal-line top-line"></div>
          <div class="horizontal-line bottom-line"></div>
        </div>
        
        <!-- 视频容器 -->
        <div class="video-container">
          <div class="video-wrapper">
            <!-- 视频占位符 -->
            <div class="video-placeholder">
              <img 
                src="https://s3plus.sankuai.com/catpaw-external-resources/home/video-placeholder/demo-preview.png"
                alt="CatPaw 演示视频"
                class="placeholder-image"
              />
              <div class="video-overlay" @click="handleVideoPlay">
                <div class="play-button">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <circle cx="30" cy="30" r="30" fill="rgba(255, 255, 255, 0.9)"/>
                    <path d="M23 20L40 30L23 40V20Z" fill="#333"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Section3 区域 -->
    <section class="section3">
      <div class="section3-grid">
        <!-- 生成 5x4 = 20 个网格单元 -->
        <div v-for="i in 20" :key="i" class="grid-item">
          <div v-if="i === 8" class="video-section3">
            <video controls class="video">
             <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              你的浏览器不支持 video 标签。
            </video>
          </div> 
          <!-- 在第1行第4列（索引4）和第2行第2列（索引7）放置SVG -->
          <div v-if="i === 4 || i === 7" class="svg-container">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" viewBox="0 0 242 502" class="scalable-svg" preserveAspectRatio="none">
              <g>
                <path d="" fill="#FFFFFF" fill-opacity="1" style="mix-blend-mode:passthrough"/><path d="M192.751,-0.179922L192.026,1.69933L192.959,2.05918L193.684,0.179922L192.751,-0.179922ZM1.59847,0.1794L2.3187,2.05306L3.25212,1.69426L2.53189,-0.1794L1.59847,0.1794ZM239.46,-0.179389L238.74,1.6943L239.673,2.05308L240.394,0.179389L239.46,-0.179389ZM49.7701,1.70138L49.0485,-0.179122L48.1149,0.179122L48.8364,2.05962L49.7701,1.70138ZM3.75919,5.80045L5.1997,9.54789L6.13311,9.18908L4.69261,5.44165L3.75919,5.80045ZM237.3,5.44172L235.859,9.18914L236.793,9.54792L238.233,5.8005L237.3,5.44172ZM190.577,5.45785L189.127,9.21638L190.06,9.57622L191.51,5.81769L190.577,5.45785ZM52.6563,9.22337L51.2132,5.46238L50.2796,5.82062L51.7227,9.58162L52.6563,9.22337ZM6.64019,13.2953L8.08068,17.0427L9.01409,16.6839L7.5736,12.9365L6.64019,13.2953ZM234.419,12.9366L232.979,16.684L233.912,17.0428L235.352,13.2953L234.419,12.9366ZM187.678,12.9749L186.228,16.7334L187.161,17.0933L188.611,13.3347L187.678,12.9749ZM55.5426,16.7454L54.0995,12.9844L53.1658,13.3426L54.609,17.1036L55.5426,16.7454ZM9.52116,20.79L10.9617,24.5375L11.8951,24.1787L10.4546,20.4312L9.52116,20.79ZM231.538,20.4314L230.098,24.1788L231.031,24.5376L232.472,20.7902L231.538,20.4314ZM184.778,20.4919L183.329,24.2505L184.262,24.6103L185.711,20.8517L184.778,20.4919ZM58.4289,24.2674L56.9858,20.5064L56.0521,20.8646L57.4953,24.6256L58.4289,24.2674ZM12.4022,28.2849L13.8426,32.0322L14.7761,31.6734L13.3356,27.9261L12.4022,28.2849ZM228.657,27.9262L227.217,31.6736L228.15,32.0324L229.591,28.285L228.657,27.9262ZM181.879,28.009L180.43,31.7675L181.363,32.1273L182.812,28.3688L181.879,28.009ZM61.3152,31.7894L59.872,28.0284L58.9384,28.3866L60.3815,32.1476L61.3152,31.7894ZM15.2831,35.7797L16.7236,39.527L17.657,39.1682L16.2166,35.4209L15.2831,35.7797ZM225.777,35.421L224.336,39.1685L225.27,39.5273L226.71,35.7798L225.777,35.421ZM178.98,35.526L177.531,39.2845L178.464,39.6444L179.913,35.8859L178.98,35.526ZM64.2014,39.3114L62.7583,35.5504L61.8247,35.9086L63.2678,39.6696L64.2014,39.3114ZM18.1641,43.2744L19.6046,47.0218L20.538,46.663L19.0975,42.9156L18.1641,43.2744ZM222.896,42.9159L221.455,46.6633L222.389,47.0221L223.829,43.2747L222.896,42.9159ZM176.081,43.043L174.631,46.8015L175.564,47.1614L177.014,43.4029L176.081,43.043ZM67.0877,46.8334L65.6446,43.0724L64.7109,43.4306L66.1541,47.1916L67.0877,46.8334ZM21.0451,50.7692L22.4856,54.5167L23.419,54.1578L21.9785,50.4104L21.0451,50.7692ZM220.015,50.4107L218.575,54.1581L219.508,54.5169L220.948,50.7695L220.015,50.4107ZM173.182,50.5601L171.732,54.3186L172.665,54.6784L174.115,50.9199L173.182,50.5601ZM69.974,54.3553L68.5308,50.5943L67.5972,50.9526L69.0404,54.7136L69.974,54.3553ZM23.9261,58.264L25.3666,62.0114L26.3,61.6526L24.8595,57.9052L23.9261,58.264ZM217.134,57.9056L215.694,61.653L216.627,62.0118L218.068,58.2643L217.134,57.9056ZM170.283,58.0771L168.833,61.8356L169.766,62.1955L171.216,58.437L170.283,58.0771ZM72.8603,61.8773L71.4171,58.1163L70.4835,58.4746L71.9266,62.2356L72.8603,61.8773ZM26.8071,65.7588L28.2476,69.5062L29.181,69.1474L27.7405,65.4L26.8071,65.7588ZM214.254,65.4004L212.813,69.1478L213.747,69.5066L215.187,65.7591L214.254,65.4004ZM167.383,65.5941L165.934,69.3527L166.867,69.7125L168.317,65.954L167.383,65.5941ZM75.7465,69.3993L74.3034,65.6383L73.3698,65.9966L74.8129,69.7576L75.7465,69.3993ZM29.6881,73.2536L31.1286,77.001L32.062,76.6422L30.6215,72.8948L29.6881,73.2536ZM211.373,72.8952L209.932,76.6426L210.866,77.0014L212.306,73.254L211.373,72.8952ZM164.484,73.1112L163.035,76.8697L163.968,77.2296L165.417,73.471L164.484,73.1112ZM78.6328,76.9213L77.1897,73.1603L76.256,73.5186L77.6992,77.2796L78.6328,76.9213ZM32.569,80.7484L34.0095,84.4958L34.943,84.137L33.5025,80.3896L32.569,80.7484ZM208.492,80.3901L207.052,84.1375L207.985,84.4963L209.425,80.7488L208.492,80.3901ZM161.585,80.6282L160.136,84.3867L161.069,84.7466L162.518,80.9881L161.585,80.6282ZM81.5191,84.4433L80.0759,80.6823L79.1423,81.0406L80.5854,84.8016L81.5191,84.4433ZM35.45,88.2432L36.8905,91.9906L37.8239,91.6318L36.3834,87.8844L35.45,88.2432ZM205.611,87.8849L204.171,91.6323L205.104,91.9911L206.545,88.2437L205.611,87.8849ZM158.686,88.1452L157.236,91.9038L158.169,92.2636L159.619,88.5051L158.686,88.1452ZM84.4053,91.9653L82.9622,88.2043L82.0286,88.5626L83.4717,92.3236L84.4053,91.9653ZM38.331,95.738L39.7715,99.4854L40.7049,99.1266L39.2644,95.3792L38.331,95.738ZM202.731,95.3797L201.29,99.1271L202.224,99.4859L203.664,95.7385L202.731,95.3797ZM155.787,95.6623L154.337,99.4208L155.27,99.7807L156.72,96.0221L155.787,95.6623ZM87.2916,99.4873L85.8485,95.7263L84.9149,96.0846L86.358,99.8456L87.2916,99.4873ZM41.212,103.233L42.6525,106.98L43.5859,106.621L42.1454,102.874L41.212,103.233ZM199.85,102.875L198.409,106.622L199.343,106.981L200.783,103.233L199.85,102.875ZM152.888,103.179L151.438,106.938L152.371,107.298L153.821,103.539L152.888,103.179ZM90.1779,107.009L88.7348,103.248L87.8011,103.607L89.2443,107.368L90.1779,107.009ZM44.093,110.728L45.5335,114.475L46.4669,114.116L45.0264,110.369L44.093,110.728ZM196.969,110.369L195.529,114.117L196.462,114.476L197.902,110.728L196.969,110.369ZM149.989,110.696L148.539,114.455L149.472,114.815L150.922,111.056L149.989,110.696ZM93.0642,114.531L91.621,110.77L90.6874,111.129L92.1306,114.89L93.0642,114.531ZM46.974,118.222L48.4145,121.97L49.3479,121.611L47.9074,117.864L46.974,118.222ZM194.088,117.864L192.648,121.612L193.581,121.97L195.022,118.223L194.088,117.864ZM147.089,118.213L145.64,121.972L146.573,122.332L148.022,118.573L147.089,118.213ZM95.9505,122.053L94.5073,118.292L93.5737,118.651L95.0168,122.412L95.9505,122.053ZM49.855,125.717L51.2955,129.465L52.2289,129.106L50.7884,125.358L49.855,125.717ZM191.207,125.359L189.767,129.106L190.7,129.465L192.141,125.718L191.207,125.359ZM144.19,125.73L142.741,129.489L143.674,129.849L145.123,126.09L144.19,125.73ZM98.8367,129.575L97.3936,125.814L96.46,126.173L97.9031,129.934L98.8367,129.575ZM52.7359,133.212L54.1764,136.959L55.1098,136.601L53.6693,132.853L52.7359,133.212ZM188.327,132.854L186.886,136.601L187.82,136.96L189.26,133.213L188.327,132.854ZM141.291,133.247L139.841,137.006L140.774,137.366L142.224,133.607L141.291,133.247ZM101.723,137.097L100.28,133.336L99.3462,133.695L100.789,137.456L101.723,137.097ZM55.6169,140.707L57.0574,144.454L57.9908,144.095L56.5503,140.348L55.6169,140.707ZM185.446,140.349L184.006,144.096L184.939,144.455L186.379,140.707L185.446,140.349ZM138.392,140.765L136.942,144.523L137.875,144.883L139.325,141.124L138.392,140.765ZM104.609,144.619L103.166,140.858L102.233,141.217L103.676,144.978L104.609,144.619ZM58.4979,148.202L59.9384,151.949L60.8718,151.59L59.4313,147.843L58.4979,148.202ZM182.565,147.844L181.125,151.591L182.058,151.95L183.499,148.202L182.565,147.844ZM135.493,148.282L134.043,152.04L134.976,152.4L136.426,148.641L135.493,148.282ZM107.496,152.141L106.052,148.38L105.119,148.739L106.562,152.5L107.496,152.141ZM61.3789,155.696L62.8194,159.444L63.7528,159.085L62.3123,155.338L61.3789,155.696ZM179.684,155.338L178.244,159.086L179.177,159.445L180.618,155.697L179.684,155.338ZM132.594,155.799L131.144,159.557L132.077,159.917L133.527,156.158L132.594,155.799ZM110.382,159.663L108.939,155.902L108.005,156.261L109.448,160.022L110.382,159.663ZM64.2599,163.191L65.7004,166.939L66.6338,166.58L65.1933,162.832L64.2599,163.191ZM176.804,162.833L175.363,166.581L176.297,166.939L177.737,163.192L176.804,162.833ZM129.694,163.316L128.245,167.074L129.178,167.434L130.627,163.675L129.694,163.316ZM113.268,167.185L111.825,163.424L110.891,163.783L112.334,167.544L113.268,167.185ZM67.1409,170.686L68.5814,174.433L69.5148,174.075L68.0743,170.327L67.1409,170.686ZM173.923,170.328L172.482,174.075L173.416,174.434L174.856,170.687L173.923,170.328ZM126.795,170.833L125.346,174.591L126.279,174.951L127.728,171.193L126.795,170.833ZM116.154,174.707L114.711,170.946L113.778,171.305L115.221,175.066L116.154,174.707ZM70.0219,178.181L71.4623,181.928L72.3958,181.569L70.9553,177.822L70.0219,178.181ZM171.042,177.823L169.602,181.57L170.535,181.929L171.976,178.182L171.042,177.823ZM123.896,178.35L122.447,182.108L123.38,182.468L124.829,178.71L123.896,178.35ZM119.041,182.229L117.598,178.468L116.664,178.827L118.107,182.588L119.041,182.229ZM72.9028,185.676L74.3433,189.423L75.2767,189.064L73.8363,185.317L72.9028,185.676ZM168.161,185.318L166.721,189.065L167.654,189.424L169.095,185.676L168.161,185.318ZM120.716,186.595L120.484,185.99L119.55,186.349L120.714,189.38L121.93,186.227L120.997,185.867L120.716,186.595ZM75.7838,193.17L77.2243,196.918L78.1577,196.559L76.7172,192.812L75.7838,193.17ZM165.281,192.813L163.84,196.56L164.774,196.919L166.214,193.171L165.281,192.813ZM78.6648,200.665L80.1053,204.412L81.0387,204.054L79.5982,200.306L78.6648,200.665ZM162.4,200.307L160.959,204.055L161.893,204.414L163.333,200.666L162.4,200.307ZM81.5458,208.16L82.9863,211.907L83.9197,211.549L82.4792,207.801L81.5458,208.16ZM159.519,207.802L158.079,211.55L159.012,211.908L160.452,208.161L159.519,207.802ZM84.4268,215.655L85.8673,219.402L86.8007,219.043L85.3602,215.296L84.4268,215.655ZM156.638,215.297L155.198,219.044L156.131,219.403L157.572,215.656L156.638,215.297ZM87.3078,223.149L88.7483,226.897L89.6817,226.538L88.2412,222.791L87.3078,223.149ZM153.758,222.792L152.317,226.539L153.251,226.898L154.691,223.151L153.758,222.792ZM90.1887,230.644L91.6292,234.392L92.5627,234.033L91.1222,230.285L90.1887,230.644ZM150.877,230.287L149.436,234.034L150.37,234.393L151.81,230.645L150.877,230.287ZM93.0697,238.139L94.5102,241.886L95.4436,241.528L94.0031,237.78L93.0697,238.139ZM147.996,237.782L146.556,241.529L147.489,241.888L148.929,238.14L147.996,237.782ZM97.2059,248.899L97.1587,249.022L97.2694,249.064L97.275,249.079L97.2914,249.073L98.0916,249.382L98.2776,248.9L96.8841,245.275L95.9507,245.634L97.2059,248.899ZM143.722,248.9L143.909,249.383L144.711,249.074L144.725,249.079L144.73,249.066L144.842,249.023L144.794,248.899L146.049,245.635L145.115,245.276L143.722,248.9ZM95.7124,252.767L94.2661,256.512L95.199,256.872L96.6453,253.127L95.7124,252.767ZM145.355,253.128L146.802,256.873L147.734,256.513L146.288,252.768L145.355,253.128ZM92.8198,260.257L91.3735,264.002L92.3064,264.362L93.7527,260.617L92.8198,260.257ZM148.248,260.619L149.694,264.364L150.627,264.003L149.181,260.258L148.248,260.619ZM89.9272,267.747L88.4809,271.493L89.4138,271.853L90.8601,268.108L89.9272,267.747ZM151.14,268.109L152.587,271.854L153.52,271.494L152.073,267.749L151.14,268.109ZM87.0346,275.238L85.5883,278.983L86.5212,279.343L87.9675,275.598L87.0346,275.238ZM154.033,275.599L155.479,279.344L156.412,278.984L154.966,275.239L154.033,275.599ZM84.142,282.728L82.6957,286.473L83.6286,286.833L85.0749,283.088L84.142,282.728ZM156.926,283.089L158.372,286.835L159.305,286.474L157.858,282.729L156.926,283.089ZM81.2494,290.218L79.8031,293.964L80.736,294.324L82.1823,290.579L81.2494,290.218ZM159.818,290.58L161.264,294.325L162.197,293.965L160.751,290.219L159.818,290.58ZM78.3568,297.709L76.9105,301.454L77.8434,301.814L79.2897,298.069L78.3568,297.709ZM162.711,298.07L164.157,301.815L165.09,301.455L163.644,297.71L162.711,298.07ZM75.4642,305.199L74.0179,308.944L74.9508,309.304L76.3971,305.559L75.4642,305.199ZM165.603,305.56L167.05,309.305L167.982,308.945L166.536,305.2L165.603,305.56ZM120.713,307.72L119.572,310.693L120.506,311.051L120.716,310.502L121.002,311.239L121.934,310.879L120.713,307.72ZM72.5716,312.689L71.1253,316.434L72.0582,316.795L73.5045,313.049L72.5716,312.689ZM168.496,313.051L169.942,316.796L170.875,316.435L169.429,312.69L168.496,313.051ZM118.148,314.404L116.724,318.115L117.658,318.474L119.082,314.762L118.148,314.404ZM124.801,318.294L123.368,314.586L122.435,314.947L123.868,318.655L124.801,318.294ZM69.679,320.18L68.2327,323.925L69.1656,324.285L70.6119,320.54L69.679,320.18ZM171.388,320.541L172.835,324.286L173.768,323.926L172.321,320.181L171.388,320.541ZM115.3,321.827L113.876,325.538L114.81,325.896L116.234,322.185L115.3,321.827ZM127.668,325.709L126.235,322.002L125.302,322.362L126.735,326.07L127.668,325.709ZM66.7864,327.67L65.3401,331.415L66.273,331.775L67.7193,328.03L66.7864,327.67ZM174.281,328.031L175.727,331.776L176.66,331.416L175.214,327.671L174.281,328.031ZM112.452,329.249L111.028,332.96L111.962,333.319L113.386,329.607L112.452,329.249ZM130.535,333.124L129.102,329.417L128.169,329.777L129.602,333.485L130.535,333.124ZM63.8938,335.16L62.4475,338.905L63.3804,339.266L64.8267,335.521L63.8938,335.16ZM177.174,335.521L178.62,339.266L179.553,338.906L178.107,335.161L177.174,335.521ZM109.604,336.672L108.18,340.383L109.114,340.741L110.538,337.03L109.604,336.672ZM133.402,340.539L131.968,336.832L131.036,337.192L132.469,340.9L133.402,340.539ZM61.0012,342.651L59.5549,346.396L60.4878,346.756L61.9341,343.011L61.0012,342.651ZM180.066,343.012L181.512,346.757L182.445,346.397L180.999,342.651L180.066,343.012ZM106.756,344.094L105.332,347.805L106.265,348.163L107.689,344.452L106.756,344.094ZM136.269,347.955L134.835,344.247L133.903,344.608L135.336,348.315L136.269,347.955ZM58.1086,350.141L56.6624,353.886L57.5952,354.246L59.0415,350.501L58.1086,350.141ZM182.959,350.502L184.405,354.247L185.338,353.887L183.892,350.142L182.959,350.502ZM103.908,351.516L102.484,355.228L103.417,355.586L104.841,351.875L103.908,351.516ZM139.136,355.37L137.702,351.662L136.77,352.023L138.203,355.73L139.136,355.37ZM55.2161,357.631L53.7698,361.376L54.7026,361.737L56.1489,357.991L55.2161,357.631ZM185.851,357.992L187.298,361.737L188.231,361.377L186.784,357.632L185.851,357.992ZM101.06,358.939L99.6357,362.65L100.569,363.008L101.993,359.297L101.06,358.939ZM142.003,362.785L140.569,359.077L139.636,359.438L141.07,363.146L142.003,362.785ZM52.3235,365.122L50.8772,368.867L51.81,369.227L53.2563,365.482L52.3235,365.122ZM188.744,365.482L190.19,369.228L191.123,368.867L189.677,365.122L188.744,365.482ZM98.2117,366.361L96.7877,370.073L97.7213,370.431L99.1453,366.72L98.2117,366.361ZM144.87,370.2L143.436,366.493L142.503,366.853L143.937,370.561L144.87,370.2ZM49.4309,372.612L47.9846,376.357L48.9174,376.717L50.3637,372.972L49.4309,372.612ZM191.637,372.973L193.083,376.718L194.016,376.358L192.569,372.613L191.637,372.973ZM95.3636,373.784L93.9396,377.495L94.8732,377.853L96.2973,374.142L95.3636,373.784ZM147.736,377.615L146.303,373.908L145.37,374.268L146.804,377.976L147.736,377.615ZM46.5383,380.102L45.092,383.847L46.0248,384.208L47.4711,380.462L46.5383,380.102ZM194.529,380.463L195.975,384.208L196.908,383.848L195.462,380.103L194.529,380.463ZM92.5156,381.206L91.0915,384.917L92.0252,385.276L93.4492,381.564L92.5156,381.206ZM150.603,385.031L149.17,381.323L148.237,381.684L149.671,385.391L150.603,385.031ZM43.6457,387.592L42.1994,391.338L43.1322,391.698L44.5785,387.953L43.6457,387.592ZM197.422,387.953L198.868,391.698L199.801,391.338L198.355,387.593L197.422,387.953ZM89.6675,388.629L88.2435,392.34L89.1771,392.698L90.6011,388.987L89.6675,388.629ZM153.47,392.446L152.037,388.738L151.104,389.099L152.538,392.806L153.47,392.446ZM40.7531,395.083L39.3068,398.828L40.2396,399.188L41.6859,395.443L40.7531,395.083ZM200.314,395.444L201.761,399.189L202.693,398.829L201.247,395.083L200.314,395.444ZM86.8195,396.051L85.3954,399.762L86.3291,400.121L87.7531,396.409L86.8195,396.051ZM156.337,399.861L154.904,396.153L153.971,396.514L155.404,400.222L156.337,399.861ZM37.8605,402.573L36.4142,406.318L37.347,406.679L38.7933,402.933L37.8605,402.573ZM203.207,402.934L204.653,406.679L205.586,406.319L204.14,402.574L203.207,402.934ZM83.9714,403.474L82.5474,407.185L83.481,407.543L84.905,403.832L83.9714,403.474ZM159.204,407.276L157.771,403.569L156.838,403.929L158.271,407.637L159.204,407.276ZM34.9679,410.063L33.5216,413.809L34.4544,414.169L35.9007,410.424L34.9679,410.063ZM206.099,410.424L207.546,414.169L208.479,413.809L207.032,410.064L206.099,410.424ZM81.1233,410.896L79.6993,414.607L80.6329,414.965L82.057,411.254L81.1233,410.896ZM162.071,414.691L160.637,410.984L159.705,411.344L161.138,415.052L162.071,414.691ZM32.0753,417.554L30.629,421.299L31.5618,421.659L33.0081,417.914L32.0753,417.554ZM208.992,417.914L210.438,421.66L211.371,421.299L209.925,417.554L208.992,417.914ZM78.2753,418.318L76.8512,422.03L77.7849,422.388L79.2089,418.677L78.2753,418.318ZM164.938,422.107L163.504,418.399L162.572,418.759L164.005,422.467L164.938,422.107ZM29.1827,425.044L27.7364,428.789L28.6692,429.149L30.1155,425.404L29.1827,425.044ZM211.885,425.405L213.331,429.15L214.264,428.79L212.817,425.044L211.885,425.405ZM75.4272,425.741L74.0032,429.452L74.9368,429.81L76.3608,426.099L75.4272,425.741ZM167.805,429.522L166.371,425.814L165.439,426.175L166.872,429.882L167.805,429.522ZM26.2901,432.534L24.8438,436.28L25.7766,436.64L27.2229,432.895L26.2901,432.534ZM214.777,432.895L216.223,436.64L217.156,436.28L215.71,432.535L214.777,432.895ZM72.5792,433.163L71.1551,436.875L72.0888,437.233L73.5128,433.522L72.5792,433.163ZM170.672,436.937L169.238,433.229L168.305,433.59L169.739,437.297L170.672,436.937ZM23.3975,440.025L21.9512,443.77L22.8841,444.13L24.3303,440.385L23.3975,440.025ZM217.67,440.385L219.116,444.13L220.049,443.77L218.603,440.025L217.67,440.385ZM69.7311,440.586L68.3071,444.297L69.2407,444.655L70.6647,440.944L69.7311,440.586ZM173.539,444.352L172.105,440.644L171.172,441.005L172.606,444.713L173.539,444.352ZM20.5049,447.515L19.0586,451.26L19.9915,451.62L21.4378,447.875L20.5049,447.515ZM220.562,447.876L222.009,451.621L222.941,451.26L221.495,447.515L220.562,447.876ZM66.883,448.008L65.459,451.719L66.3926,452.078L67.8167,448.366L66.883,448.008ZM176.405,451.767L174.972,448.06L174.039,448.42L175.473,452.128L176.405,451.767ZM17.6123,455.005L16.166,458.751L17.0989,459.111L18.5452,455.366L17.6123,455.005ZM223.455,455.366L224.901,459.111L225.834,458.751L224.388,455.006L223.455,455.366ZM64.035,455.431L62.611,459.142L63.5446,459.5L64.9686,455.789L64.035,455.431ZM179.272,459.182L177.839,455.475L176.906,455.835L178.34,459.543L179.272,459.182ZM14.7197,462.496L13.2734,466.241L14.2063,466.601L15.6526,462.856L14.7197,462.496ZM226.348,462.856L227.794,466.601L228.727,466.241L227.28,462.496L226.348,462.856ZM61.1869,462.853L59.7629,466.564L60.6965,466.923L62.1206,463.211L61.1869,462.853ZM182.139,466.598L180.706,462.89L179.773,463.251L181.207,466.958L182.139,466.598ZM11.8271,469.986L10.3808,473.731L11.3137,474.091L12.76,470.346L11.8271,469.986ZM229.24,470.346L230.686,474.092L231.619,473.731L230.173,469.986L229.24,470.346ZM58.3389,470.276L56.9148,473.987L57.8485,474.345L59.2725,470.634L58.3389,470.276ZM185.006,474.013L183.573,470.305L182.64,470.666L184.073,474.373L185.006,474.013ZM8.93451,477.476L7.48821,481.221L8.42107,481.582L9.86737,477.837L8.93451,477.476ZM232.133,477.837L233.579,481.582L234.512,481.222L233.066,477.476L232.133,477.837ZM55.4908,477.698L54.0668,481.409L55.0004,481.767L56.4244,478.056L55.4908,477.698ZM187.873,481.428L186.44,477.72L185.507,478.081L186.94,481.789L187.873,481.428ZM6.04191,484.967L4.59562,488.712L5.52847,489.072L6.97477,485.327L6.04191,484.967ZM235.025,485.327L236.472,489.072L237.404,488.712L235.958,484.967L235.025,485.327ZM52.6427,485.12L51.2187,488.832L52.1523,489.19L53.5764,485.479L52.6427,485.12ZM190.74,488.843L189.307,485.136L188.374,485.496L189.807,489.204L190.74,488.843ZM3.14932,492.457L1.70302,496.202L2.63588,496.562L4.08217,492.817L3.14932,492.457ZM237.918,492.817L239.364,496.562L240.297,496.202L238.851,492.457L237.918,492.817ZM49.7947,492.543L48.3707,496.254L49.3043,496.612L50.7283,492.901L49.7947,492.543ZM193.607,496.258L192.173,492.551L191.241,492.911L192.674,496.619L193.607,496.258ZM0.256721,499.947L-0.466428,501.82L0.466428,502.18L1.18958,500.308L0.256721,499.947ZM240.81,500.308L241.534,502.18L242.466,501.82L241.743,499.947L240.81,500.308ZM46.9466,499.965L46.2346,501.821L47.1682,502.179L47.8803,500.323L46.9466,499.965ZM195.757,501.82L195.04,499.966L194.108,500.327L194.824,502.18L195.757,501.82Z" fill-rule="evenodd" fill="#111925" fill-opacity="0.30000001192092896"/>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 全局重置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 全局平滑滚动 */
html {
  scroll-behavior: smooth;
  margin: 0;
  padding: 0;
}

/* 优化滚动性能 */
body {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

/* 页面容器样式 */
.page-container {
  width: 100%;
  height: auto; /* 改为自动高度，由内容决定 */
  scroll-behavior: smooth; /* 添加平滑滚动 */
}

/* 英雄区域样式 */
.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* 背景遮罩样式 */
.background-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 版权信息样式 */
.copyright-text {
  position: absolute; /* 相对于hero-section定位 */
  bottom: 56px; /* 距离hero-section底部56px */
  left: 56px; /* 距离hero-section左边56px，与导航栏对齐 */
  font-family: 'Courier', 'Courier New', monospace;
  font-size: 16px;
  color: #666666;
  z-index: 101;
  /* 允许鼠标事件穿透 */
  pointer-events: none;
}

/* 测试区域样式 */
.test-section {
  width: 100%;
  min-height: 200px;
  background: #ffffff;
  padding: 20px;
  border-top: 1px solid #eee;
}

/* 内容区域样式 */
.content-section {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh; /* 设置为全屏高度 */
  padding: 0; /* 移除顶部padding，让内容完全居中 */
  background: #ffffff;
  background-image: url('/src/assets/section2_background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 改为从顶部开始，允许margin-top生效 */
  overflow: visible;
  z-index: 10;
}

/* 文字内容区域 - 独立不重叠 */
.text-content-area {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 60px auto; /* 底部留60px间距 */
  padding: 40px;
  text-align: center;
  z-index: 3;
  animation: fadeInUp 1s ease-out 0.3s both;
}

/* 视频主容器 */
.video-background-main-container {
  margin-top: calc(9vh -40px); /* 再向上移动40px (80px + 40px = 120px) */
  position: relative;
  width: calc(100vw - 80px); /* 容器宽度 */
  height: 62.44vh; /* 容器高度 */
  margin-left: auto;
  margin-right: auto;
  overflow: visible; /* 允许视频放大后显示 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Section2背景装饰元素 */
.section2-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none; /* 不阻挡鼠标事件 */
}

/* 视频容器 */
.video-container {
  position: relative;
  width: 100vh;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 淡入向上动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.section-description {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 24px;
  color: #000000;
  margin-bottom: 0px;
  line-height: 1.2;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  display: absolute;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 小方块图标样式 */
.icon-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: #04F7ED;
  border-radius: 0px;
  color: #000000;
}

/* 副标题样式 */
.section-subtitle {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 24px;
  color: #000000;
  margin: 0px 0 0px;
  text-align: center;
  line-height: 1.6;
}

/* 视频wrapper - 基于16英寸MacBook屏幕优化，自适应所有屏幕 */
.video-wrapper {
  position: relative;
  /* 16英寸MacBook屏幕优化：基于1728px宽度，视频占60%视口宽度 */
  width: min(60vw, calc(100vw - 120px)); /* 视频宽度：60%视口宽度，最小间距120px */
  height: calc(min(60vw, calc(100vw - 120px)) * 495 / 994); /* 保持495:994比例（更接近16:9） */
  max-width: calc(100vw - 120px); /* 确保不超过屏幕宽度减去间距 */
  max-height: 495px; /* 更新最大值限制 */
  margin: 0 auto;
  border-radius: 4px; /* border圆角设为4px */
  overflow: hidden;
  border: 4px solid #6EFDAE; /* 添加4px的绿色边框 */
  background-color: #6EFDAE; /* 添加绿色背景 */
  /* 添加缩放效果来实现1.2倍放大 */
  transform: scale(1.2);
  transform-origin: center;
}

/* 移除hover效果 */

/* 视频占位符样式 */
.video-placeholder {
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent; /* 改为透明，让背景图片可见 */
  overflow: hidden;
  z-index: 3; /* 位于video-wrapper之上 */
}

.placeholder-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 4px; /* 与wrapper保持一致的圆角 */
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  opacity: 1;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: 4px; /* 与wrapper保持一致的圆角 */
}

.video-wrapper:hover .video-overlay {
  opacity: 0;
}

.play-button {
  transform: scale(1);
  transition: transform 0.3s ease;
  cursor: pointer;
  pointer-events: auto;
}

.play-button:hover {
  transform: scale(1.1);
}

.video-caption {
  text-align: center;
  margin-top: 20px;
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 16px;
  color: #888888;
  font-style: italic;
}



/* 导航容器样式 */
.navigation-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 124px;
  display: grid;
  grid-template-columns: 1fr 5fr 12fr 5fr 1fr;
  align-items: center;
  padding: 16px 0; /* 移除左右padding，由grid系统控制间距 */
  background: transparent;
  z-index: 1000;
  box-sizing: border-box;
  /* 允许鼠标事件穿透到下层的MaskImage */
  pointer-events: none;
  transition: background-color 0.3s ease;
}

/* 移动端菜单打开时的导航栏背景 */
.navigation-container.menu-open {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  /* 重新启用鼠标事件 */
  pointer-events: auto; /* 不阻挡鼠标事件 */
}

/* 空白区域样式 */
.nav-spacer {
  /* 空白区域，用于grid布局 */
}

/* logo区域样式 */
.nav-logo-section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /* 重新启用鼠标事件 */
  pointer-events: auto;
}

.nav-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  /* 重新启用鼠标事件 */
  pointer-events: auto;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.nav-icon:hover {
  opacity: 0.8;
}

.nav-icon img {
  height: 32px;
  width: auto; /* 根据高度自适应宽度 */
  object-fit: contain;
}

/* 中间的导航按钮组 - 居中显示 */
.nav-center-buttons {
  display: flex;
  gap: 48px;
  flex-wrap: nowrap;
  justify-content: center;
  /* 重新启用鼠标事件 */
  pointer-events: auto;
}

/* 右侧的下载按钮组 - 右对齐 */
.nav-right-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  /* 重新启用鼠标事件 */
  pointer-events: auto;
  /* 向左移动一些，确保在5fr区域内右对齐 */
  margin-right: 8px;
}

/* 汉堡按钮容器 - 确保居右显示 */
.hamburger-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  /* 重新启用鼠标事件 */
  pointer-events: auto;
  /* 左移10px */
  margin-right: -10px;
}

.nav-btn {
  background: transparent;
  color: #000000;
  border: none;
  border-radius: 0;
  padding: 8px 16px;
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  /* 取消选中态和焦点态 */
  outline: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  /* 固定宽度防止乱码影响布局 */
  width: 120px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.nav-btn:hover {
  color: #000000;
}

.nav-btn:focus {
  outline: none;
}

.nav-btn:active {
  outline: none;
  color: #000000;
}

/* 下载按钮特殊样式 */
.download-btn {
  color: #656A72;
  border-radius: 0px;
  padding: 8px 56px; /* 上下8px，左右56px */
  font-weight: 500;
  transition: all 0.3s ease;
}

/* 下载按钮hover效果 - 保持原样 */
.download-btn:hover {
  background: #ffffff;
  color: #000000;
  border-color: #000000;
  transform: none;
}

/* 滚动到第二个section时的下载按钮样式 */
.nav-btn.download-btn.download-btn-dark {
  background: #000000 !important;
  color: #ffffff !important;
  border-color: #000000 !important;
}

/* 黑色状态下载按钮hover效果 - 保持原样 */
.nav-btn.download-btn.download-btn-dark:hover {
  background: #000000 !important;
  color: #ffffff !important;
  border-color: #000000 !important;
  transform: none !important;
}

/* 英雄区域主要内容容器样式 */
.hero-main-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: grid;
  grid-template-columns: 1fr 10fr 6fr 6fr 1fr;
  align-items: center;
  width: 100%;
  min-width: 320px;
  padding: 0;
  /* 允许鼠标事件穿透到下层的MaskImage */
  pointer-events: none;
}

/* 英雄区域空白区域样式 */
.hero-spacer {
  /* 空白区域，用于grid布局 */
}

/* 英雄区域标题区域样式 - 10fr区域 */
.hero-title-section {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 标题在区域内垂直居中 */
  align-items: flex-start;
  height: 100%;
  /* 图片不需要交互，保持穿透 */
  pointer-events: none;
}

/* 英雄区域左侧标题图片样式 */
.hero-left-title {
  width: 100%;
  max-width: 700px;
  /* 图片不需要交互，保持穿透 */
  pointer-events: none;
}

.title-placeholder {
  width: 100%;
  max-width: 700px;
  height: auto;
  object-fit: contain;
}

/* 英雄区域文字内容容器样式 */
.hero-text-container {
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 400px;
  justify-self: end; /* 在grid区域内居右对齐 */
  /* 重新启用鼠标事件，因为包含交互按钮 */
  pointer-events: auto;
}

.brand-line {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 12px;
  /* 允许鼠标事件穿透 */
  pointer-events: none;
}

.brand-name {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 22px;
  font-weight: 400;
  color: #656A72;
  line-height: 1.5;
  margin-bottom: 12px;
  /* 允许鼠标事件穿透 */
  pointer-events: none;
}

.brand-subtitle {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 22px;
  font-weight: 400;
  color: #656A72;
  line-height: 1.5;
  /* 允许鼠标事件穿透 */
  pointer-events: none;
}

.brand-description {
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 22px;
  font-weight: 400;
  color: #656A72;
  margin-bottom: 32px;
  line-height: 1.5;
  pointer-events: none;
}

.button-group {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  align-items: center;
  /* 重新启用鼠标事件 */
  pointer-events: auto;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 0px;
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width:162px;
  justify-content: center;
}

.btn-primary:hover {
  background: #000000;
}

.btn-primary:active,
.btn-primary:focus {
  background: #000000;
  color: #ffffff;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #ffffff;
  color: #656A72;
  border: 1px solid #656A72;
  border-radius: 0px;
  font-family: 'PingFang SC', '苹方简', sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 120px;
  justify-content: center;
  box-sizing: border-box;
}

.btn-secondary:hover {
  background: #ffffff;
  color: #656A72
}

.btn-secondary:active,
.btn-secondary:focus {
  background: #ffffff;
  color: #656A72;
  border: 1px solid #656A72;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    min-height: 100vh;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
  }
  
  .navigation-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
    gap: 0px;
    padding: 16px 20px;
    height: 124px;
    z-index: 1001;
    transition: background-color 0.3s ease;
  }
  
  /* 确保logo和hamburger按钮在移动端垂直居中 */
  .nav-icon {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: 0;

  }
  
  .hamburger-container {
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: 8px;
  }
  
  /* 中屏幕移动端菜单打开时的导航栏背景 */
  .navigation-container.menu-open {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    /* 重新启用鼠标事件 */
    pointer-events: auto;
  }
  
  /* 隐藏桌面端导航按钮 */
  .desktop-nav {
    display: none;
  }
  
  /* 隐藏桌面端下载按钮 */
  .desktop-download {
    display: none;
  }
  
  /* 显示汉堡菜单按钮 */
  .hamburger-btn {
    display: flex;
  }
  
  /* 确保汉堡按钮容器在移动端显示 - 已在上面定义 */
  
  .nav-icon img {
    height: 28px;
    width: auto; /* 根据高度自适应宽度 */
  }
  
  .hero-main-container {
    position: absolute;
    left: 20px; /* 与导航栏左padding对齐 */
    top: 0;
    bottom: 0;
    width: calc(100% - 40px);
    height: 100vh;
    display: grid;
    grid-template-rows: 1fr 3fr 0.5fr 2.5fr 1fr;
    grid-template-columns: 1fr;
    align-items: center;
    margin: 0;
    padding: 0;
  }
  
  /* 移动端标题区域 - 在第二个grid行 */
  .hero-title-section {
    grid-row: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  /* 移动端文字和按钮容器 - 在第四个grid行 */
  .hero-text-container {
    grid-row: 4;
    width: 100%;
    max-width: 300px; /* 限制最大宽度，避免文字过长 */
    align-items: flex-start;
    text-align: left;
    margin: 0;
    padding: 0;
    justify-self: start;
  }
  
  /* 移动端版权信息 - 隐藏 */
  .copyright-text {
    display: none; /* 在移动端隐藏版权信息 */
  }
  

  .hero-left-title {
    width: 100%;
    text-align: left;
    margin: 0 0 20px 0; /* 添加底部间距 */
    padding: 0;
  }
  
  .title-placeholder {
    width: 100%;
    height: calc(100vw * 0.25); /* 调整高度，使其更小 */
    max-width: 300px; /* 限制最大宽度 */
    max-height: 120px; /* 限制最大高度 */
    margin: 0;
    padding: 0;
    display: block;
  }
  
  
  .brand-line {
    align-items: flex-start;
    margin: 0 0 12px 0; /* 保持与brand-description一致的底部间距 */
    padding: 0;
  }
  
  .button-group {
    justify-content: flex-start;
    margin: 0;
    padding: 0;
  }
  
  .brand-name {
    font-size: 20px;
  }
  
  .brand-subtitle {
    font-size: 20px;
  }
  
  .brand-description {
    font-size: 20px;
    margin-bottom: 12px; /* 与brand-line保持一致的间距 */
  }
  
  .button-group {
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: row; /* 改为水平排列 */
    gap: 12px;
  }
  
  .btn-primary {
    padding: 10px 20px;
    font-size: 16px; /* 保持与桌面端相同的字号 */
    width: 160px; /* 调整宽度以适应水平排列 */
  }
  
  .btn-secondary {
    padding: 10px 20px;
    font-size: 16px; /* 保持与桌面端相同的字号 */
    width: 120px; /* 调整宽度以适应水平排列 */
  }
  
  .content-section {
    padding: 60px 0 0 0; /* 只保留顶部padding */
  }
  
  .section-title {
    font-size: 36px;
  }
  
  .section-description {
    font-size: 24px !important; /* 保持与桌面端相同的字号 */
    margin-bottom: 40px;
  }
  
  
  .video-background-main-container {
    width: 90vw; /* 主容器宽度 */
    height: 50vh; /* 调整高度 */
    max-width: calc(100vw - 100px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .video-wrapper {
    width: min(80vw, calc(100vw - 40px)); /* 移动端使用80%视口宽度，最小间距40px */
    height: calc(min(80vw, calc(100vw - 40px)) * 495 / 994); /* 保持495:994比例 */
    max-width: calc(100vw - 40px); /* 确保不超过屏幕宽度减去间距 */
    max-height: 495px;
    border-radius: 4px;
    transform: scale(1.2);
    transform-origin: center;
  }
  
  
  .video-caption {
    font-size: 14px;
    margin-top: 15px;
  }
  
  .copyright-text {
    bottom: 20px;
    left: 20px;
    font-size: 14px;
  }
}


/* 平板设备响应式-中尺寸屏幕 */
@media (max-width: 1024px) and (min-width: 769px) {
  .hero-main-container {
    left: 5%;
    transform: translate(-5%, -50%);
    width: calc(100% - 40px);
    flex-direction: column;
    gap: 30px;
  }
  
  .hero-left-title {
    width: 100%;
    text-align: left;
  }
  
  .title-placeholder {
    max-width: 500px;
  }
  
  .hero-text-container {
    width: 100%;
    max-width: 400px;
    align-items: left;
    text-align: left;
    margin-left: 0;
  }
  
  .brand-line {
    align-items: left;
  }
  
  .button-group {
    align-items: flex-start;
  }
  
  .brand-name, .brand-subtitle, .brand-description {
    font-size: 18px;
  }
  
  .video-background-main-container {
    width: 85vw; /* 主容器宽度 */
    height: 50vh; /* 调整高度 */
    max-width: calc(100vw - 100px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 平板端背景装饰元素调整 */
  .vertical-line {
    width: 1px; /* 平板端使用与下载页面一致的线条粗细 */
  }
  
  
  /* 平板端横向线调整 */
  .horizontal-line {
    height: 1.5px; /* 平板端使用中等粗细的线条 */
  }
  
  /* 平板端顶部横向线调整 */
  .top-line {
    transform: translateY(calc(-50% + (min(75vw, calc(100vw - 80px)) * 1.2 * 495 / 994 / -2)));
  }
  
  /* 平板端底部横向线调整 */
  .bottom-line {
    transform: translateY(calc(-50% + (min(75vw, calc(100vw - 80px)) * 1.2 * 495 / 994 / 2)));
  }
  
  .video-wrapper {
    width: min(75vw, calc(100vw - 80px)); /* 平板端使用75%视口宽度，最小间距80px */
    height: calc(min(75vw, calc(100vw - 80px)) * 495 / 994); /* 保持495:994比例 */
    max-width: calc(100vw - 80px); /* 确保不超过屏幕宽度减去间距 */
    max-height: 495px;
    border-radius: 4px;
    transform: scale(1.2);
    transform-origin: center;
  }
  
  
  .copyright-text {
    bottom: 30px;
    left: 30px;
    font-size: 15px;
  }
}

/* 乱码特效样式 */
.revealed {
  color: inherit;
  transition: color 0.2s ease;
}

.encrypted {
  color: #000000;
  transition: color 0.1s ease;
}

/* 导航按钮内的文字样式优化 */
.nav-btn .revealed {
  color: #000000 !important;
}

.nav-btn .encrypted {
  color: #000000 !important;
}

/* 下载按钮内的文字样式优化 */
.btn-primary .revealed {
  color: #ffffff !important;
}

.btn-primary .encrypted {
  color: #ffffff !important;
}

/* DecryptedText组件在导航按钮中的样式 */
.nav-btn span[style*="display: inline-block"] {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* DecryptedText组件在下载按钮中的样式 */
.btn-primary span[style*="display: inline-block"] {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

/* DecryptedText组件在所有下载按钮中的样式 */
.btn-secondary span[style*="display: inline-block"] {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

/* hover状态下也保持黑色，覆盖原有的青色样式 */
.nav-btn:hover .revealed {
  color: #000000 !important;
}

.nav-btn:hover .encrypted {
  color: #000000 !important;
}

/* 下载按钮hover状态下的文字样式 */
.btn-primary:hover .revealed {
  color: #ffffff !important;
}

.btn-primary:hover .encrypted {
  color: #ffffff !important;
}

/* 所有下载按钮内的文字样式优化 */
.btn-secondary .revealed {
  color: #000000 !important;
}

.btn-secondary .encrypted {
  color: #000000 !important;
}

/* 所有下载按钮hover状态下的文字样式 */
.btn-secondary:hover .revealed {
  color: #000000 !important;
}

.btn-secondary:hover .encrypted {
  color: #000000 !important;
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
  /* 重新启用鼠标事件 */
  pointer-events: auto;
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

/* 移动端下拉菜单样式 */
.mobile-menu {
  position: fixed;
  top: 124px; /* 移动端导航栏高度 */
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: none; /* 移除顶部边框避免视觉间距 */
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
  /* 重新启用鼠标事件 */
  pointer-events: none;
}

.mobile-menu.mobile-menu-open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
  /* 重新启用鼠标事件 */
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
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  /* 重新启用鼠标事件 */
  pointer-events: auto;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  /* 取消选中态和焦点态 */
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
  background: transparent;
  color: #000000;
}

.mobile-nav-btn:active {
  outline: none;
  background: transparent;
  color: #000000;
}

.mobile-nav-btn:last-child {
  border-bottom: none;
}

.mobile-download-btn {
  background: #000000;
  color: #ffffff;
  font-weight: 500;
  text-align: center;
  border-radius: 0px;
  border: none;
}

.mobile-download-btn:hover {
  background: #333333;
  color: #ffffff;
}

/* 移动端导航按钮内的文字样式 */
.mobile-nav-btn .revealed {
  color: inherit !important;
}

.mobile-nav-btn .encrypted {
  color: inherit !important;
}

.mobile-download-btn .revealed {
  color: #ffffff !important;
}

.mobile-download-btn .encrypted {
  color: #ffffff !important;
}


/* 联系我们按钮特殊样式 */
.contact-btn {
  position: relative;
  /* 确保弹窗相对于按钮定位 */
}

/* 小屏幕手机响应式 */
@media (max-width: 480px) {
  .hero-main-container {
    position: absolute;
    left: 12px; /* 与导航栏左padding对齐 */
    top: 50%; /* 垂直居中 */
    bottom: auto; /* 取消底部定位 */
    transform: translateY(-50%); /* 垂直居中 */
    width: calc(100% - 24px); /* 调整宽度以匹配新的left值 */
    padding: 0 15px;
    gap: 30px;
    margin: 0;
    align-items: flex-start;
    justify-content: center; /* 改为居中对齐 */
  }
  
  /* 小屏幕标题区域 - 在第二个grid行 */
  .hero-title-section {
    grid-row: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  /* 小屏幕文字和按钮容器 - 在第四个grid行 */
  .hero-text-container {
    grid-row: 4;
    width: 100%;
    max-width: 280px; /* 小屏幕限制最大宽度 */
    align-items: flex-start;
    text-align: left;
    margin: 0;
    padding: 0;
    justify-self: start;
  }
  
  /* 小屏幕版权信息 - 隐藏 */
  .copyright-text {
    display: none; /* 在小屏幕移动端也隐藏版权信息 */
  }

  .hero-left-title {
    width: 100%;
    text-align: left;
    margin: 0 0 15px 0; /* 添加底部间距 */
    padding: 0;
  }
  
  .title-placeholder {
    width: 100%;
    height: calc(100vw * 0.2); /* 调整高度，使其更小 */
    max-width: 250px; /* 限制最大宽度 */
    max-height: 100px; /* 限制最大高度 */
    margin: 0;
    padding: 0;
    display: block;
  }
  
  
  .brand-name, .brand-subtitle, .brand-description {
    font-size: 18px;
  }
  
  .brand-line {
    margin: 0 0 12px 0; /* 保持与brand-description一致的底部间距 */
  }
  
  .brand-description {
    margin-bottom: 12px; /* 与brand-line保持一致的间距 */
  }
  
  .button-group {
    flex-direction: row; /* 小屏幕也改为水平排列 */
    gap: 10px;
  }
  
  .btn-primary {
    padding: 12px 16px;
    font-size: 16px; /* 保持与桌面端相同的字号 */
    width: 160px; /* 调整宽度以适应水平排列 */
    justify-content: center;
  }
  
  .btn-secondary {
    padding: 11px 16px;
    font-size: 16px; /* 保持与桌面端相同的字号 */
    width: 100px; /* 调整宽度以适应水平排列 */
    justify-content: center;
  }
  
  .content-section {
    padding: 40px 0 0 0; /* 只保留顶部padding */
  }
  
  .content-container {
    padding: 20px 15px calc(50vh + 40px) 15px; /* 底部留出视频容器高度+间距 */
  }
  
  .video-background-main-container {
    width: 95vw; /* 主容器宽度 */
    height: 50vh; /* 调整高度 */
    max-width: calc(100vw - 100px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 小屏幕背景装饰元素调整 */
  .vertical-line {
    width: 1px; /* 小屏幕使用最细的线条 */
  }
  
  
  /* 小屏幕横向线调整 */
  .horizontal-line {
    height: 1px; /* 小屏幕使用最细的线条 */
  }
  
  /* 小屏幕顶部横向线调整 */
  .top-line {
    transform: translateY(calc(-50% + (min(90vw, calc(100vw - 30px)) * 1.4 * 495 / 994 / -2)));
  }
  
  /* 小屏幕底部横向线调整 */
  .bottom-line {
    transform: translateY(calc(-50% + (min(90vw, calc(100vw - 30px)) * 1.4 * 495 / 994 / 2)));
  }
  
  .video-wrapper {
    width: min(90vw, calc(100vw - 30px)); /* 小屏幕使用90%视口宽度，最小间距30px */
    height: calc(min(90vw, calc(100vw - 30px)) * 495 / 994); /* 保持495:994比例 */
    max-width: calc(100vw - 30px); /* 确保不超过屏幕宽度减去间距 */
    max-height: 495px;
    border-radius: 0px;
    transform: scale(1.4);
    transform-origin: center;
  }
  
  .navigation-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
    padding: 0 12px;
    height: 60px;
    z-index: 1001;
    transition: background-color 0.3s ease;
  }
  
  /* 确保logo和hamburger按钮在小屏幕也垂直居中 */
  .nav-icon {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: 0;
  }
  
  .hamburger-container {
    display: flex;
    align-items: center;
    height: 100%;
    /* 左移10px */
    margin-right: 8px;
  }
  
  /* 小屏幕移动端菜单打开时的导航栏背景 */
  .navigation-container.menu-open {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    /* 重新启用鼠标事件 */
    pointer-events: auto;
  }
  
  /* 确保汉堡菜单容器在小屏幕显示 */
  .hamburger-container {
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: 8px;
  }

  /* 确保汉堡菜单在小屏幕也显示 */
  .hamburger-btn {
    display: flex;
  }
  
  /* 小屏幕移动端菜单位置调整 */
  .mobile-menu {
    top: 60px; /* 小屏幕导航栏高度 */
  }
  
  /* 小屏幕logo尺寸调整 */
  .nav-icon img {
    height: 28px;
    width: auto; /* 根据高度自适应宽度 */
  }
  
  .copyright-text {
    bottom: 15px;
    left: 15px;
    font-size: 12px;
  }
  
}

/* Section3 样式 */
.section3 {
  width: 100vw;
  height: 100vh;
  background: #f8f9fa;
  margin: 0;
  padding: 0;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.section3-grid {
  display: grid;
  grid-template-columns: 1fr 5fr 12fr 5fr 1fr;
  grid-template-rows: 2fr 8fr 1fr 1fr;
  width: 100%;
  height: 100%;
  gap: 0;
}

.grid-item {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #ffffff;
  border-top: 1px dashed rgba(17, 25, 37, 0.3);
  border-right: 1px dashed rgba(17, 25, 37, 0.3);
  position: relative;
  min-height: 0;
}

/* 第一行不需要顶部边框 */
.grid-item:nth-child(-n+5) {
  border-top: none;
}

/* 最后一列不需要右边框 */
.grid-item:nth-child(5n) {
  border-right: none;
}

/* 左3，上2的格子（第8个格子）添加背景颜色 */
.grid-item:nth-child(8) {
  background-color: #6EFDAE;
}

/* video-section3样式 */
.video-section3 {
  width: calc(100% - 12px);
  height: calc(100% - 12px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 6px;
}

/* video样式 */
.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* SVG容器样式 */
.svg-container {
  width: 100%;
  height: 100%;
  display: block;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

/* 可缩放SVG样式 */
.scalable-svg {
  width: 100%;
  height: 100%;
  display: block;
  padding: 0;
  margin: 0;
  object-fit: fill;
}


/* Section3 响应式设计 */
@media (max-width: 768px) {
  .section3-grid {
    grid-template-columns: 1fr 3fr 6fr 3fr 1fr;
    grid-template-rows: 2fr 8fr 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .section3-grid {
    grid-template-columns: 1fr 2fr 4fr 2fr 1fr;
    grid-template-rows: 2fr 8fr 1fr 1fr;
  }
}
</style>
