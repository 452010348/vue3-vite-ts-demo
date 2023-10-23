<template>
  <div>
    <button @click="flag = !flag">切换组件</button>
    <KeepAlive :max="10">
      <A v-if="flag"></A>
      <B v-else></B>
    </KeepAlive>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onActivated, onDeactivated, onUnmounted} from "vue";
import A from "./传送组件.vue"
import B from "./Tree.vue"
const flag = ref(true);
onMounted(()=>{
  console.log("组件 初始化")
});
onActivated(()=>{
  console.log('keep-alive 初始化')
});
onDeactivated(()=>{
  console.log('keep-alive 卸载')
});
onUnmounted(()=>{
  console.log("组件卸载 - 备注 onActivated 开启后 此方法就被销毁了 只在 onDeactivated 执行")
})
</script>