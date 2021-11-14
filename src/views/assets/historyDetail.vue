<!--
   	author        MrYi
 	time          2021/03/11 
 	description   配资 5  /划转 3,4  /充币 1  提币  2  详情页面 
  -->
<template>
	<div class="historyDetail">
		<div class="recordDetail_content">
			<div class="amountMoney fzboid upper color_b" v-if="isAllocation">{{(historyDetail.bonds || 0) + ' usdt'}}</div>
			<div class="amountMoney fzboid upper color_b" v-else>{{$fomatFloat((historyDetail.num || 0),8) + ' ' + (historyDetail.coin_name || ' usdt')}}</div>
			<div class="information">
				<div class="title">详细信息</div>
                <div class="information_li flexC_S border_b_c" v-if="isAllocation"><span>类型</span><span>{{$constant.allocationType[historyDetail.type_flag]}}</span></div>
				<div class="information_li flexC_S border_b_c" v-else-if="detailType == 3 || detailType == 4">
					<span>类型</span>
					<span>{{react == 4 ? '转出：' :'转入：'}}{{($constant.transferState[historyDetail.from] || '') + '到' + ($constant.transferState[historyDetail.to] || '')}}</span>
				</div>
				<div class="information_li flexC_S border_b_c" v-else><span>类型</span><span>{{$constant.actState[query.act]}}</span></div>

				<div class="information_li flexC_S border_b_c" v-if="isAllocation"><span>状态</span><span>已完成</span></div>
				<template v-else>
					<div class="information_li flexC_S border_b_c">
						<span>状态</span>
						<template v-if="detailType == 1">
							<span>{{$constant.assetsLogState[historyDetail.state]}}</span>
						</template>
						<template v-else-if="detailType == 2">
							<span>{{$constant.withdrawState[historyDetail.state]}}</span>
						</template>
						<template v-else>
							<span>已完成</span>
						</template>
					</div>
					<!-- <div class="information_li flexC_S border_b_c" v-if="detailType == 2"><span>状态</span><span>{{$constant.withdrawState[historyDetail.state]}}</span></div>
					<div class="information_li flexC_S border_b_c" v-if="detailType == 3 || detailType == 4"><span>状态</span><span>已完成</span></div> -->
				</template>
				<div v-if="detailType == 2" class="information_li flexC_S border_b_c"><span>提币地址</span><span class="rightSpan">{{historyDetail.address}}</span></div>
				<div v-if="detailType == 2" class="information_li flexC_S border_b_c t_r upper"><span>手续费</span><span class="rightSpan">{{historyDetail.fee + ' ' + historyDetail.coin_name}}</span></div>
				<div v-if="detailType == 1 || detailType == 2" class="information_li flexC_S border_b_c t_r"><span>区块链交易ID</span><span class="rightSpan">{{historyDetail.tx}}</span></div>
				<div class="information_li flexC_S border_b_c" v-if="isAllocation"><span>时间</span><span>{{$formatDate(historyDetail.begin_time)}}</span></div>
				<div class="information_li flexC_S border_b_c" v-else><span>时间</span><span>{{$formatDate(historyDetail.created_at)}}</span></div>
			</div>
		</div>
	</div>
</template>

<script>
    import {
		mapState
	} from 'vuex'
    import { walletAssetsLogInfo } from "@/api/assets";
    import { getHistoryLeverDetail } from "@/api/leverage"
	export default {
		name: "historyDetail",
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
			detailType(){
				return this.$route.query.act || ''
			},
			react() {
				return this.$route.query.react || ''
			},
			isAllocation() {
				return this.query.type == 3 || this.query.type == 4
			}
		},
		mounted() {
            this.query = this.$route.query
            if(this.isAllocation){
                getHistoryLeverDetail({id:this.query.id}).then(res => {
                    this.historyDetail = res.data.data || {}
                })
                return false
            }
            let obj = {
                act : this.query.act,
                oid : this.query.oid,
                type : this.query.type,
            }
            walletAssetsLogInfo(obj).then(res =>{
                this.historyDetail = res.data.log_info || {}
            })
		},
		methods: {

		}
	}
</script>
<style lang='scss' scoped>
	.historyDetail {
		.recordDetail_content {
			padding: 0 16px;
			font-size: 14px;

			.amountMoney {
				font-size: 24px;
				padding: 20px 0;
				border-bottom: 1px solid #E6E6E6;
			}

			.information {
				padding-top: 34px;

				.title {
					line-height: 32px;
				}

				.information_li {
					padding: 15px 0;
					color: $c-999;
					.rightSpan{
						width: 200px;
                        text-align: right;
						word-break: break-all;
						line-height: 20px;
					}
				}
			}
		}
	}
</style>
