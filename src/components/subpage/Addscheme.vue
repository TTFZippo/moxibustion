<template>
  <div>
    <div class="addScheme_header">
      <span>添加方案</span>
    </div>
    <el-form :data="scheme">
      <el-form-item label="方案名称">
        <el-input v-model="scheme.treatName"></el-input>
      </el-form-item>
      <el-form-item label="症状表现">
        <el-input
          v-model="scheme.reason"
          type="textarea"
          :rows="5"
          class="textarea"
          resize="none"
        ></el-input>
      </el-form-item>
      <el-form-item label="艾灸配穴">
        <el-input
          v-model="scheme.effect"
          type="textarea"
          :rows="8"
          class="textarea"
          resize="none"
        ></el-input>
      </el-form-item>
      <el-form-item label="方案图片">
        <div class="point-cotainer">
          <img
            v-if="scheme.path || tempPath"
            :src="scheme.path || tempPath"
            alt=""
          />
          <div v-else class="acpu-point" @click="loadImage">
            <span>添加</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="穴位图片"   v-show="isNewScheme">
        <div class="acupoint-container">
          <Acupoint
            v-for="(item, index) in xueWeiList"
            :day="1"
            :acpuPointData="xueWeiList[index]"
            :key="item.id"
            isAcupoint="true"
            :treatProjectName="scheme.treatName"
            :treatId="scheme.treatId"
          ></Acupoint>
        </div>
      </el-form-item>
    </el-form>
    <button @click="cancel">取消</button>
    <button @click="submit"  v-show="!isNewScheme">确认</button>

    <el-dialog title="添加穴位" :visible.sync="visable" width="500px">
      <el-form>
        <el-form-item>
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="load"
            auto-upload
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" id="tempImg" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visable = false">取 消</el-button>
        <el-button type="primary" @click="argue()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Acupoint from "../public/Acupoint";
import { mapGetters } from "vuex";
export default {
  created() {
    if (!this.isCreateNewScheme()) {
      this.getStorageData();
      this.getAllAcpuPoins();
      this.isNewScheme = true;
    } else {
      this.isNewScheme = false;
    }
    console.log(this.isNewScheme);
  },
  provide() {
    return {
      reload: this.getAllAcpuPoins,
    };
  },
  components: {
    Acupoint,
  },
  computed: {
    
  },
  data() {
    return {
      visable: false,
      scheme: {},
      imgUrl: "",
      xueWeiList: [],
      imageUrl: "",
      // 添加方案页暂时显示图片的地址
      tempPath: "",
      submitScheme: {},

      isNewScheme: true
    };
  },
  computed: {
    
  },
  methods: {
    // 确定将图片加入待添加列表
    argue() {
      this.tempPath = this.imageUrl;
      this.visable = false;
    },
    // 添加
    async submit() {},

    // 上传方案图片
    loadImage() {
      this.visable = true;
    },

    // 预览图片
    load(file) {
      console.log(file);
      // 待上传方案图片
      this.submitScheme.file = file;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        return reader.result;
      };
      setTimeout(() => {
        this.imageUrl = reader.onloadend();
      }, 500);
    },
    ...mapGetters(["isCreateNewScheme"]),
    // 会话存储获取数据
    getStorageData() {
      this.scheme.treatId = window.sessionStorage.getItem("treatId");
      this.scheme.path = window.sessionStorage.getItem("path");
      this.scheme.effect = window.sessionStorage.getItem("effect");
      this.scheme.treatName = window.sessionStorage.getItem("treatName");
      this.scheme.reason = window.sessionStorage.getItem("reason");
      console.log(this.scheme.treatId);
    },
    // 获取该方案的所有穴位信息
    async getAllAcpuPoins() {
      console.log(this.scheme.treatId);
      const result = await this.$http.get("/ilustrate/ilustrateInfomation", {
        params: {
          treatId: this.scheme.treatId,
        },
      });
      // console.log(result.data.data[0].xueWeiList);
      // console.log('穴位图',result.data.data[0]);
      // this.xueWeiList = [{}];
      // let length = this.xueWeiList.length;
      if(result.data.data[0]) {
        this.xueWeiList = result.data.data[0].xueWeiList;
      }
      console.log(this.xueWeiList);
      let length = this.xueWeiList.length;
      this.$set(this.xueWeiList, length, {})
    },
    //取消并退出
    cancel() {
      this.scheme = {};
      this.$router.push("/schemeManagement");
    },

    // 提交表单
    async submit() {
      var formData1 = new window.FormData();
      this.submitScheme.treatName = this.scheme.treatName;
      this.submitScheme.reason = this.scheme.reason;
      this.submitScheme.effect = this.scheme.effect;
      console.log(this.submitScheme);
      if (this.submitScheme.file)
        formData1.append(
          "file",
          this.submitScheme.file,
          this.submitScheme.file.name
        );
      if(!this.scheme.path && !this.submitScheme.file) return this.$message.error("请放入图片");
      formData1.append("symptomName", this.submitScheme.treatName);
      formData1.append("treatName", this.submitScheme.treatName);
      formData1.append("reason", this.submitScheme.reason);
      formData1.append("effect", this.submitScheme.effect);
      if (
        !this.submitScheme.treatName ||
        !this.submitScheme.reason ||
        !this.submitScheme.effect
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
      this.$http
        .put("/ilustrate/ilustrate", formData1, config)
        .then((response) => {
          this.$message.success("添加成功");
          this.submitScheme = {};
          console.log(response);
          this.$router.push("/schemeManagement");
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
.acupoint-container {
  display: flex;
  flex-wrap: wrap;
}

.all-container {
  margin-bottom: 20px;
}
.point-cotainer {
  width: 250px;
  display: flex;
}
.point-cotainer img {
  width: 160px;
  height: 80px;
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
</style>
