<template>
  <Modal v-model:visible="visible" :footer="null" :maskClosable="false" @cancel="onClose">
    <button @click="onParentFn">触发父组件方法</button>
  </Modal> 
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Modal } from 'ant-design-vue' 
const  visible = ref<boolean>(true);

import { defineEmits } from 'vue'
const emit = defineEmits(['ParentFn'])
function onParentFn() {
  console.log("666 内层 onParentFn")
  emit('ParentFn')
};
/** 弹窗打开 */
function onOpen(){
  console.log('666 内层 onOpen')
  visible.value = true
}
/** 弹窗关闭 */
function onClose() {
  console.log('666 内层 onClose')
  visible.value = false
}
/** 子组件暴露给父组件调用 */
defineExpose({
  onClose,
  onOpen,
})
</script>