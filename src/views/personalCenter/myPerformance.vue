<!-- 
  	author        MrYi
	time          2021/03/17
	description   我的业绩
 -->
<template>
	<div class="teamPerformance">
		<div class="teamPerformance_top">
			<div class="flexC_S summary_box">
				<div>
					<p>本周佣金收入</p>
					<span>{{detailsData.now_commission}}</span>
				</div>
				<div>
					<p>本周团队业绩</p>
					<span>{{detailsData.now_childs_achievement}}</span>
				</div>
				<div>
					<p>本周直属业绩</p>
					<span>{{detailsData.now_child_achievement}}</span>
				</div>
			</div>
			<div class="flexC_S summary_box">
				<div>
					<p>上周佣金收入</p>
					<span>{{detailsData.pre_commission}}</span>
				</div>
				<div>
					<p>上周团队业绩</p>
					<span>{{detailsData.pre_childs_achievement}}</span>
				</div>
				<div>
					<p>上周直属业绩</p>
					<span>{{detailsData.pre_child_achievement}}</span>
				</div>
			</div>
			<div class="interval_bj"></div>
		</div>
		<div class="teamPerformance_content">
			<ul class="teamPerformance_tab flex">
				<li :class="{active : tabIndex == 1}" @click="tabIndexClick(1)">业绩明细</li>
				<li :class="{active : tabIndex == 2}" @click="tabIndexClick(2)">收入明细</li>
			</ul>
			<div class="table_top flexC_S color_c">
				<p>时间</p>
				<p class="t_c">{{tabIndex == 1 ? '日团队业绩' : '日团队收入'}}</p>
				<p class="t_r">{{tabIndex == 1 ? '日直属业绩' : '日直属收入'}}</p>
			</div>
			<div class="myPerformance_table">
				<van-list
					v-model="loading"
					:finished="finished"
					finished-text="没有更多了"
					:offset="10"
					@load="loadMore"
					v-if="tabData.length > 0"
				>
					<div class="table_content flexC_S border_b_c" v-for="(item,index) in tabData" :key="index">
						<p>{{item.day}}</p>
						<p class="t_c">{{ tabIndex == 1 ? item.achievements : item.commissions}}</p>
						<p class="t_r">{{ tabIndex == 1 ? item.achievement : item.commission}}</p>
					</div>
				</van-list>
				<div class="no-data" v-else-if="!loading && finished"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import { myAchievement, detailAchievement, detailCommission } from '@/api/invite'
	import { List } from 'vant'
	export default {
		name: 'myPerformance',
		components: {
			[List.name]:List
		},
		data() {
			return {
				total: 0,
				loading: true,
				tabIndex: 1,
				tabData: [],
				detailsData: {},
				pageData: {
                    page: 1,
                    page_size: 10,
                }
			}
		},
		methods: {
			loadMore() {
				this.pageData.page += 1
				this.loading = true;
				setTimeout(() => {
					this.getDetailAchievement()
				}, 500)
			},
			tabIndexClick(val) {
				this.tabData = []
				this.pageData.page = 1
				this.total = 0
				this.tabIndex = val
				this.loading = true;
				this.finished = false
				this.getDetailAchievement()
			},
			getDetailAchievement() {
				let actions = this.tabIndex === 1 ? detailAchievement : detailCommission
				actions(this.pageData).then(res => {
					this.total = res.data.total
					this.tabData = [...this.tabData,...res.data.list]
					this.loading = false;
					if (this.tabData.length >= this.total) this.finished = true
				})
			}
		},
		created() {
			myAchievement().then(res => {
				this.detailsData = res.data
			})
			this.loading = true;
			this.getDetailAchievement()
		},
		mounted() {},
	}
</script>

<style lang="scss" scoped>
	.teamPerformance {
		height: 100%;

		.teamPerformance_top {
			height: 145px;
			padding: 10px 0 0;

			.summary_box {
				font-size: 12px;
				text-align: center;
				margin-bottom: 10px;
				padding: 0 16px;

				P {
					line-height: 17px;
					color: $c-999;
					margin: 10px 0;
				}

				span {
					color: $main-blue;
				}
			}
		}

		.teamPerformance_content {
			padding: 0 16px;
			height: calc(100% - 145px);

			.table_top {
				padding: 10px 0 15px;
				height: 42px;
			}

			.myPerformance_table {
				height: calc(100% - 90px);
				overflow-y: auto;

				&::-webkit-scrollbar {
					display: none;
				}
			}

			.table_content {
				padding: 15px 0;
			}

			.table_top,
			.table_content {
				font-size: 12px;

				p {
					flex: 1;
					line-height: 17px;
				}
			}

			.teamPerformance_tab {
				padding-top: 15px;
				height: 48px;

				li {
					position: relative;
					height: 30px;
					margin-right: 30px;
					font-size: 16px;
				}

				.active {
					color: $main-blue;

					&::after {
						content: '';
						width: 100%;
						height: 2px;
						background-color: $main-blue;
						position: absolute;
						bottom: 0;
						left: 0;
					}
				}
			}
		}
	}
</style>
