<template>
  <div>isShow: {{ isShow }}</div>
  <div>textVal: {{ text }}</div>
  <button @click="isShow = !isShow">开关</button>
  <vModel v-model="isShow" v-model:textVal="text"></vModel>
</template>
<script setup lang="ts">
import { ref } from "vue";
import vModel from "../components/vModel双向同步子.vue";
const isShow = ref<boolean>(true);
const text = ref<string>("666");
</script>