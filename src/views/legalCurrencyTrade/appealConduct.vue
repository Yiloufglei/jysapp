<!-- 
  	author        MrYi
	time          2021/03/15
	description   申诉中
 -->
<template>
	<div class="appealConduct publicOrderTradeStyle">
		<div class="publicOrderTrade_top flexC_S">
			<div class="top_l">
				<p class="fzboid top_l_t">{{$constant.appealState[orderDetail.appeal_state]}}</p>
				<p class="color_c top_l_b">等待客服处理</p>
			</div>
			<div class="top_r t_r">
				<p class="top_l_t">¥ {{orderDetail.cny}}</p>
				<p class="top_l_b">已付款</p>
			</div>
		</div>
		<div class="interval_bj"></div>
		<div class="purchaseMsg">
			<div class="purchaseMsg_top col-center"><i class="iconfont  iconUSDT buy-color"></i><span
					class="fzboid upper">购买{{orderDetail.coin_name}}</span></div>
			<ul class="publicMsg">
				<li class="flexC_S"><span class="color_c">总价</span><span>¥{{orderDetail.cny}}</span></li>
				<li class="flexC_S"><span class="color_c">价格</span><span>¥{{orderDetail.coin_price}}</span></li>
				<li class="flexC_S upper"><span class="color_c">数量</span><span>{{orderDetail.num}} {{orderDetail.coin_name}}</span></li>
				<li class="flexC_S"><span class="color_c">订单号</span><span class="col-center">{{orderDetail.order_id}}<i
							class="iconfont iconfuzhi" @click="$copyText(orderDetail.order_id)"></i></span></li>
			</ul>
		</div>
		<div class="interval_bj"></div>
		<div class="purchaseType">
			<ul class="publicMsg">
				<li class="flexC_S"><span class="color_c">{{orderDetail.s_user_type == 1 ? '买家' : '卖家'}}昵称</span><span class="col-center"
						@click="toPath">{{orderDetail.s_nickname || '--'}}
                        <i class="iconfont iconyou1 color_c" v-if="orderDetail.s_user_type == 2"
							style="font-size: 12px;"></i></span></li>
				<li class="flexC_S"><span class="color_c">收款方式</span><span class="col-center">
                    <i class="iconfont  text_c" style="font-size: 12px;" :class="$iconClassName(S_payment.account_type)"></i>
                   {{$constant.paymentType[S_payment.account_type]}}</span></li>
                <li class="flexC_S"><span class="color_c">申述原因</span><div class="t_r" style="width:70%;white-space:normal; word-break:break-all;">{{orderDetail.cause}}</div></li>
			</ul>
		</div>
		<div class="fixed_content_btm" v-if="userInfo.uid === orderDetail.uid">
            <van-button class="van-mybutton" type="info" block @click="appealCancel">取消申诉</van-button>
		</div>
	</div>
</template>

<script>
    import { appealInfoOtcTrans ,appealClearOtcTrans} from '@/api/legalCurrencyTrade'
    import { mapState } from 'vuex'
	export default {
		name: 'appealConduct',
		data() {
			return {
                orderDetail:{},
                S_payment:{}
            }
		},
		components: {},
        computed:{
			...mapState({
				userInfo: (state) => state.user.userInfo,
				aid: (state) => state.order.aid
			})
		},
		methods: {
			toPath() {
				if (this.orderDetail.s_user_type == 2) this.$router.push(`/businessDetail?poster_uid=${this.orderDetail.puid}`)
			},
			appealCancel(){
                appealClearOtcTrans({aid:this.orderDetail.aid}).then(res => {
                    this.$toast({
                        message:'取消申述成功'
                    })
					// 更改当前订单状态state
					this.$store.commit('SET_ORDER_STATE', '2')
                })
			}
		},
		mounted() {
            let aid = this.aid
            appealInfoOtcTrans({ aid }).then(res => {
                this.orderDetail = res.data.appealinfo
                this.S_payment = this.orderDetail.S_payment || {}
            })
        },
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';

	.appealConduct {
		.publicOrderTrade_top{
			.top_r .top_l_t{
				font-size: 20px;
			}
		}
	}
</style>
