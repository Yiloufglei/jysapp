<!-- 
  	author        MrYi
	time          2021/03/12
	description   法币交易模块首页
 -->
<template>
	<div class="legalCurrencyTrade upper" @click="isShowChoice=''">
        <header class="header">
            <div class="header_content">
                <i class="iconfont iconzuo fzboid" @click="back"></i>
                <div class="header_c">
                    <span :class="{'active' : buySellType === 1}" @click="buySellTypeClick(2)">我要买</span>
                    <span :class="{'active' : buySellType === 2}" @click="buySellTypeClick(1)">我要卖</span>
                </div>
                <van-popover
                    v-model="classifyMask"
                    trigger="click"
                    overlay
                    placement="bottom-end"
                    :get-container="getPopoverContainer">
                    <ul class="classify">
                        <li class="border_b_c center" @click="routerPath('/myOrder')"><i class="iconfont icondingdan"></i><span>订单管理</span></li>
                        <li class="border_b_c center" @click="advertising('/editReleaseAd')"><i class="iconfont iconbianji1"></i><span>发布广告</span></li>
                        <li class="border_b_c center" @click="advertising('/myAdvertisement')"><i class="iconfont icontijiaochenggong"></i><span>我的广告</span></li>
                        <li class="center" @click="routerPath('/paymentMethod')"><i class="iconfont icon930caidan_yishoukuan"></i><span>收款设置</span></li>
                    </ul>
                    <template #reference>
                        <span><i class="iconfont iconleimupinleifenleileibie"></i></span>
                    </template>
                </van-popover>
            </div>
        </header>

        <div class="tabSelect fzboid">
            <div class="center" @click="tabIndexName = item" v-for="(item) in tabList" :key="item.coin_name"
                :class="{'color_b' : item.coin_name === tabIndexName.coin_name}">{{item.coin_name}}</div>
        </div>
        <div class="legalCurrencyTrade_body">
            <van-dropdown-menu>
                <van-dropdown-item ref="payType">
                    <span slot="title">{{pageData.pay_type === '' ? '支付方式' : payTypeName}}</span>
                    <div class="dropdown-item-content grid-box ">
                        <div
                            class="btn"
                            v-for="(item, index) in subject"
                            :key="index"
                            @click.stop="payTypeIndex = index"
                            :class="{'active': payTypeIndex === index}">{{item.text}}</div>
                    </div>
                    <div class="dropdown-item-btn flexC_S">
                        <div class="left color_c" @click.stop="resetPageData('mode')">重置</div>
                        <div class="right" @click.stop="screen('mode')">筛选</div>
                    </div>
                </van-dropdown-item>
                <van-dropdown-item ref="transQuota">
                    <span slot="title">{{pageData.trans_quota_min === '' ? '交易额度' : transQuotaName}}</span>
                    <div class="dropdown-item-content grid-box ">
                        <div
                            class="btn"
                            v-for="(item, index) in subjectMoney"
                            :key="index"
                            @click.stop="transQuotaMinIndex = index"
                            :class="{'active': transQuotaMinIndex === index}">{{item.text}}</div>
                    </div>
                    <div class="dropdown-item-btn flexC_S">
                        <div class="left color_c" @click.stop="resetPageData('quota')">重置</div>
                        <div class="right" @click.stop="screen('quota')">筛选</div>
                    </div>
                </van-dropdown-item>
            </van-dropdown-menu>
            <div class="buy-sell-list">
                <template v-if="tabIndexName.coin_name === 'usdt'">
                    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                        <van-list
                            v-model="loading"
                            :finished="finished"
                            finished-text="没有更多了"
                            :offset="10"
                            @load="loadMore"
                            v-if="buysellDataList.length > 0"
                        >
                            <buySellList :type="buySellType" :dataList="buysellDataList" @setShowState="setShowState"/>
                        </van-list>
                        <div class="no-data" v-else-if="!loading && finished"></div>
                    </van-pull-refresh> 
                </template>
                <template v-else><div class="no-data"></div></template>
            </div>
        </div>
        <div class="select_body" v-if="isShowChoice =='mode' || isShowChoice =='quota'">
            <div class="select_body_centen">
                <ul  class="flexC_S" v-if="isShowChoice == 'mode'">
                    <li v-for="item in subject" :key='item.value' @click.stop="coinChangeSelect(item)">
                        <van-button class="van-myNbButton" type="info" block :class="{'active': pageData.pay_type == item.value}">{{item.text}}</van-button>
                    </li>
                </ul>
                <ul  class="flexC_S" v-if="isShowChoice == 'quota'">
                    <li v-for="item in subjectMoney" :key='item.value' @click.stop="coinChangeSelect(item)">
                        <van-button class="van-myNbButton" type="info" block :class="{'active': pageData.trans_quota_min == item.value}">{{item.text}}</van-button>
                    </li>
                </ul>
                <div class="operation_body flexC_S">
                    <div class="center color_c" @click.stop="resetPageData">重置</div>
                    <div class="center color_b" @click.stop="screen">筛选</div>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
	import buySellList from './buySellList.vue'
    import { postersOtcTrans } from '@/api/legalCurrencyTrade'
    import { oinsetOtcTrans } from '@/api/advertisement'
	import { mapState } from 'vuex'
    import _get from 'lodash/get'
    import _find from 'lodash/find'
    import { Popover, DropdownMenu, DropdownItem, PullRefresh, List } from 'vant'
    const filterRoute = ['/myOrder', '/orderDetail', '/login', '/tradeSuccess']
	export default {
		name: 'legalCurrencyTrade',
        components: {
			buySellList,
            [Popover.name]: Popover,
            [DropdownMenu.name]: DropdownMenu,
            [DropdownItem.name]: DropdownItem,
            [PullRefresh.name]: PullRefresh,
            [List.name]: List,
		},
        beforeRouteEnter (to, from, next) {
            next(vm => {
                if (filterRoute.indexOf(from.path) === -1) {
                    vm.$store.commit('SET_COMEIN_PATH', {
                        model: 'legalCurrencyTrade',
                        path: from.path
                    })
                }
            })
        },
        beforeRouteLeave (to, from, next) {
            if (!this.isBack) {
                // 正常连接跳转
                next()
            } else {
                // 返回操作
                if (filterRoute.indexOf(to.path) !== -1) {
                    next({
                        replace: true,
                        path: _get(this.$store.state, 'router.legalCurrencyTrade.comeinPath', '/')
                    })
                } else {
                    next()
                }
            }
        },
        computed:{
			...mapState({
				storeBuySellType: (state) => state.assets.buySellType,
				userInfo: (state) => state.user.userInfo,
			}),
            payTypeName() {
                return _find(this.subject, {value: this.pageData.pay_type}).text || '支付方式'
            },
            transQuotaName() {
                return _find(this.subjectMoney, {value: this.pageData.trans_quota_min}).text || '交易额度'
            }
		},
		data() {
			return {
                isBack: false,
                isShowChoice:'',
				classifyMask: false,
				buySellType: 1,
				tabIndexName: {},
				tabList: [],
                loading: true,
                finished: false,
                refreshing: false,
                isShow: false, // 购买 卖出弹窗是否显示
                total: null,
                pageData:{
                    page:1,
                    page_size:10,
                    buy_or_sell:2,
                    coin_name: '',
                    pay_type: '',
                    trans_quota_min: '',
                    trans_quota_max: '',
                },
                payTypeIndex: '',
                transQuotaMinIndex: '',
				buysellDataList: [],
				subject: [
                    {
						value: "alipay",
						text: "支付宝"
					},
					{
						value: "wechat",
						text: "微信"
					},
					{
						value: "unionpay",
						text: "银行卡"
					}
				],
				subjectMoney: [
                    {
						value: "100",
						text: "100"
					},
					{
						value: "1000",
						text: "1000"
					},
					{
						value: "5000",
						text: "5000"
					},
                    {
						value: "20000",
						text: "20000"
					},
                    {
						value: "50000",
						text: "50000"
					},
                    {
						value: "100000",
						text: "100000"
					}
				]
			}
		},
		methods: {
            back() {
                this.isBack = true
                this.$router.go(-1)
            },
            setShowState(val) {
                this.isShow = val
            },
            loadMore() {
				this.loading = true;
				setTimeout(() => {
					this.getPostersOtcTrans()
				}, 200)
			},
            advertising(link){
                if(!this.loginType){
                    this.routerPath('/login')
                    return false
                }
                if(this.userInfo.userType != 2){
                    this.$toast({
                        message:'请先申请广告商'
                    })
                    return false
                }
                this.routerPath(link)
            },
			routerPath(url){
				this.$router.push(url)
			},
            screen(type){
                if(type == 'mode'){
                    if (this.payTypeIndex !== '') this.pageData.pay_type = this.subject[this.payTypeIndex].value
                    this.$refs.payType.toggle();
                }
                if(type == 'quota'){
                    if (this.transQuotaMinIndex !== '') this.pageData.trans_quota_min = this.subjectMoney[this.transQuotaMinIndex].value
                    this.$refs.transQuota.toggle();
                }
                this.isShowChoice = ''
                this.loading = true;
                this.pageData.page = 1
                this.buysellDataList= []
                this.getPostersOtcTrans()
            },
            resetPageData(type){
                if(type == 'mode'){
                    this.pageData.pay_type = ''
                    this.payTypeIndex = ''
                    this.$refs.payType.toggle();
                }
                if(type == 'quota'){
                    this.pageData.trans_quota_min = ''
                    this.transQuotaMinIndex = ''
                    this.$refs.transQuota.toggle();
                }
                this.screen()
            },
			coinChangeSelect(data) {
                if(this.isShowChoice == 'mode'){
                    this.pageData.pay_type = data.value
                }
                if(this.isShowChoice == 'quota'){
                    this.pageData.trans_quota_min = data.value
                }
			},
            buySellTypeClick(val){
                if (this.buySellType === (val == 1 ? 2 : 1)) return
                this.loading = true;
                this.pageData.page = 1
                this.buySellType = val == 1 ? 2 : 1
                this.buysellDataList= []
                this.pageData.buy_or_sell = val
                this.$store.commit('SET_BUYSELL_TYPE',this.buySellType)
                this.getPostersOtcTrans()
            },
            onRefresh() {
                // 当前窗口数据对象
                this.pageData.page = 1
                this.buysellDataList = []
                this.loading = true;
                this.finished = false
                this.getPostersOtcTrans()
            },
            getPostersOtcTrans(){
                postersOtcTrans(this.pageData).then(res =>{
                    let data = res.data
                    this.total = data.total
                    let list = data.list || []
                    this.buysellDataList = this.pageData.page == 1 ? list : [...this.buysellDataList,...list]
                    this.loading = false;
                    if (this.buysellDataList.length >= this.total) {
                        this.finished = true
                    } else {
                        this.pageData.page += 1
                    }
                    this.refreshing = false
                })
            },
            async init(){
                this.tabList = await this.getCoinsets()
                // 产品要求 添加假数据
                // const tempList = [{coin_name: 'btc'},{coin_name: 'eth'}]
                const tempList = []
                this.tabList = [...this.tabList, ...tempList]
                this.tabIndexName = this.tabList[0]
                this.pageData.coin_name = this.tabIndexName.coin_name
                this.getPostersOtcTrans()
                if (this.loginType) this.$store.dispatch("getwalletAssetsLlist");
            },
            getCoinsets(){
                return new Promise((resolve,reject) =>{
                    oinsetOtcTrans().then(res =>{
                        resolve(res.data.coinsets || [])
                    })
                })
            },
            getPopoverContainer() {
                return document.querySelector('.header_content');
            }
		},
		mounted() {
            if(this.storeBuySellType){
                this.buySellType = this.storeBuySellType
                this.pageData.buy_or_sell = this.storeBuySellType == 1 ? 2 : 1
            }
            this.init()
        },
	}
</script>

<style lang="scss" scoped>
	.legalCurrencyTrade {
		height: 100%;
		position: relative;
        .header{
            background-color: $main-blue;
            color: #FFFFFF;
            height: 70px;
            .header_content{
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 45px;
                .iconzuo{
                    font-size: 24px;
                    margin-left: 10px;
                }
                .iconleimupinleifenleileibie{
                    font-size: 20px;
                    margin-right: 15px;
                }
                .header_c{
                    font-size: 16px;
                    font-weight: 500;
                    color: #233B55;
                    .active{
                        font-size: 20px;
                        color: #FFFFFF;
                    }
                    span~span{
                        margin-left: 30px;
                    }
                }
                .classify {
					padding: 2px 0px;
					background-color: #FFFFFF;
					border-radius: 5px;
					position: relative;
                    width: 134px;
                    li {
						height: 36px;
						font-size: 14px;
						.iconfont {
							font-size: 20px;
							color: $main-blue;
							margin-right: 6px;
						}
					}
				}
                ::v-deep.van-popover{
                    .van-popover__arrow{
                        right: 13px;
                    }
                }
            }
        }
        .legalCurrencyTrade_body{
            padding: 10px 0px;
            height: calc(100% - 95px);
            ::v-deep.van-dropdown-menu{
                .van-dropdown-menu__title, .van-cell__title{
                    font-size: 12px;
                }
                .van-dropdown-menu__item{
                    flex: inherit;
                    margin-left: 10px;
                }
                .van-dropdown-item__content{
                    border-radius: 0 0 15px 15px;
                }
                .van-dropdown-menu__bar{
                    height: 25px;
                    box-shadow: none;
                }
            }
            .dropdown-item-content{
                padding: 15px 20px 20px 20px;
            }
            .grid-box{
                display: grid;
                grid-template: [] '1 1 1' 35px;
                grid-gap: 15px 20px;
                text-align: center;
                line-height: 35px;
                .btn{
                    background: #f1f1f1;
                    border: 1px solid #f1f1f1;
                    border-radius: 5px;
                    font-size: 12px;
                    &.active{
                        background: #fff;
                        border: 1px solid $main-blue;
                        color: $main-blue;
                    }
                }
            }
            .dropdown-item-btn{
                div{
                    height: 45px;
                    line-height: 45px;
                    text-align: center;
                    font-size: 16px;
                    flex: 1;
                    &.left{
                        border-top: 1px solid #e6e6e6;
                    }
                    &.right{
                        border-top: 1px solid $main-blue;
                        background: $main-blue;
                        color: #fff;
                    }
                }
            }
            .buy-sell-list{
                padding: 0 20px;
                height: calc(100% - 25px);
                overflow-y: auto;
                ::v-deep.van-pull-refresh{
                    min-height: 100%;
                }
                &::-webkit-scrollbar {
                    display: none;
                }
            }
        }   
        .select_body{
            position: absolute;
            bottom: 0;
            height: calc(100% - 125px);
            width: 100%;
            .select_body_centen{
                background: #FFFFFF;
                position: absolute;
                width: 100%;
                z-index: 1;
                top: 0;
                border-radius: 0 0 15px 15px;
                ul{
                    padding: 15px 20px 0;
                    flex-wrap: wrap;
                    li{
                        width: 30%;
                        margin-bottom: 15px;
                        .van-button {
                            height: 35px;
                            width: 100px;
                            background: #E6E6E6;
                            border-radius: 4px;
                            font-size: 12px;
                            color: #000;
                            &.active{
                               background: $main-blue;
                               color: #FFFFFF;
                            }
                        }
                    }
                }
                .operation_body{
                    border-top: 1px solid #E6E6E6;
                    div{
                        flex: 1;
                        line-height: 46px;
                        font-size: 16px;
                        &:nth-child(1){
                            border-right: 1px solid #E6E6E6;
                        }
                    }
                }
            }
        }
		.tabSelect {
			height: 40px;
            display: flex;
            overflow-x: auto;
            background: #FFFFFF;
            border-radius: 15px 15px 0 0;
            padding: 0 10px;
            margin-top: -15px;
            border-bottom: 1px solid #F9F9F9;
            .color_b{
                border-bottom: 2px solid $main-blue;
            }
            &::-webkit-scrollbar {
                display: none;
            }
			div {
                margin: 0 20px;
			}
		}
	}
</style>
