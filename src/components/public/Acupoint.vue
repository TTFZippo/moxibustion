
<template>
  <div class="all-container">
    <div class="point-cotainer">
      <img v-if="acpuPointData.path" :src="realPath" alt="" >
      <div v-else class="acpu-point" @click="uploadAcupoint">
        <span>添加穴位</span>
      </div>
      <div v-if="acpuPointData.path" class="acpu-point-info"> 
        <a href="javascript:;" @click="deletePoint()" class="delete">删除</a>
      </div>
    </div>

    <el-dialog title="添加穴位" :visible.sync="visable" width="500px">
      <el-form :model="acpuPoint">
        <el-form-item>
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
  inject: ["reload"],
  created() {
    this.realPath =   this.acpuPointData.path;
    if(this.isAcupoint) {
      this.realPath =  'https://www.dzkf.com/static/images/' + this.acpuPointData.path;
    }
  },
  data() {
    return {
      visable: false,
      imageUrl: "",
      acpuPoint: {},
      realPath: ""
      
    };
  },
  props: ["day", "treatProjectName", "acpuPointData", "treatId", "isAcupoint"],
  methods: {
    // 删除穴位
    async deletePoint() {
      console.log(this.treatId);
      console.log(this.acpuPointData.id);
      const result = await this.$http.delete('/ilustrate/xueWei', {
        data: {
          "treatId": this.treatId,
          "xueWeiId": this.acpuPointData.id
        }
      })
      if(result.data.status == 200 ) {
        console.log(result);

        this.$message.success("删除成功")
      }
      this.reload()
    },
    
    // 添加穴位
    uploadAcupoint() {
      this.imageUrl = ""
      this.acpuPoint = {}
      this.visable = true;
    },

    // 预览图片
    beforeAvatarUpload(file) {
      console.log(file);
      this.acpuPoint.file = file;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        return reader.result;
      };
      setTimeout(() => {
        this.imageUrl = reader.onloadend();
      }, 500);
    },

    // 添加
    async submit() {
      var formData = new window.FormData();
      if (
        !this.acpuPoint.file
      ) {
        this.$message.warning("请完整填写");
        return;
      }
      formData.append("day", 1);
      formData.append("treatProjectName", this.treatProjectName);
      formData.append("file", this.acpuPoint.file, this.acpuPoint.file.name);
      formData.append("temperature", 0);
      formData.append("treatTime", 0);
      // 请求头
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      
      this.visable = false;
      this.$http  
        .put("/ilustrate/xuewei", formData, config)
        .then((response) => {
          this.$message.success("添加成功");
          this.reload()
        })
        .catch((err) => {
          this.$message.warning("添加失败");
        });
    },
  },
};
</script>

<style scoped>
.all-container {
  width: 250px;
  margin-bottom: 20px;
}
span {
  padding-left: 10px;
}
.point-cotainer {
  display: flex;
}
.acpu-point-info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  font-size: 12px;
}
.acpu-point {
  width: 160px;
  height: 80px;
  /* margin-top: 10px; */
  text-align: center;
  line-height: 80px;
  background-color: rgb(219, 217, 217);
  cursor: pointer;
}
img {
  width: 160px;
  height: 80px;
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
#tempImg {
  width: 460px;
}
.delete {
  color: black;
  text-decoration: none;
}
</style>
