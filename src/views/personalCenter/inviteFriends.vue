<!--
  	author        MrYi
	time          2021/03/17
	description   邀请好友
 -->
<template>
  <div class="inviteFriends overflowPatible_box">
    <div class="inviteFriends_box">
      <div class="inviteCode invitebody">
        <p class="col-center fzboid"><span>我的邀请码</span><span class="code">{{invitationData.code || userInfo.uid}}</span><i
            class="iconfont iconfuzhi" @click="$copyText(invitationData.code || userInfo.uid)"></i></p>
      </div>
      <div class="statistics invitebody">
        <div class="title t_c fzboid">团队统计</div>
        <ul class="color_c">
          <li class="flexC_S"><span>上级ID：{{invitationData.parent_id}}</span><span>团队人数：{{invitationData.team_count}}</span></li>
          <li class="flexC_S"><span>今日直推业绩：{{invitationData.today_child_achievement}}</span><span>直属人数 (新增) ：{{invitationData.today_child_count}}</span></li>
          <li class="flexC_S"><span>今日团队总业绩：{{invitationData.today_team_achievement}}</span><span>直属代理 (新增) ：{{invitationData.today_child_agent_count}}</span></li>
        </ul>
        <div class="operation flexC_S">
          <div class="operation_btn center color_b" @click="routerPath('/teamPerformance')">我的团队</div>
          <div class="operation_btn center color_b" @click="routerPath('/myPerformance')">我的业绩</div>
        </div>
        <div class="t_c color_b inviteFriends_rule" @click="routerPath('/inviteRule')">邀请规则></div>
      </div>
      <div class="QRCode invitebody">
        <div class="title t_c fzboid">邀请二维码</div>
        <div class="img_box" @click="refresh">
          <vue-qr
              ref="qr"
              :size="150"
              :margin="0"
              :auto-color="true"
              :dot-scale="1"
              :text="appSrc"
              colorDark="#000"
              colorLight="#fff" />
        </div>
        <p class="t_c">邀请链接</p>
        <div class="copy color_b flexC_S">
          <div class="left">{{appSrc}}</div>
          <div class="right center" @click="$copyText(appSrc)"><i class="iconfont iconfuzhi"></i></div>
        </div>
        <!-- <van-button type="info" @click="$downloadFile($refs.qr.$el.src)">保存图片并分享</van-button> -->
        <van-button class="van-mybutton" type="info" block @click="createPoster">保存图片并分享</van-button>
      </div>
    </div>
    <div class="share_img center" :class="{'yesimg':isShow}" :style="{opacity : isShow ? 1 : 0}"  @click="isShow = false">
      <img :src="posterImg" alt="" @click.stop="">
      <div class="share_img_bj_box" v-show="!isShow">
        <div id="share_img_bj">
          <img  src="@/assets/imgs/Huobi_bg.jpg"/>
          <div class="share_text flex">
            <div class="share_text_l" @click="refresh">
              <vue-qr
                  ref="qr"
                  :size="150"
                  :margin="0"
                  :auto-color="true"
                  :dot-scale="1"
                  :text="appSrc"
                  colorDark="#000"
                  colorLight="#fff" />
            </div>
            <div class="share_text_r">
              <h3 class="color_b">随时随地开启交易</h3>
              <p>邀请你加入IH Global，长按识别二维码</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="inviteFriends_bj"></div>
  </div>
</template>

<script>
import {
  mapState
} from 'vuex'
import html2canvas from 'html2canvas'
import VueQr from 'vue-qr'
import { invitation, inviteLink } from '@/api/invite'
export default {
  name: 'inviteFriends',
  data() {
    return {
      isShow:false,
      posterImg: '', // 最终生成的海报图片
      invitationData: {}
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
    appSrc() {
      // return `${location.protocol}//${location.host}/#/register?code=${this.userInfo.uid}`
      return this.invitationData.link || `${location.protocol}//${location.host}/#/register?code=${this.userInfo.uid}`
    }
  },
  components: {
    VueQr
  },
  methods: {
    refresh() {
      inviteLink().then(res => {
        this.invitationData.link = res.data.link
      })
    },
    routerPath(url){
      this.$router.push(url)
    },
    createPoster () {
      // 生成海报
      const vm = this
      const domObj = document.getElementById('share_img_bj')

      html2canvas(domObj, {
        useCORS: true,
        allowTaint: false,
        logging: false,
        letterRendering: true,
        onclone (doc) {
          let e = doc.querySelector('#share_img_bj')
          e.style.display = 'block'
        }
      }).then( (canvas) => {
        vm.posterImg = canvas.toDataURL('image/png')
        vm.isShow = true
        var userAgent = navigator.userAgent;//获取UA信息
        if(userAgent.indexOf("IosAndroidIdentification") != -1){//判断ua中是否含有和app端约定好的标识
          let ua = navigator.userAgent;
          let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
          let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
          if (isiOS) {
            try {
              window.webkit.messageHandlers.triggerIosAndroidImgDownload.postMessage(vm.posterImg);//ios调用
            } catch(error) {
              console.log("ios error");
            }
            return
          }
          if (isAndroid) {
            try {
              window.android.triggerIosAndroidImgDownload(vm.posterImg) //Android调用
            } catch(error) {
              console.log("Android error");
            }
            return
          }
        }
      })
    },
    getInvitation() {
      invitation().then(res => {
        this.invitationData = res.data
      })
    }
  },
  created() {
    this.getInvitation()
  },
}
</script>

<style lang="scss" scoped>
.van-dialog{
  top: 50%;
  .conten_text_body{
    max-height: 300px;
    overflow: auto;
    margin: 20px 0;
    img {
      width: 100%;
      display: block;
    }
  }
  .title {
    line-height: 18px;
    font-size: 18px;
  }
}
.inviteFriends {
  height: 100%;
  background-color: #F9F9F9;
  position: relative;
  .inviteFriends_bj {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    z-index: 1;
    top: 0;
    background: url("~@/assets/imgs/inviteFriends_bj.png") no-repeat;
    background-size: cover;
  }
  .share_img{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    transition: all 0.1s;
    .share_img_bj_box{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      #share_img_bj{
        width: 302px;
        height: 617px;
        display: flex;
        flex-flow: column;
        img{
          width: 302px;
          height: auto
        }
        .share_text{
          height: 60px;
          padding:10px;
          .share_text_l{
            img{
              width: 50px;
              height: 50px;
            }
            margin-right: 10px;
          }
          .share_text_r{
            font-size: 10px;
            h3{
              font-size: 16px;
              line-height: 30px;
            }
          }
        }
      }
    }
    img{
      width: 75%;
      height: auto;
      -webkit-touch-callout:default
    }
  }
  .yesimg{
    z-index: 99;
    background-color: rgba(0,0,0,.2);
  }
  .inviteFriends_bj {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    z-index: 1;
    top: 0;
    background: url("~@/assets/imgs/inviteFriends_bj.png") no-repeat;
    background-size: cover;
  }
  .QRCode {
    padding: 0 48px;

    .title {
      font-size: 16px;
    }

    .img_box {
      height: 150px;
      width: 150px;
      margin: 15px auto;
    }

    .copy {
      margin: 20px 0 35px;
      padding: 0 40px;
      .left{
        width: calc(100% - 50px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .right{
        width: 30px;

      }
    }
  }

  .inviteCode {
    p {
      span {
        margin-right: 10px;
      }

      .code {
        font-size: 18px;
      }
      .iconfont{
        line-height: 1;
      }
    }
  }

  .statistics {
    .title {
      font-size: 16px;
    }

    ul {
      font-size: 12px;
      margin: 15px 0 20px 0;

      li {
        height: 27px;

        span {
          flex: 1;
        }
      }
    }

    .operation {
      padding: 0 30px;

      .operation_btn {
        width: 80px;
        height: 29px;
        border: 1px solid $main-blue;
        border-radius: 6px;
        font-size: 12px;
      }
    }
    .inviteFriends_rule{
      line-height: 20px;
      margin-top: 10px;
    }
  }

  .inviteFriends_box {
    position: absolute;
    padding: 20px 16px;
    width: 100%;
    height: 100%;
    left: 0;
    z-index: 2;
    top: 0;
    overflow-y: auto;
  }

  .invitebody {
    background: #FFFFFF;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
  }
}
</style>
