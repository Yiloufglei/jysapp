<template>
<div class="list" @click="$emit('click', data)">
    <div class="list-title">
        <div class="l upper">{{data.quote_currency}}/{{data.base_currency}}</div>
        <div class="r" v-if="data.status !== 2 && data.status !== 3"><i class="iconfont iconyou1"></i></div>
    </div>
    <div class="list-content">
        <div class="item">
            <div class="top">
                <span :class="styleComp">{{data.trans_intention === 1 ? '买涨' : '买跌'}}</span>
            </div>
            <div class="bottom">数量 {{$fomatFloat(data.order_amt, amountPrecision)}}</div>
        </div>
        <div class="item">
            <div class="top">买入价 {{$fomatFloat(data.order_price, pricePrecision) || '--'}}</div>
            <div class="bottom">{{data.status === 1 ? '强平' : '平仓'}}价 {{$fomatFloat((data.status === 1 ? data.force_close_price : data.close_price ), pricePrecision) || '--'}}</div>
        </div>
        <div class="item last">
            <div class="top" :class="setStyle(data.profit)">{{data.profit > 0 ? '+'+ $fomatFloat(data.profit, pricePrecision) : $fomatFloat(data.profit, pricePrecision)}}</div>
            <div class="bottom" :class="setStyle(data.profitRatio)">{{data.profitRatio > 0 ? '+'+ data.profitRatio : data.profitRatio}}%</div>
        </div>
    </div>
    <div class="list-bottom">
        <div class="l">{{$constant.optionTradeStatus[data.status]}}</div>
        <div class="btn-box flexC_S" v-if="holdTabIndex === 0">
            <div class="btn" @click.stop="$emit('clickBtn', '1', data)" v-if="data.status === 2">撤单</div>
            <div class="btn" @click.stop="$emit('clickBtn', '2', data)" v-if="data.status === 1">止盈止损</div>
            <div class="btn" @click.stop="$emit('clickBtn', '3', data)" v-if="data.status === 1">平仓</div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'cellList',
    props: {
        data: {
            type: Object,
            default() {
                return {}
            }
        },
        holdTabIndex: {
            type: Number,
            default: 0
        }
    },
    computed: {
        styleComp() {
            return this.data.trans_intention === 1 ? 'label-up' : this.data.trans_intention === 2 ? 'label-down' : ''
        },
        pricePrecision () {
            return this.$store.state.optionTrade.config.price_precision
        },
        amountPrecision () {
            return this.$store.state.optionTrade.config.amount_precision
        }
    },
    methods: {
        setStyle(val) {
            return val > 0 ? 'color-up' : val < 0 ? 'color-down' : ''
        }
    }
}
</script>

<style lang="scss" scoped>
.list{
    .list-title{
        display: flex;
        justify-content: space-between;
        padding: 15px 20px;
        color: #fff;
        font-size: 17px;
        font-weight: 500;
        .iconfont{
            font-size: 20px;
        }
    }
    .list-content{
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding: 0px 20px 15px 20px;
        font-size: 12px;
        .item{
            flex: 1;
            &.last{
                text-align: right;
                .top{
                    font-size: 16px;
                }
            }
            .bottom{
                padding-top: 15px;
            }
            .top{
                height: 20px;
                span{
                    color: #fff;
                    display: inline-block;
                    width: 40px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    border-radius: 3px;
                }
                .label-up{
                    background: $buy;
                }
                .label-down{
                    background: $sell;
                }
            }
            .color-up{
                color: $buy;
            }
            .color-down{
                color: $sell;
            }
        }
    }
    .list-bottom{
        height: 44px;
        border-top: 1px solid #071724;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        .btn-box{
            .btn{
                width: 80px;
                height: 25px;
                line-height: 23px;
                border: 1px solid $main-blue;
                border-radius: 6px;
                text-align: center;
                color: $main-blue;
            }
            .btn~.btn{
                margin-left: 20px;
            }
        }
    }
    }
</style>