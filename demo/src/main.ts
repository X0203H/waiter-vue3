// @ts-ignore
import {createApp} from 'vue'

const app = createApp(App)
// import './style.css'
import App from './App.vue'
// 引入路由
import router from "./router";
// 引入大菠萝
// import createPersistedState from 'vuex-persistedstate';
import {createPinia} from "pinia";

const pinia = createPinia()
// 数据持久化插件
// pinia.use(createPersistedState({
//     storage: window.sessionStorage,
//     key: 'pinia',
// }));
// 引入ant-design-vue组件库
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css'
import STable from '@surely-vue/table';
// import '@surely-vue/table/src/style/antdv.less';
// 引入echarts组件库
import * as echarts from 'echarts'

app.config.globalProperties.$echarts = echarts
app.use(router).use(pinia).use(Antd).use(STable).mount('#app')
