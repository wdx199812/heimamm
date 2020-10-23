<template>
  <div>
    <!-- visible.sync 设置是否显示 -->
    <!-- before-close 关闭前的回到函数 -->
    <!-- show-close 设置是否显示右上角关闭按钮 -->
    <el-dialog
      title="注册"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      center
      :show-close="false"
    >
      <el-form
        :model="registerForm"
        ref="form"
        :rules="rules"
        label-width="80px"
        :inline="false"
        size="normal"
      >
        <!--头像 -->
        <el-form-item label="头像" size="normal" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :data="uploadObj"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <!-- on-success上传成功   before-upload 上传前 -->
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <!-- 表单输入框 -->
        <el-form-item label="昵称" prop="username">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="registerForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="17" style="margin-right:10px">
            <el-form-item prop="code" label="图形码" size="normal">
              <el-input
                v-model="registerForm.code"
                placeholder=""
                size="normal"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <img
              :src="codeUrl"
              alt=""
              @click="getcodeUrl"
              style="width:100%;height:40px"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17" style="margin-right:10px">
            <el-form-item prop="rcode" label="验证码" size="normal">
              <el-input
                v-model="registerForm.rcode"
                placeholder=""
                size="normal"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button size="default" @click="getrcodeUrl"
              >获取用户验证码</el-button
            >
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cacleRegister">取 消</el-button>
        <el-button type="primary" @click="submitRegister">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      dialogVisible: false,
      codeUrl: `${process.env.VUE_APP_BASEURL}captcha?type=sendsms`, //图形码地址
      uploadUrl: `${process.env.VUE_APP_BASEURL}uploads`,
      imageUrl: '', //用户头像
      registerForm: {
        username: '', //昵称
        phone: '', //手机号
        email: '', //邮箱
        avatar: '', // 头像
        password: '', // 密码
        rcode: '', // 验证码
        code: '', // 图形码
      },
      uploadObj: {
        image: '',
      },
      // 校检规则
      rules: {
        avatar: [{ required: true, message: '头像不能为空', trigger: 'blur' }],
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
        password: [
          {
            required: true,
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
        code: [{ required: true, message: '请输入图形码', trigger: 'blur' }],
        rcode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
      },
    };
  },
  mounted() {},
  methods: {
    // 取消
    cacleRegister() {
      this.dialogVisible = false;
    },
    // 注册
    centerRegister() {
      this.dialogVisible = false;
    },
    // 图形验证码
    getcodeUrl() {
      this.codeUrl = `${
        process.env.VUE_APP_BASEURL
      }captcha?type=sendsms&t=${new Date() - 0}`;
    },
    // 获取短信验证码
    async getrcodeUrl() {
      // 判断如果两个其中一个为空 就return就停止执行下面代码
      if (
        this.registerForm.code.trim().length == 0 ||
        this.registerForm.phone.trim().length == 0
      ) {
        this.$message.error('手机号或图形码不能为空');
        this.getcodeUrl();
        return;
      }
      const res = await this.$http.post('/sendsms', {
        code: this.registerForm.code,
        phone: this.registerForm.phone,
      });
      if (res.code == 200) {
        // 把返回的验证码直接赋值到input框中
        this.registerForm.rcode = res.data.captcha;
      } else {
        this.$message.error(res.message);
        this.getcodeUrl();
      }
    },
    //
    handleClose() {},
    //上传前
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG/JPEG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      // 一定要给上传的data 的image赋值 不然会报错
      this.uploadObj.image = file;
      // 把结果返回
      return isJPG && isLt2M;
    },
    // 上传成功的回调函数
    // res表示响应的结果  file表示当前文件
    handleAvatarSuccess(res, file) {
      console.log(file);
      // 转换为base64格式的图片
      // 文件预览
      // this.imageUrl = URL.createObjectURL(file.raw); //方法一
      // 完整的地址
      this.imageUrl = process.env.VUE_APP_BASEURL + '/' + res.data.file_path; //方法二
      // 给需要传参的模型值赋值
      this.registerForm.avatar = res.data.file_path;
    },
    // 注册验证
    submitRegister() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        // 对象中删除中不需要的参数 图形验证码
        delete this.registerForm.code;
        const res = await this.$http.post('/register', this.registerForm);
        if (res.code == 200) {
          this.$message({
            message: '恭喜你，注册成功',
            type: 'success',
          });
          // 成功关闭dialog  并且清空表单 清空头像
          this.dialogVisible = false; //关闭dialog
          this.$refs.form.resetFields(); //清空form表单输入框内容
          this.imageUrl = ''; //头像清空
        } else {
          // 提示报错信息
          this.$message.error(res.data.message);
        }
      });
    },
  },
};
</script>

<style>
.avatar-uploader {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
