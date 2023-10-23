<template>
  <div style="background-color: beige;width: 500px;height: 500px;">
    <h2>B组件</h2>
    {{  time }}
  </div>
</template>
<script setup lang="ts">
import Bus from '../Bus';
import { ref } from 'vue';
const time = ref(Date.now());
Bus.on("on-click",(e)=>{
  console.log( e );
  time.value = e;
});
</script>