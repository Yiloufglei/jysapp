<!-- 
  	author        MrYi
	time          2021/03/20
	description   我的订单
 -->
<template>
    <div  class="myOrder">
        <myHeader title="我的订单">
            <template v-slot:right>
                <div  @click="isShow = true"><i class="iconfont iconshaixuan"></i></div>
            </template>
        </myHeader>
        <div class="myOrder_body overflowPatible">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    :offset="10"
                    @load="loadMore"
                    v-if="tabData.length > 0"
                >
                    <div class="assetsList_body border_b_c" @click="orderPath(item)" v-for="(item,index) in tabData" :key="index">
                        <div class="assetsList_title between col-center upper">
                            <span class="fzboid">{{$constant.buy_or_sell[item.buy_or_sell_role] + item.coin_name}}</span>
                            <span class="color_c">{{item.state_name}}<i class="iconfont iconyou1"></i></span>
                        </div>
                        <div class="assetsList_ul">
                            <div>
                                <div class="assetsList_li flex">
                                    <div>
                                        <p class="color_c">时间</p>
                                        <p>{{$formatDate(item.created_at,'/')}}</p>
                                    </div>
                                    <div class="t_c">
                                        <p class="color_c">数量(USDT)</p>
                                        <p>{{$fomatFloat((item.num || 0),6)}}</p>
                                    </div>
                                    <div class="t_r">
                                        <p class="color_c">交易总额(CNY)</p>
                                        <p>{{$fomatFloat((item.cny || 0),2)}}</p>
                                    </div>
                                </div>
                                <p class="assetsList_name fzboid">{{item.nick_name || '--'}}</p>
                            </div>
                        </div>
                    </div>
                </van-list>
                <div class="no-data" v-else-if="!loading && finished"></div>
            </van-pull-refresh> 
        </div>
        <van-dialog v-model="isShow" title="" show-cancel-button confirmButtonText="筛选" cancelButtonText="重置" @confirm="confirm" @cancel="beforeClose">
            <div class="screen_body">
                <p class="title">交易类型</p>
                <div class="btm_body flexC_S">
                    <van-button class="van-mybutton" :class="{'active': pageData.buy_or_sell == 1}" block @click="setOrderSellBuy(1)">购买</van-button>
                    <van-button class="van-mybutton" :class="{'active': pageData.buy_or_sell == 2}" block @click="setOrderSellBuy(2)">出售</van-button>
                    <div class="btm_body_btn"></div>
                </div>
                <p class="title">订单状态</p>
                <div class="btm_body flexC_S">
                    <van-button class="van-mybutton" :class="{'active': pageData.state == 2}" block @click="setOrderType(2)">已付款</van-button>
                    <van-button class="van-mybutton" :class="{'active': pageData.state == 1}" block @click="setOrderType(1)">未付款</van-button>
                    <van-button class="van-mybutton" :class="{'active': pageData.state == 3}" block @click="setOrderType(3)">已完成</van-button>
                </div>
                <div class="btm_body flexC_S">
                    <van-button class="van-mybutton" :class="{'active': pageData.state == 4}" block @click="setOrderType(4)">已取消</van-button>
                    <van-button class="van-mybutton" :class="{'active': pageData.state == 8}" block @click="setOrderType(8)">申诉中</van-button>
                    <van-button class="van-mybutton" :class="{'active': pageData.state == 7}" block @click="setOrderType(7)">冻结中</van-button>
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
    import { myTransOtcTrans } from '@/api/legalCurrencyTrade'
    import myHeader from '@/components/common/header'
    import { PullRefresh, List } from 'vant'
	export default {
		name: 'myOrder',
		data() {
			return {
                isShow:false,
				count: 10,
                loading: true,
                finished: false,
                refreshing: false,
				tabData: [],
                total: 0,
                pageData:{
                    page:1,
                    page_size:10,
                    buy_or_sell:'',
                    state:'',
                },
			}
		},
		computed: {
			...mapState({
                userInfo: (state) => state.user.userInfo,
            }),
		},
		components: {
            myHeader,
            [PullRefresh.name]: PullRefresh,
            [List.name]: List,
        },
		methods: {
            confirm(){
                this.isShow = false
                this.pageData.page = 1
                this.getMyTransOtcTrans()
            },
            beforeClose(val){
                this.pageData.buy_or_sell = ''
                this.pageData.state = ''
                this.confirm()
            },
            setOrderType(val){
                this.pageData.state = val
            },
            setOrderSellBuy(val){
                this.pageData.buy_or_sell = val
            },
            orderPath(item){
                // 存储订单状态
                this.$store.commit('SET_ORDER_STATE', item.state)
                // 存储订单申述id
                this.$store.commit('SET_ORDER_AID', item.aid)
                this.$router.push(`/orderDetail?orderID=${item.id}&sellRole=${item.buy_or_sell_role}`)
            },
			loadMore() {
				this.loading = true;
				this.getMyTransOtcTrans()
			},
            getMyTransOtcTrans(){
                myTransOtcTrans(this.pageData).then(res =>{
                    let data = res.data
                    this.total = data.total
                    let list = data.list || []
                    this.tabData = this.pageData.page == 1 ? list : [...this.tabData,...list]
                    this.loading = false;
                    if (this.tabData.length >= this.total) {
                        this.finished = true
                    } else {
                        this.pageData.page += 1
                    }
                    this.refreshing = false
                })
            },
            onRefresh() {
                // 当前窗口数据对象
                this.pageData.page = 1
                this.tabData = []
                this.loading = true;
                this.finished = false
                this.getMyTransOtcTrans()
            },
		},
		mounted() {
            this.getMyTransOtcTrans()
        },
	}
</script>

<style lang="scss" scoped>
	.myOrder {
		height: 100%;
        .myOrder_body{
            padding: 0 16px;
            height: calc(100% - 45px);
            overflow-y: auto;
            ::v-deep.van-pull-refresh{
                min-height: 100%;
            }
            &::-webkit-scrollbar {
                display: none;
            }
        }
        .screen_body{
            padding: 10px;
            .title{
                font-size: 16px;
            }
            .btm_body{
                padding: 10px 0;
                ::v-deep .van-mybutton {
                    height: 35px;
                    // width: 100px;
                    padding: 0;
                    background: #E6E6E6;
                    border-radius: 4px;
                    font-size: 12px;
                    &.active{
                        background: $main-blue;
                        color: #FFFFFF;
                    }
                    flex: 1;
                }
                button~button{
                    margin-left: 10px;
                }
                .btm_body_btn{
                    flex: 1;
                }
            }
        }
		.assetsList_title {
			height: 65px;
		}
		.assetsList_ul {
			.assetsList_name {
				font-size: 14px;
				line-height: 20px;
				margin-bottom: 20px;
			}
			.assetsList_li {
				font-size: 12px;
				padding-bottom: 10px;
				div {
					flex: 1;
					p {
						line-height: 17px;
						margin-bottom: 10px;
					}
				}
			}
		}
	}
</style>
