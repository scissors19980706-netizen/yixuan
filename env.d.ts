/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 扩展Vue组件的类型定义
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $refs: {
      [key: string]: HTMLElement | null
    }
  }
}

interface ImportMetaEnv {
  readonly VITE_MODE: string
  readonly VITE_BASE_URL: string
  readonly PUBLIC_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

