// 导入axios对象
import axios from "axios"
import store from "../store"

// 2.用axios创建一个axios的实例
const Server = axios.create({
    baseURL: process.env.VUE_APP_SERVER_API, //根域名
    timeout: 5000, //超时时间
})

// 3.定义请求拦截器
Server.interceptors.request.use((config) => {
    return config
}), (error) => {
    return Promise.reject(error)
}

// 定义相应拦截器
Server.interceptors.response.use((response) => {
    // 过滤响应回来的数据，取出data中的值
    if (response.status == 200) {
        return response.data
    }
    
}), (error) => {
    return Promise.reject(error)
}

// 定义抛出对象
export default Server