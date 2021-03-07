<template>
  <div v-loading="loading">
    <div class="setting_header">
      <span>管理员设置</span>
      <button @click="addAdimin">添加管理员</button>
    </div>
    <el-table :data="settingData" style="width: 98%" border>
      <el-table-column
        label="姓名"
        prop="userName"
        align="center"
      ></el-table-column>
      <el-table-column
        label="账号"
        prop="userId"
        align="center"
      ></el-table-column>
      <el-table-column
        label="密码"
        prop="password"
        align="center"
      ></el-table-column>
      <el-table-column
        label="管理员类型"
        prop="adminType"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <a href="javascript:;" @click="confirmDelete(scope.row.userId)"
            >删除</a
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  created() {
    this.getUser();
  },
  data() {
    return {
      // 管理员数据
      settingData: [],
      loading: true,
    };
  },
  methods: {
    // 跳转添加管理员页面
    addAdimin() {
      this.$router.push("./AddAdmin");
    },

    // 获得所有管理员数据
    async getUser() {
      const result = await this.$http.get("/user/user");
      if(result.data.msg=="token过期" || result.data.msg=="这个账号在别的地方登陆，请重新登录") return this.$message.error("登录状态过期，请重新登录")

      
      if (result.data.status == 200) {
        this.settingData = result.data.data;
        
        for (let i = 0; i < this.settingData.length; i++) {
          this.settingData[i].adminType = "超级管理员";
        }

        this.loading = false;
      }
    },
    confirmDelete(userId) {
      this.$confirm("此操作将永久删除该管理员, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteAdmin(userId);
        })
        .catch(() => {
          
        });
      return false;
    },
    // 删除管理员
    deleteAdmin(userId) {
      this.$http
        .delete("/user/user", {
          data: {
            userId: userId,
          },
        })
        .then((response) => {

          this.$message.success("删除成功");
          this.getUser();
        })
        .catch((err) => {
          this.$message.warning("删除失败");
        });
    },
  },
};
</script>

<style scoped>
.setting_header {
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 5px;
  width: 98%;
  border-bottom: 1px solid rgba(187, 187, 187, 0.5);
}
.setting_header button {
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
a {
  text-decoration: none;
  color: red;
}
</style>
