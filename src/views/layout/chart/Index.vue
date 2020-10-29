<template>
  <div>
    <el-card class="cardOne">
      <el-row class="rowChart">
        <el-col :span="4" :offset="0">
          <div :ref="refs[0]" style="width:100%;height:120px"></div>
        </el-col>
        <el-col :span="4" :offset="0">
          <div :ref="refs[1]" style="width:100%;height:120px"></div>
        </el-col>
        <el-col :span="4" :offset="0">
          <div :ref="refs[2]" style="width:100%;height:120px"></div>
        </el-col>
        <el-col :span="4" :offset="0">
          <div :ref="refs[3]" style="width:100%;height:120px"></div>
        </el-col>
        <el-col :span="4" :offset="0">
          <div :ref="refs[4]" style="width:100%;height:120px"></div>
        </el-col>
        <el-col :span="4" :offset="0">
          <div :ref="refs[5]" style="width:100%;height:120px"></div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="cardTwo">
      <div ref="echartsRef" style="height:500px"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Chart',
  props: {},
  data() {
    return {
      // ref
      refs: [1, 2, 3, 4, 5, 6],
      // 图表title
      title: [
        '今日新增用户',
        '总用户量',
        '新增试题',
        '总试题量',
        '总刷题量',
        '人均刷题量',
      ],
      // 图表颜色
      colors: ['#0487fa', '#f76137'],
      increment_questions: 0,
      increment_users: 0,
      personal_questions: 0,
      total_done_questions: 0,
      total_questions: 0,
      total_users: 0,
      statistics: [], // 统计哪些企业
      titleObj: {},
    };
  },
  created() {
    // 数据
    this.getTitleData();
  },
  mounted() {
    this.getStatisticsData();
  },
  methods: {
    async getStatisticsData() {
      const res = await this.$axios.post('/data/statistics');
      console.log(res);
      if (res.code === 200) {
        this.statistics = res.data;

        // 使用echarts进行渲染
        this.initEcharts();
      }
    },
    // 图一
    getEchartData(ele, title, color, data) {
      console.log(data);
      let chart = this.$refs[ele];
      let myChart = null;
      if (chart) {
        myChart = this.$echarts.init(chart);
        let option = {
          title: {
            left: 'center',
            bottom: 0,
            right: 'auto',
            text: `${title}`,
            textStyle: {
              fontSize: 12,
              color: '#000',
            },
          },
          series: [
            {
              type: 'pie',
              bottom: '20px',
              hoverAnimation: false,
              radius: ['75%', '80%'],
              label: {
                //  饼图图形上的文本标签
                normal: {
                  // normal 是图形在默认状态下的样式
                  show: true,
                  position: 'center',
                  color: `${color}`,
                  fontSize: 16,
                  fontWeight: 'bold',
                  formatter: '{c}', // {b}:数据名； {c}：数据值； {d}：百分比，可以自定义显示内容，
                },
              },
              data: [
                {
                  name: '直接访问',
                  value: `${data}`,
                  itemStyle: {
                    normal: {
                      color: `${color}`,
                      label: {
                        normal: { show: true },
                      },
                    },
                  },
                },
              ],
            },
          ],
        };
        myChart.setOption(option);
      }
    },
    // 数据接口
    async getTitleData() {
      const res = await this.$axios.post('/data/title');
      console.log(res);
      if (res.code == 200) {
        this.increment_questions = res.data.increment_questions;
        this.increment_users = res.data.increment_users;
        this.personal_questions = res.data.personal_questions;
        this.total_done_questions = res.data.total_done_questions;
        this.total_questions = res.data.total_questions;
        this.total_users = res.data.total_users;
        this.getEchartData(
          this.refs[0],
          this.title[0],
          this.colors[0],
          this.increment_questions
        );
        this.getEchartData(
          this.refs[1],
          this.title[1],
          this.colors[0],
          this.increment_users
        );
        this.getEchartData(
          this.refs[2],
          this.title[2],
          this.colors[1],
          this.personal_questions
        );
        this.getEchartData(
          this.refs[3],
          this.title[3],
          this.colors[1],
          this.total_done_questions
        );
        this.getEchartData(
          this.refs[4],
          this.title[4],
          this.colors[1],
          this.total_questions
        );
        this.getEchartData(
          this.refs[5],
          this.title[5],
          this.colors[1],
          this.total_users
        );
        this.titleObj = res.data.data;
      }
    },
    // 图二
    initEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(this.$refs.echartsRef);

      const legendData = this.statistics.map((item) => item.name);

      // 指定图表的配置项和数据
      var option = {
        color: ['#f60'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          right: 60,
          data: legendData,
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: this.statistics,
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    //

    //
  },
};
</script>

<style scoped lang="less">
.cardOne {
  margin-bottom: 20px;
}
.rowChart {
  height: 120px;
}
.rowChart .el-col {
  display: block;
  height: 120px;
}
.cardTwo {
  height: 500px;
}
</style>
