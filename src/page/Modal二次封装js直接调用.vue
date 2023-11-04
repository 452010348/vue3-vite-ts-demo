<template>
  <div>
    <Button type="primary" @click="Modal.onOpen()">Open Modal</Button>
  </div>
</template>
<script setup lang="ts">
import { onUnmounted } from "vue";
import { Button } from 'ant-design-vue' 
import { useModal } from '../components/Modal/index'
const Modal = useModal(false)
// 组件销毁时触发
onUnmounted(() => {
  console.log('666 onUnmounted')
  Modal.onDestroy()
})
</script>