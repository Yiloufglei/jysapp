<template>
    <div class="table">
        <dl class="table_header">
            <dt>时间</dt>
            <dt>方向</dt>
            <dt>价格(USDT)</dt>
            <dt>数量</dt>
        </dl>
        <div class="list">
            <dl class="row" v-for="(item,index) in dealData" :key="index">
                <dd>{{$formatDate(parseInt(item.ts / 1000),':')}}</dd>
                <dd :class="{'sell-color' : item.direction == 'sell','buy-color' : item.direction == 'buy'}">{{item.direction == 'sell' ? '卖出' :'买入'}}</dd>
                <dd>{{$fomatFloat(item.price,symbolAccuracy)}}</dd>
                <dd>{{$fomatFloat(item.amount,currencyAccuracy)}}</dd>
            </dl>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    data(){
        return {

        }
    },
    computed:{
        ...mapState({
            dealData: (state) => state.wsData.dealData,
            coinConfig: (state) => state.coinConfig,
            symbol: (state) => state.wsData.symbol,
        }),
        splitSymbol () {
            return this.symbol.split("_").join("/");
        },
        symbolAccuracy(){
            return this.coinConfig.info[this.splitSymbol] && this.coinConfig.info[this.splitSymbol].basicCoinAccuracy || 2
        },
        currencyAccuracy() {
            return this.coinConfig.info[this.splitSymbol] && this.coinConfig.info[this.splitSymbol].currencyAccuracy || 2
        }
    }
};
</script>
<style lang="scss" scoped>
.table {
    padding: 0 14px;
    width: 100%;
    .table_header {
        dt {
            line-height: 30px;
        }
    }
    dl {
        display: flex;
        dt,
        dd {
            flex: 1;
            text-align: center;
            &:nth-child(1) {
                text-align: left;
            }
            &:nth-child(3) {
                flex: 2;
            }
            &:nth-child(4) {
                text-align: right;
            }
        }
        dt {
            font-size: 12px;
        }
        dd {
            line-height: 24px;
            font-size: 11px;
        }
    }
    .list {
        .row {
            color: #fff;
            height: 32px;
            align-items: center;
        }
    }
}
</style>