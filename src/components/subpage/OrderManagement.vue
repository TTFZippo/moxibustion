<template>
  <div v-loading="loading">
    <div class="order-header">订单管理</div>
    <detail-box itemName="待处理订单" :number="undeliveredOrder"></detail-box>
    <detail-box itemName="已完成订单" :number="deliveredOrder"></detail-box>
    <el-form>
      <el-form-item class="derive">
        <derive :url="deriveUrl" :token="token"></derive>
      </el-form-item>
      <el-form-item class="screen">
        <button @click="screen">筛选</button>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入订单号"
          v-model="screenData.orderId"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="screenData.status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="orderData">
      <el-table-column label="订单号" prop="orderId"></el-table-column>
      <el-table-column label="商品名称" prop="productName"></el-table-column>
      <el-table-column label="商品数量" prop="productNumber"></el-table-column>
      <el-table-column label="用户昵称" prop="userName"></el-table-column>
      <el-table-column label="联系方式" prop="userPhone"></el-table-column>
      <el-table-column label="收货地址" prop="userAddress"></el-table-column>
      <el-table-column label="订单总额" prop="orderAmout"></el-table-column>
      <el-table-column label="下单时间" prop="orderTime"></el-table-column>
      <el-table-column label="备注信息" prop="remark"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status==1 ? "已发货" : "未发货" }}
          <a
            v-if="scope.row.status==0"
            href="javascript:;"
            class="deliver"
            @click="deliver(scope.row)"
            >发货</a
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-size="screenData.pageSize"
      layout="sizes, total, prev, pager, next "
      :page-sizes="[5, 10, 15, 20]"
      :total="pagination.total"
    >
    </el-pagination>

    <el-dialog  :visible.sync="visable" width="400px">
      <div slot="title" class="dialog-title">
        发货提醒
      </div>
      <div class="orderMessage">
        <div>订单号：{{dialogData.orderId || "暂无数据"}}</div>
        <div>姓名：{{dialogData.userName || "暂无数据"}}</div>
        <div>联系方式：{{dialogData.userPhone || "暂无数据"}}</div>
        <div>商品：{{dialogData.productName || "暂无数据"}}</div>
        <div>数量：{{dialogData.productNumber || "暂无数据"}}</div>
        <div>订单总额：{{dialogData.orderAmout || "暂无数据"}}</div>
        <div class="warnMessage">请仔细核对单号是否发出！</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visable = false">取 消</el-button>
        <el-button type="primary" @click="submit(dialogData.orderId)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Derive from "../public/derive.vue";
import DetailBox from "../public/DetailBox.vue";
export default {
  created() {
    this.token = window.sessionStorage.getItem("token");
    this.handleToken()
    this.getAllOrders();
  },
  data() {
    return {
      visable: false,
      loading: false,

      // 待处理订单、已完成订单
      deliveredOrder: "",
      undeliveredOrder: "",

      //导出路径
      deriveUrl: "http://47.112.125.53:8080/orders/exportExcel",
      token: "",
      // 分页信息
      pagination: {
        total: 0,
        currentPage: 1,
      },
      // 待选项
      options: [
        {
          value: "1",
          label: "已发货",
        },
        {
          value: "0",
          label: "未发货",
        },
        {
          value: "",
          label: "所有订单",
        },
      ],

      // 订单筛选信息
      screenData: {
        orderId: "",
        page: "1",
        pageSize: 5,
        status: "",
      },

      // 防止点击下一页时请求带入已填写筛选项
      screenDataCopy: {
        orderId: "",
        page: "1",
        pageSize: 5,
        status: "",
      },

      // 订单信息
      orderData: [],


      // 本轮对话框信息
      dialogData: {}
    };
  },
  components: {
    Derive,
    DetailBox,
  },

  methods: {
    async handleToken() {
      const result = await this.$http.get('/orders/waiting')
      if(result.data.msg=="token过期" || result.data.msg=="这个账号在别的地方登陆，请重新登录") return this.$message.error("登录状态过期，请重新登录")
    },

    // 提交发货申请
    async submit(orderId) {
      
      // const result = await this.$http.post('/orders/updateOrder?orderId='+ orderId)
      
      // if(result.data.status == 200) {
      //   this.$message.success("发货成功")
      //   this.visable = false
      // }
      this.visable = false
      this.$http
        .post('/orders/updateOrder?orderId='+ orderId)
        .then((response) => {

          this.$message.success("发货成功");
          this.getAllOrders();
        })
        .catch((err) => {
          this.$message.warning("发货失败");
          this.loading = false
        });
      
    },
    // 发货按钮
    async deliver(data) {
      this.visable = true
      // 对话框数据
      console.log(data);
      this.dialogData = data
    },
    // 筛选并更新数据
    async screen() {
      this.loading = true;
      this.screenDataCopy = this.screenData;
      const result = await this.$http.get("/orders/orders", {
        params: this.screenData,
      });
      this.orderData = result.data.data.list;
      this.pagination.total = result.data.data.total;
      this.loading = false;
    },

    async handleSizeChange(pageSize) {
      this.loading = true;
      this.screenData.pageSize = pageSize;
      this.screenDataCopy.pageSize = pageSize;
      this.screenDataCopy.page = 1;
      const result = await this.$http.get("/orders/orders", {
        params: this.screenDataCopy,
      });
      this.orderData = result.data.data.list;
      this.pagination.total = result.data.data.total;
      this.loading = false;
    },
    // 分页处理
    async handleCurrentChange(currentPage) {
      this.loading = true;
      this.screenDataCopy.page = currentPage;
      const result = await this.$http.get("/orders/orders", {
        params: this.screenDataCopy,
      });
      this.orderData = result.data.data.list;
      this.pagination.total = result.data.data.total;
      this.loading = false;
    },

    // 获取所有订单数据
    getAllOrders() {
      this.loading = true;
      this.$http
        .all([
          this.$http.get("/orders/waiting").then((res) => res.data.data),
          this.$http.get("/orders/finished").then((res) => res.data.data),
          this.$http
            .get("/orders/orders", { params: this.screenData })
            .then((res) => res.data.data),
        ])
        .then(
          this.$http.spread((val1, val2, val3) => {
            this.undeliveredOrder = val1;
            this.deliveredOrder = val2;
            this.orderData = val3.list;
            this.pagination.total = val3.total;
           
            this.loading = false;
            // console.log(val3.list);
            // console.log(this.orderData);

          })
        )
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.order-header {
  margin-bottom: 15px;
  padding-bottom: 5px;
  width: 98%;
}
.detail-box {
  display: inline-block;
  margin-left: 10%;
}
.el-form {
  margin-top: 20px;
  /* display: flex; */
  /* justify-content: right; */
}
.el-form-item {
  float: right;
  margin-left: 2%;
  width: 20%;
}
.screen,
.derive {
  width: 6%;
}
.screen button {
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
.pagination {
  float: right;
  margin-top: 10px;
  margin-right: 5%;
}
.deliver {
  margin-left: 5px;
  text-decoration: none;
}

.dialog-title {
  text-align: center;
}
.orderMessage div {
  margin-top: 5px;
}
.warnMessage {
  text-align: center;
  color: red;
}
</style>
