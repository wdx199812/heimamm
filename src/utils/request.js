import Vue from 'vue';
import axios from 'axios';
import router from '../router';
// 设置axios请求允许携带cookie
axios.defaults.withCredentials = true; //配置为true
// 设置基准路径
// 开发环境基地址
axios.defaults.baseURL = process.env.VUE_APP_BASEURL;

// 获取token的值在请求拦截器中统一设置
import { gettoken, removetoken } from './token';
// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // 有token就直接在请求头中添加token
    const token = gettoken();
    if (token) {
      config.headers.token = token;
    }
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
    // 当code码为206时表示token已经过期
    if (response.data.code == 206) {
      // 移除token
      removetoken();
      // 跳转到登录页面
      router.push('/login');
      // 不返回数据 直接return 结束执行下面代码
      return;
    }
    // 对响应数据做点什么
    return response.data;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
// 把axios添加到vue原型中
Vue.prototype.$axios = axios;
