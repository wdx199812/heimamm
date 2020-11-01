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
        class="formBlock"
      >
        <el-form-item label="学科" prop="subject">
          <el-select
            style="width:280px"
            v-model="form.subject"
            placeholder="请选择学科"
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
            style="width:280px"
            v-model="form.step"
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
            style="width:280px"
            v-model="form.enterprise"
            placeholder="请选择企业"
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
        <el-form-item label="题型" prop="type">
          <el-select
            style="width:280px"
            v-model="form.type"
            placeholder="请选择题型"
          >
            <el-option
              v-for="item in typies"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="难度" prop="difficulty">
          <el-select
            style="width:280px"
            v-model="form.difficulty"
            placeholder="请选择难度"
          >
            <el-option
              v-for="item in difficultys"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作者" prop="username">
          <el-input style="width:280px" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            style="width:280px;"
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
        <!-- 日期 -->
        <el-form-item prop="create_date">
          <div class="block">
            <span
              class="demonstration"
              style="margin-right:10px;text-align:left"
              >日期</span
            >
            <el-date-picker
              v-model="form.create_date"
              type="date"
              placeholder="请选择日期"
              style="width:280px;"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <!-- 标题 -->
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder=""
            style="width:400px;"
          ></el-input>
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
            >+新增试题</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <!--列表 表格  -->
    <el-card shadow="always" style="margin-top:20px">
      <el-table :data="List" style="width:100%">
        <el-table-column
          type="index"
          label="序号"
          style="width:80px"
        ></el-table-column>
        <el-table-column prop="title" label="题目" width="120">
          <template slot-scope="scope">
            <span v-html="scope.row.title"></span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="学科.阶段">
          <template slot-scope="scope">
            <span v-if="scope.row.step == 1"
              >{{ scope.row.subject_name }}.初级</span
            >
            <span v-if="scope.row.step == 2"
              >{{ scope.row.subject_name }}.中级</span
            >
            <span v-if="scope.row.step == 3"
              >{{ scope.row.subject_name }}.高级</span
            >
          </template>
        </el-table-column>
        <el-table-column label="题型">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">单选</span>
            <span v-if="scope.row.type == 2">多选</span>
            <span v-if="scope.row.type == 3">简答</span>
          </template>
        </el-table-column>
        <el-table-column prop="enterprise_name" label="企业"> </el-table-column>
        <el-table-column prop="username" label="创建者"> </el-table-column>
        <!-- 使用作用域插槽 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" style="color:#409eff">启用</span>
            <span v-if="scope.row.status == 0" style="color:#de2f27">禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="reads" label="访问量"> </el-table-column>
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
    <!-- 并把需要的值传值给子组件 -->
    <add-or-update
      ref="addOrUpdateRef"
      :subjectList="subjectList"
      :erterpriseList="erterpriseList"
      :statuses="statuses"
      :typies="typies"
      :steps="steps"
      :difficultys="difficultys"
    ></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './Add-or-update';
import bus from '../../../common/bus';
export default {
  name: 'question',
  components: { AddOrUpdate },
  props: {},
  data() {
    return {
      // 搜索表单
      form: {
        title: '', //标题
        subject: '', //学科id
        enterprise: '', //	企业id
        type: 1, //	题目类型:1(单选),2(多选),3(简答)
        step: '', //题目阶段:1(初级),2(中级),3(高级)
        username: '', //作者
        status: '', //状态:0(禁用),1(启用)
        difficulty: '', //题目难度: 1(简单),2(一般),3(困难)
        create_date: '', //创建日期
      },
      page: 1, //页码 默认1
      limit: 10, //页尺寸（显示条数）默认10
      total: 0, //总条数
      // 列表
      List: [],
      // 学科
      subjectList: [],
      // 企业
      erterpriseList: [],
      // 状态
      statuses: [
        { value: 1, label: '启用' },
        { value: 0, label: '禁用' },
      ],
      // 题目类型
      typies: [
        { value: 1, label: '单选' },
        { value: 2, label: '多选' },
        { value: 3, label: '简答' },
      ],
      // 题目阶段
      steps: [
        { value: 1, label: '初级' },
        { value: 2, label: '中级' },
        { value: 3, label: '高级' },
      ],
      // 题目难度
      difficultys: [
        { value: 1, label: '简单' },
        { value: 2, label: '一般' },
        { value: 3, label: '困难' },
      ],
    };
  },
  mounted() {
    this.getuserListData();
    bus.$on('subjectName', (val) => {
      console.log(val);
    });
    this.getsubjectList();
    this.getenterpriseList();
  },
  methods: {
    async getuserListData() {
      const res = await this.$axios.get('/question/list', {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.form, //展开运算符
        },
      });
      if (res.code == 200) {
        // 获得的所有列表信息 直接赋值到List数组中
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
      const res = await this.$axios.post('/question/status', { id });
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

      this.$confirm(`你确定要删除当前题目吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await this.$axios.post('/question/remove', { id });
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
      (this.$refs.addOrUpdateRef.form = {
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
      }),
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
      this.$refs.addOrUpdateRef.form = JSON.parse(JSON.stringify(forms));
      this.$refs.addOrUpdateRef.form.city = forms.city.split(',');
      this.$refs.addOrUpdateRef.form.multiple_select_answer = forms.multiple_select_answer.split(
        ','
      );
      // 深拷贝   或者 {...form}
    },
    //获取学科列表内名称和企业列表名称
    async getsubjectList() {
      const res = await this.$axios.get('/subject/list', {});
      // console.log(res);
      this.subjectList = res.data.items;
    },
    async getenterpriseList() {
      const res = await this.$axios.get('/enterprise/list', {});
      console.log(res);
      this.erterpriseList = res.data.items;
    },
  },
};
</script>

<style lang="less">
.block {
  margin-left: 40px;
}
.demonstration {
  display: inline-block;
}
.formBlock .el-form-item__label {
  text-align: right !important;
}
</style>
