<template>
  <button @click="emitB">A组件 - 派发一个事件</button>
</template>
<script setup lang="ts">
import Bus from '../Bus';
const emitB = () => {
  Bus.emit('on-click', Date.now());
};
</script>
