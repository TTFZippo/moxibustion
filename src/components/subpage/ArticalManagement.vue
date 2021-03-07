<!--  -->
<template>
  <div v-loading="loading">
    <div class="articals_header">
      <span>文章管理</span>
      <button @click="addArticals()">添加文章</button>
    </div>
    <el-table border :data="articalsData">
      <el-table-column
        label="文章标题"
        prop="title"
        align="center"
      ></el-table-column>
      <el-table-column
        label="文章简介"
        prop="content"
        align="center"
      ></el-table-column>
      <el-table-column label="文章图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.image" alt="" class="imgs" />
        </template>
      </el-table-column>
      <el-table-column
        label="上线日期"
        prop="createTime"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <a
            href="javascript:;"
            @click="confirmDelete(scope.row.id)"
            class="deleteArtical"
            >删除</a
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 上传文章拟态框 -->
    <el-dialog title="上传文章" :visible.sync="visable" width="500px">
      <el-form :model="upLoadArtical">
        <el-form-item>
          <el-input
            v-model="upLoadArtical.title"
            placeholder="文章标题"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="upLoadArtical.content"
            placeholder="文章简介"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章文档（pdf）">
          <el-upload
            class="avatar-uploader1"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload2"
          >
            <a v-if="fileName" class="avatar" id="tempImg">{{ fileName }}</a>
            <i v-else class="el-icon-plus avatar-uploader-icon1"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="文章封面">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload1"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" id="tempImg1" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visable = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getAllArticals();
  },
  data() {
    return {
      articalsData: [],
      loading: false,

      visable: false, // 拟态框弹出
      upLoadArtical: {}, //上传文章的数据
      fileName: "",
      imgUrl: "",
    };
  },
  methods: {
    beforeAvatarUpload() {},

    // 跳转到添加文章页面
    addArticals() {
      // this.$router.push('/AddArticals')
      this.upLoadArtical = {};
      this.visable = true;
      this.fileName = "";
      this.imgUrl = "";
    },

    // 确认删除文章并调用deleteArtical
    confirmDelete(userId) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: async (action) => {
          if (action == "confirm") {
            // this.goodsData[index].status = this.goodsData[index].status ? "0" : "1";
            // const result = await this.$http.post('/goods/goods?goodsName='+goodsName)
            // console.log(result);
            this.deleteArtical(userId)
            this.getAllArticals()
          }
        },
      })
        
      return false;
    },
    // 删除文章
    async deleteArtical(userId) {
      const result = await this.$http
        .delete("/article/article", {
          data: {
            id: userId,
          },
        })
      this.getAllArticals()
        
    },

    // 获得所有文章数据
    async getAllArticals() {
      this.loading = true;
      const result = await this.$http.get("/article/articleAll");
      if(result.data.msg=="token过期" || result.data.msg=="这个账号在别的地方登陆，请重新登录") return this.$message.error("登录状态过期，请重新登录")
      
      this.articalsData = result.data.data;
      for (let i = 0; i < this.articalsData.length; i++) {
        this.articalsData[i].image =
          "http://47.112.125.53:8080/static/images/" +
          this.articalsData[i].image;
      }
      
      this.loading = false;
    },

    beforeAvatarUpload1(file) {
      this.upLoadArtical.img = file;
      
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        return reader.result;
      };
      setTimeout(() => {
        this.imgUrl = reader.onloadend();
      }, 500);
    },

    beforeAvatarUpload2(file) {
      this.upLoadArtical.pdf = file;
      this.fileName = file.name;
    },

    // 上传文章
    async submit() {
      // 保存上传数据
      var formData1 = new window.FormData();
      // 判空
      if (
        !this.upLoadArtical.pdf ||
        !this.upLoadArtical.img ||
        !this.upLoadArtical.content ||
        !this.upLoadArtical.title
      ) {
        this.$message.error("请完整填写");
        return;
      }

      formData1.append(
        "file",
        this.upLoadArtical.pdf,
        this.upLoadArtical.pdf.name
      );
      formData1.append(
        "photos",
        this.upLoadArtical.img,
        this.upLoadArtical.img.name
      );
      formData1.append("content", this.upLoadArtical.content);
      formData1.append("title", this.upLoadArtical.title);
      

      // 请求头
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      // let result = await this.$http.put("/article/article", formData1, config);
      // // 添加成功
      // if (result.data.status == 200) {
      //   this.$message.success("添加成功");
      //   this.visable = false;
      //   console.log(result);
      //   this.getAllArticals();
      // } else {
      //   // console.log("上传失败");
      //   this.$message.warning("上传失败")
      // }
      this.visable = false;
      this.$http
        .put("/article/article", formData1, config)
        .then((response) => {

          this.$message.success("添加成功");
          this.getAllArticals();
          
        })
        .catch((err) => {
          this.$message.warning("添加失败");
        });
    },
  },
};
</script>

<style scoped>
.articals_header {
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 5px;
  width: 98%;
  border-bottom: 1px solid rgba(187, 187, 187, 0.5);
}
.articals_header button {
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
.imgs {
  height: 200px;
}
.deleteArtical {
  text-decoration: none;
  color: red;
}

.avatar-uploader {
  width: 460px;
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
  width: 460px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 460px;
  height: 178px;
  display: block;
}

.avatar-uploader1 {
  width: 460px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader1:hover {
  border-color: #409eff;
}
.avatar-uploader-icon1 {
  font-size: 28px;
  color: #8c939d;
  width: 460px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.avatar1 {
  width: 460px;
  height: 50px;
  display: block;
}
#tempImg {
  height: 50px;
}
</style>
