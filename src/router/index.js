// 导包
import Vue from 'vue';
import vueRouter from 'vue-router';
// 是有路由
Vue.use(vueRouter);
// 导入组件
import Login from '@/views/login/Login';
import Register from '@/views/login/Register';
import Welcome from '@/views/layout/welcome/Index';
import NotFound from '@/views/NotFound';
// 路由实例化
const router = new vueRouter({
  // 在vue实例中配置路由规则
  routes: [
    { path: '/login', component: Login },
    // 重定向
    { path: '/', redirect: '/login' },
    { path: '/register', component: Register },
    { path: '/welcome', component: Welcome },
    { path: '*', component: NotFound },
  ],
});
// 导出路由
export default router;
