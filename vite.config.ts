import fs  from 'node:fs'
import path  from 'node:path'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// 使用它可以移动端
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// 在开发中 可能由于配置 没配置好  只有nuxt ssr 移动端才能访问
// import UnoCSS from 'unocss/vite'
import nodePolyfill from 'rollup-plugin-node-polyfills';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 开启以后某些手机断白屏， 利用ssr渲染似乎可以解决 
    // UnoCSS()

    nodePolyfill()
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  },
  // 指定 TypeScript 配置文件
  // 如果你不想用 TypeScript 可以不配置这个字段
  // 并且将 src/main.js 改成 src/main.ts
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // 指定输出文件夹和公共资源路径

  server: {
    host: '0.0.0.0',
    proxy: {
      '/v1': 'https://nile.tron-gas.net',
      '/open': 'https://nile.tron-gas.net',
      '/pay': {
        target: 'http://swap.tron-gas.net/v1' /** 测试网 */,
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/pay/, ''),
      },
    },
    https:{
      key:fs.readFileSync(path.resolve(__dirname, './ssl/localhost.key')) ,
      cert:fs.readFileSync(path.resolve(__dirname, './ssl/localhost.crt'))
    },
    open: true,
  },
//  define: {
//     'Buffer': 'buffer'
//   },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        // NodeModulesPolyfillPlugin(),
        // NodeGlobalsPolyfillPlugin({
        //   process: false,
        //   buffer: true,
        // }),
      ],
    },
  },
  build: {
    target: 'es2020',
    cssTarget: 'chrome80',
    reportCompressedSize: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
