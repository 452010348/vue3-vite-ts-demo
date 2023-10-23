

<template>
  <button v-for="(item,idnex) in data" @click="onTab(item,idnex)">{{ item.name }}</button>
  <component :is="comId" ></component>
</template>
<script setup lang="ts">
import { reactive,shallowRef,markRaw } from "vue";

import HelloWorld from './components/HelloWorld.vue'
import Tree from './components/Tree.vue';
import 传送组件 from './components/传送组件.vue';
import 缓存组件 from './components/缓存组件.vue';
import 兄弟组件Bus传参 from './components/兄弟组件Bus传参.vue';
import vModel双向同步 from './components/vModel双向同步.vue';
const comId = shallowRef(HelloWorld);
const data = reactive([
  {name:'HelloWorld',com:markRaw(HelloWorld)},
  {name:'Tree',com:markRaw(Tree)},
  {name:'传送组件',com:markRaw(传送组件)},
  {name:'缓存组件',com:markRaw(缓存组件)},
  {name:'兄弟组件Bus传参',com:markRaw(兄弟组件Bus传参)},
  {name:'vModel双向同步',com:markRaw(vModel双向同步)},
])
const onTab = (item,index)=>{
  console.log( item, index);
  comId.value = item.com
}
</script>

