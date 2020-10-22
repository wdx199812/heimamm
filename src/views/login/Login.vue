<template>
  <div id="app">
    <div class="login-container">
      <div class="left">
        <!-- 表单内头部文字 -->
        <div class="title-box">
          <img src="../../assets/login_icon.png" alt="" />
          <span class="title">黑马面面</span>
          <span class="line"></span>
          <span class="sub-title">用户登录</span>
        </div>
        <!-- form表单 -->
        <el-form
          style="margin-top:20px"
          :model="loginForm"
          ref="form"
          :rules="rules"
          label-width="auto"
          :inline="false"
          size="normal"
        >
          <el-form-item prop="phone">
            <el-input
              v-model="loginForm.phone"
              placeholder="请输入手机号"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              show-password
            ></el-input>
          </el-form-item>
          <!-- 验证码 -->
          <el-form-item prop="code">
            <el-row>
              <el-col :span="15" style="margin-right:8px">
                <el-input
                  v-model="loginForm.code"
                  placeholder="请输入验证码"
                  clearable
                  prefix-icon="el-icon-key"
                ></el-input>
              </el-col>
              <el-col :span="8">
                <img
                  :src="caphchaUrl"
                  alt=""
                  class="caphcha"
                  @click="getcaphcha"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <!-- duo选框 -->
          <el-form-item label="" size="normal" prop="ischecked">
            <el-checkbox v-model="loginForm.ischecked"></el-checkbox>
            我已阅读并同意<el-link type="primary" href="http://www.baidu.com"
              >用户协议</el-link
            >和<el-link type="primary" href="http://www.baidu.com"
              >隐私条款</el-link
            >
          </el-form-item>
          <el-form-item label="" size="normal">
            <el-button type="primary" style="width:100%" @click="submitForm"
              >登录</el-button
            >
          </el-form-item>
          <el-form-item label="" size="normal">
            <el-button type="primary" style="width:100%">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <img src="../../assets/login_bg.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
// 按需导入
// import { settoken } from '../../utils/token';
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        phone: '',
        password: '',
        code: '',
        ischecked: true,
      },
      caphchaUrl: `${process.env.VUE_APP_BASEURL}/captcha?type=login`,
      // 验证规则
      rules: {
        //  { required: true, message: '请输入活动名称', trigger: 'blur' },
        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        phone: [
          {
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
        password: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('密码不能为空'));
              }
              if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value))
                callback();
            },
            message: '请输入密码',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个数字字母字符',
            trigger: 'blur',
          },
        ],
        code: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('验证码不能为空'));
              }
              callback();
            },
            message: '请输入验证码',
            trigger: 'blur',
          },
        ],
        // 验证多选框
        ischecked: [
          {
            // validator 验证器
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('必须勾选用户协议'));
              }

              callback();
            },
            trigger: 'change',
          },
        ],
      },
    };
  },
  methods: {
    getcaphcha() {
      this.caphchaUrl = `${
        process.env.VUE_APP_BASEURL
      }/captcha?type=login$t=${new Date() - 0}`;
    },
    // 登录事件
    submitForm() {
      // 先验证表单
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          console.log('error submit!!');
          return false;
        } else {
          // 验证成功发送axios请求
          const res = await this.$http.post('/login', this.loginForm);
          console.log(res);
          if (res.data.code == 200) {
            this.$router.push('/welcome');
            this.caphchaUrl = `${
              process.env.VUE_APP_BASEURL
            }/captcha?type=login$t=${new Date() - 0}`;
          } else {
            console.log(res.data.message);
            this.caphchaUrl = `${
              process.env.VUE_APP_BASEURL
            }/captcha?type=login$t=${new Date() - 0}`;
          }
        }
      });
      // 发送axios请求
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less">
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(225deg, #1493fa, #01c6fa);
  .left {
    width: 478px;
    height: 550px;
    background: #f5f5f5;
    padding: 48px;
    .title-box {
      display: flex;
      align-items: center;
      .title {
        font-size: 24px;
        margin-right: 14px;
      }
      img {
        width: 22px;
        height: 17px;
        margin-right: 16px;
      }
      .line {
        width: 1px;
        background-color: #c7c7c7;
        height: 27px;
        margin-right: 12px;
      }
      .sub-title {
        font-size: 22px;
      }
    }
    .caphcha {
      width: 100%;
      height: 40px;
      cursor: pointer;
    }
    .el-link--primary {
      color: #409eff;
    }
  }
}
</style>
