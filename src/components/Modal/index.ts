import type { App } from 'vue'
import { createApp } from 'vue'
import index from './index.vue'
export  { useModal }
// 定义接口
interface optings {
  childComponent: any,
  onDestroy:Function,
  onClose: Function,
  onOpen: Function,
  onParentFn: Function,
  getchildComponent: Function,
}
/**
 * 调用 模态框
 * @param isShow 是否显示
 * @returns childComponent onDestroy onClose onOpen onParentFn getchildComponent
 */
function useModal(isShow: boolean = false): optings {
  let div: HTMLDivElement | undefined, app: App, childComponent:any
  /** return 给调用者使用的方法 */
  const optings = {
    // 子组件 defineEmits emit('destroy') 调用父组件。 备注：语法 destroy 对应 onDestroy
    onDestroy(){
      if (div) {
        (app.unmount as any)(div)
        div.remove()
        div = undefined
        childComponent = null
      }
    },
    // 子组件 defineExpose 暴露的方法。备注：(千万不要在子组件 使用defineEmits emit('close') 给父组件 会死循环)
    onClose() {
      if (div) {
        //调用子组件的close方法
        childComponent.onClose()
      }
    },
    // 子组件 defineExpose 暴露的方法。备注：同上！！
    onOpen() {
      if (div === undefined) {
        div = document.createElement('div') as HTMLDivElement
        document.body.appendChild(div)
        app = createApp(index, optings)
        childComponent = app.mount(div)
      }else{
        //调用子组件的open方法
        childComponent.onOpen()
        console.log('已经存在')
      }
    },
    onParentFn(){
      console.log("666 外层 onParentFn")
    },
    // 既不是 defineEmits 也不是 defineExpose ，当前useModal2的获取组件方法
    getchildComponent(){
      return childComponent
    }
  }
  isShow && optings.onOpen()
  return {childComponent,...optings}
}