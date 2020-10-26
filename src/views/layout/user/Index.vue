<template>
  <div>
    <!-- 搜索清除新增框 -->
    <el-card shadow="always">
      <el-form
        :model="userFrom"
        ref="searchForm"
        label-width="80px"
        :inline="true"
        size="normal"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="userFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="userFrom.role_id" placeholder="请选择">
            <!-- <el-option label="请选择"> </el-option> -->
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="管理员" value="2"> </el-option>
            <el-option label="老师" value="3"> </el-option>
            <el-option label="学生" value="4"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" @click="search"
            >搜索</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button size="default" @click="clearVal">清除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" @click="add"
            >+新增用户</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <!--用户列表  -->
    <el-card shadow="always" style="margin-top:20px">
      <el-table :data="userList" style="width:100%">
        <el-table-column
          type="index"
          label="序号"
          style="width:80px"
        ></el-table-column>
        <el-table-column prop="username" label="用户名" style="width:100px">
        </el-table-column>
        <el-table-column prop="phone" label="电话"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="remark" label="备注"> </el-table-column>
        <!-- 使用作用域插槽 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" style="color:#409eff">启用</span>
            <span v-if="scope.row.status == 0" style="color:#de2f27">禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button
              :type="scope.row.status === 1 ? 'info' : 'success'"
              @click="setStatus(scope.row.id)"
              >{{ scope.row.status === 1 ? '禁用' : '启用' }}</el-button
            >
            <el-button
              type="default"
              @click="deleteUser(scope.row.username, scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination" style="margin-top:15px;text-align:center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
          <!-- total 总条数 -->
        </el-pagination>
      </div>
    </el-card>
    <!-- 新增or编辑子组件 -->
    <add-or-update ref="addOrUpdateRef"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './Add-or-update';
export default {
  name: 'UserList',
  components: {
    AddOrUpdate,
  },
  props: {},
  data() {
    return {
      // 搜索表单
      userFrom: {
        username: '', //用户名
        email: '', //邮箱
        role_id: '', //角色 1超级管理员 2.管理员 3.老师 4.学生
      },
      page: 1, //页码 默认1
      limit: 5, //页尺寸（显示条数）默认10
      total: 0, //总条数
      // 用户列表表
      userList: [],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getuserListData();
  },
  methods: {
    async getuserListData() {
      const res = await this.$axios.get('/user/list', {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.userFrom, //三位运算符
          // 等于 username：this。userForm.username 等所有属性
        },
      });
      // console.log(res.data.items);
      if (res.code == 200) {
        // 获得的所有用户信息 直接赋值到userList数组中
        this.userList = res.data.items;
        this.total = res.data.pagination.total;
      }
    },
    // 分页
    // 每页显示数
    handleSizeChange(val) {
      this.limit = val;
      // console.log(`每页 ${val} 条`);
      this.search();
    },
    // 分页条
    handleCurrentChange(val) {
      this.page = val;
      // console.log(`当前页: ${val}`);
      this.getuserListData();
    },
    // 搜索
    search() {
      this.page = 1;
      this.getuserListData();
    },
    // 清空表单
    clearVal() {
      this.page = 1;
      this.$refs.searchForm.resetFields();
    },
    // 更改当前状态
    async setStatus(id) {
      const res = await this.$axios.post('/user/status', { id });
      if (res.code == 200) {
        this.$message({ message: '状态修改成功', type: 'success' });
        this.search();
      } else {
        this.$message.error('状态修改失败');
      }
    },
    // 删除
    async deleteUser(username, id) {
      const res = await this.$axios.post('/user/remove', { id });
      // console.log(res);
      if (res.code == 200) {
        this.$confirm(`你确定要删除用户 ${username} 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            // 刷新页面
            this.search();
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            });
          });
      }
    },
    // 新增
    add() {
      this.$refs.addOrUpdateRef.mode = 'add';
      this.$refs.addOrUpdateRef.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdateRef.$refs.form.resetFields();
      });
    },
    // 编辑
    edit(forms) {
      // console.log(form);
      // 把mode改为edit 即dialog的title显示 编辑用户
      this.$refs.addOrUpdateRef.mode = 'edit';
      // 显示dialog
      this.$refs.addOrUpdateRef.dialogVisible = true;
      // 深拷贝
      this.$refs.addOrUpdateRef.form = JSON.parse(JSON.stringify(forms));
      // 拿到子组件的dom元素 移除表单的校检结果，传入待移除的表单项的prop属性或prop组成的数组 ，不传则移除整个表单的校检结果
      // this.$refs.addOrUpdateRef.$refs.form.clearValidate();
      this.$nextTick(() => {
        this.$refs.addOrUpdateRef.$refs.form.clearValidate();
      });
    },
  },
};
</script>

<style scoped lang="less"></style>
