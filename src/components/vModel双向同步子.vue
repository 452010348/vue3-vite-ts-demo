<template>
  <div v-if="modelValue" style="background: #ccc;width: 500px;height: 500px;">
    <button @click="onClose">关闭</button>
    <h2>我是子组件</h2>
    <input type="text" :value="textVal" @input="change">
  </div>
</template>
<script setup lang="ts">
 withDefaults(defineProps<{
  modelValue?: boolean | number | string;
  textVal?:string,
}>(), {
  modelValue: true,
  textVal:""
});
const emit = defineEmits(['update:modelValue','update:textVal'])
const onClose = ()=>{
  emit('update:modelValue',false)
}
const change = (e:Event)=>{
  const target = e.target as HTMLInputElement;
  emit('update:textVal',target.value);
}

</script>