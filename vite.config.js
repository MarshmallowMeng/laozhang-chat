import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 部署到 GitHub Pages 时，资源路径前缀必须是 /<仓库名>/
// 通过环境变量 VITE_BASE 注入，本地开发用 '/'
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api/ark': {
        target: 'https://ark.cn-beijing.volces.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ark/, '/api/v3')
      }
    }
  }
})
