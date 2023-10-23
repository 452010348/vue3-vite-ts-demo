

<template>
  <div>
    <button type="button" @click="count++">count is {{ count }}</button>
    <AA :num="count">
      <template #header><img src="/vite.svg" class="logo" alt="Vite logo" /></template>
      <template #default="{data}" >
        <p>{{data}}</p>
      </template>
      <template #footer><img src="../assets/vue.svg" class="logo vue" alt="Vue logo" /></template>
    </AA>
  </div>
</template>

<script setup lang="ts">
import AA from "./插槽.vue"
import { ref } from 'vue'
const count = ref(0)
</script>