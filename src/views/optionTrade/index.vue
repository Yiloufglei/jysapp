<template>
  <div class="option-trade" ref="overflowPatibleBox">
    <div class="header">
        <i class="iconfont iconzuo" @click="back"></i>
        <div class="tab">
            <span class="left" :class="{'active': tabIndex === 0}" @click="changeTab(0)">实盘交易</span>
            <span class="right" :class="{'active': tabIndex === 1}" @click="changeTab(1)">实盘持仓</span>
        </div>
    </div>
    <div class="tab-content" v-show="tabIndex === 0">
        <Trade @setMarketList="setMarketList" @refresh="onRefresh" />
    </div>
    <div class="tab-content2" v-if="tabIndex === 1">
        <van-tabs
            v-model="holdTabIndex"
            background="#131e32"
            title-inactive-color="#9B9B9B"
            :line-width="80"
            :line-height="2"
            @change="getDataList"
            swipeable
            animated>
            <van-tab
                v-for="(item,index) in holdTabList"
                :key="index"
                :title="item">
            </van-tab>
        </van-tabs>
        <div class="interval-line"></div>
        <div class="hold-tab-content">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    :offset="10"
                    @load="getOptOrderList"
                    v-if="currentDataList.length > 0"
                >
                    <div class="list-card" v-for="item in currentDataList" :key="item.id">
                        <CellList
                            @click="toPage"
                            @clickBtn="clickBtn"
                            :data="item"
                            :holdTabIndex="holdTabIndex"></CellList>
                        <div class="interval-line"></div>
                    </div>
                    
                </van-list>
                <div class="no-data" v-else-if="!loading && finished"></div>
            </van-pull-refresh>
        </div>
    </div>
    <van-popup
        v-model="showStopPopup"
        @close="popupClose"
        :clickMaskClose="false">
        <div class="stop-popup-box">
            <div class="title">修改止盈止损</div>
            <van-tabs v-model="tabStopType" @change="changeStopType" animated line-width="50%" line-height="2" background="#131E30" swipeable>
                <van-tab title="按金额" name="2">
                    <div class="stop-content">
                        <div class="list profit">
                            <div class="label">止盈</div>
                            <div class="right">
                                <Input
                                    type="number"
                                    v-model="numParams.stop_profit_price" @blur="checkprofitPrice"/>
                                <div class="tips upper">{{currentOrder.quote_currency}}止盈价格{{currentOrder.trans_intention === 2 ? transIntentionTwo : profitPrice}}</div>
                            </div>
                        </div>
                        <div class="list loss">
                            <div class="label">止损</div>
                            <div class="right">
                                <Input
                                    type="number"
                                    v-model="numParams.stop_loss_price" @blur="checkLossPrice"/>
                                <div class="tips upper">{{currentOrder.quote_currency}}止损价格{{lossPrice}}</div>
                            </div>
                        </div>
                    </div>
                </van-tab>
                <van-tab title="按价格" name="1">
                    <div class="stop-content">
                        <div class="list profit">
                            <div class="label">止盈</div>
                            <div class="right">
                                <Input
                                    type="number"
                                    v-model="priceParams.stop_profit_price" @blur="checkprofitPrice"/>
                                <div class="tips upper">{{currentOrder.quote_currency}}止盈金额{{profitPrice}}</div>
                            </div>
                        </div>
                        <div class="list loss">
                            <div class="label">止损</div>
                            <div class="right">
                                <Input
                                    type="number"
                                    v-model="priceParams.stop_loss_price" @blur="checkLossPrice"/>
                                <div class="tips upper">{{currentOrder.quote_currency}}止损金额{{lossPrice}}</div>
                            </div>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
            
            <div class="btn-box">
                <div class="btn" @click="showStopPopup = false">取消</div>
                <div class="btn" @click="submitStopConfig">确定</div>
            </div>
        </div>
    </van-popup>
  </div>
</template>

<script>
import Trade from "./trade"
import CellList from "./cellList.vue"
import { optOrderList, optClearOrder, optCloseOrder, optEditOrder } from "@/api/optionTrade"
import { mapState } from "vuex"
import Input from "./input"
import _find from 'lodash/find'
import { PullRefresh, List, Tabs, Tab } from 'vant'
export default {
    name: 'OptionTrade',
    components: {
        Trade,
        CellList,
        Input,
        [PullRefresh.name]: PullRefresh,
        [List.name]: List,
        [Tabs.name]: Tabs,
        [Tab.name]: Tab
    },
    data() {
        return {
            fromPath: '/',
            holdTabList: ['持仓', '结算', '撤单'],
            showStopPopup: false,
            stopType: 2,
            tabStopType:2,
            numParams:{
                stop_profit_price: '',
                stop_loss_price: '',
            },
            priceParams:{
                stop_profit_price: '',
                stop_loss_price: '',
            },
            currentOrder: {},
            marketList: {},
            holdTabIndex: 0,
            loading: false,
            finished: false,
            refreshing: false,
            // 持仓数据（列表，分页）
            holdTabData: [{
                dataList: [],
                pageData: {
                    page:1,
                    page_size: 10,
                    total: null
                },
            },{
                dataList: [],
                pageData: {
                    page:1,
                    page_size: 5,
                    total: null
                },
            },{
                dataList: [],
                pageData: {
                    page:1,
                    page_size: 10,
                    total: null
                },
            }]
        }
    },
    computed: {
        ...mapState({
            token: (state) => state.user.token,
            usdtCny: (state) => state.publicData.usdt_cny,
            coinConfig: (state) => state.coinConfig,
            pricePrecision: (state) => state.optionTrade.config.price_precision,
            amountPrecision: (state) => state.optionTrade.config.amount_precision,
        }),
        tabIndex() {
            return this.$store.state.optionTrade.tabIndex || 0
        },
        holdTabIndexVuex() {
            return this.$store.state.optionTrade.holdTabIndex || 0
        },
        currentHoldTabPage() {
            return this.holdTabData[this.holdTabIndex].pageData
        },
        currentDataList() {
            return this.holdTabData[this.holdTabIndex].dataList
        },
        transIntentionTwo(){
            if(!this.numParams.stop_profit_price){
                return this.$fomatFloat(this.numParams.stop_profit_price, this.pricePrecision)
            }
            return  this.$fomatFloat(2 * this.currentOrder.order_price - (this.numParams.stop_profit_price / this.currentOrder.order_amt), this.pricePrecision)
        },
        profitPrice() {
            if (this.stopType ===2) {
                // 价格换算金额
                return this.$fomatFloat(this.numParams.stop_profit_price / this.currentOrder.order_amt, this.pricePrecision)
            } else {
                // 金额换算价格
                return this.$fomatFloat(this.priceParams.stop_profit_price * this.currentOrder.order_amt, this.pricePrecision)
            }
        },
        lossPrice() {
            if (this.stopType ===2) {
                // 价格换算金额
                return this.$fomatFloat(this.numParams.stop_loss_price / this.currentOrder.order_amt, this.pricePrecision)
            } else {
                // 金额换算价格
                return this.$fomatFloat(this.priceParams.stop_loss_price * this.currentOrder.order_amt, this.pricePrecision)
            }
        }
    },
    watch: {
        holdTabIndexVuex(val) {
            this.holdTabIndex = val
        },
        tabIndex(val) {
            if (val === 1) {
                this.getOptOrderList()
            }
        },
        marketList: {
            handler(val) {
                if (this.holdTabIndex === 0) {
                    let dataList = this.holdTabData[this.holdTabIndex].dataList
                    for (let index = 0; index < dataList.length; index++) {
                        const item = dataList[index];
                        if (item.status !== 2) {
                            // 持仓中的
                            const symbollist = val[item.base_currency.toLocaleUpperCase()].symbollist
                            const coinInfo = _find(symbollist, {quote: item.quote_currency.toLocaleUpperCase()}).info
                            const precision = this.getSymbolAccuracy(`${item.quote_currency}/${item.base_currency}`)
                            // 买涨买跌
                            let price = item.trans_intention === 1 ? coinInfo.price - item.order_price : item.order_price - coinInfo.price
                            item.profit = this.$fomatFloat(price*item.order_amt, precision)
                            item.profitRatio = this.$fomatFloat(item.profit/item.order_bond * 100, 2)
                            // // 止盈、止损、强平 刷新列表
                            // let isRefresh = false
                            // if (item.trans_intention === 1) {
                            //     // 买涨
                            //     if (item.stop_profit_price && coinInfo.price >= item.stop_profit_price) {
                            //         // 止盈
                            //         isRefresh = true
                            //         item.isdelete = true
                            //     } else if (item.stop_loss_price && coinInfo.price <= item.stop_loss_price) {
                            //         // 止损
                            //         isRefresh = true
                            //         item.isdelete = true
                            //     } else if (item.force_close_price && coinInfo.price <= item.force_close_price) {
                            //         // 强平
                            //         isRefresh = true
                            //         item.isdelete = true
                            //     }
                            // } else if (item.trans_intention === 2) {
                            //     // 买跌
                            //     if (item.stop_profit_price && coinInfo.price <= item.stop_profit_price) {
                            //         // 止盈
                            //         item.isdelete = true
                            //         isRefresh = true
                            //     } else if (item.stop_loss_price && coinInfo.price >= item.stop_loss_price) {
                            //         // 止损
                            //         item.isdelete = true
                            //         isRefresh = true
                            //     } else if (item.force_close_price && coinInfo.price >= item.force_close_price) {
                            //         // 强平
                            //         item.isdelete = true
                            //         isRefresh = true
                            //     }
                            // }
                            // if (isRefresh) {
                            //     this.holdTabData[this.holdTabIndex].dataList = dataList.filter((v) => v.isdelete !== true)
                            //     // this.onRefresh()
                            //     return
                            // }
                        }
                    }
                }
            },
            deep: true
        }
    },
    beforeRouteEnter (to, from, next) {
        next((vm) => {
            if (from.fullPath) {
                if(from.fullPath.indexOf('horizontalHq') === -1){
                    vm.fromPath = from.fullPath;
                }
            }
        });
    },
    created() {
        this.$store.dispatch("set_usdt_cny");
        this.holdTabIndex = this.holdTabIndexVuex
        if (this.token) {
            this.$store.dispatch("getwalletAssetsLlist");
            this.getOptOrderList()
        }
    },
    methods: {
        popupClose(){
            this.tabStopType = this.stopType =  1
            this.numParams.stop_profit_price = ''
            this.numParams.stop_loss_price = ''
            this.priceParams.stop_profit_price = ''
            this.priceParams.stop_loss_price = ''
        },
        getSymbolAccuracy(symbol){
            return this.coinConfig.info[symbol] && this.coinConfig.info[symbol].basicCoinAccuracy || 2
        },
        setMarketList(val) {
            this.marketList = val
        },
        submitStopConfig() {
            if (this.stopType === 2) {
                if (this.numParams.stop_profit_price === '' && this.numParams.stop_loss_price === '') {
                    return this.$toast('止盈止损至少设置一项！')
                }
            }else{
                if (this.priceParams.stop_profit_price === '' && this.priceParams.stop_loss_price === '') {
                    return this.$toast('止盈止损至少设置一项！')
                }
            }
            let profit_price = this.stopType === 1 ? this.priceParams.stop_profit_price : this.profitPrice
            let loss_price = this.stopType === 1 ? this.priceParams.stop_loss_price : this.lossPrice
            let tips = ''
            let validate = true
            let price = this.currentOrder.order_price
            // 1/买涨 价格 2/买跌金额
            if (this.currentOrder.trans_intention === 1) {
                //买涨按价格
                if(this.stopType === 1){
                    let x = this.$fomatFloat(this.currentOrder.force_close_price, this.pricePrecision)
                    let y = this.$fomatFloat(this.currentOrder.order_price, this.pricePrecision)
                    if(loss_price && loss_price > 0){
                        if(!(Number(this.priceParams.stop_loss_price) > Number(x) && Number(this.priceParams.stop_loss_price)  < Number(y))){
                            tips = `止损价要大于${x}且小于${y}`
                            validate = false
                        }
                    }
                    if(profit_price && profit_price > 0){
                        if(Number(this.priceParams.stop_profit_price) <= Number(y)){
                            tips = `止盈价要大于${y}`
                            validate = false
                        }
                    }
                }else{
                    //买涨按金额
                    let x = this.$fomatFloat(this.currentOrder.force_close_price * this.currentOrder.order_amt, this.pricePrecision)
                    let y = this.$fomatFloat(this.currentOrder.order_price * this.currentOrder.order_amt, this.pricePrecision)
                    if(loss_price && loss_price > 0){
                        if(!(Number(this.numParams.stop_loss_price) > Number(x) && Number(this.numParams.stop_loss_price)  < Number(y))){
                            tips = `止损金额要大于${x}且小于${y}`
                            validate = false
                        }
                    }
                    if(profit_price && profit_price > 0){
                        if(Number(this.numParams.stop_profit_price) <= Number(y)){
                            tips = `止盈金额要大于${y}`
                            validate = false
                        }
                    }
                }
            }
            // 1/买涨 价格 2/买跌金额
            if (this.currentOrder.trans_intention === 2) {
                //买跌按价格
                if(this.stopType === 1){
                    let x = this.$fomatFloat(this.currentOrder.force_close_price, this.pricePrecision)
                    let y = this.$fomatFloat(this.currentOrder.order_price, this.pricePrecision)
                    if(loss_price && loss_price > 0){
                        if(!(Number(this.priceParams.stop_loss_price) < Number(x) && Number(this.priceParams.stop_loss_price)  > Number(y))){
                            tips = `止损价要大于${y}且小于${x}`
                            validate = false
                        }
                    }
                    if(profit_price && profit_price > 0){
                        if(Number(this.priceParams.stop_profit_price) > Number(y)){
                            tips = `止盈价要小于${y}`
                            validate = false
                        }
                    } 
                }else{
                    //买跌按金额
                    let x = this.$fomatFloat(this.currentOrder.force_close_price * this.currentOrder.order_amt, this.pricePrecision)
                    let y = this.$fomatFloat(this.currentOrder.order_price * this.currentOrder.order_amt, this.pricePrecision)
                    if(loss_price && loss_price > 0){
                        if(!(Number(this.numParams.stop_loss_price) > Number(x) && Number(this.numParams.stop_loss_price) < Number(y))){
                            tips = `止损金额要大于${x}且小于${y}`
                            validate = false
                        }
                    }
                    if(profit_price && profit_price > 0){
                        if(Number(this.numParams.stop_profit_price) <= Number(y) || Number(this.numParams.stop_profit_price) >= Number(y * 2)){
                            tips = `止盈金额要大于${y},且小于${y*2}`
                            validate = false
                        }
                    }
                }
            } 
            if (!validate) {
                return this.$toast({
                    message: tips,
                    duration: 3000
                })
            }
            let params = {
                order_id: this.currentOrder.order_id,
                stop_profit_price: profit_price,
                stop_loss_price: loss_price
            }
            optEditOrder(params).then(res => {
                if (res.code === 0) {
                    this.$toast('止盈止损设置成功！')
                    this.showStopPopup = false
                    this.onRefresh()
                }
            })
        },
        checkprofitPrice() {
        },
        checkLossPrice() {
        },
        changeStopType(val) {
            this.stopType = Number(val)
        },
        getDataList() {
            if (!this.token) {
                this.$router.push({ path: '/login' })
                return
            }
            this.$store.commit('SET_OPTION_TRADE_HOLD_TAB_INDEX', this.holdTabIndex)
            // 当前窗口数据对象
            let currentObj = this.holdTabData[this.holdTabIndex]
            // 如果列表为空并且没有请求过数据 ，需要重新请求数据
            currentObj.pageData.page = 1
            currentObj.dataList = []
            this.finished = false
            this.getOptOrderList()
        },
        onRefresh() {
            // 当前窗口数据对象
            let currentObj = this.holdTabData[this.holdTabIndex]
            currentObj.pageData.page = 1
            // currentObj.dataList = []
            this.finished = false
            this.getOptOrderList()
        },
        getOptOrderList() {
            // 12：持仓；3：撤销；47：结算
            let status = 12
            if (this.holdTabIndex === 1) {
                status = 47
            } else if (this.holdTabIndex === 2) {
                status = 3
            }
            let parmas = {
                page: this.currentHoldTabPage.page,
                page_size: this.currentHoldTabPage.page_size,
                status
            }
            this.loading = true;
            optOrderList(parmas).then(res => {
                res.data.list.map(item => {
                    item.profitRatio = this.$fomatFloat((item.profit_loss/item.order_bond * 100) || 0, 2)
                    item.profit = item.profit_loss
                })
                let list = res.data.list
                let currentObj = this.holdTabData[this.holdTabIndex]
                currentObj.pageData.total = res.data.total
                currentObj.dataList = currentObj.pageData.page == 1 ? list : [...currentObj.dataList,...list]
                // this.$set(this.holdTabData, index, )
                this.loading = false;
                if (currentObj.dataList.length >= currentObj.pageData.total) {
                    this.finished = true
                } else {
                    currentObj.pageData.page += 1
                }
                this.refreshing = false
            })
        },
        back() {
            this.$router.replace({ path: this.fromPath });
        },
        changeTab(index){
            if (!this.token && index === 1) {
                this.$router.push({ path: '/login' })
                return
            }
            this.$store.commit('SET_OPTION_TRADE_TAB_INDEX', index)
        },
        clickBtn(type, item) {
            if (type === '1' || type === '3') {
                // 撤单
                let params = {
                    order_id: item.order_id
                }
                let actions = type === '1' ? optClearOrder : optCloseOrder
                actions(params).then(res => {
                    if (res.code === 0) {
                        this.$toast(`${type === '1' ? '撤单' : '平仓'}成功！`)
                        this.onRefresh()
                    }
                })
            } else if (type === '2') {
                // 止盈止损
                this.currentOrder = item
                // this.numParams.stop_profit_price = this.currentOrder.stop_profit_price
                // this.numParams.stop_loss_price = this.currentOrder.stop_loss_price
                this.showStopPopup = true
            }
        },
        toPage(item) {
            if (item.status === 2 || item.status === 3) return
            this.$router.push({
                path: '/optionTradeOrderDetail?orderId='+item.order_id
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.color-up {
    color: $buy;
}
.color-down {
    color: $sell;
}
.option-trade {
    background: #131e32;
    height: 100%;
    width: 100%;
    color: #9B9B9B;
    .interval-line{
        height: 10px;
        background: #071724;
    }
    .header{
        background: #131e32;
        width: 100%;
        font-weight: 500;
        height: 65px;
        line-height: 65px;
        font-size: 14px;
        color: #fff; 
        display: flex;
        justify-content: center;
        align-items: center;
        .iconzuo {
            font-size: 24px;
            position: absolute;
            left: 15px;
        }
        .tab{
            width: 220px;
            height: 35px;
            line-height: 33px;
            display: flex;
            border-radius: 6px;
            overflow: hidden;
            span{
                border: 1px solid $main-blue;
                flex: 1;
                text-align: center;
                &.active{
                    background: $main-blue;
                }
            }
            span.left{
                border-radius: 6px 0px 0px 6px;
            }
            span.right{
                border-radius: 0px 6px 6px 0px;
            }
        }
    }
    .tab-content{
        height: calc(100% - 66px);
        overflow-y: auto;
        &::-webkit-scrollbar {
            display: none;
        }
    }
    .tab-content2{
        height: calc(100% - 66px);
        overflow: hidden;
    }
    .hold-tab-content{
        height: calc(100% - 54px);
        position: relative;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        ::v-deep.van-pull-refresh{
            min-height: 100%;
        }
        &::-webkit-scrollbar {
            display: none;
        }
    }
    ::v-deep .van-popup{
        background: #131E30;
    }
    .stop-popup-box{
        width: 276px;
        color: #9B9B9B;
        font-weight: 500;
        padding-bottom: 20px;
        .title{
            text-align: center;
            padding: 14px 0 10px 0;
            font-size: 17px;
        }
        ::v-deep .van-tabs{
            .van-tabs__wrap{
                height: 40px;
                .van-tab{
                    font-size: 12px;
                }
            }
        }
        .stop-content{
            padding: 0 16px;
            .list{
                display: flex;
                padding-top: 18px;
                .label{
                    padding: 0 20px;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 35px;
                }
                .right{
                    input{
                        width: 165px;
                        height: 35px;
                        background: #071724;
                        border-radius: 6px;
                        color: #fff;
                        font-size: 14px;
                        font-weight: 500;
                        padding-left: 34px;
                    }
                    .tips{
                        font-size: 12px;
                        padding-top: 5px;
                        text-align: right;
                    }
                }
            }
        }
        .btn-box{
            display: flex;
            justify-content: space-between;
            padding: 0 19px;
            margin-top: 30px;
            .btn{
                width: 100px;
                height: 35px;
                line-height: 33px;
                border: 1px solid $main-blue;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                color: #FFFFFF;
                text-align: center;
            }
        }
    }
}
</style>