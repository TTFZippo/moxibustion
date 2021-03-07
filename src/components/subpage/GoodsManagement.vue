<template>
  <div v-loading="loading">
    <div class="goods_header">
      <span>商品管理</span>
      <button @click="addGoods()">添加商品</button>
    </div>
    <!-- 表格 -->
    <el-table :data="goodsData" style="width: 98%" border>
      <el-table-column prop="productName" label="商品名称" align="center">
        
      </el-table-column>
      <el-table-column prop="describe" label="商品描述" align="center">
      </el-table-column>
      <el-table-column prop="productPrice" label="商品价格" align="center">
      </el-table-column>
      <el-table-column  prop="sales" label="商品总销量" align="center">
        
      </el-table-column>
      <el-table-column prop="imageUrl" label="商品图片" align="center">
        <!-- <div slot-scope="scope"> -->
        <!-- {{scope}} -->
        <!-- </div> -->
        <!-- <template slot-scope=""> -->
        <!-- {{JSON.stringify(scope)}} -->
        <!-- <img :src="scope.row.imageUrl" alt=""> -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column label="上架状态" align="center">
        <!-- scope接受本行数据 -->
        <template slot-scope="scope">
          <!-- <span v-if="scope.row">{{ scope.row.status }}</span> -->
          <el-switch
            v-if="scope.row"
            v-model="scope.row.status"
            class="captcha-img"
            @change="
              statusChange(
                scope.row.status,
                scope.$index,
                scope.row.productName
              )
            "
            active-color="#13ce66"
            inactive-color="#ECECEC"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            @click="deleteGood(scope.row.productName)"
            type="danger"
            icon="el-icon-delete"
            size="small"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  created() {
    this.getGoods();
  },
  data() {
    return {
      // 商品信息
      goodsData: [],
      loading: false
    };
  },
  methods: {
    // 删除商品
    async deleteGood(goodsName) {
      
      // const result1 = await this.$confirm(
      //   "此操作将永久删除该商品，是否继续?",
      //   "提示",
      //   {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning",
      //   }
      // ).catch(() => {});
      // // 确认删除
      // if (result1 == "confirm") {
      //   console.log("开始删除");
      // const result = this.$http.delete("/goods/goods", {
      //   data: {
      //     goodsName: goodsName,
      //   },
      // });
      //   this.getGoods()
      // }
      let warnMessage = "删除后将无法恢复，请确认是否删除";
      this.$confirm(warnMessage, "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: async (action) => {
          if (action == "confirm") {
            // this.goodsData[index].status = this.goodsData[index].status ? "0" : "1";
            // const result = await this.$http.post('/goods/goods?goodsName='+goodsName)
            // console.log(result);
            const result = await this.$http.delete("/goods/goods?goodsName="+goodsName);
            this.getGoods();
          }
        },
      });
    },
    // 测试

    // 获取所有商品数据
    async getGoods() {
      this.loading = true
      const result = await this.$http.get("/goods/goods");
      if(result.data.msg=="token过期" || result.data.msg=="这个账号在别的地方登陆，请重新登录") return this.$message.error("登录状态过期，请重新登录")
      
      if (result.data.status == 200) {
        // this.goodsData = result.data.data;
        // this.goodsData=$.extend(true,{},result.data.data);
        this.goodsData = JSON.parse(JSON.stringify(result.data.data));
        for(let i = 0; i < this.goodsData.length; i++) {
          if(!this.goodsData[i].sales) {
            this.goodsData[i].sales = 0
          }
          if(!this.goodsData[i].productName) {
            this.goodsData.splice(i,1);
          }
        }
        this.loading = false
      } else {
        this.loading = false
      }
      // // this.goodsData = result.data.data;
      // console.log(this.goodsData);
    },

    // 上架或者下架确认
    async statusChange(status, index, goodsName) {
      
      let warnMessage;
      //   ? "上后用户将正常购买本商品，是否确认上架本商品？"
      //   : "下架后用户将不能购买本商品，是否确认下架本商品？";
      if (status === "0") this.goodsData[index].status = "1";
      if (status === "1") this.goodsData[index].status = "0";
      if (status === "1")
        warnMessage = "上架后用户将正常购买本商品，是否确认上架本商品？";
      if (status === "0")
        warnMessage = "下架后用户将正常购买本商品，是否确认下架本商品？";
      // this.goodsData[index].status = this.goodsData[index].status ? "0" : "1";
      // status = status ? "上架" : "下架";
      this.$confirm(warnMessage, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: async (action) => {
          if (action == "confirm") {
            // this.goodsData[index].status = this.goodsData[index].status ? "0" : "1";
            this.loading = true
            const result = await this.$http.post(
              "/goods/goods?goodsName=" + goodsName
            );
            this.loading = false
            
            this.getGoods();
          }
        },
      });
    },

    // 添加商品
    addGoods() {
      this.$router.push("/AddGoods");
    },
  },
};
</script>

<style lang="less"scoped>
.el-table {
  margin: 0 auto;
  font-size: 14px;
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
</style>
