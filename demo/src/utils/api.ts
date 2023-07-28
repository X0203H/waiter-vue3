// api.ts
import service from "./service";
// const baseurl = import.meta.env.VITE_APP_API; // 后台地址

/**
 * 封装get请求
 * @param {string} url 请求连接
 * @param {Object} params 请求参数
 * @param {Object} header 请求的header头
 */
export const get = (url: string, params: object): any => {
    return service({
        url: url,
        method: "get",
        params: params,
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
    });
};

/**
 * 封装post请求
 * @param {string} url 请求连接
 * @param {Object} data 请求参数
 * @param {Object} header 请求的header头
 */
export const post = (url: string, data: object): any => {
    return service({
        url: url,
        method: "post",
        data: data,
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
    });
};
