<!--  -->
<template>
  <div v-loading="loading">
    <el-dialog title="上传视频" :visible.sync="visable" width="500px">
      <el-form :model="video">
        <el-form-item>
          <el-input v-model="video.name" placeholder="视频名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <video
              v-if="videoUrl"
              :src="videoUrl"
              class="avatar"
              id="tempImg"
            ></video>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visable = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
    <div class="video_header">
      <span>视频管理</span>
      <button @click="addVideo()">添加视频</button>
    </div>
    <div class="allVideo">
      <video-box
        :videoName="videoData[index].videoName"
        :src="videoData[index].path"
        :uploadTime="videoData[index].createTime"
        v-for="(item, index) in videoData"
        :key="index"
      ></video-box>
    </div>
  </div>
</template>

<script>
import videoBox from "../public/video.vue";
export default {
  created() {
    this.getAllVideo();
  },
  data() {
    return {
      // 暂时显示的视频地址
      videoUrl: "",
      // 待上传视频
      video: {},
      // 所有视频数据
      videoData: {},
      visable: false,
      loading: false,
      file: "",
    };
  },
  provide() {
    return {
      reload: this.getAllVideo,
    };
  },
  components: {
    videoBox,
  },
  methods: {
    // 获取所有视频
    async getAllVideo() {
      this.loading = true;
      const result1 = await this.$http.get("/file/video2");
      if (
        result1.data.msg == "token过期" ||
        result1.data.msg == "这个账号在别的地方登陆，请重新登录"
      )
        return this.$message.error("登录状态过期，请重新登录");

      this.videoData = result1.data.data;

      // TODO:调试阶段加入地址前缀
      for (let i = 0; i < this.videoData.length; i++) {
        this.videoData[i].path =
          "http://47.112.125.53:8080/" + this.videoData[i].path;
      }
      this.loading = false;
      // console.log(result);
    },

    // 添加视频function
    addVideo() {
      // 清空
      this.video = {};
      this.videoUrl = "";
      // 拟态框
      this.visable = true;
    },

    // 上传视频
    async submit() {
      this.loading = true;
      var formData1 = new window.FormData();
      if (this.file) {
        formData1.append("file", this.file, this.file.name);
        formData1.append("videoName", this.video.name);
      }
      if (!this.video.name) {
        this.$message.error("请完整填写");
        return;
      }

      // 请求配置
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      this.visable = false;
      this.$http
        .put("/file/video", formData1, config)
        .then((response) => {
          this.$message.success("添加成功");
          this.loading = false;
          this.getAllVideo();
        })
        .catch((err) => {
          this.$message.warning("添加失败");
          this.loading = false;
        });
    },

    // 保存file(视频文件)
    beforeAvatarUpload(file) {
      this.file = file;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        return reader.result;
      };
      setTimeout(() => {
        this.videoUrl = reader.onloadend();
      }, 500);
    },
  },
};
</script>

<style scoped>
.video_header {
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 5px;
  width: 98%;
  border-bottom: 1px solid rgba(187, 187, 187, 0.5);
}
.video_header button {
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
.allVideo {
  padding-left: 50px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  flex-shrink: 1;
  align-content: center;
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
.video-box {
  flex-grow: 1;
}
</style>
