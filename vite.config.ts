import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 从环境变量获取公共路径配置
const PUBLIC_PATH = process.env.PUBLIC_PATH

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log({ mode })

  return {
    plugins: [vue()],
    // CSS 预处理器配置
    css: {
      preprocessorOptions: {
        scss: {
          // Vite 4.x 兼容配置
          additionalData: ''
        }
      }
    },
    // 设置缓存目录
    cacheDir: '.vite.local',
    // 设置环境变量文件目录
    envDir: 'config',
    // 设置应用的基础路径，支持通过环境变量动态配置
    base: PUBLIC_PATH,
    // 路径别名配置
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    build: {
      // 构建输出目录
      outDir: 'dist',
      // 根据环境设置 sourcemap
      sourcemap: mode === 'production' ? 'hidden' : false,
      // 优化 chunk 分割
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // 将 Vue 相关库分离到单独的 chunk
            if (id.includes('vue') || id.includes('vue-router')) {
              return 'vue-vendor'
            }
            // 将 marked 库单独分离
            if (id.includes('marked')) {
              return 'marked-vendor'
            }
            // 将 highlight.js 相关库分离到单独的 chunk
            if (id.includes('highlight.js')) {
              return 'highlight-vendor'
            }
            // 将文档内容分离到单独的 chunk
            if (id.includes('/docs/') && id.includes('.md')) {
              return 'docs'
            }
            // 将 guides 相关组件分离
            if (id.includes('DocsContent') || id.includes('DocsSidebar')) {
              return 'docs-components'
            }
            // 将其他 node_modules 中的大型库分离
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        }
      },
      // 调整 chunk 大小警告阈值 - 由于我们已经做了合理的分割，可以适当提高阈值
      chunkSizeWarningLimit: 800
    },
    // 开发服务器配置
    server: {
      port: 5173,
      host: true,
      // 如果需要代理 API 请求，可以在这里配置
      // proxy: {
      //   '/api': {
      //     target: 'https://catpaw.test.meituan.com',
      //     changeOrigin: true
      //   }
      // }
    }
  }
})
