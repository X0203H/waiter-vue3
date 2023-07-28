// service.ts
import axios from "axios";
import {message} from "ant-design-vue";

axios.defaults.baseURL = 'http://127.0.0.1:5000';
const service = axios.create({
    timeout: 5000, // 超时时间
    headers: {
        "Content-Type": "application/json;charset=utf-8",
    },
    validateStatus() {
        return true;
    },
});

service.interceptors.request.use(
    (config: any) => {
        // console.log("请求拦截~!");
        // 添加请求头以及其他逻辑处理(在这里判断有没有token值，有的话就放行，没有就拦住)
        const token = localStorage.getItem('token')
        if (token) {
            console.log('用户携带token值，可通过')
            config.headers.Authorization = token
        } else {
            message.loading({content: '正在将token值存到本地...', key: 'updatable'})
            setTimeout(() => {
                message.success({content: '存储完毕！', key: 'updatable', duration: 2});
            }, 1500);
        }
        return config;
    },
    (error: any) => {
        console.log(error)
        return Promise.reject(error);
    }
);

/**
 * 响应拦截器
 */
service.interceptors.response.use(
    (response: any) => {
        if (response.status !== 200) {
            console.log('网络连接失败')
        }
        return Promise.resolve(response.data)
    },
    (error: any) => {
        console.log(error)
        // Http错误状态码处理
        return Promise.reject(error);
    }
);

export default service;
