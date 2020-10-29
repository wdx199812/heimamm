<template>
  <div class="questionType">
    <div v-for="item in select_options" :key="item.label" class="item">
      <el-radio-group v-model="single_select_answer">
        <el-radio :key="item.label" :label="item.label">
          {{ item.label }}
          <el-input :key="index" v-model="item.text" size="normal"></el-input>
          <upload style="margin-left: 15px;" class="avatar-uploader"></upload>
        </el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import Upload from './Upload-file';
export default {
  name: '',
  components: { Upload },
  props: {},
  data() {
    return {
      // 单选题答案
      single_select_answer: '',
      select_options: [
        {
          label: 'A',
          text: '狗不理',
          image: 'upload/20191129/fd5f03a07d95e3948860240564b180e4.jpeg',
        },
        {
          label: 'B',
          text: '猫不理',
          image: 'upload/20191129/e93e7bb72accda7f3159cdabc4203991.jpeg',
        },
        {
          label: 'C',
          text: '麻花',
          image: 'upload/20191129/b7caf98be9d0aa6764b0112ba0dfa19e.jpeg',
        },
        {
          label: 'D',
          text: '炸酱面',
          image: 'upload/20191129/4067f19ab53a5e8388ad3459e23110f0.jpeg',
        },
      ],
      radios: [{ label: 'A' }, { label: 'B' }, { label: 'C' }, { label: 'D' }],
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less">
.questionType .item {
  display: flex;
  justify-content: space-between;
}
</style>
