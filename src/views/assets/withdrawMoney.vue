<!-- 
  	author        MrYi
	time          2021/03/15
	description   充币
 -->
<template>
    <div  class="withdrawMoney">
        <myHeader title="充币">
            <template v-slot:right>
                <i class="iconfont iconshiyongjilu" @click="routerPath(`/withdrawhistory?type=1&coin_name=${codeInfo.coin_name}`)"></i>
            </template>
        </myHeader>
        <div class="withdrawMoney_body">
            <div class="selectCurrency-top">
                <div class="title fzboid">选择币种</div>
                <div class="select_li flexC_S border_b_c" @click="isSelectCurrency = true">
                    <span class="color_b upper">{{codeInfo.coin_name}}</span>
                    <i class="iconfont iconyou1"></i>
                </div>
                <div class="title fzboid">链名称</div>
            </div>
            <div class="QRCode selectContent">
                <div class="flex upper">
                    <div class="center clickBtn" v-for="(item,index) in codeInfo.link" :key="item.name" :class="{active : addressType === index}" @click="switchAddressType(item,index)">{{item.coin_link}}</div>
                </div>
                <div class="center img_box" id="qrId">
                    <vue-qr ref="qr"  :size="150" :margin="0" :auto-color="true" :dot-scale="1"
                        :text="appSrc" colorDark="#000" colorLight="#fff" />
                </div>
                <div class="operation t_c">
                    <p class="color_b" @click="$appDownloadFile('qrId', $refs.qr.$el.src)">保存地址二维码</p>
                    <p class="fzboid">充币地址</p>
                    <div class="addressCopy">
                        {{appSrc}}
                    </div>
                    <div class="addressCopyBtn center" @click="$copyText(appSrc)">复制地址</div>
                </div>
            </div>
            <ul class="explain color_c upper">
                <li>充币说明</li>
                <li>1、请勿向上述地址充值任何非{{codeInfo.coin_name}} 资产，否则资产将无法收回。</li>
                <!-- <li>2、最小充值金额：1USDT，小于最小金额的充值将不会上账且无法退回。</li> -->
                <li>2、您充值到上述地址后，您需要确认整个网络节点，可能出现延迟，请耐心等待。</li>
                <li>3、您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告或邮件通知您。</li>
                <li>4、请务必确认计算机及浏览器安全，防止信息别篡改或泄露。</li>
            </ul>
            <selectCurrency @select="select" :isShow.sync="isSelectCurrency" :list="list"/>
        </div>
    </div>
</template>
<script>
import VueQr from 'vue-qr'
import {
    mapState
} from 'vuex'
import selectCurrency from "@/components/selectCurrency"
import { getWalletAddress,walletCoinSet} from "@/api/assets"
import myHeader from '@/components/common/header'
export default {
    name: 'withdrawMoney',
    data () {
        return {
            isSelectCurrency: false,
            addressType: 0,
            linkObj:{},
            appSrc: '',
            list:[],
            codeInfo:{}
        }
    },
    computed: {
        ...mapState({
        }),
    },
    components: {
        VueQr,
        myHeader,
        selectCurrency
    },
    methods: {
        select (item) {
            this.isSelectCurrency = false
            this.codeInfo = item
            this.linkObj =  item.link[0] || {}
            this.getAddress();
        },
        routerPath (url) {
            this.$router.push(url)
        },
        switchAddressType (item,index) {
            this.addressType = index
            this.linkObj = this.codeInfo.link[index]
            this.getAddress();
        },
        getwalletCoin(){
            return new Promise((resolve) => {
                walletCoinSet({operation:1}).then(res => {
                    let data = res.data.list || []
                    this.list = data
                    let query = this.$route.query.coin_name
                    if(query){
                        this.codeInfo = data.find( v => v.coin_name.toLowerCase() === query.toLowerCase())
                        this.linkObj =  this.codeInfo.link[0]
                    }else{
                        this.codeInfo = data[0] || {}
                        this.linkObj =  this.codeInfo.link && this.codeInfo.link[0] || {}
                    }
                    if(this.linkObj.coin_name){
                        resolve(true)
                    }else{
                        resolve(false)
                    }
                })
            })
        },
        getAddress(){
            let obj = {
                coin_name:this.linkObj.coin_name,
                coin_link:this.linkObj.coin_link
            }
            getWalletAddress(obj).then(res => {
                this.appSrc = res.data.address
            })
        },
        async init(){
            let coin = await this.getwalletCoin()
            if(coin) {
                this.getAddress()
            }
        }
    },
    mounted () {
        this.init();
    },
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
.withdrawMoney {
    height: 100%;
    .withdrawMoney_body{
        padding: 0 16px 10px;
        height: calc(100% - 45px);
        overflow: auto;
    }
    .QRCode {
        margin-bottom: 20px;
        .operation {
            p {
                text-align: center;
                line-height: 20px;
                margin-bottom: 16px;
            }
        }
        .img_box {
            margin: 20px 0;
            height: 150px;
        }
        .addressCopy {
            padding: 5px 20px;
            background: #f7f7f7;
            border-radius: 4px;
            word-wrap:break-word ;
        }
        .addressCopyBtn{
            width: 60px;
            height: 25px;
            line-height: 25px;
            background: #F7F7F7;
            border-radius: 4px;
            display: inline-block;
            margin-top: 10px;
            color: #9B9B9B;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: bold;
        }
    }
}
</style>
