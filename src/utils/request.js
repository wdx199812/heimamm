import Vue from 'vue';
import axios from 'axios';
// 设置基准路径
// 开发环境基地址
axios.defaults.baseURL = process.env.VUE_APP_BASEURL;
// 把axios添加到vue原型中
Vue.prototype.$http = axios;
