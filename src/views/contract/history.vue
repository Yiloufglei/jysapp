<!-- 合约历史 -->
<template>
    <div class="contractHistory">
        <van-dropdown-menu active-color="#1989fa">
            <van-dropdown-item :title="coinText" ref="item1">
                <div class="select_body_centen">
                    <ul>
                        <li v-for="item in coinOption" :key='item.value' @click="coin = item.value">
                            <button :class="{'active': coin == item.value}">{{item.text}}</button>
                        </li>
                    </ul>
                    <div class="operation_body flexC_S">
                        <div class="center color_c" @click="coin = 1">重置</div>
                        <div class="center color_b" @click="onConfirm(1)">筛选</div>
                    </div>
                </div>
            </van-dropdown-item>
            <van-dropdown-item :title="entrustText" ref="item2">
                <div class="select_body_centen">
                    <ul>
                        <li v-for="item in entrustOption" :key='item.value' @click="entrust = item.value">
                            <button :class="{'active': entrust == item.value}">{{item.text}}</button>
                        </li>
                    </ul>
                    <div class="operation_body flexC_S">
                        <div class="center color_c" @click="entrust = 1">重置</div>
                        <div class="center color_b" @click="onConfirm(2)">筛选</div>
                    </div>
                </div>
            </van-dropdown-item>
            <van-dropdown-item :title="transactionText" ref="item3">
                <div class="select_body_centen">
                    <ul>
                        <li v-for="item in transactionOption" :key='item.value' @click="transaction = item.value">
                            <button :class="{'active': transaction == item.value}">{{item.text}}</button>
                        </li>
                    </ul>
                    <div class="operation_body flexC_S">
                        <div class="center color_c" @click="transaction = 1">重置</div>
                        <div class="center color_b" @click="onConfirm(3)">筛选</div>
                    </div>
                </div>
            </van-dropdown-item>
            <van-dropdown-item :title="typeText" ref="item4">
                <div class="select_body_centen">
                    <ul>
                        <li v-for="item in typeOption" :key='item.value' @click="type = item.value">
                            <button :class="{'active': type == item.value}">{{item.text}}</button>
                        </li>
                    </ul>
                    <div class="operation_body flexC_S">
                        <div class="center color_c" @click="type = 1">重置</div>
                        <div class="center color_b" @click="onConfirm(4)">筛选</div>
                    </div>
                </div>
            </van-dropdown-item>
        </van-dropdown-menu>
        <div class="contractHistory_list">
            
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                :offset="10"
                @load="loadMore"
                v-if="tabData.length > 0"
            >
                <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                    <div class="order_ul" v-for="(item,index) in tabData" :key="index">
                        <div class="title flexC_S" @click="$router.push('/contractTransactionDetail')">
                            <p>BTC 永续/USDT·逐仓<span :class="item.type === 2 ? 'sell-color' : 'buy-color'">
                                    <!-- 20X·{{orderType[item.orderType]}}</span></p> -->
                                    20X.买空</span></p>
                            <!-- <div class="color_c col-center">{{typeOptionFun(item.typeOption)}} <i class="iconfont iconyou1"></i> -->
                            <div class="color_c col-center">已成交<i class="iconfont iconyou1"></i>
                            </div>
                        </div>
                        <div class="profitDetail flexC_S" v-if="item.orderType !==3">
                            <div>
                                <p class="profit_title">委托量(BTC)</p>
                                <p class="profit_number">21.21545</p>
                            </div>
                            <div>
                                <p class="profit_title">触发价(USDT)</p>
                                <p class="profit_number">4212.3</p>
                            </div>
                            <div class="t_r">
                                <p class="profit_title">委托价(USDT)</p>
                                <p class="profit_number ">4212.3</p>
                            </div>
                        </div>
                        <div class="profitDetail flexC_S" v-if="item.orderType ===3">
                            <div>
                                <p class="profit_title">强平数量(张)</p>
                                <p class="profit_number">21.21545</p>
                            </div>
                            <div>
                                <p class="profit_title">接管价格(USDT)</p>
                                <p class="profit_number">4212.3</p>
                            </div>
                            <div class="t_r">
                                <p class="profit_title">收益(USDT)</p>
                                <p class="profit_number ">4212.3</p>
                            </div>
                        </div>
                        <div class="profitDetail flexC_S" v-if="item.start == 2">
                            <div>
                                <p class="profit_title">成交量(USDT)</p>
                                <p class="profit_number">21.21545</p>
                            </div>
                            <div>
                                <p class="profit_title">成交均价(USDT)</p>
                                <p class="profit_number">4212.3</p>
                            </div>
                            <div class="t_r">
                                <p class="profit_title">手续费(USDT)</p>
                                <p class="profit_number ">4212.3</p>
                            </div>
                        </div>
                        <p class="ordertime color_c">下单时间 14:10 06/02</p>
                    </div>
                </van-pull-refresh>
            </van-list>
            <div class="no-data" v-else></div>
        </div>
    </div>
</template>

<script>
import { optOrderList } from "@/api/binaryOption"
export default {
    name: "contractHistory",
    props: {

    },
    components: {
    },
    computed:{
        coinText(){
            return this.coinOption.find(v => v.value === this.coinIndex).text
        },
        typeText(){
            return this.typeOption.find(v => v.value === this.typeIndex).text
        },
        transactionText(){
            return this.transactionOption.find(v => v.value === this.transactionIndex).text
        },
        entrustText(){
            return this.entrustOption.find(v => v.value === this.entrustIndex).text
        },
        noMore() {
            return this.tabData.length >= this.total
        },
        disabled() {
            return this.loading || this.noMore
        },
    },
    data () {
        return {
            coin: 0,
            coinIndex:0,
            entrust: 1,
            entrustIndex: 1,
            transaction: 1,
            transactionIndex: 1,
            type: 1,
            typeIndex:1,
            coinOption: [
                { text: 'BTC', value: 0 },
            ],
            entrustOption: [
                { text: "限价委托", value: 1 },
                { text: "计划委托", value: 2 },
            ],
            transactionOption: [
                { text: "逐仓", value: 1 },
                { text: "全仓", value: 2 },
            ],
            typeOption: [
                { text: "全部状态", value: 1 },
                { text: "已成交", value: 2 },
                { text: "部分成交", value: 3 },
                { text: "已撤销", value: 4 },
            ],
            orderType: {
                1: '开多',
                2: '开空',
                3: '强平',
            },
            list: [
                { start: 1, type: 1, orderType: 1, typeOption: 4 },
                { start: 2, type: 2, orderType: 2, typeOption: 3 },
                { start: 3, type: 1, orderType: 3, typeOption: 2 },
                { start: 4, type: 2, orderType: 1, typeOption: 1 },
                { start: 4, type: 2, orderType: 1, typeOption: 1 },
            ],
            tabData: [],
            total: 0,
            loading: true,
            finished: false,
            pageData:{
                page:1,
                page_size:10,
                symbol:'',
                status:4,
            },
        }
    },
    created () {
        this.init()
    },
    mounted () {
    },
    methods: {
        onRefresh(){
            setTimeout(() =>{
                this.pageData.page = 1
                this.init()
            },1000)
        },
        loadMore() {
            this.loading = true;
            this.pageData.page += 1
            setTimeout(() => {
                this.init()
            }, 1000)
        },
        colorStyle (msg,type) {
            if(type === 'status'){
                if(msg == 3){
                    return "bg-sell";
                }
                return 'bg-buy'
            }else{
                if(msg === 1){
                    return 'bg-buy'
                }
                return "bg-sell";
            }
        },
        init(){
            this.loading = true;
            let obj = JSON.parse(JSON.stringify(this.pageData))
            optOrderList(obj).then(res => {
                let data = res.data
                let list = data.list || []
                this.total = data.total
                let tabDataList = this.pageData.page == 1 ? list : [...this.tabData,...list]
                let obj = {};
                this.tabData = tabDataList.reduce((cur,next) => {
                    obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                    return cur;
                },[]) //设置cur默认类型为数组，并且初始值为空的数组
                if (this.tabData.length >= data.total) this.finished = true
                this.loading = false;
                this.isLoading = false
            })
        },
        onConfirm (start) {
            if(start === 1){
                this.coinIndex = this.coin
                this.$refs.item1.toggle();
            }
            if(start === 2){
                this.entrustIndex = this.entrust
                this.$refs.item2.toggle();
            }
            if(start === 3){
                this.transactionIndex = this.transaction
                this.$refs.item3.toggle();
            }
            if(start === 4){
                this.typeIndex = this.type
                this.$refs.item4.toggle();
            }
        },
        typeOptionFun (val) {
            return this.typeOption.find(v => v.value === val).text
        }
    }
}
</script>
<style lang='scss' scoped>
@import "./index.scss";
.contractHistory {
    height: 100%;
    ::v-deep .van-dropdown-menu .van-dropdown-menu__title {
        font-size: 12px;
    }
    .select_body_centen {
        background: #ffffff;
        border-radius: 0 0 15px 15px;
        ul {
            padding: 15px 20px 0;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            li {
                width: 33.33%;
                margin-bottom: 15px;
                button {
                    height: 35px;
                    width: 100px;
                    background: #e6e6e6;
                    border-radius: 4px;
                    font-size: 12px;
                    &.active {
                        background: $main-blue;
                        color: #ffffff;
                    }
                }
                &:nth-child(3n+2){
                    text-align: center;
                }
                &:nth-child(3n+3){
                    text-align: right;
                }
            }
        }
        .operation_body {
            border-top: 1px solid #e6e6e6;
            div {
                flex: 1;
                line-height: 46px;
                font-size: 16px;
                &:nth-child(1) {
                    border-right: 1px solid #e6e6e6;
                }
            }
        }
    }
    .contractHistory_list {
        height: calc(100% - 48px);
        overflow-y: auto;
    }
    .order_ul {
        padding: 15px;
        border-bottom: 1px solid #e6e6e6;
        .title {
            line-height: 20px;
            font-weight: 500;
        }
        .profit_title {
            font-size: 12px;
            line-height: 17px;
            color: $c-999;
            margin-bottom: 10px;
        }
        .profitDetail {
            margin-top: 15px;
            div {
                flex: 1;
                .profit_number {
                    line-height: 17px;
                    font-size: 12px;
                }
            }
        }
        .ordertime {
            font-size: 12px;
            line-height: 17px;
            margin-top: 10px;
        }
    }
}
</style>