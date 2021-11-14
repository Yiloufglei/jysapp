<!-- 
  	author        MrYi
	time          2021/03/11
	description   合约账户
 -->
<template>
	<div class="contractAccount overflowPatible_box">
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
						<p class="color_c">账户权益(USDT)</p>
						<span>{{$fomatFloat(indexSelectItem.num,8)}}</span>
					</div>
					<div class="list_l">
						<p class="color_c">预估强平价(USDT)</p>
						<span>{{$fomatFloat(indexSelectItem.frozen,8)}}</span>
					</div>
					<div class="list_r">
						<p class="color_c">担保资产率</p>
						<span>{{" ≈ " + $fomatFloat(indexSelectItem.cny)}}</span>
					</div>
				</div>
                <div class="publicListStyle flexC_S">
					<div class="list_l">
						<p class="color_c">可用担保资产(USDT)</p>
						<span>{{$fomatFloat(indexSelectItem.num,8)}}</span>
					</div>
					<div class="list_l">
						<p class="color_c">持仓担保资产(USDT)</p>
						<span>{{$fomatFloat(indexSelectItem.frozen,8)}}</span>
					</div>
					<div class="list_r">
						<p class="color_c">冻结担保资产(USDT)</p>
						<span>{{" ≈ " + $fomatFloat(indexSelectItem.cny)}}</span>
					</div>
				</div>
                <div class="publicListStyle flexC_S">
					<div class="list_l">
						<p class="color_c">未实现盈亏(USDT)</p>
						<span>{{$fomatFloat(indexSelectItem.num,8)}}</span>
					</div>
					<div class="list_l">
						<p class="color_c">已实现盈亏(USDT)</p>
						<span>{{$fomatFloat(indexSelectItem.frozen,8)}}</span>
					</div>
					<div class="list_r"></div>
				</div>
			</div>
			<div class="interval_bj"></div>
			<div class="account_body_style_title flexC_S">
				<span>合约账单</span>
				<div class="center" @click="visible = true"><i class="iconfont iconshaixuan"></i></div>
			</div>
			<div class="list_body">
				<recordList :list="tabData" :typeName="2" v-if="tabData.length > 0"/>
				<div class="no-data" v-else-if="!loading && finished"></div>
			</div>
			</van-list>
		</div>
		<div class="actionBar flexC_S">
			<div v-if="indexSelectItem.swich_trans === 1" class="actionBa_list t_c"  @click="routerPath(`/capitalTransfer?coin_name=${indexSelectItem.coin_name}`)">
				<img src="@/assets/imgs/transfer_text.png" alt="" />
				<p  class="">划转</p>
			</div>
			<div class="actionBa_list t_c"  @click="routerPath('/contractIndex')">
				<img src="@/assets/imgs/contractTrade-1.png.png" alt="" />
				<p  class="color_b">合约交易</p>
			</div>
		</div>
        <van-action-sheet
            v-model="visible"
            :actions="list"
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
		name: 'contractAccount',
		components: {
			recordList,
			[List.name]:List
		},
		data() {
			return {
                visible:false,
				loading: true,
				finished: false,
                total: 0,
				tabData: [],
                pageData:{
                    page:1,
                    page_size:5,
                    type:1,
                    act:''
                },
                defaultVal:{ name: '全部', id: '' },
                list:[
                    { name: '全部', id: 1 },
                    { name: '开仓', id: 2 },
                    { name: '平仓', id: 3 },
                    { name: '强平', id: 4 },
                    { name: '资金费', id: 5 },
                    { name: '结算', id: 6 },
                    { name: '转入', id: 7 },
                    { name: '转出', id: 8 },
                    { name: '手续费', id: 9 },
                ]
			}
		},
        computed:{
            ...mapState({
                indexSelectItem : (state) => state.assets.indexSelectItem,
			}),
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
	.contractAccount {
		height: 100%;
        .account_body_style_top{
            padding-bottom: 15px;
            .publicListStyle{
                padding: 0;
                margin-top: 10px;
                div{
                    flex: 1;
                }
                span{
                    font-size: 12px;
                    color: #000000;
                }
            }
        }
	}
</style>
