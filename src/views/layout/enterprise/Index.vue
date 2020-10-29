<template>
  <div>
    <!-- 搜索清除新增框 -->
    <el-card shadow="always">
      <el-form
        :model="form"
        ref="searchForm"
        label-width="80px"
        :inline="true"
        size="normal"
      >
        <el-form-item label="企业编号" prop="eid">
          <el-input style="width:150px;" v-model="form.eid"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input style="width:150px;" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input style="width:150px;" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            style="width:150px;"
            v-model="form.status"
            placeholder="请选择状态"
          >
            <el-option
              v-for="item in statuses"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
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
            >+新增企业</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <!--用户列表  -->
    <el-card shadow="always" style="margin-top:20px">
      <el-table :data="List" style="width:100%">
        <el-table-column
          type="index"
          label="序号"
          style="width:80px"
        ></el-table-column>
        <el-table-column prop="eid" label="企业编号" width="120">
        </el-table-column>
        <el-table-column prop="name" label="企业名称"> </el-table-column>
        <el-table-column prop="short_name" label="企业简称"> </el-table-column>
        <el-table-column prop="username" label="创建者"> </el-table-column>
        <el-table-column prop="create_time" label="创建日期"> </el-table-column>
        <!-- 使用作用域插槽 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" style="color:#409eff">启用</span>
            <span v-if="scope.row.status == 0" style="color:#de2f27">禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button
              :type="scope.row.status === 1 ? 'info' : 'success'"
              @click="setStatus(scope.row.id)"
              >{{ scope.row.status === 1 ? '禁用' : '启用' }}</el-button
            >
            <el-button
              type="default"
              @click="deleteUser(scope.row.name, scope.row.id)"
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
  name: 'enterprise',
  components: {
    AddOrUpdate,
  },
  props: {},
  data() {
    return {
      // 搜索表单
      form: {
        eid: '', //企业编号
        name: '', //企业名称
        username: '', //创建者
        status: '', //状态
      },
      page: 1, //页码 默认1
      limit: 5, //页尺寸（显示条数）默认10
      total: 0, //总条数
      // 用户列表
      List: [],
      // 状态
      statuses: [
        { value: 1, label: '启用' },
        { value: 0, label: '禁用' },
      ],
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
      const res = await this.$axios.get('/enterprise/list', {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.form, //三位运算符
          // 等于 username：this。userForm.username 等所有属性
        },
      });
      if (res.code == 200) {
        // 获得的所有用户信息 直接赋值到userList数组中
        this.List = res.data.items;
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
      this.search();
    },
    // 更改当前状态
    async setStatus(id) {
      const res = await this.$axios.post('/enterprise/status', { id });
      if (res.code == 200) {
        this.$message({ message: '状态修改成功', type: 'success' });
        this.search();
      } else {
        this.$message.error('状态修改失败');
      }
    },
    // 删除
    deleteUser(name, id) {
      // console.log(res);

      this.$confirm(`你确定要删除当前企业吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await this.$axios.post('/enterprise/remove', { id });
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            // 刷新页面
            this.search();
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    // 新增
    add() {
      this.$refs.addOrUpdateRef.mode = 'add';
      this.$refs.addOrUpdateRef.dialogVisible = true;
      this.$refs.addOrUpdateRef.form = {
        eid: '', //企业编号
        name: '', //企业名称
        short_name: '', //企业简称
        intro: '', //企业简介
        remark: '', //企业备注
      };
      this.$nextTick(() => {
        // 清空校检规则
        this.$refs.addOrUpdateRef.$refs.form.clearValidate();
      });
    },
    // 编辑
    edit(forms) {
      console.log(forms);
      // 把mode改为edit 即dialog的title显示 编辑用户
      this.$refs.addOrUpdateRef.mode = 'edit';
      // 显示dialog
      this.$refs.addOrUpdateRef.dialogVisible = true;
      // 深拷贝   或者 {...form}
      this.$refs.addOrUpdateRef.form = JSON.parse(JSON.stringify(forms));
    },
  },
};
</script>

<style scoped lang="less"></style>
