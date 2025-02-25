import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import { viteVConsole } from 'vite-plugin-vconsole'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default (({ command, mode }) => {
  console.log(command, mode)
  return {
    base: './',
    plugins: [
      react(),
      viteVConsole({
        entry: resolve('src/main.tsx'), // or you can use entry: [path.resolve('src/main.ts')]
        enabled: command === 'app', // command === 'serve'
        config: {
          theme: 'light'
        }
      }),
      legacy({
        renderLegacyChunks: mode == 'app'
      }),
      (command == 'app' && visualizer({open: true})),
      // externalGlobals({
      //   heic2any: "heic2any",
      //   "@wtto00/html2canvas": "html2canvas",
      //   exifr: "exifr",
      // }),
      // createHtmlPlugin({
      //   minify: true,
      //   entry: 'src/main.tsx',
      //   inject: {
      //     data: {
      //       injectScript: `
      //       <script src="https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js"></script>
      //       <script src="https://cdn.jsdelivr.net/npm/@wtto00/html2canvas@1.4.3/dist/html2canvas.min.js"></script>
      //       <script src="https://cdn.jsdelivr.net/npm/exifr@7.1.3/dist/full.umd.js"></script>
      //       `,
      //     },
      //   }
      // })
    ],
    server: {
      host: '0.0.0.0'
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      minifyIdentifiers: false,  // 不混淆标识符
    },
  }
})
