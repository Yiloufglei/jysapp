<!-- 二元期权历史 -->
<template>
    <div class="binaryOptionHistory">
        <van-dropdown-menu active-color="#1989fa">
            <van-dropdown-item :title="profitLossText" ref="item2">
                <div class="select_body_centen">
                    <ul>
                        <li v-for="item in profitLossOption" :key='item.value' @click="profitLoss = item.value">
                            <button :class="{'active': profitLoss == item.value}">{{item.text}}</button>
                        </li>
                    </ul>
                    <div class="operation_body flexC_S">
                        <div class="center color_c" @click="profitLoss = 4">重置</div>
                        <div class="center color_b" @click="onConfirm(2)">筛选</div>
                    </div>
                </div>
            </van-dropdown-item>
            <van-dropdown-item :title="coinText" ref="item3">
                <div class="select_body_centen">
                    <ul>
                        <li v-for="item in coinOption" :key='item.symbol' @click="coin = item.symbol">
                            <button :class="{'active': coin == item.symbol}"><span class="upper">{{item.symbol || '所有币对'}}</span></button>
                        </li>
                    </ul>
                    <div class="operation_body flexC_S">
                        <div class="center color_c" @click="coin = ''">重置</div>
                        <div class="center color_b" @click="onConfirm(3)">筛选</div>
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
                <van-collapse v-model="activeNames">
                    <van-collapse-item :name="index" v-for="(item,index) in tabData" :key="item.id">
                        <template #title>
                            <div class="position_list upper">
                                <div class="position_list_r_t flexC_S">
                                    <p>{{item.symbol}}<span :class="colorStyle(item.trans_type)">{{item.trans_type === 1 ? '买涨' : '买跌'}}</span></p>
                                    <span class="position_list_time">{{$formatDate(item.created_at,'s')}}</span>
                                </div>
                                <div class="position_list_r_c flexC_S">
                                    <p><span>开仓价：</span>{{item.order_price}}</p>
                                    <p><span>结算价：</span>{{item.close_price}}</p>
                                </div>
                                <div class="position_list_r_t flexC_S">
                                    <span>购买数量：{{item.order_amt + ' '}}{{item.base_currency}}</span>
                                    <p><span :class="colorStyle(item.status,'status')">{{positionStatus[item.status]}}{{Math.abs(item.award_amt)}}</span></p>
                                </div>
                            </div>
                        </template>
                        <div class="position_list upper">
                            <div class="position_list_r_c">
                                <p><span>开仓时间：</span>{{$formatDate(item.created_at,'s')}}</p>
                            </div>
                            <div class="position_list_r_c">
                                <p><span>平仓时间：</span>{{$formatDate(item.updated_at,'s')}}</p>
                            </div>
                        </div>
                    </van-collapse-item>
                </van-collapse>
            </van-pull-refresh>
            </van-list>
            <div class="no-data" v-else></div>
        </div>
    </div>
</template>

<script>
import { optOrderList } from "@/api/binaryOption"
import { mapState } from "vuex"
export default {
    name: "binaryOptionHistory",
    props: {

    },
    components: {
    },
    computed:{
        ...mapState({
            placeOrderList: (state) => state.optionTrade.placeOrderList,
        }),
        coinText(){
            return this.coinOption.find(v => v.symbol === this.coinIndex).symbol || '所有币对'
        },
        profitLossText(){
            return this.profitLossOption.find(v => v.value === this.profitLossIndex).text
        },
        noMore() {
            return this.tabData.length >= this.total
        },
        disabled() {
            return this.loading || this.noMore
        },
        coinOption(){
            return [{ symbol: "", value: 0 },...this.placeOrderList]
        }
    },
    data () {
        return {
            isLoading: false,
            activeNames:[],
            coin: '',
            coinIndex:'',
            profitLoss: 4,
            profitLossIndex: 4,
            type: 0,
            typeIndex:0,
            profitLossOption: [
                { text: "全部盈亏", value: 4 },
                { text: "盈利", value: 2 },
                { text: "亏损", value: 3 },
            ],
            positionStatus:{
                1 : '未结算' ,
                2 : '盈:' ,
                3 : '亏:'
            },
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

    },
    mounted () {
        this.init()
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
        onConfirm (start) {
            this.pageData.page = 1
            if(start === 2){
                this.profitLossIndex = this.profitLoss
                this.pageData.status = this.profitLoss
                this.$refs.item2.toggle();
            }
            if(start === 3){
                this.coinIndex = this.coin
                this.pageData.symbol = this.coin
                this.$refs.item3.toggle();
            }
            this.init()
        },
    }
}
</script>
<style lang='scss' scoped>
.binaryOptionHistory {
    height: 100%;
    ::v-deep .van-dropdown-menu .van-dropdown-menu__title {
        font-size: 12px;
        text-transform: uppercase;
    }
    ::v-deep .van-collapse-item__wrapper{
        transition: height 0.01s ease-in-out;
    }
    ::v-deep .van-collapse-item__title .van-cell__right-icon::before{
        transition: transform 0.01s,-webkit-transform .3s;
    }
    // .activeItem{
    //     /*一个溢出的盒子作为边框，添加背景后形成光源效果*/
    //     &::before {
    //         content: '';
    //         position: absolute;
    //         top:0px;
    //         left: 0px;
    //         width: 100%;
    //         height: 100%;
    //         // box-shadow: 0 0 10px rgb(78,130,243) inset;
    //         border: 4px solid #000;
    //         // box-shadow: 0 0 5px rgb(0,0,0) inset;
    //         box-sizing: border-box;
    //     }
    // }
    ::v-deep .van-cell{
        background: rgba($color: #fff, $alpha: 0.0);
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
                    width: 80%;
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
    .position_list{
        font-size: 12px;
        .position_list_r_t{
            height: 20px;
            p{
                font-size: 14px;
                span{
                    margin-left: 5px;
                    padding: 0 2px;
                    border-radius: 3px;
                    color: #fff;
                    font-size: 12px;
                }
            }
        }
        .position_list_r_c{
            margin: 5px 0;
            line-height: 17px;
        }
        .position_list_r_b{
            height: 17px;
            p{
                flex: 1;
                &:last-child{
                    max-width: 60px;
                    text-align: right;
                }
            }
        }
    }
}
</style>