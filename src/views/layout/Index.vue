<template>
  <el-container>
    <el-header class=" header ">
      <div class="left">
        <i
          class="el-icon-s-fold setheight"
          @click="isCollapse = !isCollapse"
          style="cursor: pointer;"
        ></i
        ><img
          src="../../assets/layout_icon.png"
          alt=""
          class="marginlr cc_cursor"
        /><span class="title">黑马面面</span>
      </div>
      <div class="right">
        <div class="right">
          <img :src="avatar" alt="" /><span class="name cc_cursor"
            >{{ username }} 欢迎您</span
          ><button
            type="button"
            class="el-button el-button--primary"
            @click="loginout"
          >
            <!----><!----><span>退出</span>
          </button>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          router
          :collapse="isCollapse"
        >
          <div
            v-for="item in $router.options.routes[2].children"
            :key="item.meta.fullpath"
          >
            <el-menu-item
              :index="item.meta.fullpath"
              v-if="item.meta.roles.includes(rolename)"
            >
              <i :class="item.meta.icon"></i>
              <span slot="title">{{ item.meta.title }}</span>
            </el-menu-item>
          </div>
          <!-- <el-menu-item index="/layout/welcome">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="/layout/chart">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据预览</span>
          </el-menu-item>
          <el-menu-item index="/layout/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/enterprise">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/question">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/subject">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item> -->
        </el-menu>
      </el-aside>
      <el-main class=" main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removetoken } from '../../utils/token';
import { gettoken } from '../../utils/token';
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      isCollapse: false, //侧边栏是否折叠
      defaultActive: '/layout/chart', //侧边栏router对应菜单的index
      avatar: '', // header 用户头像
      username: '', //用户名
      rolename: '', //角色名   超级管理员/管理员/老师/学生
    };
  },
  computed: {},
  watch: {
    // 监听地址栏的值
    // 解决地址栏直接输入地址访问非权限的网站问题
    $route(newvalue) {
      if (!newvalue.meta.roles.includes(this.rolename)) {
        this.$message.error('对不起，你无权访问此网站');
        this.$router.push('/login');
      }
      // 把当前地址栏中的路径给到default-active中 对应选中的index
      this.defaultActive = this.$route.path;
    },
  },
  mounted() {
    // 把当前地址栏中的路径给到default-active中 对应选中的index
    this.defaultActive = this.$route.path;
    // 直接调用下面函数渲染用户名和密码
    this.getUserInfo();
  },
  methods: {
    closeMenu() {},
    // 退出登录操作
    loginout() {
      this.$confirm('你将要退出管理系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await this.$axios.get('/logout');
          if (res.code == 200) {
            this.$message({
              message: '退出成功',
              type: 'success',
            });
            removetoken();
            this.$router.push('/login');
          }
        })
        .catch(() => {});
    },
    // 登录成功后拿到token的参数
    async getUserInfo() {
      const res = await this.$axios.get('/info', {
        headers: {
          token: gettoken(),
        },
      });
      this.avatar = process.env.VUE_APP_BASEURL + '/' + res.data.avatar;
      this.username = res.data.username;
      this.rolename = res.data.role;
      // 根据登录角色信息给权限
      // 解决强制刷新的非权限访问
      if (!this.$route.meta.roles.includes(res.data.role)) {
        this.$message.error('对不起，你无权访问此网站');
        this.$router.push('/login');
      } else {
        this.$store.commit('setuserInfo', res.data);
      }
      // console.log(this.$route.meta.roles.includes(res.data.role));
    },
  },
};
</script>

<style lang="less">
.el-container {
  height: 100%;
}
.header {
  border-bottom: 1px solid #8d8c8c;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    display: flex;
    align-items: center;
    .setheight {
      font-size: 20px;
    }
    .marginlr {
      margin-left: 10px;
      margin-right: 10px;
    }
    .title {
      font-size: 22px;
      color: #49a1ff;
    }
  }
  .right {
    display: flex;
    align-items: center;
    img {
      width: 43px;
      height: 43px;
      margin-right: 9px;
      border-radius: 50%;
    }
    .name {
      margin-right: 38px;
    }
  }
}
.el-menu {
  border: none !important;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.main {
  background-color: #e6e7e9;
}
</style>
