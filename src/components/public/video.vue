<template>
<div class="container">

  <div class="video-container">
    <video :src="src" @mouseover="ShowControls" @mouseleave="HideControls"  :id="videoName"></video>
    <ul>
      <li>{{videoName}}</li>
      <li>{{uploadTime}}</li>
      <li><a href="javascript:;" @click="deleteVideo" >删除</a></li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  inject: ['reload'],
  props: ["videoName", "uploadTime", "src"],
  methods: {
    // 删除视频
    async deleteVideo() {
      // console.log(this.videoName);
      const result = await this.$http.delete('/file/video', {
        data: {
          "videoName": this.videoName
        }
      })
      this.reload()
    },

    ShowControls() {
      document.getElementById(this.videoName).controls = true
    },
    HideControls() {
      document.getElementById(this.videoName).controls = false
    }
  }
};
</script>

<style scoped>
.container {
  padding-right: 30px;
  padding-bottom: 40px;
}
.video-container {
  margin: 0;
  padding: 0;
  display: flex;
  /* width: 260px; */
  font-size: 14px;
}
.video-container video {
  /* border: 1px solid rgba(0, 0, 0, .5); */
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, .1);
  width: 250px;
  height: 200px;
}

ul {
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  list-style: none;
  padding-left: 20px;
  width: 100px;
}
li {
  width: 100px;
}
li a {
  text-decoration: none;
  color: red;
}
</style>
