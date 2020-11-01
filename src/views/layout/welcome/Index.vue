<template>
  <el-card>
    <div>亲爱的-{{ $store.getters.getuserInfo.username }}-欢迎来到德莱联盟</div>
    <!-- card body -->
  </el-card>
</template>

<script>
export default {
  name: 'welcome',
};
</script>

<style scoped lang="less"></style>
