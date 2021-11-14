<template>
  <div class="Learningvideo">
    <div class="headertext">欢迎使用USDT永续合约</div>
    <div>
      <p class="color_c">
        只有100%通过检测才能开始合约交易。观看以下视频帮助你了解合约的基本知识。
      </p>
    </div>
    <div class="palyvideo">
      <video poster="~@/assets/imgs/poster.jpg"></video>
    </div>
    <van-row type="flex" justify="center">
      <van-col span="24">
        <van-button
          type="info"
          block
          size="small"
          @click="$router.push('/contractAnswer')"
          >开始检测</van-button
        >
      </van-col>
    </van-row>
  </div>
</template>
<script>
export default {
  name: "Learningvideo",
  data() {
    return {
    };
  },

  methods: {},
  computed: {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.Learningvideo {
  padding: 0 20px;
  height: 100%;
  .headertext {
    font-size: 18px;
    line-height: 60px;
  }
  .palyvideo {
    // background-color: burlywood;
    height: calc(100% - 160px);
    // margin-bottom: 60px;
    video {
      height: 100%;
      width: 100%;
    }
  }
  /deep/.van-col{
      height: 60px;
      padding: 0 40px;
    // background-color: burlywood;
    display: flex;
    justify-content: center;
    align-items: center;
    position:fixed;
    bottom: 0;
    .van-button{
        
    }
  }
}
</style>