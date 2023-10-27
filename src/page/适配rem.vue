<template>
  <div style="font-size: 0.3rem">
    <div>屏幕宽,高：{{ width }}，{{ height }}</div>
  
    <header style="border:1px solid red; width:3rem">1</header>
    
    <footer style="border:1px solid green; width: 6rem;height: 3rem;">2</footer>
  
    <pre style="text-wrap: wrap;">视窗宽度 / (设计稿宽度(750) / 100) = html根字体px</pre>
  </div>
</template>
<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
const { width, height } = useWindowSize();
import { debounce } from 'lodash-es';
import { watch } from 'vue';

document.body.style.fontSize = '0.2rem';
function resize(){
  let max = 750;// 设计稿宽度750
  let dom_W = width.value;
  if (dom_W > max) dom_W = max;
  let rem = dom_W / (max / 100);
  // 设置根元素的字体大小
  document.documentElement.style.fontSize = rem+'px' 
  console.log(rem);
}
const debounceResize = debounce(resize, 100);//防抖
watch(width, debounceResize,{immediate: true});
</script>