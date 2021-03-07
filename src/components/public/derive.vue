<template>
  <div>
    <button @click="derive">导出</button>
  </div>
</template>

<script>
export default {
  created() {
    this.token = window.sessionStorage.getItem("token");
  },
  data() {
    return {
      token: ""
    };
  },
  props: ["url"],
  methods: {
    derive() {
      // console.log(this.token);
      let url = this.url;
      let xhr = new XMLHttpRequest();
      xhr.open("get", url, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("token", this.token);
      xhr.send();
      xhr.responseType = "blob";
      xhr.onload = function () {
        if (this.status === 200) {
          var blob = this.response;
          let href = window.URL.createObjectURL(blob);
          let link = document.createElement("a");
          link.href = href;
          link.download = "订单记录";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(href);
        } else {
          alert("出现了未知的错误!");
        }
      };
    },
  },
  props: ["url"]
};
</script>

<style scoped>
button{
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
