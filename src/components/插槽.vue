<template>
  <div>
    <h2>插槽</h2>
    <slot name="header"></slot>
    <slot v-for="item in num" :data="item"></slot>
    <slot name="footer"></slot>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  num?: number | string;
}>(), {
  num: 100, //如果父组件不传值· 默认便利100次
});
</script>