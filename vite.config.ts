import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import UnoCSS from 'unocss/vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // UnoCSS()
  ],
  server:{
    host:"0.0.0.0",

    proxy: {
      '/v1': 'https://nile.tron-gas.net',
      '/open': 'https://nile.tron-gas.net',
    },
  }
})
