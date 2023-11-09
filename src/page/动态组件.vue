<template>
  <button v-for="(item, idnex) in data" @click="onTab(item, idnex)">{{ item.name }}</button>
  <component :is="comId"></component>
</template>
<script setup lang="ts">
// 加上 shallowRef, markRaw 能节约性能 ，并且浏览器再也不警告提示
import { reactive, shallowRef, markRaw } from 'vue';
import A from './插槽.vue';
import B from './传送组件.vue';
const comId = shallowRef(A);
const data = reactive([
  { name: 'A组件', com: markRaw(A) },
  { name: 'B组件', com: markRaw(B) },
]);
const onTab = (item: any, index: number) => {
  console.log(item, index);
  comId.value = item.com;
};
</script>
