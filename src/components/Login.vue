<template>
  <div class="login_container" v-loading="loading">
    <div class="login_header">
      <img
        src="../assets/logo.jpg"
        alt=""
        class="login_logo"
        align="absmiddle"
      />
      <span>广州讯点科技艾灸仪小程序管理系统</span>
    </div>
    <!-- 登录表单 -->
    <div class="login_box">
      <el-form label-width="0px" :model="form" ref="form">
        <!-- 账号 -->
        <el-form-item class="login_account">
          <el-input
            @input="change($event)"
            v-model="form.account"
            placeholder="账号"
            clearable
          ></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item class="login_psw">
          <el-input
            @input="change($event)"
            v-model="form.psw"
            placeholder="密码"
            clearable
            type="password"
          ></el-input>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item class="login_btns">
          <el-button class="login_btn" @click="login">登 &nbsp;录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      loading: false,
    };
  },
  methods: {
    change(e) {
      this.$forceUpdate();
    },
    login() {
      this.loading = true;

      // 表单预验证
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        // TODO:发起登录请求逻辑
        // const result = await this.$http.post("/user/manager", {
        //   password: this.form.psw,
        //   username: this.form.account,
        // });

        // if(result.data.status == 200) {
        //   // 弹窗提示,保存token，并跳转
        // this.$message.success("登录成功");
        // window.sessionStorage.setItem("token", result.data.data.token);
        // this.$router.push("/home");
        // } else {
        //   return this.$message.error("登录失败")
        // }
        // this.loading = false
        this.$http
          .post("/user/manager", {
            password: this.form.psw,
            username: this.form.account,
          })
          .then((result) => {
            this.$message.success("登录成功");
            window.sessionStorage.setItem("token", result.data.data.token);
            this.$router.push("/home");
            this.loading = false
          })
          .catch((err) => {
            this.$message.error("登录失败")
            this.loading = false
          });
      });
    },
  },
};
</script>

<style scoped>
.login_container {
  background-color: #636b66;
  height: 100%;
}
.login_header {
  padding-top: 10px;
}
.login_logo {
  margin-left: 3%;
  width: 80px;
  border: 1px solid white;
  border-radius: 50%;
}
.login_header span {
  margin-left: 2%;
  vertical-align: sub;
  font-size: 32px;
  color: white;
}
.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 545px;
  height: 369px;
  background-color: #15beac;
}
.login_account,
.login_psw,
.login_btns {
  margin: 10% auto;
  width: 80%;
  border-radius: 5px;
}
.login_btn {
  height: 55px;
  width: 100%;
  border-radius: 10px;
  font-size: 24px;
}
.login_psw >>> .el-input__inner,
.login_account >>> .el-input__inner {
  height: 50px;
  font-size: 20px;
}
</style>
