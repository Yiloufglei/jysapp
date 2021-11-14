<template>
    <div>
        <div class="order-container">
            <TradeOrder :orderData="backTradeInfo" showRate />
        </div>
        <div class="interval_bj"></div>
        <section class="list upper">
            <div class="list-item" v-for="item in backDetailList" :key="item.id">
                <dl class="between">
                    <dd>成交时间</dd>
                    <dd>{{ $formatDate((item.createAt || item.createdAt),'/')}}</dd>
                </dl>
                <dl class="between">
                    <dd>方式</dd>
                    <dd>{{ (item.tradeType || backTradeInfo.tradeDirection) | transTradeType }}</dd>
                </dl>
                <dl class="between">
                    <dd>成交价</dd>
                    <dd>{{ item.tradePrice }} {{ coin.base }}</dd>
                </dl>
                <dl class="between">
                    <dd>成交量</dd>
                    <dd>{{ $fomatFloat(item.tradeNums,currencyAccuracy) }} {{ coin.quote }}</dd>
                </dl>
                <dl class="between">
                    <dd>手续费</dd>
                    <dd>{{ fomatFloat(item.tradeCost) }} {{ backTradeInfo.constFeeUnit }}</dd>
                </dl>
            </div>
        </section>
    </div>
</template>
<script>
import TradeOrder from "./tradeOrder";
import { getTradeHistoryDetail, allocationTradeDetailRead } from "@/api/trade";
import { mapState } from 'vuex'
export default {
    components: { TradeOrder },
    data () {
        return {
            detailData: {},
        };
    },
    filters: {
        transTradeType (type) {
            switch (type) {
                case 1:
                    return "限价";
                case 2:
                    return "市价";
            }
        },
    },
    computed: {
        ...mapState({
            coinConfig: (state) => state.coinConfig,
        }),
        coin () {
            if (this.backTradeInfo) {
                const cArr = this.coins.split("/");
                return { base: cArr[1], quote: cArr[0] };
            }
        },
        type() {
            return this.$route.query.type
        },
        backDetailList() {
            return  this.detailData.detailList || this.detailData.backDetailList
        },
        backTradeInfo() {
            return this.detailData.tradeInfo || this.detailData.backTradeInfo
        },
        coins() {
            let coins = this.backTradeInfo.coins
            if (this.backTradeInfo.coinsInfo) {
                coins = this.backTradeInfo.coinsInfo.coinName
            }
            return coins
        },
        currencyAccuracy(){
            return this.coinConfig.info[this.coins] && this.coinConfig.info[this.coins].currencyAccuracy || 2
        },
    },
    methods: {
        fomatFloat(num) {
            let info = this.coinConfig.info[this.coins.toLowerCase()]
            return this.$fomatFloat(Number(num), 8)
            // return this.$fomatFloat(Number(num), info.basicCoinAccuracy)
        },
        async getTradeHistoryDetail () {
            const actions = this.type === 'spot' ? getTradeHistoryDetail : allocationTradeDetailRead
            let parmas = {}
            if (this.type === 'spot') {
                parmas.tradeId = this.$route.query.id
            } else {
                parmas.trade_id = this.$route.query.id
            }
            const { data } = await actions(parmas);
            this.detailData = data;
        },
    },
    created () {
        this.getTradeHistoryDetail();
    },
};
</script>
<style lang="scss" scoped>
dd {
    @include ep-hd;
}
.order-container {
    // background: #f9f9f9;
    padding-bottom: 10px;
    min-height: 170px;
}
.list {
    padding: 0 16px;
    .list-item {
        &:not(:last-child) {
            border-bottom: 1px solid #e6e6e6;
        }
        dl {
            padding: 15px 0;
            &:not(:last-child) {
                padding-bottom: 15px;
            }
            dd {
                color: #9c9ba5;
                font-size: 12px;
                &:last-child {
                    color: $main-font-c;
                    font-weight: 500;
                }
            }
        }
    }
}
</style>