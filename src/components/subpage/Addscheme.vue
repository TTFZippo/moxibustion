<template>
  <div>
    <div class="addScheme_header">
      <span>添加方案</span>
    </div>
    <el-form :data="scheme">
      <el-form-item label="症状名称">
        <el-input v-model="scheme.symptomName"></el-input>
      </el-form-item>
      <el-form-item label="方案名称">
        <el-input v-model="scheme.treatName"></el-input>
      </el-form-item>
      <el-form-item label="方案描述">
        <el-input v-model="scheme.describe"></el-input>
      </el-form-item>
      <el-form-item label="症状图片">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="病症原因">
        <el-input v-model="scheme.reason"></el-input>
      </el-form-item>
      <el-form-item label="灸疗效果">
        <el-input
          type="textarea"
          :rows="5"
          class="textarea"
          resize="none"
          v-model="scheme.effect"
        ></el-input>
      </el-form-item>
    </el-form>
    <button @click="cancel">取消</button>
    <button @click="submit">确认</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scheme: {},
      imgUrl: "",
    };
  },
  methods: {
    //取消并退出
    cancel() {
      this.scheme = {}
      this.$router.push('/schemeManagement')
    },

    // 提交表单
    async submit() {
      
      // const result = await this.$http.put('')
      var formData1 = new window.FormData();
      
      if(this.scheme.file)formData1.append("file", this.scheme.file, this.scheme.file.name);
      else return this.$message.error("请放入图片")
      formData1.append("symptomName", this.scheme.symptomName);
      formData1.append("treatName", this.scheme.treatName);
      formData1.append("describe", this.scheme.describe);
      formData1.append("reason", this.scheme.reason);
      formData1.append("effect", this.scheme.effect);
      if (
        !this.scheme.symptomName ||
        !this.scheme.treatName ||
        !this.scheme.describe ||
        !this.scheme.reason ||
        !this.scheme.effect
        
      ) {
        this.$message.error("请完整填写")
        return;
      }

      // 请求头
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      // let result = await this.$http.put("/ilustrate/ilustrate", formData1, config);
      // console.log(result);
      // // 添加成功
      // if (result.data.status == 200) {
      //   this.$router.push('/schemeManagement')
      //   this.$message.success("添加成功")
      //   this.form = {}
      // }
      this.$http
        .put("/ilustrate/ilustrate", formData1, config)
        .then((response) => {
          this.$message.success("添加成功");
          this.scheme = {}
          this.imgUrl = ""
        })
        .catch((err) => {
          this.$message.warning("添加失败");
        });
    },

    // 获取图片
    beforeAvatarUpload(file) {
      this.scheme.file = file;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        return reader.result;
      };
      setTimeout(() => {
        this.imgUrl = reader.onloadend();
      }, 500);
    },
  },
};
</script>

<style scoped>
.addScheme_header {
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 5px;
  width: 98%;
  border-bottom: 1px solid rgba(187, 187, 187, 0.5);
}
.el-input {
  width: 400px;
}
.textarea {
  width: 400px;
}

.avatar-uploader {
  width: 400px;
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
  width: 400px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 400px;
  height: 178px;
  display: block;
}


button {
  /* margin-top: 10%; */
  margin-left: 120px;
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
  margin-left: 50px;
}
</style>
