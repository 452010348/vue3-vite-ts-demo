import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.min.css'
// import 'virtual:uno.css';
import "tailwindcss/tailwind.css"


import App from './App.vue';
const app = createApp(App);
app.use(Antd);
app.mount('#app');



