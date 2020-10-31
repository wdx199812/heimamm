<template>
  <el-upload
    class="avatar-uploader"
    :action="UploadUrl"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :data="data"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <video v-if="videoUrl" :src="videoUrl" class="avatar" controls="controls" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
export default {
  name: 'UPload',
  components: {},
  props: {
    type: String,
    // 父组件的传值
    // 当上传的是图片是 obj就是select_options的每一项
    obj: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
  data() {
    return {
      UploadUrl: process.env.VUE_APP_BASEURL + 'question/upload',

      data: {
        file: '', //上传所携带的参数
      },
      imageUrl: '', //预览图片路径
      videoUrl: '', //预览视频地址
    };
  },
  watch: {
    obj() {
      if (
        (this.type === 'image' || this.type === 'video') &&
        (this.obj.image === '' || this.obj.video === '')
      ) {
        this.imageUrl = '';
        this.videoUrl = '';
      } else if (this.type === 'image' && this.obj.image) {
        this.imageUrl = process.env.VUE_APP_BASEURL + this.obj.image;
      } else if (this.type === 'video' && this.obj.video) {
        this.videoUrl = process.env.VUE_APP_BASEURL + this.obj.video;
      }
    },
  },
  mounted() {
    if (this.type == 'image' && this.obj.image) {
      console.log(process.env.VUE_APP_BASEURL);
      this.imageUrl = process.env.VUE_APP_BASEURL + this.obj.image;
    } else if (this.type == 'video' && this.obj.video) {
      this.videoUrl = process.env.VUE_APP_BASEURL + this.obj.video;
    }
  },
  methods: {
    // 上传前
    beforeAvatarUpload(file) {
      this.data.file = file; //给请求参数赋值
      if (this.type == 'image') {
        const isJPG =
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/gif';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片只能是 jpeg/png/gif 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      } else if (this.type == 'video') {
        const ismP4 = file.type === 'video/mp4' || file.type === 'video/AVI';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!ismP4) {
          this.$message.error('上传视频只能是 mp4/avi 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传视频大小不能超过 2MB!');
        }
        return ismP4 && isLt2M;
      }
    },
    //上传成功
    handleAvatarSuccess(res, file) {
      console.log(file);
      if (this.type == 'image') {
        //预览图片
        this.imageUrl = process.env.VUE_APP_BASEURL + res.data.url;
        this.obj.image = res.data.url;
      } else if (this.type == 'video') {
        // 把地址赋值给src 显示预览效果
        this.videoUrl = process.env.VUE_APP_BASEURL + res.data.url;
        // 把值赋值给模型中
        this.obj.video = res.data.url;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.avatar-uploader {
  justify-content: left;
  text-align: left;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
video {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
