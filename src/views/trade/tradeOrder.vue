<template>
    <div class="trade-order buy upper">
        <section class="order-content" v-if="orderData">
            <dl class="order-type between">
                <dd class="upper title" :class="{'buy-color' : tradeDirection == 1,'sell-color' : tradeDirection == 2}">
                    {{ tradeDirection == 1 ? "买入" : "卖出" }}
                    {{ coins }}
                </dd>
                <dd class="revoke" v-if="revoke" @click="$emit('revoke', orderData)">
                    撤单
                </dd>
                <dd v-else-if="!showRate">
                    <span class="color_c">{{tradeNums === 0 ? '已撤销': tradeNums === entrustNums ? '全部成交' : '部分成交' }}<i class="iconfont iconyou1" v-if="orderData.tradeNums !== 0"></i></span>
                </dd>
            </dl>
            <section class="order-table">
                <dl class="order-info margin-info">
                    <dt>委托时间</dt>
                    <dt>委托价格({{ coin.base }})</dt>
                    <dt>委托量({{ coin.quote }})</dt>
                </dl>
                <dl class="order-info margin-info">
                    <dd>
                        {{ $formatDate(createdAt,'/') }}
                    </dd>
                    <dd>{{ $fomatFloat(entrustPrice,symbolAccuracy) }}</dd>
                    <dd>{{ $fomatFloat(entrustNums,currencyAccuracy) }}</dd>
                </dl>
                <dl class="order-info margin-info">
                    <dt>成交总额({{ coin.base }})</dt>
                    <dt>成交均价({{ coin.base }})</dt>
                    <dt>成交量({{ coin.quote }})</dt>
                </dl>
                <dl class="order-info margin-info">
                    <dd>{{ $fomatFloat(totalMoney,symbolAccuracy) }}</dd>
                    <dd>{{ $fomatFloat(averagePrice,symbolAccuracy) }}</dd>
                    <dd>{{ $fomatFloat(tradeNums,currencyAccuracy) }}</dd>
                </dl>
                <template v-if="showRate">
                    <dl class="order-info">
                    <dt>手续费({{ orderData.constFeeUnit }})</dt>
                        <dt></dt>
                        <dt></dt>
                    </dl>
                    <dl class="order-info">
                        <dd>{{ $fomatFloat(Number(orderData.constFee), 8) }}</dd>
                        <dt></dt>
                        <dt></dt>
                    </dl>
                </template>
            </section>
        </section>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
    props: {
        revoke: { type: Boolean, default: false },
        orderData: { type: Object, default: () => null },
        showRate: { type: Boolean, default: false },
    },
    computed: {
         ...mapState({
            coinConfig: (state) => state.coinConfig,
        }),
        symbolAccuracy(){
            return this.coinConfig.info[this.coins] && this.coinConfig.info[this.coins].basicCoinAccuracy || 2
        },
        currencyAccuracy(){
            return this.coinConfig.info[this.coins] && this.coinConfig.info[this.coins].currencyAccuracy || 2
        },
        coin () {
            if (this.orderData) {
                const cArr = this.coins.split("/");
                return { base: cArr[1], quote: cArr[0] };
            }
        },
        type() {
            return this.$route.query.type
        },
        tradeDirection() {
            return this.orderData.trade_direction || this.orderData.tradeDirection
        },
        coins() {
            if (this.orderData.coinsInfo) {
                return this.orderData.coinsInfo.coinName
            }
            return this.orderData.coins.coinName || this.orderData.coins
        },
        createdAt() {
            return this.orderData.created_at || this.orderData.createdAt
        },
        entrustPrice() {
            return this.orderData.entrust_price || this.orderData.entrustPrice
        },
        entrustNums() {
            return this.orderData.entrust_nums || this.orderData.entrustNums
        },
        tradeNums() {
            return this.orderData.trade_nums || this.orderData.tradeNums
        },
        totalMoney() {
            return this.orderData.total_money || this.orderData.totalMoney
        },
        averagePrice() {
            return this.orderData.average_price || this.orderData.averagePrice
        }
    },
};
</script>
<style lang="scss" scoped>
dd {
    @include ep-hd;
}
.trade-order {
    padding: 15px 15px 15px;
    // background: #fff;
    font-size: 12px;
    .order-content {
        .order-type {
            line-height: 17px;
            dd.title{
                font-size: 14px;
            }
            dd:first-child {
                font-weight: 500;
            }
            .revoke {
                color: $main-blue;
            }
        }
        .order-table {
            .order-info {
                @extend .flex;
                &:nth-child(3){
                    dd,
                    dt {margin-top: 14px}
                }
                dd,
                dt {
                    flex: 1;
                    margin-top: 10px;
                    color: #9c9ba5;
                    &:nth-child(2){
                        padding-left: 20px;
                    }
                    &:last-child{
                        text-align: right;
                    }
                }
                dd {
                    color: $main-font-c;
                    font-weight: 500;
                    line-height: 17px;
                    height: 17px;
                }
            }
        }
    }
}
</style>