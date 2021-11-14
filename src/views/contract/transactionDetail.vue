<!-- 成交详情 -->
<template>
    <div class="contractTransactionDetail">
        <div class="order_ul">
            <div class="title">
                <p>BTC 永续/USDT·逐仓<span class="buy-color">20X·开多</span></p>
            </div>
            <div class="profitDetail flexC_S" v-if="isShow">
                <div>
                    <p class="profit_title">成交均价(USDT)</p>
                    <p class="profit_number">21.21545</p>
                </div>
                <div>
                    <p class="profit_title">成交量(张)</p>
                    <p class="profit_number">4212.3</p>
                </div>
                <div class="t_r">
                    <p class="profit_title">手续费(USDT)</p>
                    <p class="profit_number ">4212.3</p>
                </div>
            </div>
            <div class="profitDetail flexC_S" v-else>
                <div>
                    <p class="profit_title">委托价(USDT)</p>
                    <p class="profit_number">21.21545</p>
                </div>
                <div>
                    <p class="profit_title">委托量(张)</p>
                    <p class="profit_number">4212.3</p>
                </div>
                <div class="t_r">
                    <p class="profit_title">收益(USDT)</p>
                    <p class="profit_number ">4212.3</p>
                </div>
            </div>
            <div class="profitDetail flexC_S" v-if="isShow">
                <div>
                    <p class="profit_title col-center">
                        <span>收益(USDT)</span>
                        <i class="iconfont iconwenhao" @click="showProfit = true"></i>
                    </p>
                    <p class="profit_number">21.21545</p>
                </div>
                <div>
                    <p class="profit_title col-center">
                        <span>平仓盈亏(USDT)</span>
                        <i class="iconfont iconwenhao" @click="showProfitLoss = true"></i>
                    </p>
                    <p class="profit_number">4212.3</p>
                </div>
                <div></div>
            </div>
        </div>
        <div class="interval_bj"></div>
        <ul class="transactionDetail_ul" v-if="isShow">
            <li><span class="color_c">时间</span><span>14:10 03/10</span></li>
            <li><span class="color_c">委托类型</span><span>限价委托</span></li>
            <li><span class="color_c">成交价</span><span>4,212.3BTC</span></li>
            <li><span class="color_c">成交量</span><span>5张</span></li>
            <li><span class="color_c">成交类型</span><span>maker</span></li>
            <li><span class="color_c">手续费</span><span>-4212.3BTC</span></li>
        </ul>
        <ul class="transactionDetail_ul" v-else>
            <li><span class="color_c">撤销时间</span><span>14:10 03/10</span></li>
            <li><span class="color_c">委托类型</span><span>限价委托</span></li>
        </ul>
        <!-- 收益说明弹窗 -->
        <van-dialog v-model="showProfit" title="" :showConfirmButton="false">
            <p class="title">收益说明</p>
            <p class="conten_text">收益计算公式:</p>
            <p class="conten_text">(1)币本位合约:</p>
            <p class="conten_text">多单收益=1/开仓均价-1/平仓成交均价]*平多合约张数*合约面值</p>
            <p class="conten_text">空单收益=(1平仓成交均价-1/开仓均价]*平空合约张数*合约面值</p>
            <p class="conten_text">(2)USDT本位合约:</p>
            <p class="conten_text">多单收益=平仓成交均价-开仓均价]*合约面值*平多仓合约张数</p>
            <p class="conten_text">空单收益=开仓均价-平仓成交均价)*合约面值*平空仓合约张数</p>
            <p class="conten_text">历史收益数据可通过历史记录-已成交订单-成交明细-平仓盈亏查看。</p>
            <van-row type="flex" justify="space-between">
                <van-col span="24">
                    <van-button type="info" block size="small" @click="showProfit = false">知道了</van-button>
                </van-col>
            </van-row>
        </van-dialog>
        <!-- 平仓盈亏说明弹窗 -->
        <van-dialog v-model="showProfitLoss" title="" :showConfirmButton="false">
            <p class="title">平仓盈亏说明</p>
            <p class="conten_text">平仓盈亏表示最近一次结算后产生的收益,不包括历史已结算的收益。</p>
            <p class="conten_text">平仓盈亏计算公式：</p>
            <p class="conten_text">USDT本位合约:</p>
            <p class="conten_text">多单平仓盈亏=(平仓成交均价-持仓均价)*合约面值*平多仓合约张数</p>
            <p class="conten_text">空单平仓盈亏=持仓均价-平仓成交均价]*合约面值*平空仓合约张数</p>
            <van-row type="flex" justify="space-between">
                <van-col span="24">
                    <van-button type="info" block size="small" @click="showProfitLoss = false">知道了</van-button>
                </van-col>
            </van-row>
        </van-dialog>
    </div>
</template>

<script>
export default {
    name: "contractTransactionDetail",
    props: {

    },
    components: {
    },
    data () {
        return {
            isShow:true,
            showProfitLoss:false,
            showProfit:false
        }
    },
    created () {

    },
    mounted () {

    },
    methods: {

    }
}
</script>
<style lang='scss' scoped>
@import "./index.scss";
.contractTransactionDetail {
    height: 100%;
    .transactionDetail_ul{
        font-size: 12px;
        padding: 10px 15px;
        border-bottom: 1px solid #F9F9F9;
        li{
            line-height: 32px;
            display: flex;
            align-content: center;
            justify-content: space-between;
        }
    }
    .order_ul {
        padding:20px 15px;
        .title {
            line-height: 20px;
            font-weight: 500;
            margin-bottom: 15px;
            font-size: 16px;
        }
        .profit_title {
            font-size: 12px;
            line-height: 17px;
            color: $c-999;
            margin-bottom: 10px;
            i{
                margin-left: 5px;
            }
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
    }
}
</style>