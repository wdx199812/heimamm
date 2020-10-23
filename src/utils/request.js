import Vue from 'vue';
import axios from 'axios';
// 设置axios请求允许携带cookie
axios.defaults.withCredentials = true; //配置为true
// 设置基准路径
// 开发环境基地址
axios.defaults.baseURL = process.env.VUE_APP_BASEURL;

// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response.data;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
// 把axios添加到vue原型中
Vue.prototype.$http = axios;
