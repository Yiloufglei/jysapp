<!--
	author        MrYi
	time          2021/03/11 
	description   资金划转
  -->
<template>
	<div class="capitalTransfer upper" @click="isShow=false">
        <myHeader title="划转">
            <template v-slot:right>
                <i class="iconfont iconshiyongjilu" @click="routerPath(`/transferHistory?coin_name=${codeInfo.coin_name}`)"></i>
            </template>
        </myHeader>
        <div class="capitalTransfer_body">
            <div class="accountSwitch flexC_S">
                <div class="accountSwitch_l">
                    <div class="switch_lt color_c">从</div>
                    <div class="switch_lb color_c">到</div>
                </div>
                <div class="accountSwitch_r" v-show="direction">
                    <div class="switch_rt col-center color_b border_b_c">币币账户</div>
                    <van-popover
                        v-model="showPopover"
                        trigger="click"
                        :actions="accountList"
                        @select="setAccount"
                        >
                        <template #reference>
                            <div class="switch_rb flexC_S">
                                <span class="color_b">{{accountObj.text}}</span>
                                <i class="iconfont"  :class="{'iconyou1' : !isShow,'iconyou1-copy' : isShow}"></i>
                            </div>
                        </template>
                    </van-popover>
                </div>
                <div class="accountSwitch_r" v-show="!direction">
                    <van-popover
                        v-model="showPopover1"
                        trigger="click"
                        :actions="accountList"
                        @select="setAccount"
                        >
                        <template #reference>
                            <div class="switch_rb flexC_S border_b_c">
                                <span class="color_b">{{accountObj.text}}</span>
                                <i class="iconfont"  :class="{'iconyou1' : !isShow,'iconyou1-copy' : isShow}"></i>
                            </div>
                        </template>
                    </van-popover>
                    <div class="switch_rt col-center color_b">币币账户</div>
                </div>
                <div class="rightIcon center">
                    <div class="switch_lc" @click="direction = !direction;getwalletCoin()">
                        <img src="@/assets/imgs/capitalTransfer.png" alt="" />
                    </div>
                </div>
            </div>
            <div class="select_body">
                <div class="select_title fzboid">选择币种</div>
                <div class="select_content flexC_S border_b_c"  @click="isSelectCurrency = true">
                    <div class="select_content_l color_b">{{codeInfo.coin_name}}</div>
                    <div class="select_content_r">
                        <i class="iconfont iconyou1"></i>
                    </div>
                </div>
                <div class="select_title fzboid">划转数量</div>
                <Input v-model="num" type="number" :precision="6" placeholder="请输入划转数量">
                <template v-slot:after>
                    <div style="font-size: 16px;">
                        <span class="color_c">{{codeInfo.coin_name}}</span>
                        <span class="color_c" style="margin:0 10px">|</span>
                        <span class="fzboid" @click="num = balance">全部</span>
                    </div>
                </template>
                </Input>
            </div>
            <div class="balanceTips color_c">
                <div class="balance">当前可用余额 {{balance + ' ' + (codeInfo.coin_name || '')}}</div>
                <div class="tipTitle">温馨提示</div>
                <div class="tipText">只有资产化划转到对应账户才可进行交易，账户间的划转不收取手续费</div>
            </div>
            <div class="fixedSeizeSeat"></div>
            <div class="fixed_content_btm">
                <van-button class="van-mybutton" type="info" block @click="submit" :disabled="disabled">划转</van-button>
            </div>
        </div>
        <selectCurrency @select="select"  :isShow.sync="isSelectCurrency" :list="list"/>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
    import selectCurrency from "@/components/selectCurrency"
    import { walletTransfer,walletCoinSet,Contracttransfercurrency,getucttcantrans} from "@/api/assets"
    import myHeader from '@/components/common/header'
	export default {
		name: 'capitalTransfer',
		props: {},
		components: {
            selectCurrency,
            myHeader
        },
		data() {
			return {
                showPopover:false,
                showPopover1:false,
                list:[],
                codeInfo:{},
				num: '',
				direction:true,
                isSelectCurrency:false,
				isShow:false,
                accountObj:{
                    text:'法币账户',
                    vlaue:'fnum'
                },
                accountList:[
                    // {
                    //     text:'逐仓账户',
                    //     vlaue:'pnum'
                    // },
                    // {
                    //     text:'全仓账户',
                    //     vlaue:'panum'
                    // },
                    {
                        text:'法币账户',
                        vlaue:'fnum'
                    },
                    {
                        text:'期权账户',
                        vlaue:'qnum'
                    },
                    {
                        text:'合约账户',
                        vlaue:'utnum'
                    }
                ],
                walletCoin:{
                    operation:3,
                },
                hbalance:'',
                hcodeInfo:{}
			}
		},
		computed: {
			...mapState({
                indexSelectItem : (state) => state.assets.indexSelectItem,
                leverAccount: (state) => state.assets.leverAccount, //逐仓
                legalAccount: (state) => state.assets.legalAccount, // 法币
                qlistAccount: (state) => state.assets.qlistAccount,
			}),
            balance(){
                if(this.direction){
                    return this.$fomatFloat((this.codeInfo.bnum || 0),6)
                }
                if(this.accountObj.vlaue == 'pnum' && this.codeInfo.coin_name){
                    let data = this.leverAccount.find( v => v.coin_name.toLowerCase() === this.codeInfo.coin_name.toLowerCase()) || {}
                    return this.$fomatFloat((data.num || 0),6)
                }
                if(this.accountObj.vlaue == 'fnum' && this.codeInfo.coin_name){
                    let data = this.legalAccount.find( v => v.coin_name.toLowerCase() === this.codeInfo.coin_name.toLowerCase()) || {}
                    return this.$fomatFloat((data.num || 0),6)
                }
                if (this.accountObj.vlaue == 'qnum' && this.codeInfo.coin_name){
                    let data = this.qlistAccount.find( v => v.coin_name.toLowerCase() === this.codeInfo.coin_name.toLowerCase()) || {}
                    return this.$fomatFloat((data.num || 0),6)
                }
                if (this.accountObj.vlaue === 'utnum' && this.hbalance){
                    return this.hbalance
                }
                return 0.00
            },
            disabled(){
                if(this.num && Number(this.num) <= Number(this.balance) && Number(this.num > 0)){
                    return false
                }
                return true
            }
        },
        watch:{
            "codeInfo":function(e){
                if(this.accountObj.vlaue === 'utnum'){
                    getucttcantrans({quote_currency:this.codeInfo.coin_name}).then((res)=>{
                        this.hbalance = res.data.num
                    })
                }
            }
        },
		created() {},
		mounted() {
            let account = this.$route.query.account
            let coin_name = this.$route.query.coin_name
            if(account){
                this.direction = false
                this.accountObj = this.accountList.find(v => v.vlaue == account)
            }
            if(coin_name){
                this.codeInfo.coin_name = coin_name
            }
            this.init();
		},
		methods: {
            routerPath(url) {
				this.$router.push(url)
			},
            submit(){
                let obj = {
                    num:this.num,
                    coin_name:this.codeInfo.coin_name,
                    for_coin_type: this.direction ? 'bnum' : this.accountObj.vlaue,
                    to_coin_type: this.direction ? this.accountObj.vlaue : 'bnum',
                }
                if(this.accountObj.vlaue === 'utnum'){
                    obj.coin_name = 'usdt'
                    obj.ut_coin_name = this.codeInfo.coin_name
                }
                walletTransfer(obj).then(res => {
                    this.num = ''
                    this.$toast('划转成功')
                    this.$store.dispatch("getwalletAssetsLlist");
                    this.getwalletCoin()
                })
            },
            setAccount(item){
                this.accountObj = item
                this.getwalletCoin()
            },
            getwalletCoin(){
                let obj = this.walletCoin
                obj.from = this.direction ? 'bnum' : this.accountObj.vlaue,
                obj.to = this.direction ? this.accountObj.vlaue : 'bnum';
                    if (this.accountObj.vlaue =="utnum") {
                        Contracttransfercurrency({}).then((res)=>{
                            let data = res.data.symbols || []
                            data.forEach(v => {
                                v.coin_name = v.quote_currency
                            });
                            this.list = data
                            let obj =  JSON.parse(JSON.stringify(this.codeInfo))
                            let dataObj = {}
                            
                            if(JSON.stringify(this.codeInfo) !== '{}'){
                                dataObj = data.find(v => (v.quote_currency).toLowerCase() == (this.codeInfo.coin_name).toLowerCase()) || data[0] || {}
                            }else{
                                dataObj = data[0] || {}
                            }
                            if(this.direction){
                                dataObj.bnum =  this.$fomatFloat((obj.bnum || 0),6)
                            }
                            this.codeInfo = this.hcodeInfo =  dataObj
                        })
                    }else{
                        walletCoinSet(obj).then(res => {
                            let data = res.data.list || []
                            this.list = data
                            if(JSON.stringify(this.codeInfo) !== '{}'){
                                this.codeInfo = data.find(v => (v.coin_name).toLowerCase() == (this.codeInfo.coin_name).toLowerCase()) || data[0] || {}
                            }else{
                                this.codeInfo = data[0] || {}
                            }
                        })                      
                    }
            },
            init(){
                this.getwalletCoin()
            },
            select(item){
                this.isSelectCurrency = false
                if(this.accountObj.vlaue === 'utnum'){
                    this.codeInfo = this.hcodeInfo = {...this.hcodeInfo,...item}
                }else{
                    this.codeInfo = item
                }
            },
		},
	}
</script>
<style lang='scss' scoped>
	.capitalTransfer {
        font-size: 14px;
        .capitalTransfer_body{
            padding: 0 16px;
        }
		.accountSwitch {
            margin-top: 10px;
			height: 80px;
            border: 1px solid #F9F9F9;
            border-radius: 5px;
			.accountSwitch_l {
				width: 50px;
				text-align: center;
                padding-left: 10px;
                position: relative;
                &::after{
                    content: "";
                    width: 20px;
                    height: 100%;
                    background: url('~@/assets/imgs/capitalTransfer_left.png') no-repeat center;
                    background-size: 100%;
                    position: absolute;
                    left: 5px;
                    top: 0;
                }
				.switch_lt,
				.switch_lb {
					line-height: 40px;
				}

				.switch_lc {
					line-height: 20px;
					color: $main-blue;
				}
			}

			.accountSwitch_r {
				flex: 1;
				display: flex;
				height: 100%;
				flex-direction: column;
				justify-content: space-between;
				.switch_rt,
				.switch_rb {
					height: 40px;
                    line-height: 40px;
                    box-sizing: border-box;
                    padding-right: 10px;
                    padding-left: 20px;
                    .iconfont{
                        color: #999;
                        font-size: 14px;
                    }
					ul{
						position: absolute;
						left: 0;
						top: 40px;
						background-color: #FFFFFF;
						border: 1px solid #e6e6e6;
						width: 100%;
						padding: 0 10px;
						z-index: 1;
						li{
							line-height: 40px;
							border-bottom: 1px solid #e6e6e6;
						}
					}
				}
			}
            .rightIcon{
                width: 50px;
                background: #F9F9F9;
                height: 100%;
                border-radius:0 5px 5px 0;
                img{
                    width: 30px;
                    height: 30px;
                }
            }
		}

		.select_body {
			.select_title {
				line-height: 40px;
				margin-top: 10px;
			}

			.select_content {
				height: 46px;
			}
		}

		.balanceTips {
			font-size: 12px;

			div {
				line-height: 17px;
			}

			.balance {
				margin: 12px 0 20px;
			}

			.tipText {
				margin: 7px 0 20px;
			}
		}
	}
</style>
