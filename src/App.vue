
<template v-if="condition">
    <button v-for="(item,idnex) in data" @click="onTab(item,idnex)">{{ item.name }}</button>
    <component :is="comId" ></component>
</template>
<script setup lang="ts">
import { reactive,shallowRef,markRaw,defineAsyncComponent } from "vue";
// const comId = shallowRef('');
const comId = shallowRef(defineAsyncComponent(() => import('./page/TronLink1.vue')));
const data = reactive([
  {name:'插槽',com:markRaw(defineAsyncComponent(() => import('./page/插槽.vue')))},
  {name:'Tree',com:markRaw(defineAsyncComponent(() => import('./page/Tree.vue')))},
  {name:'vModel双向同步',com:markRaw(defineAsyncComponent(() => import('./page/vModel双向同步.vue')))},
  {name:'传送组件',com:markRaw(defineAsyncComponent(() => import('./page/传送组件.vue')))},
  {name:'兄弟组件Bus传参',com:markRaw(defineAsyncComponent(() => import('./page/兄弟组件Bus传参.vue')))},
  {name:'动态组件',com:markRaw(defineAsyncComponent(() => import('./page/动态组件.vue')))},
  {name:'异步组件',com:markRaw(defineAsyncComponent(() => import('./page/异步组件.vue')))},
  {name:'缓存组件',com:markRaw(defineAsyncComponent(() => import('./page/缓存组件.vue')))},
  {name:'适配rem',com:markRaw(defineAsyncComponent(() => import('./page/适配rem.vue')))},
  {name:'适配vw',com:markRaw(defineAsyncComponent(() => import('./page/适配vw.vue')))},
  {name:'TronLink1',com:markRaw(defineAsyncComponent(() => import('./page/TronLink1.vue')))},
  {name:'TronLink',com:markRaw(defineAsyncComponent(() => import('./page/TronLink.vue')))},
])
const onTab = (item:any,index:number)=>{
  console.log( item, index);
  comId.value = item.com
}
</script>
<style>

</style>

