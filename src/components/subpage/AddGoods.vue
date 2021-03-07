<template>
  <div>
    <div class="goods-header">商品管理</div>
    <el-form
      :model="form"
      label-width="100px"
      label-position="left"
      class="addGodds-form"
    >
      <el-form-item label="商品名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" id="tempImg" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品状态">
        <el-switch
          v-model="status"
          active-color="#13ce66"
          inactive-color="#ECECEC"
          active-text="上架"
          inactive-text="下架"
        >
        </el-switch>
      </el-form-item>
      <button @click="cancel">取消</button>
      <button @click="submit">确认</button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据
      form: {},
      imageUrl: null,
      status: false,
      file: null,
    };
  },
  methods: {
    // 选中图片后显示图片
    beforeAvatarUpload(file) {
      this.file = file;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        return reader.result;
      };
      setTimeout(() => {
        this.imageUrl = reader.onloadend();
      }, 500);
    },

    // 状态转化
    change() {
      this.form.status = this.status ? 1 : 0;
    },

    // 添加
    async submit() {
      this.change();
      var formData1 = new window.FormData();
      if (this.file) formData1.append("file", this.file, this.file.name);
      formData1.append("describe", this.form.description);
      formData1.append("productName", this.form.name);
      formData1.append("productPrice", this.form.price);
      formData1.append("status", this.form.status);
      
      if (
        !this.form.description ||
        !this.form.name ||
        !this.form.price ||
        !this.file
      ) {
        this.$message.error("请完整填写");
        return;
      }

      // 请求头
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      // let result = await this.$http.put("/goods/goods", formData1, config);
      // console.log("result");
      // // 添加成功
      // if (result.data.status == 200) {
      //   this.$message.success("添加成功")
      // this.$router.push("/GoodsManagement");
      // this.form = {};
      // this.imageUrl = "";
      //   return;
      // }
      // this.$message.error("添加失败")
      this.loading = false;
      this.$http
        .put("/goods/goods", formData1, config)
        .then((response) => {
          this.$message.success("添加成功");
          this.$router.push("/GoodsManagement");
          this.form = {};
          this.imageUrl = "";
        })
        .catch((err) => {
          this.$message.error("添加失败")
        });
    },

    cancel() {
      this.$router.push("/GoodsManagement");
    },
    getFullGoods() {},
  },
};
</script>

<style scoped>
.goods-header {
  margin-bottom: 15px;
  padding-bottom: 5px;
  width: 98%;
  border-bottom: 1px solid rgba(187, 187, 187, 0.5);
}
.addGodds-form {
  width: 30%;
  padding-left: 1%;
}

.avatar-uploader {
  width: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
button {
  margin-top: 10%;
  margin-left: 18%;
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
  margin-left: 15%;
}
</style>
