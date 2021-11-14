<template>
  <div class="answer">
    <div class="headertext">
      <h2>合约检测</h2>
      <div v-if="!wrongnum.length&&!Submitflag">您已作答{{Answerednum.length}}/10题</div>
      <div v-if="wrongnum.length">{{wrongnum.length}}题作答有误</div>
      <div v-if="Submitflag" style="color: green;">答题全部正确</div>
    </div>
    <div class="answerList">
      <div class="answerone">
        <p>1.USDT永续合约最多提供几倍杠杆：</p>
        <van-radio-group v-model="radio.answerone">
          <van-radio name="1">125X</van-radio>
          <van-radio name="2">100X</van-radio>
          <van-radio name="3">75X</van-radio>
        </van-radio-group>
      </div>
      <div class="answerone">
        <p>2.USDT永续合约不支持哪个钱包进行交易：</p>
        <van-radio-group v-model="radio.answertwo">
          <van-radio name="1">U本位合约钱包</van-radio>
          <van-radio name="2">币本位合约钱包</van-radio>
          <van-radio name="3">杠杆钱包</van-radio>
        </van-radio-group>
      </div>
      <div class="answerone">
        <p>3.合约交易最大的亏损风险为何？</p>
        <van-radio-group v-model="radio.answerthree">
          <van-radio name="1">100%保证金余额</van-radio>
          <van-radio name="2">30%保证金余额</van-radio>
          <van-radio name="3">2.5%保证金余额</van-radio>
        </van-radio-group>
      </div>
      <div class="answerone">
        <p>4.哪个不是交割合约与永续合约的差异？</p>
        <van-radio-group v-model="radio.answerfour">
          <van-radio name="1">资金费用</van-radio>
          <van-radio name="2">下单方式</van-radio>
          <van-radio name="3">到期日</van-radio>
        </van-radio-group>
      </div>
      <div class="answerone">
        <p>5.USDT永续合约采用那种价格来判断用户是否爆仓？</p>
        <van-radio-group v-model="radio.answerfive">
          <van-radio name="1">过去1小时平均价格</van-radio>
          <van-radio name="2">最新价格</van-radio>
          <van-radio name="3">标记价格</van-radio>
        </van-radio-group>
      </div>
      <div class="answerone">
        <p>6.当用户的保证金余额低于何者时，会收到补充保证金通知以免爆仓？</p>
        <van-radio-group v-model="radio.answersix">
          <van-radio name="1">加权保证金</van-radio>
          <van-radio name="2">破产保证金</van-radio>
          <van-radio name="3">维持保证金</van-radio>
        </van-radio-group>
      </div>
      <div class="answerone">
        <p>7.U本位钱包里，BNB是否可以用来做为保证金开仓？</p>
        <van-radio-group v-model="radio.answerseven">
          <van-radio name="1">可以</van-radio>
          <van-radio name="2"> 不可以，U本位钱包里的BNB只能作为手续费扣抵</van-radio>
        </van-radio-group>
      </div>
      <div class="answerone">
        <p>8.用户的未实现盈利，是否可以用来作为保证金开仓？</p>
        <van-radio-group v-model="radio.answereight">
          <van-radio name="1">可以</van-radio>
          <van-radio name="2">不可以</van-radio>
        </van-radio-group>
      </div>
      <div class="answerone">
        <p>9.当合约最新价格出现剧烈波动时，不建议用户采取哪种行动？</p>
        <van-radio-group v-model="radio.answernine">
          <van-radio name="1">采用标记价格作为止盈止损的参考价格</van-radio>
          <van-radio name="2">降低杠杆以避免爆仓风险</van-radio>
          <van-radio name="3">使用市价单追涨杀跌</van-radio>
        </van-radio-group>
      </div>
      <div class="answerone">
        <p>10.用户应该贷款来交易合约吗？</p>
        <van-radio-group v-model="radio.answerten">
          <van-radio name="1">应该，我相信我一定能从中获利</van-radio>
          <van-radio name="2">不应该，我必须按照自身的财务条件量力而为。</van-radio>
        </van-radio-group>
      </div>
    </div>
    <div class="Submitbutton">
      <van-button
          v-if="flag"
          :disabled=disabledflag
          type="info"
          block
          @click="Answerprompt"
          size="small">
          <van-count-down
            ref="countDown"
            millisecond
            :time="30000"
            :auto-start="false"
            :format=answertext
            @finish="finish"
          >
          </van-count-down>
          </van-button
      >
      <van-button
        v-if="!Submitflag&&!flag"
          type="info"
          block
          size="small"
          @click="Submitanswers"
          >提交答案</van-button
      >
      <van-button
        v-if="Submitflag"
          type="info"
          block
          size="small"
          @click="Submitcontent"
          >去交易合约</van-button
      >
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
        answertext:"提交答案",
        radio:{
          answerone:"",
          answertwo:"",
          answerthree:"",
          answerfour:"",
          answerfive:"",
          answersix:"",
          answerseven:"",
          answereight:"",
          answernine:"",
          answerten:"",
        },
        wrongnum:"",
        Answerednum:"",
        correctanswer:["1", "3", "1", "2", "3", "3", "2", "1", "3", "2"],//正确答案
        correctanswerclass:["1", "6", "7", "11", "15", "18", "20", "21", "25", "27"],
        wrongtext:[],
        flag:true,
        disabledflag:true,
        Submitflag:false
        
    };
  },
  watch:{
    radio:{
      handler(val, oldVal){
        let list = []
        let wronglist = []
        for (const key in oldVal) {
          if (oldVal.hasOwnProperty.call(oldVal, key)) {
            wronglist.push(oldVal[key])
            if (oldVal[key] !='') {
              const element = oldVal[key];
              list.push(element)
            }
            
          }
        }
        this.wrongtext = wronglist
        this.Answerednum = list
        if (this.disabledflag) {
          this.start()
        }
      },
      deep: true
    }
  },
  methods: {
     finish() {
      this.answertext = '提示答案'
      this.disabledflag = false
    },
    start() {
      this.$refs.countDown.start();
      this.answertext="提示答案(sss)";
    },
    //答案提示方法
    Answerprompt(){
      let nodeelement = document.getElementsByClassName('van-radio')
      this.correctanswerclass.forEach((element,index) => {
        nodeelement[element-1].classList.add("active")
      });
      this.flag = false
    },
    Submitanswers(){
      let wrongtext = this.wrongtext;
      let correcttext = this.correctanswer
      let list = []
      wrongtext.forEach((item,index) => {
        if (item!=correcttext[index]) {
            console.log(item,"this.wrongnum",correcttext[index])
            list.push(correcttext[index])
          }
      });
      if (!list.length) {
        this.Submitflag = true
      }
      this.wrongnum = list
        console.log(list,"wrongnum")
    },
    Submitcontent(){
      this.$router.push('/contractIndex')
    }
  },
  computed: {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.answer {
  padding:0 20px;
  .headertext {
    background-color: #fff;
    position: fixed;
    left: 0;
    top: 45px;
    line-height: 45px;
    width: 100%;
    padding-left: 20px;
    z-index: 2;
    p{
        font-size: 16px;
    }
  }
  .answerList{
    overflow-y: auto;
    margin-top: 90px;
    padding-bottom: 60px;
    .answerone{
      margin-top: 10px;
    }
    p{
      line-height: 20px;
      font-size: 14px;
      font-weight: bold;
    }
    /deep/.van-radio{
      line-height: 20px;
      margin:5px 0;
    }
    .active{
      /deep/.van-radio__label{
        color: red;
      }
    }
  }
  .Submitbutton{
    background-color: #fff;
    height: 60px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    padding:0 20px;
    justify-content: center;
    align-items: center;
    /deep/.van-button{
      width: 100%;
    }
  }
}
</style>