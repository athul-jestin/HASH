/// <reference types="vite/client" />

declare namespace App {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly NODE_ENV: 'development' | 'production' | 'test'
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
