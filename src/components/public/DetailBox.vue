<template>
  <div class="detail-box">
    <span>{{itemName}}：{{number}}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: ["itemName", "number"]
}

</script>

<style scoped>
.detail-box {
  position: relative;
  width: 205px;
  height: 84px;
  border-radius: 5px;
  background-color: #636b66;
}
.detail-box span {
  position: absolute;
  width: 80%;
  left: 50%;
  top: 50%;
  transform: translate(-40%, -50%);
  color: white;
}
</style>
