<!--
   	author        MrYi
 	time          2021/03/11 
 	description   配资 5  /划转 3,4  /充币 1  提币  2  详情页面 
  -->
<template>
	<div class="contractTradeDetail">
		<div class="recordDetail_content">
			<div class="amountMoney fzboid upper color_b">0.00USDT</div>
			<div class="information">
				<div class="information_li flexC_S border_b_c" style="align-items: flex-start;">
                    <span>类型</span>
                    <div>
                        <p>平仓</p>
                        <p style="font-size: 12px;margin-top:5px" class="t_r">平多</p>
                    </div>
                </div>
				<div class="information_li flexC_S border_b_c"><span>状态</span><span>已完成</span></div>
				<div class="information_li flexC_S border_b_c"><span>时间</span><span>12:11:02/2020-03-12</span></div>
				<div class="information_li flexC_S border_b_c"><span>张数</span><span>-66</span></div>
			</div>
		</div>
	</div>
</template>

<script>
    import {
		mapState
	} from 'vuex'
	export default {
		name: "contractTradeDetail",
		props: {},
		components: {},
		data() {
			return {
                historyDetail:{},
                query:{}
			}
		},
		created() {

		},
		computed:{
            ...mapState({}),
		},
		mounted() {
		},
		methods: {

		}
	}
</script>
<style lang='scss' scoped>
	.contractTradeDetail {
		.recordDetail_content {
			padding: 0 16px;
			font-size: 14px;
			.amountMoney {
				font-size: 24px;
				padding: 20px 0;
				border-bottom: 1px solid #E6E6E6;
			}
			.information {
				.information_li {
					padding: 15px 0;
					color: $c-999;
				}
			}
		}
	}
</style>
