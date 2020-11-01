<template>
  <div class="questionType">
    <!-- 单选 -->
    <div v-if="form.type == 1">
      <div class="item" v-for="item in form.select_options" :key="item.label">
        <el-radio v-model="form.single_select_answer" :label="item.label">{{
          item.label
        }}</el-radio>
        <el-input v-model="item.text"></el-input>
        <upload-file type="image" :obj="item"></upload-file>
      </div>
    </div>
    <!-- 多选 -->
    <div v-else-if="form.type == 2">
      <div class="item" v-for="item in form.select_options" :key="item.label">
        <el-checkbox
          v-model="form.multiple_select_answer"
          :label="item.label"
          >{{ item.label }}</el-checkbox
        >
        <el-input v-model="item.text" style="margin: 0 15px"></el-input>
        <upload-file type="image" :obj="item"></upload-file>
      </div>
    </div>
    <!-- 简答题 -->
    <div v-if="form.type == 3">
      <input
        type="textarea"
        v-model="form.short_answer"
        rows="20"
        style="width:100%"
      />
    </div>
  </div>
</template>

<script>
import UploadFile from './Upload-file';
export default {
  name: 'questionType',
  components: { UploadFile },
  props: {
    type: String,
    form: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less">
.questionType {
  .el-input {
    color: #606266;
    cursor: pointer;
    margin-left: 20px;
    margin-right: 20px;
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}
</style>
