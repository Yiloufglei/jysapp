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
                    <div class="switch_lc" @click="direction = !direction;getwalletCoin()">
                        <i class="iconfont iconshangxiayidongjiantou"></i>
                    </div>
                    <div class="switch_lb color_c">到</div>
                </div>
                <div class="accountSwitch_r" v-show="direction">
                    <div class="switch_rt center color_b">币币账户</div>
                    <div class="switch_rb center" @click.stop="isShow = !isShow"><span class="color_b">{{accountObj.name}}</span><i class="iconfont"  :class="{'iconsanjiao-top' : !isShow,'iconsanjiao-btm' : isShow}"></i>
                        <ul v-show="isShow">
                            <li v-for="item in accountList" :class="{'color_b':accountObj.name == item.name}" :key="item.vlaue" @click="setAccount(item)">{{item.name}}</li>
                        </ul>
                    </div>
                </div>
                <div class="accountSwitch_r" v-show="!direction">
                    <div class="switch_rb center" @click.stop="isShow = !isShow"><span class="color_b">{{accountObj.name}}</span><i class="iconfont" :class="{'iconsanjiao-btm' : !isShow,'iconsanjiao-top' : isShow}"></i>
                        <ul v-show="isShow">
                            <li v-for="item in accountList" :class="{'color_b':accountObj.name == item.name}" :key="item.vlaue" @click="setAccount(item)">{{item.name}}</li>
                        </ul>
                    </div>
                    <div class="switch_rt center color_b">币币账户</div>
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
                <Button type="primary" @click="submit" :disabled="disabled">划转</Button>
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
    import { walletTransfer,walletCoinSet } from "@/api/assets"
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
                list:[],
                codeInfo:{},
				num: '',
				direction:true,
                isSelectCurrency:false,
				isShow:false,
                accountObj:{
                    name:'逐仓账户',
                    vlaue:'pnum'
                },
                accountList:[
                    {
                        name:'逐仓账户',
                        vlaue:'pnum'
                    },
                    // {
                    //     name:'全仓账户',
                    //     vlaue:'panum'
                    // },
                    {
                        name:'法币账户',
                        vlaue:'fnum'
                    }
                ],
                walletCoin:{
                    operation:3,
                }
			}
		},
		computed: {
			...mapState({
                indexSelectItem : (state) => state.assets.indexSelectItem,
                leverAccount: (state) => state.assets.leverAccount, //逐仓
                legalAccount: (state) => state.assets.legalAccount, // 法币
			}),
            balance(){
                if(this.direction){
                    return (this.codeInfo.bnum || 0)
                }
                if(this.accountObj.vlaue == 'pnum'){
                    let data = this.leverAccount.find( v => v.coin_name.toLowerCase() === this.codeInfo.coin_name.toLowerCase()) || {}
                    return this.$fomatFloat((data.num || 0),6)
                }
                if(this.accountObj.vlaue == 'fnum'){
                    let data = this.legalAccount.find( v => v.coin_name.toLowerCase() === this.codeInfo.coin_name.toLowerCase()) || {}
                    return this.$fomatFloat((data.num || 0),6)
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
                    coin_name:this.codeInfo.coin_name,
                    num:this.num,
                    for_coin_type: this.direction ? 'bnum' : this.accountObj.vlaue,
                    to_coin_type: this.direction ? this.accountObj.vlaue : 'bnum',
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
                obj.to = this.direction ? this.accountObj.vlaue : 'bnum',
                walletCoinSet(obj).then(res => {
                    let data = res.data.list || []
                    this.list = data
                    if(JSON.stringify(this.codeInfo) !== '{}'){
                        this.codeInfo = data.find(v => (v.coin_name).toLowerCase() == (this.codeInfo.coin_name).toLowerCase()) || data[0] || {}
                    }else{
                        this.codeInfo = data[0] || {}
                    }
                })
            },
            init(){
                this.getwalletCoin()
            },
            select(item){
                this.isSelectCurrency = false
                this.codeInfo = item
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
			padding: 10px 0 0;
			height: 110px;

			.accountSwitch_l {
				width: 60px;
				text-align: center;

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
				padding-right: 20px;

				.switch_rt,
				.switch_rb {
					height: 40px;
					border: 1px solid #e6e6e6;
					border-radius: 6px;
					position: relative;
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
