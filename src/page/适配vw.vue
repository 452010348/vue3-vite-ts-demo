<template>
  <div>
    <h2>屏幕宽,高：{{ width }}，{{ height }}</h2>
  
    <header style="border:1px solid red; width:30vw">1</header>
    
    <footer style="border:1px solid green; width: 60vw;height: 30vh;">2</footer>
  
    <pre style="font-size: 3vw;text-wrap: wrap;">
  
      实际尺寸 = 视口尺寸 x 百分比 / 100
  
      若视口宽度为1000px 元素宽50vw
  
        50vw / 100% * 1000px = 500px实际尺寸()
    </pre>
  </div>
</template>
<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
const { width, height } = useWindowSize()
</script>