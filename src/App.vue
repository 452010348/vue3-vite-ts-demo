<template v-if="condition">
  <button v-for="(item, idnex) in data" @click="onTab(item, idnex)">{{ item.name }}</button>
  <component :is="comId"></component>
</template>
<script setup lang="ts">
import { reactive, shallowRef, markRaw, defineAsyncComponent } from 'vue';
// const comId = shallowRef('');
const comId = shallowRef(defineAsyncComponent(() => import('./page/ethereum3_Sepolia.vue')));
// const comId = shallowRef(defineAsyncComponent(() => import('./page/TronLink2.vue')));
const data = reactive([
  { name: '插槽', com: markRaw(defineAsyncComponent(() => import('./page/插槽.vue'))) },
  { name: 'Tree', com: markRaw(defineAsyncComponent(() => import('./page/Tree.vue'))) },
  { name: 'vModel双向同步', com: markRaw(defineAsyncComponent(() => import('./page/vModel双向同步.vue'))) },
  { name: '传送组件', com: markRaw(defineAsyncComponent(() => import('./page/传送组件.vue'))) },
  { name: '兄弟组件Bus传参', com: markRaw(defineAsyncComponent(() => import('./page/兄弟组件Bus传参.vue'))) },
  { name: '动态组件', com: markRaw(defineAsyncComponent(() => import('./page/动态组件.vue'))) },
  { name: '异步组件', com: markRaw(defineAsyncComponent(() => import('./page/异步组件.vue'))) },
  { name: '缓存组件', com: markRaw(defineAsyncComponent(() => import('./page/缓存组件.vue'))) },
  { name: '适配rem', com: markRaw(defineAsyncComponent(() => import('./page/适配rem.vue'))) },
  { name: '适配vw', com: markRaw(defineAsyncComponent(() => import('./page/适配vw.vue'))) },
  { name: 'TronLink1', com: markRaw(defineAsyncComponent(() => import('./page/TronLink1.vue'))) },
  { name: 'TronLink', com: markRaw(defineAsyncComponent(() => import('./page/TronLink.vue'))) },
  { name: 'TronLink2', com: markRaw(defineAsyncComponent(() => import('./page/TronLink2.vue'))) },

  { name: 'ethereum', com: markRaw(defineAsyncComponent(() => import('./page/ethereum.vue'))) },
  { name: 'ethereum2', com: markRaw(defineAsyncComponent(() => import('./page/ethereum2.vue'))) },
  { name: 'ethereum3', com: markRaw(defineAsyncComponent(() => import('./page/ethereum3.vue'))) },
  { name: 'ethereum3_Sepolia', com: markRaw(defineAsyncComponent(() => import('./page/ethereum3_Sepolia.vue'))) },
  {
    name: 'Modal二次封装js直接调用',
    com: markRaw(defineAsyncComponent(() => import('./page/Modal二次封装js直接调用.vue'))),
  },
  { name: '网格布局grid响应式', com: markRaw(defineAsyncComponent(() => import('./page/网格布局grid响应式.vue'))) },
]);
const onTab = (item: any, index: number) => {
  console.log(item, index);
  comId.value = item.com;
};
</script>
<style></style>
