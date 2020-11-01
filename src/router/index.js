// 导包
import Vue from 'vue';
import vueRouter from 'vue-router';
// 是有路由
Vue.use(vueRouter);
// 导入组件
// import Login from '@/views/login/Login';
// import Layout from '@/views/layout/Index';
// import Chart from '@/views/layout/chart/Index';
// import Question from '@/views/layout/question/Index';
// import Subject from '@/views/layout/subject/Index';
// import User from '@/views/layout/user/Index';
// import Enterprise from '@/views/layout/enterprise/Index';
// import NotFound from '@/views/404/NotFound';
// import Welcome from '@/views/layout/welcome/Index';
// 实现路由懒加载
const Login = () => import('@/views/login/Login');
const Layout = () => import('@/views/layout/Index');
const Chart = () => import('@/views/layout/chart/Index');
const Question = () => import('@/views/layout/question/Index');
const Subject = () => import('@/views/layout/subject/Index');
const User = () => import('@/views/layout/user/Index');
const Enterprise = () => import('@/views/layout/enterprise/Index');
const NotFound = () => import('@/views/404/NotFound');
const Welcome = () => import('@/views/layout/welcome/Index');

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
      redirect: '/layout/welcome',
      children: [
        {
          path: 'welcome',
          component: Welcome,
          /* 路由元信息 只能额外携带一些参数 */
          meta: {
            roles: ['超级管理员', '管理员', '老师', '学生'],
            fullpath: '/layout/welcome',
            title: '首页',
            icon: 'el-icon-s-home',
          },
        },
        {
          path: 'chart',
          component: Chart,
          meta: {
            roles: ['超级管理员', '管理员', '老师'],
            fullpath: '/layout/chart',
            title: '数据预览',
            icon: 'el-icon-pie-chart',
          },
        },
        {
          path: 'user',
          component: User,
          meta: {
            roles: ['超级管理员', '管理员', '老师'],
            fullpath: '/layout/user',
            title: '用户列表',
            icon: 'el-icon-user',
          },
        },
        {
          path: 'subject',
          component: Subject,
          meta: {
            roles: ['超级管理员', '管理员', '老师'],
            fullpath: '/layout/enterprise',
            title: '企业列表',
            icon: 'el-icon-office-building',
          },
        },
        {
          path: 'question',
          component: Question,
          meta: {
            roles: ['超级管理员', '管理员', '老师', '学生'],
            fullpath: '/layout/question',
            title: '题库列表',
            icon: 'el-icon-edit-outline',
          },
        },
        {
          path: 'enterprise',
          component: Enterprise,
          meta: {
            roles: ['超级管理员', '管理员', '老师'],
            fullpath: '/layout/subject',
            title: '学科列表',
            icon: 'el-icon-notebook-2',
          },
        },
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
// 后置守卫
// 设置头部文字
router.afterEach((to) => {
  document.title = to.meta.title || '黑马面面后台管理';
});
// 导出路由
export default router;
