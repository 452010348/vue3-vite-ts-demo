<template>
	<div>
		<div :key="index" v-for="(item, index) in data">
			<div @click.stop='clickItem(item,$event)'>{{ item.name }}
				<input type="text" v-model="item.name">
			</div>
			<Tree @on-click='clickItem' v-if='item?.children?.length' :data="item.children"></Tree>
		</div>
	</div>
</template>
<script lang="ts">
// 方式一 Tree.vue 文件名就是组件名
// 方式二 定义子组件名称  { name: "Tree" } 防止文件动态被改变导致组件调用错误
export default { name: "Tree" }
</script>
<script setup lang="ts">
// 在vue3语法糖模式中是不需要引入vue的 withDefaults,defineProps 方法的

interface Tree {
  name: string;
  children?: Tree[];
}


// 接收父数据
const props = withDefaults(defineProps<{
  data?: Tree[],
}>(), {
	// 为 data 属性设置默认值 []
  data:[
		{
			name: "no.1",
			children: [
				{
					name: "no.1-1",
					children: [
						{
							name: "no.1-1-1",
						},
					],
				},
			],
		},
		{
			name: "no.2",
			children: [
				{
					name: "no.2-1",
				},
			],
		},
		{
			name: "no.3",
		},
	], 
});
// 点击时间
const clickItem = (item:Tree,$event:MouseEvent):void => {
	console.log( item, $event, props.data[0].name )
}


</script>

