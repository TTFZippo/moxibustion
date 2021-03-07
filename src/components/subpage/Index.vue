<!--  -->
<template>
  <div class="index_page" v-loading="loading">
    <div class="income_container">
      <div class="income_box">
        <span>今日收入：{{ todayIncome || "暂无数据" }}</span>
      </div>
      <div class="income_box">
        <span>本月收入：{{ currentMonthIncome || "暂无数据" }}</span>
      </div>
      <div class="income_box">
        <span>累计收入：{{ totalIncome || "暂无数据" }}</span>
      </div>
    </div>

    <div id="income_chart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  created() {
    this.handleToken()
    // 今日收入、月收入、累计收入
    this.$http
      .all([
        this.$http.get("/orders/income").then((res) => res.data.data),
        this.$http.get("/orders/incomeMonth").then((res) => res.data.data),
        this.$http.get("/orders/totalIncome").then((res) => res.data.data),
        this.$http.get("/orders/all").then((res) => res.data.data),
      ])
      .then(
        this.$http.spread((val1, val2, val3, val4) => {
          this.todayIncome = val1;
          this.currentMonthIncome = val2;
          this.totalIncome = val3;
          
          // 近15天收入数据
          var data = val4.slice(val4.length - 15, val4.length);
          this.option.yAxis.max = data[0].income;
          for (let i = 0; i < data.length; i++) {
            this.option.xAxis.data[i] = data[i].date;
            this.option.series[0].data[i] = Number(data[i].income);
            if(this.option.yAxis.max  < data[i].income)
            this.option.yAxis.max = data[i].income
          }
          // 绘制图表
          var myChart = echarts.init(document.getElementById("income_chart"));
          myChart.setOption(this.option);
          this.loading = false;
        })
      )
      .catch((err) => {
        
      });
  },
  data() {
    return {
      todayIncome: null,
      currentMonthIncome: null,
      totalIncome: null,
      loading: true,
      option: {
        title: {
          text: "",
        },
        tooltip: {},
        legend: {
          data: ["收入"],
        },
        xAxis: {
          data: [],
          boundaryGap: false,
          name: "日期",
        },
        yAxis: {
          name: "收入",
          max: Number,
          splitNumber: 5,
        },
        series: [
          {
            name: "收入",
            type: "line",
            data: [],
          },
        ],
      },
    };
  },
  mounted() {
    
  },
  methods: {
    // 处理token过期
    async handleToken() {
      const result = await this.$http.get('/orders/waiting')
      if(result.data.msg=="token过期" || result.data.msg=="这个账号在别的地方登陆，请重新登录") return this.$message.error("登录状态过期，请重新登录")
    },
    getBeforeDate(number) {
      const num = number;
      const date = new Date();
      let year = date.getFullYear();
      let mon = date.getMonth() + 1;
      let day = date.getDate();
      if (day <= num) {
        if (mon > 1) {
          mon = mon - 1;
        } else {
          year = year - 1;
          mon = 12;
        }
      }
      date.setDate(date.getDate() - num);
      year = date.getFullYear();
      mon = date.getMonth() + 1;
      day = date.getDate();
      const s =
        year +
        "-" +
        (mon < 10 ? "0" + mon : mon) +
        "-" +
        (day < 10 ? "0" + day : day);
      return s;
    },
  },
};
</script>

<style scoped>
.income_container {
  display: flex;
  justify-content: space-around;
  color: white;
}
.income_box {
  position: relative;
  width: 205px;
  height: 84px;
  border-radius: 5px;
  background-color: #636b66;
}
.income_box span {
  position: absolute;
  width: 80%;
  left: 50%;
  top: 50%;
  transform: translate(-40%, -50%);
}
#income_chart {
  margin-top: 1.5%;
  width: 100%;
  height: 500px;
}
</style>
