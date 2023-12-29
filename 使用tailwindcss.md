# 1.安装tailwindcss

```sh
pnpm install -D tailwindcss@latest postcss@latest autoprefixer@latest
```

# 2.创建tailwindcss的配置文件

```sh
pnpm tailwindcss init
```
这将会在您的项目根目录创建一个最小化的 tailwind.config.js 文件：

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {}
  },
  plugins: []
}
```

# 3.配置tailwind.config.js文件

```js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}']
}
```

# 4.在入口 main.ts 全局引入 tailwind.css

```js
// main.ts
import "tailwindcss/tailwind.css"
```

# 5.配置vite.config选项

```js
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
export default defineConfig({
    //...
    css: {
      postcss: {
      plugins: [ tailwindcss(), autoprefixer()]
    }
    //...
  }
})
```

# 6.配置 .vscode/settings.json

tailwindcss模板中仍没有智能的提示 需要去配置settings.json：

```js
{
    //...
    "editor.quickSuggestions": {
      "strings": true
    }
    //...
}
```

# 7. 可以运行了
```sh
pnpm dev
```