<!--  -->
<template>
  <div class="container">
    <div class="goods_header">
      <span>添加疗程</span>
    </div>
    <div class="info">
      <div>
        <span class="symptomName">症状名称：{{ schemeData.symptomName }}</span>
        <span>病症原因：{{ schemeData.reason }}</span>
      </div>
      <div>方案名称：{{ schemeData.treatName }}</div>
      <div>方案描述：{{ schemeData.describe }}</div>
      <div class="pic_container">
        <span class="symptomLabel">症状图片：</span>
        <img :src="schemeData.path" alt="" class="symptomPic" />
      </div>
      <div>灸疗效果：{{ schemeData.effect }}</div>
    </div>
    <div class="add">
      <button @click="addDay">+ 添加天数</button>
    </div>
    <div
      v-for="(item1, index1) in acpuPointsData"
      :key="index1"
      class="dayData"
    >
      <span>第{{ index1 + 1 }}天</span>
      <!-- {{ item1.xueWeiList }} -->
      <div class="acpuPointsData">
        <Acupoint
          v-for="(item, index) in item1.xueWeiList"
          :day="index1 + 1"
          :treatProjectName="schemeData.treatName"
          :treatId="schemeData.treatId"
          :acpuPointData="item1.xueWeiList[index]"
          :key="item.id"
        ></Acupoint>
      </div>
    </div>
  </div>
</template>

<script>
import Acupoint from "../public/Acupoint";
export default {
  created() {
    this.getStorageData();
    this.getAllAcpuPoins();
  },
  
  data() {
    return {
      schemeData: {},
      index: "10",
      // 已添加穴位的天数
      day: "",
      // 已添加穴位信息
      acpuPointsData: [],
    };
  },
  methods: {
    // 会话存储获取数据
    getStorageData() {
      window.sessionStorage.getItem("");
      this.schemeData.symptomName = window.sessionStorage.getItem("symptomName");
      this.schemeData.treatName = window.sessionStorage.getItem("treatName");
      this.schemeData.treatId = window.sessionStorage.getItem("treatId");
      this.schemeData.describe = window.sessionStorage.getItem("describe");
      this.schemeData.path = window.sessionStorage.getItem("path");
      this.schemeData.reason = window.sessionStorage.getItem("reason");
      this.schemeData.effect = window.sessionStorage.getItem("effect");
    },

    // 获取该方案的所有穴位信息
    // async getAllAcpuPoins() {
    //   const result = await this.$http.get("/ilustrate/ilustrateInfomation", {
    //     params: {
    //       treatId: this.schemeData.treatId,
    //     },
    //   });

    //   // 天数
    //   this.day = result.data.data.length;
    //   this.acpuPointsData = result.data.data;

    //   //置空
    //   for (let i = 0; i < this.acpuPointsData.length; i++) {
    //     // 每天的穴位的个数
    //     let length = this.acpuPointsData[i].xueWeiList.length;
    //     this.acpuPointsData[i].xueWeiList[length] = {};
    //   }
    // },

    addDay() {
      let day = this.day * 1;
      this.$set(this.acpuPointsData, day, {})
      this.$set(this.acpuPointsData[day],'xueWeiList',[])
      // this.acpuPointsData[this.day] = {}
      // this.acpuPointsData[this.day].xueWeiList = []
      this.$set(this.acpuPointsData[day].xueWeiList, 0, {})
      
      this.day++
    }
  },
  components: {
    Acupoint,
  },
  provide() {
    return {
      reload: this.getAllAcpuPoins
    }
  }
};
</script>

<style scoped>
.container {
  width: 98%;
}
.goods_header {
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 5px;
  width: 98%;
  border-bottom: 1px solid rgba(187, 187, 187, 0.5);
  font: bolder;
}
.symptomPic {
  /* width: 200px; */
  height: 150px;
  /* float: right; */
}
.symptomName {
  margin-right: 30px;
}
.symptomLabel {
  line-height: 150px;
}
.pic_container {
  display: flex;
}

.info {
  /* width: 98%; */
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  border-bottom: 1px solid rgba(187, 187, 187, 0.5);
  font-size: 13px;
  color: rgba(0, 0, 0, 0.7);
}
.info div {
  margin-bottom: 10px;
}
.add {
  width: 98%;
  margin: 20px auto;
}
.add button {
  margin-left: 20px;
  width: 150px;
  height: 60px;
  border-radius: 5px;
  background-color: rgb(21, 190, 172);
  border: none;
  outline: none;
  font-size: 14px;
  color: white;
  cursor: pointer;
}
.Acupoints {
  width: 98%;
  margin: 20px auto;
}

.acpuPointsData {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
.dayData {
  margin-left: 10px;
  margin-top: 20px;
}
.dayData span {
  font-size: 14px;
}
</style>
