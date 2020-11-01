<template>
  <div class="question-edit">
    <el-dialog :visible.sync="dialogVisible" center fullscreen>
      <div class="title" slot="title">
        {{ mode === 'add' ? '新增题目' : '修改题目' }}
      </div>
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="120px"
        label-position="left"
        :inline="false"
        size="normal"
        class="form"
      >
        <!-- 学科 -->
        <el-form-item label="学科" prop="subject">
          <el-select
            v-model="form.subject"
            placeholder="请选择学科"
            class="select"
          >
            <el-option
              v-for="item in subjectList"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="阶段" prop="step">
          <el-select
            class="select"
            v-model="form.step"
            value-key=""
            placeholder="请选择阶段"
          >
            <el-option
              v-for="item in steps"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业" prop="enterprise">
          <el-select
            v-model="form.enterprise"
            placeholder="请选择企业"
            class="select"
          >
            <el-option
              v-for="item in erterpriseList"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 城市？ -->
        <el-form-item label="城市" prop="city">
          <el-cascader
            v-model="form.city"
            :options="options"
            :props="{ value: 'label' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <!-- 单选框 -->
        <el-form-item label="题型" prop="type">
          <template>
            <el-radio-group v-model="form.type">
              <el-radio
                v-for="item in typies"
                :key="item.value"
                :label="item.value"
                @change="typechange"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </template>
        </el-form-item>
        <!-- 多选 -->
        <el-form-item label="难度" prop="difficulty">
          <template>
            <el-radio-group v-model="form.difficulty">
              <el-radio
                v-for="item in difficultys"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </template>
        </el-form-item>
        <hr />
        <!-- 富文本 -->
        <el-form-item
          label="试题标题"
          prop="title"
          class="setMargin"
          size="normal"
        >
          <quill-editor
            ref="myQuillEditor"
            v-model="form.title"
            :options="editorOption"
            @blur="onEditorChange('title')"
          />
          <!-- @change="onEditorChange($event)" -->
        </el-form-item>
        <!-- 题型选项 单选 多选 简答-->
        <el-form-item :label="typeData[form.type]" :prop="propsData[form.type]">
          <question-type :form="form"></question-type>
        </el-form-item>
        <hr />
        <!-- 答案解析 -->
        <el-form-item
          label="答案解析"
          prop="answer_analyze"
          class="setMargin"
          size="normal"
        >
          <quill-editor
            :content="form.answer_analyze"
            v-model="form.answer_analyze"
            :options="editorOption"
            class="textBlock"
            @change="onEditorChange('answer_analyze')"
          />
        </el-form-item>
        <hr />
        <!-- 解析视频 -->
        <el-form-item label="解析视频" size="normal">
          <upload-file class="setMargin" type="video" :obj="form"></upload-file>
        </el-form-item>
        <el-form-item
          style="margin-top:20px"
          label="试题备注"
          size="normal"
          prop="remark"
        >
          <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
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
// 导入省市区三级联动（不带全部）
import { regionData } from 'element-china-area-data';
// 富文本
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import QuestionType from './Question-type';
// 上传组件
import UploadFile from './Upload-file';
export default {
  name: 'questionAddorEdit',
  components: { quillEditor, QuestionType, UploadFile },
  created() {
    this.options = regionData;
  },
  props: {
    // 接收到父组件的传值
    subjectList: {
      type: Array,
      default: () => {
        return {};
      },
    },
    erterpriseList: {
      type: Array,
      default: () => {
        return {};
      },
    },
    statuses: {
      type: Array,
      default: () => {
        return {};
      },
    },
    typies: {
      type: Array,
      default: () => {
        return {};
      },
    },
    steps: {
      type: Array,
      default: () => {
        return {};
      },
    },
    difficultys: {
      type: Array,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      // 根据题型来选择显示不同的选项
      typeData: { 1: '单选', 2: '多选', 3: '简答' },
      // 验证规则
      propsData: {
        1: 'single_select_answer',
        2: 'multiple_select_answer',
        3: 'short_answer',
      },
      // quill-edit
      quillValidate: '',
      // city
      options: regionData,
      titleText: '', //编辑新增dialog框title显示的文字
      dialogVisible: false, //是否显示dialog
      mode: '', //约定模式 add为新增 edit为编辑
      form: {
        title: '', //标题
        subject: '', //学科id标识
        step: '', //阶段1、初级 2、中级 3、高级
        enterprise: '', //企业id标识
        city: [], // array 	[省、市、区县]
        type: 1, // 题型 1单选 、2多选 、3简答
        difficulty: 1, //	题目难度 1简单 、2一般 、3困难
        single_select_answer: '', //单选题答案
        multiple_select_answer: [], // array 	多选题答案
        short_answer: '', // 	简答题答案
        video: '', // 解析视频地址
        answer_analyze: '', // 	答案解析
        remark: '', // 答案备注
        select_options: [
          {
            label: 'A',
            text: '狗不理',
            image: '',
          },
          {
            label: 'B',
            text: '猫不理',
            image: '',
          },
          {
            label: 'C',
            text: '麻花',
            image: '',
          },
          {
            label: 'D',
            text: '炸酱面',
            image: '',
          },
        ], //array 	选项，介绍，图片介绍
      },
      // 校验规则
      rules: {
        title: [
          {
            required: true,
            message: '标题不能为空',
            trigger: 'change',
          },
        ],
        subject: [
          { required: true, message: '学科不能为空', trigger: 'change' },
        ],
        step: [{ required: true, message: '阶段不能为空', trigger: 'change' }],
        enterprise: [
          { required: true, message: '企业不能为空', trigger: 'change' },
        ],
        city: [{ required: true, message: '城市不能为空', trigger: 'change' }],
        type: [{ required: true, message: '题型不能为空', trigger: 'change' }],
        difficulty: [
          { required: true, message: '难度不能为空', trigger: 'change' },
        ],
        answer_analyze: [
          { required: true, message: '答案解析不能为空', trigger: 'change' },
        ],
        remark: [
          { required: true, message: '试题备注不能为空', trigger: 'blur' },
        ],
        single_select_answer: [
          { required: true, message: '单选题不能为空', trigger: 'change' },
        ],
        multiple_select_answer: [
          { required: true, message: '多选题不能为空', trigger: 'change' },
        ],
        short_answer: [
          { required: true, message: '简答题不能为空', trigger: 'blur' },
        ],
      },
      editorOption: {
        placeholder: '请在这里输入试题标题',
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
          url = '/question/add';
          message = '新增成功';
        } else if (this.mode == 'edit') {
          // 后台问题 提交时需要把 数组转换成字符串
          this.form.city = this.form.city.join(',');
          url = '/question/edit';
          message = '编辑成功';
        }
        const res = await this.$axios.post(url, this.form);
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
    // 城市
    handleChange() {
      console.log(this.form.city);
    },
    // 定义quill-editor验证规则
    //validateField()对部分表单字段进行校验的方法
    onEditorChange(val) {
      this.$refs.form.validateField(val);
    },
    // 题型选择
    typechange() {
      // 清除部分表单的校验规则
      this.$refs.form.clearValidate([
        'single_select_answer',
        'short_answer',
        'multiple_select_answer',
      ]);
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

<style lang="less">
// .el-form-item {
//   margin-bottom: 22px;
// }
// .el-form-item__label {
//   text-align: left !important;
// }
// .textFull div.el-form-item__content {
//   margin-left: 0 !important;
// }

// .textFull .el-form-item__label {
//   display: block;
//   float: none !important;
// }

// .singleGroup .singleRadio {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   width: 100%;
// }
// .edit_container {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-top: 60px;
// }
// .ql-editor {
//   height: 300px;
// }
// .setMargin {
//   margin-left: 0px !important;
//   margin-top: 40px;
// }
// .avatar-uploader {
//   text-align: left;
// }
// 如果有直接更改第三方的样式，不要加scoped
.question-edit {
  .el-dialog__header {
    padding: 0;
    text-align: left;
  }
  .title {
    color: #fff;
    padding-left: 15px;
    height: 54px;
    line-height: 54px;
    background-color: #04bcfa;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .form {
    width: 832px;
    margin: 0 auto;
    .select {
      width: 300px;
    }
  }
  .hrMargin {
    margin-bottom: 20px;
  }
  .setMargin {
    .el-form-item__content {
      margin-left: 0px !important;
      margin-top: 40px;
    }
  }
  .ql-editor {
    height: 200px;
  }
}
</style>
