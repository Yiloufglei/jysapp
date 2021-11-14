<template>
    <div class="container overflowPatible">
        <div class="lever-num">
            <div class="title-box">
                <dl class="info-title padding-16">
                    <dd>合约编号</dd>
                    <dd>{{ detailData.allocation_id }}</dd>
                </dl>
            </div>
        </div>
        <section class="view padding-16">
            <div class="view-title between">
                <dl class="upper">
                    {{detailData.choose_coins_info && detailData.choose_coins_info.coinName}}{{ detailData.type_flag | transTitle }}{{ detailData.multiple }}倍
                </dl>
                <dl>
                    {{ new Date(detailData.begin_time * 1000).Format("yyyy-MM-dd") }}~{{new Date(detailData.end_time * 1000).Format("yyyy-MM-dd")}}
                </dl>
            </div>
            <div class="view-data">
                <div class="data-text">交易盈亏（USDT）</div>
                <div class="data-num ep-hd">{{ detailData.win_profit > 0 ? $fomatFloat(detailData.win_profit,4) : $fomatFloat(detailData.loss_profit,4) }}</div>
                <div class=" column col-center">
                    <Pie ref="pie"/>
                </div>
            </div>
            <ListItem front="当前总资产" :end="`${$fomatFloat(detailData.total_assets,4)} USDT`" />
            <ListItem front="管理费" :end="`${$fomatFloat(detailData.manager_cost,4)} USDT`" />
        </section>
        <section class="info-detail">
            <dl class="detail-item flex">
                <dd>
                    <span>总配资资金：</span>
                    <span>{{ $fomatFloat(detailData.total_allocation,4) }}</span>
                </dd>
                <dd>
                    <span>申请额度：</span>
                    <span>{{ $fomatFloat(detailData.allocation_money,4) }}</span>
                </dd>
            </dl>
            <dl class="detail-item flex">
                <dd>
                    <span>风险保证金：</span>
                    <span>{{ $fomatFloat(detailData.bonds,4) }}</span>
                </dd>
                <dd>
                    <span>收益分成：</span>
                    <span>{{$fomatFloat(detailData.share_money, 2)}}</span>
                </dd>
            </dl>
            <dl class="detail-item flex">
                <dd>
                    <span>平仓警戒线：</span>
                    <span>{{ $fomatFloat(detailData.close_money,4) }}</span>
                </dd>
                <dd>
                    <span>亏损警戒线：</span>
                    <span>{{ $fomatFloat(detailData.alert_money,4) }}</span>
                </dd>
            </dl>
        </section>
        <section class="padding-16">
            <dl class="info-title title-margin">
                <dd>交易盈亏分配</dd>
            </dl>
            <ListItem front="盈利分配" :end="`${$fomatFloat(detailData.win_profit,4)} USDT`" />
            <ListItem front="亏损赔付" :end="`${$fomatFloat(detailData.loss_profit,4)} USDT`" />
        </section>
        <section class="padding-16">
            <dl class="info-title title-margin">
                <dd>保证金结算</dd>
            </dl>
            <ListItem front="冻结" :end="`${$fomatFloat(detailData.bonds, 4)} USDT`" />
            <ListItem front="扣除" :end="`${$fomatFloat(detailData.deduction, 4)} USDT`" />
            <ListItem front="解冻" :end="`${$fomatFloat(detailData.frozen, 4)} USDT`" />
        </section>
        <section class="padding-16">
            <dl class="info-title title-margin">
                <dd>交易流水</dd>
                <router-link class="more" :to="{
            path: '/capitalDetail',
            query: { id: detailData.allocation_id },
          }">更多<i class="iconfont iconyou1 fzboid"></i></router-link>
            </dl>
        </section>
        <div class="no-data" style="margin-top: 12px" :style="{ 'padding-bottom': billList.length ? '70px' : '0' }">
            <Table v-for="item in billList" :billData="item" :key="item.id" />
        </div>
    </div>
</template>
<script>
import Pie from "./pie";
import ListItem from "@/components/listItem";
import Table from "./table";
import { getHistoryLeverDetail } from "@/api/leverage";
import mixin from "../mixin";
export default {
    components: { Pie, ListItem, Table },
    data () {
        return {
            detailData: {},
            billList: [],
            pieData: {}
        };
    },
    mixins: [mixin],
    methods: {
        async getHistoryLeverDetail () {
            const { data } = await getHistoryLeverDetail({
                id: this.$route.query.id,
            });
            this.detailData = data.data;
            this.billList = data.allocationTrade;
            this.pieData = {
                win: this.detailData.win_profit,
                loss: this.detailData.loss_profit,
                baseCount: this.detailData.bonds,
                total_allocation: this.detailData.total_allocation,
            }
            this.$refs.pie.PieChart(this.pieData)
        },
    },
    mounted () {
        this.getHistoryLeverDetail();
    },
};
</script>
<style lang="scss" scoped>
.container {
    height: 100%;
}
.lever-num {
    background: #f9f9f9;
    padding: 10px 0;
    .title-box {
        height: 49px;
        line-height: 49px;
        background: #fff;
    }
}
.padding-16 {
    padding-left: 16px !important;
    padding-right: 16px !important;
}
.title-margin {
    margin: 20px 0 8px;
}
.info-title {
    @extend .between;
    dd {
        font-size: 16px;
        color: #233b55;
        &:first-child {
            font-weight: 500;
        }
    }
}
.view {
    padding: 12px 0 20px;
}
.view-title {
    dl {
        &:first-child {
            font-size: 16px;
        }
        &:last-child {
            font-size: 12px;
            color: #9c9ba5;
        }
    }
}
.view-data {
    position: relative;
    margin-top: 20px;
    padding-bottom: 18px;
    .data-text {
        color: #9c9ba5;
        font-size: 12px;
    }
    .data-num {
        color: #fd9e00;
        font-size: 18px;
        margin: 8px 0 15px;
        font-weight: 500;
    }
}

.info-detail {
    padding: 13px 20px;
    background: #f9f9f9;
    .detail-item {
        &:not(:last-child) {
            margin-bottom: 12px;
        }
        dd {
            flex: 1;
            font-size: 12px;
            color: #9c9ba5;
            display: flex;
            justify-content: space-between;
        }
        dd ~ dd {
            margin-left: 32px;
        }
    }
}
.more {
    font-size: 14px !important;
    color: #9c9ba5 !important;
}
</style>