<template>
  <div>
    <el-container style="height:100%">
      <el-header class="el-header header ">
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
        <div class="right"></div>
      </el-header>
      <el-container>
        <el-aside>
          <el-menu
            :default-active="defaultActive"
            class="el-menu-vertical-demo"
            router
            :collapse="isCollapse"
          >
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
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import { gettoken } from '../../utils/token';
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      isCollapse: false,
      defaultActive: '/layout/chart',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // 把当前地址栏中的路径给到default-active中 对应选中的index
    this.defaultActive = this.$route.path;
  },
  methods: {
    closeMenu() {},
  },
};
</script>

<style lang="less">
.header {
  justify-content: space-between;
  border-bottom: 1px solid #f9f9f9;
  height: 60px;
  display: flex;

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
  }
}
.el-menu-vertical-demo {
  width: 200px;
  min-height: 400px;
}
</style>
