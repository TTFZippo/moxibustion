<template>
  <div v-loading="loading">
    <div class="goods_header">
      <span>方案管理</span>
      <button @click="addScheme()">添加方案</button>
    </div>
    <el-table :data="schemeData" border>
      <el-table-column prop="symptomName" label="症状名称" align="center">
      </el-table-column>
      <el-table-column prop="treatName" label="方案名称" align="center">
      </el-table-column>
      
      <el-table-column prop="path" label="封面图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.path" alt=""  class="scheme-image"/>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="病症表现" align="center">
      </el-table-column>
      
      <el-table-column prop="create_Time" label="上传日期" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" class="options">
        <template slot-scope="scope">
          <a href="javascript:;" @click="addCourse(scope)" class="edit">编辑</a>
          <a href="javascript:;" @click="deleteScheme(scope)">删除</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
  created() {
    this.getSchemes();
  },
  data() {
    return {
      // 诊疗方案
      schemeData: [],
      loading: false,
    };
  },
  methods: {
    // 添加疗程
    addCourse(scope) {
      this.createNewScheme(false);
      let index = scope.$index;
      window.sessionStorage.setItem(
        "symptomName",
        this.schemeData[index].symptomName
      );
      window.sessionStorage.setItem("treatId", this.schemeData[index].treatId);
      window.sessionStorage.setItem(
        "treatName",
        this.schemeData[index].treatName
      );
      window.sessionStorage.setItem(
        "describe",
        this.schemeData[index].describe
      );
      window.sessionStorage.setItem("path", this.schemeData[index].path);
      window.sessionStorage.setItem("reason", this.schemeData[index].reason);
      window.sessionStorage.setItem("effect", this.schemeData[index].effect);
      this.$router.push("/Addscheme");
    },
    // 获取诊疗方案数据
    async getSchemes() {
      // console.log("开始获取方案管理");
      this.loading = true;
      const result = await this.$http.get("/ilustrate/ilustrateAll");
      if (
        result.data.msg == "token过期" ||
        result.data.msg == "这个账号在别的地方登陆，请重新登录"
      )
        return this.$message.error("登录状态过期，请重新登录");

      if (result.data.status == 200) {
        this.schemeData = result.data.data;
        for (let i = 0; i < result.data.data.length; i++) {
          this.schemeData[i].path =
            "http://47.112.125.53:8080/static/images/" +
            this.schemeData[i].path;
        }
      }
      this.loading = false;
    },

    // 跳转到添加方案
    addScheme() {
      this.$router.push("/addscheme");
      this.createNewScheme(true);
    },
    ...mapMutations(['createNewScheme']),
    // 删除本行方案,传入本行信息
    async deleteScheme(scopeData) {
      this.$confirm("此操作将永久删除该方案，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: async (action) => {
          if (action == "confirm") {
            this.loading = true;
            const result = await this.$http.delete("/ilustrate/ilustrate", {
              data: {
                treatId: scopeData.row.treatId,
                symptomId: scopeData.row.symptomId,
              },
            });
            this.loading = false;
            if(result.data.status == 200) {
              this.$message.success("删除成功")
            }
            // console.log(result);
            this.getSchemes();
          }
        },
      });
    },
  },
};
</script>

<style scoped>
.goods_header {
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 5px;
  width: 98%;
  border-bottom: 1px solid rgba(187, 187, 187, 0.5);
}
.goods_header button {
  width: 80px;
  height: 35px;
  border-radius: 5px;
  background-color: rgb(21, 190, 172);
  border: none;
  outline: none;
  font-size: 12px;
  color: white;
  cursor: pointer;
}
.el-table a {
  text-decoration: none;
  margin: 0 10px;
  color: red;
}
.el-table a:nth-of-type(1) {
  margin-bottom: 20px;
}
img {
  width: 250px;
}
.scheme-image {
  height: 120px;
  width: 120px;
}
.el-table  .edit {
  color: black;
}
</style>
