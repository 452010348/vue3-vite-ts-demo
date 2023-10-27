<template>
  <div>
    <h2>传送组件</h2>
    <header  style="background: red;min-height: 100px;">header</header>
    <main class="main" style="background: yellow;min-height: 100px;">
      中间
    </main>
    <footer id="footer" style="background: blue;min-height: 100px;">底部</footer>
  </div>
  <!-- 似乎默认在body才能正常使用 -->
  <Teleport :disabled="false" :to="to">
    <div style="background:lawngreen;width:250px;height: 250px;">传送阵 - {{ to }}</div>
  </Teleport>
</template>
<script setup lang="ts">
import { ref, onBeforeUnmount} from "vue";
const names = ['body',"h2","header",'.main', '#footer'];
const to = ref<string>(names[0]);
const timer = setInterval(()=>{
  to.value = names[Math.random() * names.length << 0];
  console.log( to.value );
},2000)
// 组件卸载之前执行的函数；
onBeforeUnmount(()=>{
  clearInterval(timer);
  console.log(`组件卸载之前执行的函数`);
})
</script>