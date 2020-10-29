<template>
  <div>
    <el-dialog
      :title="mode == 'add' ? '新增用户' : '编辑用户'"
      :visible.sync="dialogVisible"
      width="600px"
      center
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="80px"
        :inline="false"
        size="normal"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="form.role_id" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="item in statuses"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户备注" prop="remark">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'userAddOrUpdate',
  components: {},
  props: {},
  data() {
    return {
      titleText: '', //编辑新增dialog框title显示的文字
      dialogVisible: false, //是否显示dialog
      mode: '', //约定模式 add为新增 edit为编辑
      form: {
        id: '', //id
        username: '', //用户名
        email: '', //邮箱
        phone: '', //电话
        role_id: '1', //角色
        status: '', //状态
        remark: '', //备注
      },
      avatar: '', //头像
      password: '', //密码
      // 角色
      roles: [
        { value: 1, label: '超级管理员' },
        { value: 2, label: '管理员' },
        { value: 3, label: '老师' },
        { value: 4, label: '学生' },
      ],
      // 状态
      statuses: [
        { value: 1, label: '启用' },
        { value: 0, label: '禁用' },
      ],
      // 校验规则
      rules: {
        username: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        email: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('邮箱不能为空'));
              }
              /**/
              // 局部关闭eslint代码检查
              /* eslint-disable */
              const reg = /[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
              // 打开eslint代码检查
              /* eslint-enable */
              if (!reg.test(value)) {
                return callback(new Error('邮箱不合法'));
              }
              callback();
            },
            trigger: 'blur',
          },
        ],
        phone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('手机号不能为空'));
              }
              if (!/^1[3456789][0-9]{9}$/.test(value)) {
                return callback(new Error('手机号不合法'));
              }
              callback();
            },
            trigger: 'blur',
          },
        ],
        role_id: [{ required: true, message: '请选择角色', trigger: 'change' }],
      },
    };
  },
  methods: {
    // 提交按钮
    submit() {
      // 验证form表单
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        let url = '';
        let message = '';
        // 新增
        if (this.mode == 'add') {
          delete this.form.id;
          url = '/user/add';
          message = '新增成功';
        } else if (this.mode == 'edit') {
          url = '/user/edit';
          message = '编辑成功';
        }
        const res = await this.$axios.post(url, { ...this.form });
        // console.log(res);
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message,
          });
          // 隐藏dialog
          this.dialogVisible = false;
          // 重新加载页面 直接调用父组件的 search方法重新渲染页面
          this.$parent.search();
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
  watch: {
    // 监听dialog框的显示和隐藏从而 清空表单内元素和移除校检属性
    dialogVisible(newvalue) {
      if (!newvalue) {
        this.$refs.form.clearValidate();
      }
    },
  },
};
</script>

<style scoped lang="less"></style>
