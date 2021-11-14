<!-- 
  	author        MrYi
	time          2021/03/15
	description   待收款
 -->
<template>
	<div class="pendingPayment publicOrderTradeStyle">
		<div class="publicOrderTrade_top flexC_S">
			<div class="top_l">
				<p class="fzboid top_l_t">等待买家付款</p>
				<!-- <p class="color_c top_l_b"> 还未收到对方付款？点击 <span class="color_b">联系对方</span></p> -->
			</div>
			<img class="right-icon" src="@/assets/imgs/wait-icon.png" alt="">
		</div>
		<div class="interval_bj"></div>
		<div class="purchaseMsg">
			<div class="purchaseMsg_top col-center"><i class="iconfont iconUSDT buy-color"></i><span
					class="fzboid upper">出售{{orderDetail.coin_name}}</span></div>
			<ul class="publicMsg">
				<li class="flexC_S"><span class="color_c">总价</span><span>¥{{orderDetail.cny}}</span></li>
				<li class="flexC_S"><span class="color_c">价格</span><span>¥{{orderDetail.coin_price}}</span></li>
				<li class="flexC_S upper"><span class="color_c">数量</span><span>{{$fomatFloat(orderDetail.num,6)}} {{orderDetail.coin_name}}</span></li>
				<li class="flexC_S"><span class="color_c">订单号</span><span class="col-center">{{orderDetail.order_id}}<i
							class="iconfont iconfuzhi" @click="$copyText(orderDetail.order_id)"></i></span></li>
			</ul>
		</div>
		<div class="interval_bj"></div>
		<div class="purchaseType">
			<ul class="publicMsg">
				<li class="flexC_S">
                    <span class="color_c">买家昵称</span>
                    <span class="col-center" @click="toPath">{{orderDetail.s_nickname || '--'}}
                        <i class="iconfont iconyou1 color_c" v-if="orderDetail.s_user_type == 2"></i>
                    </span>
                </li>
			</ul>
		</div>
		<div class="fixed_content_btm">
            <van-button class="van-mybutton" type="info" block disabled>我确定已收到货款</van-button>
		</div>
	</div>
</template>

<script>
    import { waitPayOtcTrans } from '@/api/legalCurrencyTrade'
	export default {
		name: 'pendingPayment',
		data() {
			return {
                trans_id:'',
                orderDetail:{},
                timer:null
			}
		},
        beforeDestroy() {
			if(this.timer){
                clearInterval(this.timer)
            }
		},
		components: {},
		methods: {
            init(){
                this.trans_id = this.$route.query.orderID
                waitPayOtcTrans({trans_id:this.trans_id}).then(res => {
                    if(res.data.wait.state == 2){
                        clearInterval(this.timer)
						this.$store.commit('SET_ORDER_STATE', '2')
                        return
                    }
                    this.orderDetail = res.data.wait
                })
            },
			toPath() {
				if(this.orderDetail.s_user_type == 2) this.$router.push(`/businessDetail?poster_uid=${this.orderDetail.puid}`)
			}
        },
		mounted() {
            this.init()
            this.timer = setInterval(() => {
                this.init()
            }, 3000);
        }
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';

	.pendingPayment {
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
