import Vue from 'vue';
import App from './App.vue';

// 导入路由
import router from './router';
Vue.config.productionTip = false;

// 导入axios
import './utils/request';
// 导入elementui组件
import './plugins/element';
// 导入全局样式包
import './styles/base.less';
new Vue({
  render: (h) => h(App),
  // 挂载到vue实例中 让vue拥有全局路由功能
  router,
}).$mount('#app');
