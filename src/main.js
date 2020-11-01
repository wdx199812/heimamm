import Vue from 'vue';
import App from './App.vue';
// 导入路由
import router from './router';
// 阻止生产环境消息
// 开发环境下，Vue 会提供很多警告来帮你对付常见的错误与陷阱。
// 而在生产环境下，这些警告语句却没有用，反而会增加应用的体积。
Vue.config.productionTip = false;

// 导入axios
import './utils/request';
// 导入elementui组件
import './plugins/element';
// 导入全局样式包
import './styles/base.less';
// 导入echarts
import echarts from 'echarts';
// 导入仓库
import store from './store/index';
Vue.prototype.$echarts = echarts;
new Vue({
  render: (h) => h(App),
  // 挂载到vue实例中 让vue拥有全局路由功能
  router,
  store, //注入到vue的根实例中
}).$mount('#app');
