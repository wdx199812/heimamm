// 导包
import Vue from 'vue';
import vueRouter from 'vue-router';
// 是有路由
Vue.use(vueRouter);
// 导入组件
import Login from '@/views/login/Login';
import Layout from '@/views/layout/Index';
import Chart from '@/views/layout/chart/Index';
import Question from '@/views/layout/question/Index';
import Subject from '@/views/layout/subject/Index';
import User from '@/views/layout/user/Index';
import Enterprise from '@/views/layout/enterprise/Index';
import NotFound from '@/views/404/NotFound';

// 按需导入导入获取token的函数
import { gettoken } from '../utils/token';
// 路由实例化
const router = new vueRouter({
  // 在vue实例中配置路由规则
  routes: [
    { path: '/login', component: Login },
    // 重定向
    { path: '/', redirect: '/login' },
    {
      path: '/layout',
      component: Layout,
      redirect: '/layout/chart',
      children: [
        { path: 'chart', component: Chart },
        { path: 'question', component: Question },
        { path: 'subject', component: Subject },
        { path: 'user', component: User },
        { path: 'enterprise', component: Enterprise },
      ],
    },
    { path: '*', component: NotFound },
  ],
});
// 路由守卫、
// 导航守卫
/**
 * 这个回调函数，在每次路由切换之前（无论是声明式导航，还是编程式导航）都会执行这个方法
 *
 * 参数1：to 表示你要去的路径
 * 参数2：from 你上一次的路径
 * 参数3：next 代表放行以及跳转指定的页面
 */
router.beforeEach((to, from, next) => {
  // 要去的路径为登录页的直接放行
  if (to.path == '/login') {
    next();
  } else {
    // 获取当前登录状态
    const token = gettoken();
    // 有登录状态则直接放行
    if (token) {
      next();
    } else {
      // 没有登录状态的话就饿跳转到登录页
      next('/login');
    }
  }
});
// 导出路由
export default router;
