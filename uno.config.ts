// uno.config.js
// https://www.tailwindcss.cn/docs/font-family(中文文档)
// https://unocss.dev/interactive/(官方文档)

import { defineConfig } from 'unocss'
 
export default defineConfig({
  // ...UnoCSS options
  shortcuts: [
    {'flex-center': 'flex items-center justify-center',}, // 静态快捷方式，是一个对象，可配多个
    [/^base-border-(.*)$/, match => `border-1 border-style-dashed border-${match[1]}`], // 动态快捷方式，一个配置为一个数组
   ]
})