<template>
  <div class="order-detail">
    <div class="header">
        <i class="iconfont iconzuo" @click="back"></i>
        <div class="title">订单详情</div>
    </div>
    <div class="content-box">
        <div class="interval-line"></div>
        <div class="top-info-box">
            <div class="head flexC_S">
                <span class="upper">{{dataInfo.quote_currency || '-'}}/{{dataInfo.base_currency || '-'}}</span>
                <span v-if="dataInfo.status === 1" :class="colorStyle('coinInfo')">
                    {{$fomatFloat(coinInfo.price, pricePrecision) + ' ' }}{{coinInfo.rate > 0 ? '+'  : ''}}{{(coinInfo.rate || 0).toFixed(2) + '%'}}
                </span>
            </div>
            <div class="content">
                <div>浮动盈亏USDT</div>
                <div v-if="dataInfo.status === 1" class="num" :class="{'color-up': profitLoss.num > 0, 'color-down': profitLoss.num < 0}">
                    {{(profitLoss.num > 0  ? '+' : '') + profitLoss.num}}
                </div>
                <div v-else class="num" :class="{'color-up':dataInfo.profit_loss > 0, 'color-down': dataInfo.profit_loss < 0}">
                    {{(dataInfo.profit_loss > 0 ? '+' : '') + $fomatFloat(dataInfo.profit_loss, pricePrecision)}}
                </div>
            </div>
            <div class="flexC_S">
                <span>止损价 {{dataInfo.stop_loss_price ? $fomatFloat(dataInfo.stop_loss_price, pricePrecision) : '--'}}</span>
                <span>止盈价 {{dataInfo.stop_profit_price ? $fomatFloat(dataInfo.stop_profit_price, pricePrecision) : '--'}}</span>
            </div>
            <div class="tips">{{$constant.optionTradeStatus[dataInfo.status]}}</div>
        </div>
        <div class="interval-line"></div>
        <div class="center-info-box flexC_S">
            <div class="left">
                <div class="tit">买入市值 <span class="upper">{{dataInfo.base_currency}}</span></div>
                <!-- <div class="num">{{$fomatFloat(dataInfo.order_price*dataInfo.order_amt, pricePrecision)}}</div> -->
                <div class="num">{{$fomatFloat((dataInfo.order_bond * dataInfo.leverage_ratio) || 0, pricePrecision)}}</div>
                <div class="desc upper">{{dataInfo.quote_currency}} {{$fomatFloat(dataInfo.order_amt || 0, amountPrecision)}}个</div>
            </div>
            <div class="right">
                <div class="tit">保证金</div>
                <div class="num">{{dataInfo.order_bond || 0}}</div>
                <div class="desc">杠杆 ≈ {{dataInfo.leverage_ratio || 0}}X</div>
            </div>
        </div>
        <div class="interval-line"></div>
        <div class="bottom-info-box">
            <div class="list flexC_S">
                <span>买{{dataInfo.trans_intention === 1 ? '涨' : '跌'}}价格</span>
                <span>{{$fomatFloat(dataInfo.order_price || 0, pricePrecision)}}</span>
            </div>
            <div class="list flexC_S">
                <span>买{{dataInfo.trans_intention === 1 ? '涨' : '跌'}}时间</span>
                <span>{{$formatDate(dataInfo.created_at) || '--'}}</span>
            </div>
            <div class="list flexC_S">
                <span>平仓价格</span>
                <span>{{dataInfo.status === 1 ? '--' : $fomatFloat(dataInfo.close_price || 0, pricePrecision)}}</span>
            </div>
            <div class="list flexC_S">
                <span>平仓时间</span>
                <span>{{$formatDate(dataInfo.closed_at) || '--'}}</span>
            </div>
            <div class="list flexC_S">
                <span>平仓手续费<label @click="showRatePopup = true">费率表</label></span>
                <span class="upper" v-if="dataInfo.status === 1">--</span>
                <span class="upper" v-else>{{$fomatFloat(dataInfo.closing_fee || 0, pricePrecision)}}{{dataInfo.base_currency}}</span>
            </div>
        </div>
    </div>
    <van-popup v-model="showRatePopup" style="background: #131E30;border-radius: 10px;">
        <div class="stop-popup-box">
            <div class="title">费率表</div>
            <div class="text">
                <p>开仓手续费 （免费）<br/>
                平仓手续费 = 买入市值 * 平仓手续费费率。<br/>
                平仓结算时，手续费从保证金退还余额中扣除。<br/>
                如退还保证金不足以支付手续费，超出部分免支付。<br/></p>
                <p style="padding-top: 25px">如何降低手续费<br/>
                手续费根据买入市值来计算，杠杆越高市值越大手续费就越多，所以选择低杠杆交易手续费就会优惠很多。</p>
            </div>
            <div class="btn-box">
                <div class="btn" @click="showRatePopup = false">关闭</div>
            </div>
        </div>
    </van-popup>
  </div>
</template>

<script>
import { optOrderInfo } from "@/api/optionTrade"
import { mapState } from "vuex"
import { worker } from "@/utils/webWorker.js";
import _find from 'lodash/find'
export default {
    name: 'OrderDetail',
    components: {
    },
    data() {
        return {
            showRatePopup: false,
            dataInfo: {
                profit_loss: 0,
            },
            orderId: '',
            profitLoss: {
                num: 0,
                ratio: 0.00
            },
            coinInfo: {
                price: 0
            }
        }
    },
    computed: {
        ...mapState({
            usdtCny: (state) => state.publicData.usdt_cny,
            coinConfig: (state) => state.coinConfig,
            token: (state) => state.user.token,
        }),
        pricePrecision () {
            return this.$store.state.optionTrade.config.price_precision
        },
        amountPrecision () {
            return this.$store.state.optionTrade.config.amount_precision
        },
        symbolAccuracy(){
            const symbol = this.dataInfo.quote_currency + '/' + this.dataInfo.base_currency
            return this.coinConfig.info[symbol] && this.coinConfig.info[symbol].basicCoinAccuracy || 2
        },
    },
    created() {
        this.orderId = this.$route.query.orderId
        this.getOptOrderInfo()
    },
    beforeDestroy () {
        if (this.dataInfo.status === 1) this.disconnect()
    },
    methods: {
        disconnect () {
            worker.postMessage({type: "UNSUB",data: { operate: "delcoins_b" },});
            worker.postMessage({ type: "LOGOUT", data: {
                authtoken: this.token
            }});
            worker.postMessage({ type: "CLOSE_WEBSOCKET" });
        },
        colorStyle () {
            if (this.coinInfo.price < this.coinInfo.open) {
                return 'color-down'
            }
            else if (this.coinInfo.price > this.coinInfo.open) return 'color-up'
        },
        initWs() {
            //初始连接
            worker.postMessage({ type: "CREATE_WEBSOCKET" });
            worker.onmessage = (ev) => {
                const { data } = ev;
                //已有ws链接
                if (data.type === "WEBSOCKET_ON_OPEN") {
                    // 全币种行情
                    this.subCoins()
                    // 推送用户登录
                    worker.postMessage({ type: "LOGIN", data: {
                        authtoken: this.token
                    }});
                }
                if (data.type === "WEBSOCKET_DATA") {
                    this.listenWSData(data.data);
                }
            };
        },
        listenWSData(data) {
            if (data.data && data.type === "rank_b") {//币币列表行情
                let marketList = JSON.parse(data.data)
                const symbollist = marketList[this.dataInfo.base_currency.toLocaleUpperCase()].symbollist
                const coinInfo = _find(symbollist, {quote: this.dataInfo.quote_currency.toLocaleUpperCase()}).info
                this.coinInfo = coinInfo
                // 买涨买跌
                let price = this.dataInfo.trans_intention === 1 ? coinInfo.price - this.dataInfo.order_price : this.dataInfo.order_price - coinInfo.price
                this.profitLoss.num = this.$fomatFloat(price*this.dataInfo.order_amt, this.pricePrecision)
                this.profitLoss.ratio = this.$fomatFloat(price*this.dataInfo.order_amt/this.dataInfo.order_bond, 2)
                // // 止盈、止损、强平 刷新列表
                // let isRefresh = false
                // if (this.dataInfo.trans_intention === 1) {
                //     // 买涨
                //     if (this.dataInfo.stop_profit_price && coinInfo.price >= this.dataInfo.stop_profit_price) {
                //         // 止盈
                //         isRefresh = true
                //     } else if (this.dataInfo.stop_loss_price && coinInfo.price <= this.dataInfo.stop_loss_price) {
                //         // 止损
                //         isRefresh = true
                //     } else if (this.dataInfo.force_close_price && coinInfo.price <= this.dataInfo.force_close_price) {
                //         // 强平
                //         isRefresh = true
                //     }
                // } else if (this.dataInfo.trans_intention === 2) {
                //     // 买跌
                //     if (this.dataInfo.stop_profit_price && coinInfo.price <= this.dataInfo.stop_profit_price) {
                //         // 止盈
                //         isRefresh = true
                //     } else if (this.dataInfo.stop_loss_price && coinInfo.price >= this.dataInfo.stop_loss_price) {
                //         // 止损
                //         isRefresh = true
                //     } else if (this.dataInfo.force_close_price && coinInfo.price >= this.dataInfo.force_close_price) {
                //         // 强平
                //         isRefresh = true
                //     }
                // }
                // if (isRefresh) {
                //     this.disconnect()
                //     this.getOptOrderInfo()
                // }
            }
            if (data.data && data.type === "opt_order_active") {
                // 登录成功后，接收更新信息，刷新页面
                if ([4,5,7].indexOf(JSON.parse(data.data).status) !== -1) {
                    this.disconnect()
                    this.getOptOrderInfo()
                }
            }
        },
        subCoins () {
            // 行情
            worker.postMessage({ type: "MARKETB", data: { optional: '' } });
        },
        getOptOrderInfo() {
            optOrderInfo({
                order_id: this.orderId
            }).then(res => {
                this.dataInfo = res.data.info
                if (this.dataInfo.status === 1) this.initWs()
            })
        },
        back() {
            this.$router.go(-1)
        },
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
.order-detail{
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
        height: 48px;
        line-height: 48px;
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
    }
    .content-box{
        height: calc(100% - 49px);
        overflow-y: auto;
        font-weight: 500;
        &::-webkit-scrollbar {
            display: none;
        }
        .top-info-box{
            padding: 0 20px;
            font-size: 12px;
            .head{
                padding: 15px 0;
                font-size: 17px;
            }
            .content{
                padding: 15px 0 20px 0;
                text-align: center;
                font-size: 14px;
                .num{
                    padding-top: 20px;
                    font-size: 28px;
                }
            }
            .tips{
                padding: 10px 0 20px 0;
                text-align: center;
            }
        }
        .center-info-box{
            padding: 20px;
            font-weight: 500;
            .tit{
                font-size: 17px;
                span{
                    font-size: 12px;
                }
            }
            .num{
                font-size: 24px;
                color: #fff;
                padding-top: 14px;
            }
            .desc{
                font-size: 12px;
                padding-top: 10px;
            }
            .right{
                text-align: right;
            }
        }
        .bottom-info-box{
            font-size: 14px;
            padding: 0 20px;
            .list{
                padding-top: 20px;
                label{
                    color: $main-blue;
                    padding-left: 20px;
                }
            }
        }
    }
    .stop-popup-box{
        width: 320px;
        color: #9B9B9B;
        font-weight: 500;
        font-size: 12px;
        .title{
            text-align: center;
            padding: 14px 0 10px 0;
            font-size: 17px;
        }
        .text{
            padding: 0 16px;
            line-height: 20px;
        }
        .btn-box{
            padding: 30px 0;
            .btn{
                width: 120px;
                height: 40px;
                line-height: 40px;
                border: 1px solid $main-blue;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                color: #FFFFFF;
                text-align: center;
                margin: 0 auto;
            }
        }
    }
}
</style>