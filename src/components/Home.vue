
<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div class="left_header">
        <img
          src="../assets/logo.jpg"
          alt=""
          class="login_logo"
          align="absmiddle"
        />
        <span>广州讯点科技艾灸仪小程序管理系统</span>
      </div>
      <div @click="logout" class="logout">退出</div>
    </el-header>
    <!-- 主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="205px">
        <el-menu
          background-color="#15BEAC"
          text-color="#fff"
          active-text-color="white"
          router
          default-active="Index"
        >
          <el-menu-item index="Index">
            <i class="el-icon-s-home"></i>
            <span slot="title" style="padding-right: 28px">首页</span>
          </el-menu-item>
          <el-menu-item index="GoodsManagement">
            <i class="el-icon-document"></i>
            <span slot="title">商品管理</span>
          </el-menu-item>
          <el-menu-item index="OrderManagement">
            <i class="el-icon-s-order"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>


          <el-submenu class="sub" index="">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>资源管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="schemeManagement">方案管理</el-menu-item>
              <el-menu-item index="ArticalManagement">文章管理</el-menu-item>
              <el-menu-item index="VideoManagement">视频管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>


          <el-menu-item index="Setting">
            <i class="el-icon-setting"></i>
            <span slot="title">系统管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 页面主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    // 退出按钮
    logout() {
      window.sessionStorage.clear("token");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.home_container {
  height: 100%;
}
.el-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background-color: #15beac;
}
.el-aside {
  margin-top: 2%;
  padding-top: 2%;
  background-color: #15beac;
  overflow: hidden;
}
.el-menu {
  border-right-width: 0;
}

.el-menu-item:hover,
.sub >>> .el-submenu__title:hover {
  background-color: #15beac !important;
}
.el-menu-item,
.el-menu-item-group,
 .sub >>> .el-submenu__title{
  padding-left: 30px !important;
}
.el-menu-item.is-active {
  background-color: #636b66 !important;
}
.el-aside i {
  color: white;
}

.left_header img {
  margin-right: 20px;
  width: 50px;
  border-radius: 50%;
  border: 1px solid white;
}
.left_header span {
  color: white;
  font-size: 20px;
}
.logout {
  margin-bottom: 5px;
  align-self: flex-end;
  float: right;
  color: white;
  cursor: pointer;
}
.el-main {
  padding-top: 45px;
}
</style>
