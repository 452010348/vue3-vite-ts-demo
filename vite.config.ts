import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import UnoCSS from 'unocss/vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // UnoCSS()
  ],
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
  },
  // build: {
  //   target: 'es2020',
  //   cssTarget: 'chrome80',
  //   reportCompressedSize: true,
  //   minify: 'terser',
  //   terserOptions: {
  //     compress: {
  //       drop_console: true,
  //       drop_debugger: true,
  //     },
  //   },
  // },
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
});
