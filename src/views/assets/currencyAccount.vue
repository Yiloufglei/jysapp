<!--
   	author        MrYi
 	time          2021/03/11 
 	description   逐仓账户信息
  -->
<template>
	<div class="currencyAccount overflowPatible_box">
		<div class="currencyAccount_top upper">
			<div class="title fzboid">{{indexSelectItem.coin_name}}</div>
			<div class="accountTitle">逐仓账户</div>
			<ul>
				<li class="flexC_S"><span>类型</span><span>{{indexSelectItem.coin_name}}</span></li>
				<li class="flexC_S"><span>可用</span><span>{{$fomatFloat(indexSelectItemObj.pnum || 0,8)}}</span></li>
				<li class="flexC_S"><span>冻结</span><span>{{$fomatFloat(indexSelectItemObj.pnumfrozen || 0,8)}}</span></li>
				<li class="flexC_S"><span>配资</span><span>{{$fomatFloat(indexSelectItemObj.pborrowed || 0,8)}}</span></li>
			</ul>
			<p class="fzboid">净资产折合 {{" ≈ " + $fomatFloat(indexSelectItemObj.totalMoney || 0)}} CNY</p>
		</div>
		<div class="interval_bj"></div>
		<div class="currencyAccount_content">
			<div class="content_title flexC_S">
				<span class="fzboid">当前申请</span>
				<span class="color_c right" @click="routerPath('/allocationHistory?act=5')">历史</span>
			</div>
            <div class="currencyAccount_content_body">
				<van-list
					v-model="loading"
					:finished="finished"
					finished-text="没有更多了"
					:offset="10"
					@load="loadMore"
					v-if="tabData.length > 0"
				>
					<div class="publicListStyle border_b_c " v-for="item in tabData" :key="item.id" @click="historyDetail(item)">
						<p class="typeText color_c">{{$constant.allocationType[item.typeFlag]}}</p>
						<div class="flexC_S flex_ul">
							<div class="list_l">
								<p class="color_c">数量</p>
								<span>{{$fomatFloat(item.allocationMoney,8)}}</span>
							</div>
							<div class="list_c">
								<p class="color_c">状态</p>
								<span>{{$constant.allocationState[item.allocationStatus] || '--'}}</span>
							</div>
							<div class="list_r">
								<p class="color_c">时间</p>
								<span>{{$formatDate(item.createdAt,'/')}}</span>
							</div>
						</div>
					</div>
				</van-list>
				<div class="no-data" v-else-if="!loading && finished"></div>
            </div>
		</div>
		<div class="actionBar flexC_S">
			<!-- <div class="actionBa_list t_c"  @click="routerPath('/leverage')">
				<img class="left_img" src="@/assets/imgs/allocation.png" alt="" />
				<p  class="">配资</p>
			</div> -->
			<div v-if="indexSelectItem.swich_trans === 1" class="actionBa_list t_c"  @click="routerPath(`/capitalTransfer?account=pnum&coin_name=${indexSelectItem.coin_name}`)">
				<img class="centre_img" src="@/assets/imgs/transfer_text.png" alt="" />
				<p  class="">划转</p>
			</div>
			<div class="actionBa_list t_c"  @click="routerPath('/trade', 'lever')">
				<img class="right_img" src="@/assets/imgs/allocationTrade.png" alt="" />
				<p  class="color_b">配资交易</p>
			</div>
		</div>
	</div>
</template>

<script>
    import { mapState } from 'vuex'
    import { getAllocationAccout } from "@/api/leverage";
	import { List } from 'vant'
	export default {
		name: "currencyAccount",
		props: {},
		components: {
			[List.name]:List
		},
		data() {
			return {
                tabData :[],
                total: 0,
                loading: true,
				finished: false,
                pageData:{
                    curpage:1,
                    pageSize:5,
					coinBase: ''
                },
                indexSelectItemObj:{}
			};
		},
        computed:{
            ...mapState({
                indexSelectItem : (state) => state.assets.indexSelectItem,
			}),
        },
		created() {},
		mounted() {
            this.$store.dispatch("getwalletAssetsLlist");
			this.pageData.coinBase = this.indexSelectItem.coin_name
            this.getCurrentLeverFun()
        },
		methods: {
            getCurrentLeverFun(){
                getAllocationAccout(this.pageData).then(res =>{
                    let data = res.data
                    this.indexSelectItemObj = data.account || {}
                    this.total = data.account.totalRows || 0
                    let list = data.list || []
                    this.tabData = this.pageData.curpage == 1 ? list : [...this.tabData,...list]
					if (this.tabData.length >= data.total) this.finished = true
                    this.loading = false;
                }).catch(err => {
					this.loading = false;
				})
            },
            loadMore() {
				this.loading = true;
				this.pageData.curpage += 1
				setTimeout(() => {
					this.getCurrentLeverFun()
				}, 1000)
			},
            historyDetail(item){
                // this.routerPath(`/historyDetail?id=${item.id}&act=5`)
            },
			routerPath(url, type){
				if (url === '/leverage') this.$store.commit('SET_COIN_NAME', this.indexSelectItem.coin_name)
				if (type) {
					let params = {
                        tradeType : type,
                        symbolName : this.indexSelectItem.coin_name+'/usdt',
                    }
                    this.$store.commit('SET_USERSYMBOL', params)
					this.$store.commit('SET_TRADE_TYPE', type)
				}
				this.$router.push(url)
			}
		},
	};
</script>
<style lang="scss" scoped>
	.currencyAccount {
        height: 100%;
        padding-bottom: 80px;
		.currencyAccount_top {
			background: #fff;
			padding: 20px 16px 15px;
            height: 225px;

			.title {
				font-size: 20px;
				line-height: 22px;
				color: $main-blue;
			}

			.accountTitle {
				line-height: 20px;
				margin-top: 12px;
			}

			ul {
				font-size: 12px;
				margin: 15px 0;

				li {
					line-height: 22px;

					span {
						&:nth-child(1) {
							color: $c-999;
						}

						&:nth-child(2) {
							color: $main-font-c;
						}
					}
				}
			}

			p {
				text-align: right;
			}
		}
		.currencyAccount_content {
			background: #fff;
			.content_title {
				height: 50px;
				font-size: 16px;
                padding: 0 16px;
				.right{
					font-size: 12px;
				}
			}
            .currencyAccount_content_body{
                padding: 0 16px;
                overflow: auto;
            }
			.typeText {
				line-height: 20px;
                height: 20px;
                font-size: 14px;
                margin-bottom: 16px;
			}
            .flex_ul{
                div{
                    flex: 1;
					span{
						font-size: 14px;
						color: #000000;
					}
                }
            }
		}

	}
</style>
