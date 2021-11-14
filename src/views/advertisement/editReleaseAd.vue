<!-- 
  	author        MrYi
	time          2021/03/17
	description   编辑发布广告  // 发布  1    编辑  2
 -->
<template>
	<div class="editReleaseAd overflowPatible">
        <myHeader :title="editReleaseType === 1 ? '发布广告' : '编辑广告'">
            <template v-if="editReleaseType === 1" v-slot:right>
                <span @click="routerPath('/myAdvertisement')" class="color_c">我的广告</span>
            </template>
        </myHeader>
        <div class="editReleaseAd_body">
            <CellInput
                title="广告类型"
                type="radio"
                :disabled="editReleaseType !== 1"
                v-model="buySellType"
                :options="adOptions"></CellInput>
            <CellInput
                title="选择币种"
                v-model="selectCoin.coin_name"
                placeholder="请选择币种"
                @click="isSelectCurrency = true"
                type="select"></CellInput>
            <CellInput
                title="选择法币"
                value="CNY"
                type="select"></CellInput>
            <CellInput
                title="出价方式"
                :value="1"
                :options="biddingOptions"
                type="radio"></CellInput>
            <CellInput
                v-model="formData.coin_price"
                title="交易价格"
                placeholder="请输入交易价格"
                inputType="number"
                unit="CNY"
                :precision="2"
                :desc="`当前市价：${usdtCny} CNY`"></CellInput>
            <CellInput
                v-model="formData.trans_num"
                title="发布数量"
                placeholder="请输入发布数量"
                inputType="number"
                :precision="6"
                :unit="selectCoin.coin_name"
                :desc="`可用：${balance}`"></CellInput>
            <CellInput
                v-model="formData.trans_min"
                title="单笔最小限额"
                placeholder="请输入单笔最大限额"
                inputType="number"
                :precision="2"
                unit="CNY"></CellInput>
            <CellInput
                v-model="formData.trans_max"
                title="单笔最大限额"
                placeholder="请输入单笔最大限额"
                inputType="number"
                :precision="2"
                unit="CNY"></CellInput>
            <CellInput
                title="服务时段"
                placeholder="请选择时段"
                :value="selectopening_time.opening_start + '-' + selectopening_time.opening_end"
                @click="selectShow = true"
                type="select"></CellInput>
            <div class="operation_btm fixed_content_btm">
                <van-button class="van-mybutton" type="info" block @click="submit" :disabled="disabled">{{editReleaseType == 2 ? '确认修改' : '立即发布'}}</van-button>
            </div>
            <div class="fixedSeizeSeat"></div>
        </div>
        <van-dialog class="timedialog" v-model="selectShow" title="选择时间" show-cancel-button :showCancelButton="false" @confirm="selectShow= false">
            <ul class="select_body">
                <li :class="selectopening_time == item ? 'color_b' : ''" @click="selectopening_time = item" v-for="(item,index) in opening_time" :key="index" class="border_b_c">{{item.opening_start + '--' + item.opening_end}}</li>
            </ul>
        </van-dialog>
        <selectCurrency @select="select" :list="coinsets" :isShow.sync="isSelectCurrency"/>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
    import myHeader from '@/components/common/header'
    import { oinsetOtcTrans , openingTimeOtcPoster , bondCreatOtcPoster , posterEditOtcPoster} from "@/api/advertisement"
    import selectCurrency from "@/components/selectCurrency"
    import CellInput from "@/components/common/cellInput"
    import _get from "lodash/get"
    import _find from "lodash/find"
	export default {
		name: 'editReleaseAd',
		data() {
			return {
                selectShow:false,
				buySellType: 1,
                formData:{
                    trans_to_coin:'CNY',
                    price_type:'1',
                    coin_price:'',
                    trans_num:'',
                    trans_min:'',
                    trans_max:'',
                },
                coinsets:[],
                selectCoin:{
                    coin_name: ''
                },
                opening_time:[],
                selectopening_time:{},
                isSelectCurrency:false,
                adOptions: [{
                    label: '购买广告',
                    value: 1
                },{
                    label: '出售广告',
                    value: 2
                }],
                biddingOptions: [{
                    label: '固定价格',
                    value: 1
                }]
			}
		},
		computed: {
			...mapState({
                userInfo: (state) => state.user.userInfo,
                advertiserInfo: (state) => state.advertisement.advertiserInfo,
            }),
            usdtCny () {
                return this.$store.getters.usdt_cny
            },
            disabled() {
                let data = this.formData
                if(data.trans_num && data.trans_min && data.trans_max && data.coin_price){
                    return false
                }
				return true
			},
			editReleaseType(){
				return this.$route.query.type || 1
			},
            legalAccount() {
                return _get(this.$store.state, 'assets.legalAccount') || []
            },
            balance() {
                let obj = _find(this.legalAccount, {'coin_name': this.selectCoin.coin_name})
                const coin_name = this.selectCoin.coin_name.toUpperCase()
                let num = 0
                if (obj) {
                    num = obj.num || 0
                }
                return this.$fomatFloat((num || 0),6) + coin_name
            }
		},
		components: {
            selectCurrency,
            myHeader,
            CellInput
        },
		methods: {
            routerPath (url) {
                this.$router.push(url)
            },
            select(val){
                this.selectCoin = val
                this.isSelectCurrency = false
            },
			submit(){
                this.formData.coin_name = this.selectCoin.coin_name
                this.formData.opening_end = this.selectopening_time.opening_end
                this.formData.opening_start = this.selectopening_time.opening_start
                this.formData.uid = this.userInfo.uid
                if(this.editReleaseType == 1){
                    this.formData.buy_or_sell = this.buySellType
                    bondCreatOtcPoster(this.formData).then(res => {
                        this.$toast({
                            message:"发布成功"
                        })
                        this.$router.push('/myAdvertisement')
                    })
                }
                if(this.editReleaseType == 2){
                    this.formData.buy_or_sell = this.advertiserInfo.buy_or_sell
                    this.formData.poster_id = this.advertiserInfo.id
                    posterEditOtcPoster(this.formData).then(res => {
                        this.$toast({
                            message:"编辑成功"
                        })
                        this.$store.commit('SET_ADDETAILS',{})
                        this.$router.replace('/myAdvertisement')
                    })
                }
			},
            init(){
                oinsetOtcTrans().then(res => {
                    this.coinsets = res.data.coinsets || []
                    if(this.editReleaseType == 1){
                        this.selectCoin = this.coinsets[0] || {}
                    }else{
                        this.selectCoin = {coin_name:this.advertiserInfo.coin_name}
                    }
                })
                openingTimeOtcPoster().then(res => {
                    this.opening_time = res.data.opening_time || []
                    if(this.editReleaseType == 1){
                        this.selectopening_time = this.opening_time[0] || {}
                    }else{
                        this.selectopening_time = {
                            opening_start:this.advertiserInfo.opening_start,
                            opening_end:this.advertiserInfo.opening_end
                        }
                    }
                })
                //编辑
                if(this.editReleaseType == 2){
                    this.formData.trans_min = this.advertiserInfo.trans_min
                    this.formData.trans_max = this.advertiserInfo.trans_max
                    this.formData.coin_price = this.advertiserInfo.coin_price
                    this.formData.trans_num = this.advertiserInfo.total_num
                }
            }
		},
		mounted() {
            this.$store.dispatch("set_usdt_cny");
            this.$store.dispatch("getwalletAssetsLlist");
            this.init()
            // 如果法币账户列表为空，重新请求数据
            if (this.legalAccount.length === 0 ) {
                this.$store.dispatch("getwalletAssetsLlist");
            }
        },
	}
</script>

<style lang="scss" scoped>
    .timedialog{
        min-height: 100px;
        .select_body{
            min-height: 100px;
            overflow-y: auto;
            max-height: 200px;
            li{
                line-height: 30px;
            }
        }
    }
	.editReleaseAd {
        height: 100%;
        .editReleaseAd_body{
            height: calc(100% - 45px);
            overflow-y: auto;
            padding: 10px 16px 0px 16px;
        }
        
		.interval_bj{
			margin: 0 -16px 0 -16px;
		}
		.editReleaseAd_content{
			padding-bottom: 10px;
			div{
				height: 38px;
				margin-bottom: 10px;
				.iconfont{
					margin-left: 10px;
				}
				input{
					width: 124px;
					height: 29px;
					border: 1px solid #9B9B9B;
					border-radius: 2px;
					text-align: center;
					&::-webkit-input-placeholder{
						color:$c-999;
						font-size:11px;
					}
				}
				.iptr_text{
					width: 50px;
				}
			}
		}
		.editReleaseAd_top {
			padding: 10px 0;
			.business {
				width: 100%;
				height: 38px;
				border: 1px solid $c-999;
				div {
					flex: 1;
					height: 100%;
				}
				.border_r {
					border-right: 1px solid $c-999;
				}
			}
		}
	}

</style>
