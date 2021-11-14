<!-- 
  	author        MrYi
	time          2021/03/11
	description   币币账户
 -->
<template>
	<div class="coinslAccount overflowPatible_box">
		<div class="financialRecords_body account_body_style">
			<van-list
				v-model="loading"
				:finished="finished"
				:finished-text="tabData.length === 0 ? '' : '没有更多了'"
				:offset="10"
				@load="loadMore"
			>
				<div class="account_body_style_top">
					<p class="title_text fzboid upper">{{indexSelectItem.coin_name}}</p>
					<div class="publicListStyle flexC_S">
						<div class="list_l">
							<p class="color_c">可用</p>
							<span>{{$fomatFloat(indexSelectItem.num,8)}}</span>
						</div>
						<div class="list_c">
							<p class="color_c">冻结</p>
							<span>{{$fomatFloat(indexSelectItem.frozen,8)}}</span>
						</div>
						<div class="list_r">
							<p class="color_c">折合(CNY)</p>
							<span>{{" ≈ " + $fomatFloat(indexSelectItem.cny)}}</span>
						</div>
					</div>
				</div>
				<div class="interval_bj"></div>
				<div class="account_body_style_title flexC_S">
					<span>财务记录</span>
					<div class="center" @click="visible = true"><i class="iconfont iconshaixuan"></i></div>
				</div>
				<div class="list_body">
					<recordList :list="tabData" :typeName="2" v-if="tabData.length > 0"/>
					<div class="no-data" v-else-if="!loading && finished"></div>
				</div>
			</van-list>
		</div>
		<div class="actionBar flexC_S">
			<div v-if="indexSelectItem.swich_recharge === 1" class="actionBa_list t_c"  @click="routerPath(`/withdrawMoney?coin_name=${indexSelectItem.coin_name}`)">
				<img src="@/assets/imgs/chargeMoney_text.png" alt="" />
				<p  class="">充币</p>
			</div>
			<div v-if="indexSelectItem.swich_withdraw === 1" class="actionBa_list t_c"  @click="routerPath(`/chargeMoney?coin_name=${indexSelectItem.coin_name}`)">
				<img src="@/assets/imgs/withdrawMoney_text.png" alt="" />
				<p  class="">提币</p>
			</div>
			<div v-if="indexSelectItem.swich_trans === 1" class="actionBa_list t_c"  @click="routerPath(`/capitalTransfer?coin_name=${indexSelectItem.coin_name}`)">
				<img src="@/assets/imgs/transfer_text.png" alt="" />
				<p  class="">划转</p>
			</div>
			<div class="actionBa_list t_c"  @click="routerPath('/trade', 'spot')">
				<img src="@/assets/imgs/coinsTrade-1.png" alt="" />
				<p  class="color_b">币币交易</p>
			</div>
		</div>
		<van-action-sheet
			v-model="visible"
			:actions="sheetList"
			cancel-text="取消"
			close-on-click-action
			@select="itemClick"
			@cancel="visible = false"
			close-on-popstate
			safe-area-inset-bottom
		/>
	</div>
</template>

<script>
	import recordList from '@/components/recordList'
    import { walletAssetsLog } from "@/api/assets";
    import { mapState } from 'vuex'
	import { List } from 'vant'
	export default {
		name: 'coinslAccount',
		components: {
			recordList,
			[List.name]:List
		},
		computed:{
            ...mapState({
                indexSelectItem : (state) => state.assets.indexSelectItem,
			}),
            sheetList() {
                let list = [
                    { name: '全部', id: ''},
                    { name: '充币', id: 1 },
                    { name: '提币', id: 2 },
                    { name: '转入', id: 3 },
                    { name: '转出', id: 4 },
                ]
                list.forEach((v) => {
                    if(v.id === this.defaultVal.id){
                        v.color = '#4e82f3'
                    }
                })
				return  list
			},
        },
		data() {
			return {
                visible:false,
				loading: true,
                total: 0,
				tabData: [],
                pageData:{
                    page:1,
                    page_size:5,
                    type:1,
                    act:''
                },
                defaultVal:{ name: '全部', id: '' },
				finished: false
			}
		},
		methods: {
            itemClick(item){
                this.defaultVal = item
                this.pageData.act = item.id
                this.visible = false
                this.loading = true;
				this.finished = false
                this.tabData = []
				this.pageData.page = 1
                this.getwalletAssetsLog()
            },
            loadMore() {
				this.loading = true;
				this.pageData.page += 1
				setTimeout(() => {
					this.getwalletAssetsLog()
				}, 1000)
			},
			routerPath(url, type){
				if (type) {
					let params = {
                        tradeType : type,
                        symbolName : this.indexSelectItem.coin_name+'/usdt',
                    }
                    this.$store.commit('SET_USERSYMBOL', params)
					this.$store.commit('SET_TRADE_TYPE', type)
				}
				this.$router.push(url)
			},
            getwalletAssetsLog(){
                walletAssetsLog(this.pageData).then(res => {
                    let data = res.data
                    this.total = data.total
                    let list = data.list || []
                    list.forEach(v => {
                        v.stateText = this.$constant.assetsLogState[v.status]
                    });
                    this.tabData = this.pageData.page == 1 ? list : [...this.tabData,...list]
					if (this.tabData.length >= data.total) this.finished = true
                    this.loading = false;
                })
            }
		},
		mounted() {
            this.$store.dispatch('getwalletAssetsLlist')
            this.pageData.coin_name = this.indexSelectItem.coin_name
            this.getwalletAssetsLog()
        },
	}
</script>

<style lang="scss" scoped>
	@import  './index.scss';
	.coinslAccount {
		height: 100%;
		.publicListStyle{
			span{
				font-size: 12px;
				color: #000000;
			}
		}
	}
</style>
