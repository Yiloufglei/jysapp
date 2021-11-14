<!-- 
  	author        MrYi
	time          2021/03/13
	description   商家详情
 -->
<template>
	<div class="businessDetail">
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			<div class="businessDetail_top">
				<div class="user_box col-center">
					<img v-if="merchant.head_url" :src="merchant.head_url" />
					<img v-else src="@/assets/imgs/home-user.png" />
					<div class="user_detail">
						<p class="fzboid">{{merchant.nick_name || '--'}}</p>
						<p class="color_c">注册时间 <span>{{merchant.created_at}}</span></p>
					</div>
				</div>
				<div class="buySellDetail flexC_S border_b_c">
					<div class="buySellDetail_content">
						<p class="flexC_S"><span class="color_c">总成单：</span><span>{{merchant.count_success}}次</span></p>
						<p class="flexC_S"><span class="color_c">30日成单：</span><span>{{merchant.count_success_30}}次</span></p>
					</div>
					<div class="buySellDetail_content">
						<p class="flexC_S"><span class="color_c">完成率：</span><span>{{$fomatFloat(merchant.trans_rate, 2)}}%</span></p>
						<p class="flexC_S"><span class="color_c">平均放行：</span><span>{{$fomatFloat(merchant.avg_confirm, 0)}}分钟</span></p>
					</div>
				</div>
				<ul class="col-center paymentGrade">
					<li class="col-center"><i class="iconfont iconrenzheng color_b"></i><span>手机认证</span></li>
					<li class="col-center"><i class="iconfont iconshenfenzheng color_g"></i><span>实名认证</span></li>
					<li class="col-center"><i class="iconfont icondaikuangailan color_gr"></i><span>保证金抵押</span></li>
				</ul>
			</div>
			<div class="interval_bj"></div>
			<div class="inline_buySell">
				<div class="inline_title border_b_c fzboid">在线购买</div>
				<onLineBuySellList :type="2" :dataList="buyList" />
			</div>
			<div class="interval_bj"></div>
			<div class="inline_buySell">
				<div class="inline_title border_b_c fzboid">在线出售</div>
				<onLineBuySellList :dataList="sellList" />
			</div>
		</van-pull-refresh>
	</div>
</template>

<script>
	import onLineBuySellList from './onLineBuySellList.vue'
    import { postersMcOtcTrans } from '@/api/legalCurrencyTrade'
    import { myPosterOtcPoster } from '@/api/advertisement'
	import { PullRefresh } from 'vant'
	export default {
		name: 'businessDetail',
		data() {
			return {
                buyList:[],
                sellList:[],
                merchant:{},
				refreshing: false
			}
		},
		components: {
			onLineBuySellList,
			[PullRefresh.name]: PullRefresh,
		},
		methods: {
            getMyPosterOtcPoster(){
                myPosterOtcPoster({state:1,uid:this.$route.query.poster_uid}).then(res => {
                    let data = res.data.list || []
                    this.buyList = data.filter((v) => v.buy_or_sell == 1)
                    this.sellList = data.filter((v) => v.buy_or_sell == 2)
					this.refreshing = false
                })
            },
            getPostersMcOtcTrans(){
                let obj = {
                    poster_uid:this.$route.query.poster_uid
                }
                postersMcOtcTrans(obj).then(res => {
                    this.merchant = res.data.merchant
					this.refreshing = false
                })
            },
			onRefresh() {
				this.getPostersMcOtcTrans()
            	this.getMyPosterOtcPoster()
			},
        },
		mounted() {
            this.getPostersMcOtcTrans()
            this.getMyPosterOtcPoster()
        },
	}
</script>

<style lang="scss" scoped>
	.businessDetail {
        height: 100%;
		font-size: 14px;
		::v-deep.van-pull-refresh{
			min-height: 100%;
		}
		.inline_buySell {
			padding: 0 16px;
			.inline_title {
				padding: 10px 0;
			}
		}
		.businessDetail_top {
			padding: 0 16px;
			.paymentGrade {
				height: 48px;
				font-size: 12px;
				li {
					margin-right: 15px;

					.iconfont {
						font-size: 18px;
						margin-right: 4px;
					}
				}
			}

			.buySellDetail {
				.buySellDetail_content {
					flex: 1;
					padding-right: 10px;

					&:nth-child(1) {
						padding-right: 20px;
					}

					p {
						line-height: 20px;
						margin-bottom: 15px;

						&:nth-child(1) {
							margin-bottom: 20px;
						}
					}
				}
			}

			.user_box {
				padding: 20px 0;

				img {
					width: 48px;
					height: 48px;
					border-radius: 50%;
					margin-right: 26px;
				}

				.fzboid {
					line-height: 22px;
					font-size: 16px;
					margin-bottom: 4px;
				}

				.color_c {
					line-height: 20px;
				}
			}
		}
	}
</style>
