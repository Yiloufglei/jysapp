<!-- 
  	author        MrYi
	time          2021/03/15
	description   已收款
 -->
<template>
	<div class="alreadyPayment publicOrderTradeStyle">
		<div class="publicOrderTrade_top flexC_S">
			<div class="top_l">
				<p class="fzboid top_l_t">{{orderDetail.state == 6 ? $constant.orderState[orderDetail.state] : '等待收款'}}</p>
				<p class="color_c top_l_b" v-if="orderDetail.state == 6">等待后台处理，详情可联系客服</p>
				<p class="color_c top_l_b" v-else>对方标记付款成功，请确认收款</p>
			</div>
			<img v-if="orderDetail.state != 6" class="right-icon" src="@/assets/imgs/wait-icon.png" alt="">
			<img v-else class="right-icon" src="@/assets/imgs/sigh-icon.png" alt="">
		</div>
		<div class="interval_bj"></div>
		<div class="purchaseMsg">
			<div class="purchaseMsg_top col-center"><i class="iconfont iconUSDT buy-color"></i><span class="fzboid upper">出售{{orderDetail.coin_name}}</span></div>
			<ul class="publicMsg">
				<li class="flexC_S"><span class="color_c">总价</span><span>¥{{orderDetail.cny}}</span></li>
				<li class="flexC_S"><span class="color_c">价格</span><span>¥{{orderDetail.coin_price}}</span></li>
				<li class="flexC_S upper"><span class="color_c">数量</span><span>{{$fomatFloat(orderDetail.num,6)}} {{orderDetail.coin_name}}</span></li>
				<li class="flexC_S"><span class="color_c">订单号</span><span class="col-center">{{orderDetail.order_id}}<i class="iconfont iconfuzhi"  @click="$copyText(orderDetail.order_id)"></i></span></li>
			</ul>
		</div>
		<div class="interval_bj"></div>
		<div class="purchaseType">
			<ul class="publicMsg">
				<li class="flexC_S" @click="pathRouter">
                    <span class="color_c">买家昵称</span>
                    <span class="col-center">{{orderDetail.s_nickname || '--'}}
                        <i v-if="orderDetail.s_user_type == 2" class="iconfont iconyou1 color_c" style="font-size: 12px;"></i>
                    </span>
                </li>
				<li class="flexC_S">
                    <span class="color_c">买家姓名</span>
                    <span class="col-center">{{S_payment.real_name || '--'}}<i class="iconfont iconfuzhi"  @click="$copyText(S_payment.real_name)"></i></span>
                </li>
				<li class="flexC_S"><span class="color_c">{{$constant.paymentType[orderDetail.pay_type]}}收款账号</span><span class="col-center">{{S_payment.created_at}}<i class="iconfont iconfuzhi"  @click="$copyText(S_payment.created_at)"></i></span></li>
			</ul>
		</div>
		<div class="flexC_S fixed_content_btm" v-if="orderDetail.state != 6">
            <van-button class="van-mybutton button_body_l" type="default" block @click="appeal">申诉</van-button>
            <van-button class="van-mybutton button_body_r" type="info" block @click="cancelVisible = true">我确定已收到货款</van-button>
		</div>
		<MySecondaryDialog :visible="cancelVisible" title="安全验证" @confirm="confirm" cancelText="我再想想"
			@cancel="cancelVisible = false" :disabled="!type">
			<div class="cancelSecondaryDialog_body">
				<p class="title_text">请务必登陆网上银行或第三方账户确认收到该笔货款</p>
				<div class="check_body col-center">
                    <van-checkbox v-model="type" icon-size="16px" shape="square"><span class="color_c">我确认已登陆收款账户，并核对收款无误</span></van-checkbox>
				</div>
			</div>
		</MySecondaryDialog>
	</div>
</template>

<script>
    import { transConfirmOtcTrans , waitPayOtcTrans  } from '@/api/legalCurrencyTrade'
	import util from "@/utils/util";
	export default {
		name: 'alreadyPayment',
		data() {
			return {
				cancelVisible: false,
				type: false,
                orderID:'',
                orderDetail:{},
                S_payment:{},
                timer:null
			}
		},
		components: {
		},
		methods: {
            pathRouter(){
                if(this.orderDetail.s_user_type == 2) this.$router.push(`/businessDetail?poster_uid=${this.orderDetail.puid}`)
            },
			confirm() {
                transConfirmOtcTrans({trans_id:this.orderID}).then(res =>{
                    this.cancelVisible = false
					this.$store.commit('SET_ORDER_STATE', '3')
                    this.$router.push(`/tradeSuccess?tradeType=2&num=${this.orderDetail.num}&cny=${this.orderDetail.cny}&coin_name=${this.orderDetail.coin_name}&id=${this.orderDetail.id}`)
                })
			},
			appeal(){
				// 申述 带上当前url参数
				this.$router.push(`/appeal?${util.queryParams(this.$route.query)}`)
			},
            init(){
                waitPayOtcTrans({trans_id:this.orderID}).then(res => {
                    this.orderDetail = res.data.wait
                    this.S_payment = this.orderDetail.S_payment
                    if(this.orderDetail.state == 6){
                        clearInterval(this.timer)
                    }
                    if(this.orderDetail.state == 4){
                        clearInterval(this.timer)
                        this.$store.commit('SET_ORDER_STATE', '4')
                    }
                    if(this.orderDetail.state == 8){
                        clearInterval(this.timer)
                        this.$router.replace('/myOrder')
                    }
                })
            }
		},
        beforeDestroy() {
			if(this.timer){
                clearInterval(this.timer)
            }
		},
		mounted() {
            this.orderID = this.$route.query.orderID
            this.init()
            this.timer = setInterval(() => {
                this.init()
            }, 20000);
        },
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
	.alreadyPayment {
		.fixed_content_btm {
			.button_body_l {
				width: 110px;
				margin-right: 10px;
				font-size: 14px;
			}

			.button_body_r {
				flex: 1;
			}
		}

		.paymentSecondaryDialog_body {
			padding: 50px 0 10px;
			font-size: 14px;
			line-height: 20px;

			.title_text {
				margin-bottom: 12px;
			}
		}
	}
</style>
