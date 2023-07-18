import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          // <script src="https://unpkg.com/react@18.2.0/cjs/react.production.min.js"></script>
          // <script src="https://unpkg.com/react-dom@18.2.0/cjs/react-dom.production.min.js"></script>
          // <script src="https://unpkg.com/react-redux@8.1.1/dist/react-redux.min.js"></script>
          // <script src="https://unpkg.com/react-router-dom@6.14.1/dist/react-router-dom.production.min.js"></script>
          // <script src="https://unpkg.com/redux@4.2.1/dist/redux.min.js"></script>
          // <script src="https://unpkg.com/ahooks@3.7.8/dist/ahooks.js"></script>
          // <script src="https://unpkg.com/antd@5.7.0/dist/antd.min.js"></script>
          // <script src="https://unpkg.com/exifr@7.1.3/dist/full.umd.js"></script>
          // <script src="https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
          // <script src="https://unpkg.com/canvas-size@1.2.6/dist/canvas-size.min.js"></script>
          // <script src="https://unpkg.com/downloadjs@1.4.7/download.min.js"></script>
          // <link rel="stylesheet" href="https://unpkg.com/antd@5.7.0/dist/reset.css">
          // <script src="https://unpkg.com/heic2any@0.0.4/dist/heic2any.min.js"></script>
          injectScript: `
          `,
          injectCss: `
          `
        },
      }
    })
  ],
  server: {
    host: '0.0.0.0'
  },
  build: {
    rollupOptions: {
      external: [
        // 'react',
        // 'react-dom',
        // 'react-redux',
        // 'react-router-dom',
        // 'redux',
        // 'html2canvas',
        // 'canvas-size',
        // 'downloadjs',
        // 'antd',
        // 'heic2any',
        // 'exifr',
        // 'ahooks',
        // 'vconsole',
        // 'piexifjs'
      ]
    }
  }
})
