<!-- 
  	author        MrYi
	time          2021/03/15
	description   交易成功页面 // 购买出售成功
 -->
<template>
	<div class="tradeSuccess">
		<div class="title center"><img src="@/assets/imgs/iconsuccess.png" />交易成功</div>
		<div class="assets upper" v-if="tradeInfo.tradeType == 1">
			<h3>{{$fomatFloat(tradeInfo.num,6) + tradeInfo.coin_name}}</h3>
			<p>已存入您的资产</p>
		</div>
        <div class="assets upper" v-else>
            <h3>{{"￥" + tradeInfo.cny}}</h3>
			<p>您已成功出售了{{$fomatFloat(tradeInfo.num,6) + ' USDT'}}</p>
		</div>
		<div class="see">
            <van-button class="van-mybutton color_b" type="default" block  @click="submit('/assets')" v-if="tradeInfo.tradeType == 1">查看资产</van-button>
            <van-button class="van-mybutton color_b" type="default" block  @click="submit('/legalCurrencyTrade')" v-else>回到首页</van-button>
		</div>
		<div class="detail" @click="orderDetail">查看订单详情<i class="iconfont iconyou1"></i></div>
	</div>
</template>

<script>
	export default {
		name: 'tradeSuccess',
		data() {
			return {}
		},
        computed:{
            tradeInfo(){
                return this.$route.query
            }
        },
		components: {},
		methods: {
			submit(url){
				this.$router.replace(url)
			},
            orderDetail(){
				this.$router.go(-1)
            }
		},
		mounted() {
			// 成功页面，更改订单状态，以便返回查询
			this.$store.commit('SET_ORDER_STATE', '3')
		},
	}
</script>

<style lang="scss" scoped>
.tradeSuccess{
	height: 100%;
	background-color: $main-blue;
	color: #FFFFFF;
	.title{
		padding: 60px 0 120px 0;
		font-size: 18px;
		img{
			width: 25px;
			height: 25px;
			margin-right: 8px;
		}
	}
	.assets{
		text-align: center;
		h3{
			font-size: 36px;
			font-weight: 500;
			line-height: 50px;
			margin-bottom: 12px;
		}
		p{
			font-size: 16px;
			line-height: 22px;
		}
	}
	.see{
		padding: 110px 100px 70px 100px;
	}
	.detail{
		line-height: 22px;
		font-size: 16px;
		color: #EDEDED;
		text-align: center;
		.iconfont{
			margin-left: 10px;
		}
	}
}
</style>
