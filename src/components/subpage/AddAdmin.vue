<template>
  <div>
    <div class="goods_header">
      <span>管理员添加</span>
    </div>
    <el-form label-position="left" label-width="60px">
      <el-form-item label="姓名">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="form.userId"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
    </el-form>
    <div class="buttons">
      <button @click="cancel">取消</button>
      <button @click="addAdmin">确认</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 管理员表单
      form: {},
    };
  },
  methods: {
    // 取消返回
    cancel() {
      this.form = {};
      this.$router.push("/Setting");
    },

    // 添加员工
    addAdmin() {
      // 判空
      if (!this.form.userName || !this.form.userId || !this.form.password)
        return this.$message.warning("请完整填写");
      // 提交表单
      this.$http
        .put("/user/user", this.form)
        .then((response) => {
          this.$message.success("添加成功");
          this.form = {};
          this.$router.push("/Setting");
        })
        .catch((err) => {
          this.$message.warning("添加失败");
          this.form = {};
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

.el-form-item {
  width: 400px;
}
button {
  
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
button:nth-of-type(2) {
  margin-left: 40px;
}
.buttons {
  margin-top: 50px;
  padding-left: 100px;
  /* border: 1px solid red; */
}
</style>
