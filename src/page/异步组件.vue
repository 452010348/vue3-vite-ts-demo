
<template>
  <div>
    <h1>还没有做好</h1>
    <Suspense>
      <template #default><Sync></Sync></template>
      <template #fallback><Skeleton></Skeleton></template>
    </Suspense>
  </div>
</template>
<script setup lang="ts">
// import { defineAsyncComponent } from 'vue'
// // 骨架屏
// import Skeleton from "Skeleton.vue"
// // 异步组件简写模式
// const Sync = defineAsyncComponent(() => import('./Sync.vue'))
/*
//完整写法
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),
 
  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,
 
  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000
})
*/
</script>