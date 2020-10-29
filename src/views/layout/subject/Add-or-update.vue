<template>
  <div>
    <el-dialog
      :title="mode == 'add' ? '新增企业' : '编辑企业'"
      :visible.sync="dialogVisible"
      width="600px"
      cnter
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="80px"
        :inline="false"
        size="normal"
      >
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="form.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="学科简称" prop="short_name">
          <el-input v-model="form.short_name"></el-input>
        </el-form-item>
        <el-form-item label="学科简介" prop="intro">
          <el-input v-model="form.intro"></el-input>
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
  name: 'subject',
  components: {},
  props: {},
  data() {
    return {
      titleText: '', //编辑新增dialog框title显示的文字
      dialogVisible: false, //是否显示dialog
      mode: '', //约定模式 add为新增 edit为编辑
      form: {
        id: '',
        rid: '', //学科编号
        name: '', //学科名称
        short_name: '', //学科简称
        intro: '', //学科简介
        remark: '', //学科备注
      },
      // 校验规则
      rules: {
        rid: [{ required: true, message: '请输入学科编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入学科名称', trigger: 'blur' }],
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
          url = '/subject/add';
          message = '新增成功';
        } else if (this.mode == 'edit') {
          url = '/subject/edit';
          message = '编辑成功';
        }
        const res = await this.$axios.post(url, { ...this.form });
        // console.log(res);
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message,
          });
          this.dialogVisible = false;
          // 清空表单
          this.$refs.form.resetFields();
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
        this.$refs.form.resetFields();
      }
    },
  },
};
</script>

<style scoped lang="less"></style>
