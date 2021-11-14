<!-- 
  	author        MrYi
	time          2021/03/15
	description   交易订单详情
 -->
<template>
	<div class="orderDetail publicOrderTradeStyle">
		<div class="publicOrderTrade_top flexC_S">
			<div class="top_l">
				<p class="fzboid top_l_t">{{state == 5 ? '超时取消' : $constant.orderState[orderDetail.state]}}</p>
				<p class="color_c top_l_b" v-if="orderDetail.state == 4">订单取消无法查看支付消息</p>
				<p class="color_c top_l_b" v-if="orderDetail.state == 6">等待后台处理，详情可联系客服</p>
			</div>
			<img class="right-icon" v-if="orderDetail.state != 3" src="@/assets/imgs/sigh-icon.png" alt="">
			<i class="iconfont iconsuccess up-color" v-else></i>
		</div>
		<div class="interval_bj"></div>
		<div class="purchaseMsg">
			<div class="purchaseMsg_top col-center"><i class="iconfont  iconUSDT buy-color"></i><span
					class="fzboid upper">{{$constant.buy_or_sell[orderDetail.buy_or_sell] + orderDetail.coin_name}}</span></div>
            <ul class="publicMsg">
				<li class="flexC_S"><span class="color_c">总价</span><span>¥{{$fomatFloat((orderDetail.cny || 0),2)}}</span></li>
				<li class="flexC_S"><span class="color_c">价格</span><span>¥{{$fomatFloat((orderDetail.coin_price || 0),2)}}</span></li>
				<li class="flexC_S upper"><span class="color_c">数量</span><span>{{$fomatFloat((orderDetail.num || 0),6)}} {{orderDetail.coin_name}}</span></li>
				<li class="flexC_S"><span class="color_c">订单号</span><span class="col-center">{{orderDetail.order_id}}<i class="iconfont iconfuzhi"  @click="$copyText(orderDetail.order_id)"></i></span></li>
			</ul>
		</div>
		<div class="interval_bj"></div>
		<div class="purchaseType">
			<ul class="publicMsg">
				<li class="flexC_S">
                    <span class="color_c">{{orderDetail.buy_or_sell == 1 ? '卖家' : '买家'}}昵称</span>
                    <span class="col-center" @click="toPath">{{orderDetail.s_nickname || '--'}}
                        <i class="iconfont iconyou1 color_c" v-if="orderDetail.s_user_type == 2"></i>
                    </span>
                </li>
			</ul>
		</div>
	</div>
</template>

<script>
    import { transInfoTrans  } from '@/api/legalCurrencyTrade'
	import _get from 'lodash/get'
	export default {
		name: 'orderDetail',
		data() {
			return {
                orderDetail:{}
            }
		},
		computed: {
			state() {
				// 订单状态 1.待付款；2.待放币(已付款)；3.已放币；4.用户取消；5.超时取消；6.系统冻结；7.后台冻结；8.申诉中。
				return _get(this.$store.state, 'order.orderState', '')
			}
		},
		components: {},
		methods: {
			toPath() {
				if(this.orderDetail.s_user_type == 2) this.$router.push(`/businessDetail?poster_uid=${this.orderDetail.puid}`)
			}
		},
		mounted() {
            let id = this.$route.query.orderID
            transInfoTrans({trans_id:id}).then(res => {
                this.orderDetail = res.data.TransInfo
            })
        },
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
