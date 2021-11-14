<!-- 
	description   交易订单详情
 -->
<template>
	<div class="detail-page">
		<!-- 下拉时，导致底部按钮位置偏移，暂时不用下拉刷新 -->
		<!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh"> -->
			<template v-if="state == 1">
				<template v-if="sellRole == 1">
					<stayPayment></stayPayment>
				</template>
				<template v-else>
					<pendingPayment></pendingPayment>
				</template>
			</template>
			<template v-else-if="state == 2">
				<template v-if="sellRole == 1">
					<sellerConfirm></sellerConfirm>
				</template>
				<template v-else>
					<alreadyPayment></alreadyPayment>
				</template>
			</template>
			<template v-else-if="state == 8">
				<appealConduct></appealConduct>
			</template>
			<template v-else>
				<orderDetail></orderDetail>
			</template>
		<!-- </van-pull-refresh> -->
	</div>
</template>

<script>
	import orderDetail from './orderDetail.vue'
	import stayPayment from './stayPayment.vue'
	import pendingPayment from './pendingPayment.vue'
	import sellerConfirm from './sellerConfirm.vue'
	import alreadyPayment from './alreadyPayment.vue'
	import appealConduct from './appealConduct.vue'
	import _get from 'lodash/get'
	import { PullRefresh } from 'vant'
	export default {
		name: 'orderDetailV2',
		inject:['reload'],
		data() {
			return {
				// 订单状态 1.待付款；2.待放币(已付款)；3.已放币；4.用户取消；5.超时取消；6.系统冻结；7.后台冻结；8.申诉中。
				// state: '',
				// 1 买 2 卖
				sellRole: '',
				refreshing: false
            }
		},
		components: {
			orderDetail,
			stayPayment,
			pendingPayment,
			sellerConfirm,
			alreadyPayment,
			appealConduct,
			[PullRefresh.name]: PullRefresh,
		},
		computed: {
			state() {
				// 订单状态 1.待付款；2.待放币(已付款)；3.已放币；4.用户取消；5.超时取消；6.系统冻结；7.后台冻结；8.申诉中。
				return _get(this.$store.state, 'order.orderState', '')
			}
		},
		watch: {
			state () {
				this.reload()
			}
		},
		created() {
			this.sellRole = this.$route.query.sellRole
		},
		methods: {
			onRefresh() {
				this.reload()
			},
		},
		
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
	.detail-page{
		height: 100%;
		::v-deep.van-pull-refresh{
			min-height: 100%;
		}
	}
</style>
