<template>
    <div class="leverageList_body">
        <div class="no-data">
            <div class="module" v-for="item in list" :key="item.id">
                <section class="header">
                    <div  class="info">
                        <p class="title upper">{{item.choose_coins_info.coinName}}{{ item.type_flag | transTitle }}{{ item.multiple }}倍({{item.allocation_id}})</p>
                        <p class="time_box flexC_S">
                            <span>{{ new Date(item.begin_time * 1000).Format("yyyy-MM-dd") }}~{{new Date(item.end_time * 1000).Format("yyyy-MM-dd")}}</span>
                            <span class="btn row-center">
                                <a class="center" @click="toPath(item)">配资交易</a>
                                <router-link class="center" :to="`/accountInformation?id=${item.id}`">账户信息</router-link>
                            </span>
                        </p>
                    </div>
                </section>
                <section class="list upper">
                    <!-- <ListItem front="配资币对" :end="item.choose_coins_info.coinName"></ListItem> -->
                    <ListItem front="当前总资产" :end="`${$fomatFloat(item.totalMoney,4)} ${item.choose_coins_info.coinBase}`"></ListItem>
                    <ListItem front="亏损警戒线" :end="`${$fomatFloat(item.alert_money,4)} ${item.choose_coins_info.coinBase}`"></ListItem>
                    <ListItem front="亏损平仓线" :end="`${$fomatFloat(item.close_money,4)} ${item.choose_coins_info.coinBase}`"></ListItem>
                    <ListItem front="风险保证金" :end="`${$fomatFloat(item.bonds,4)} ${item.choose_coins_info.coinBase}`"></ListItem>
                    <ListItem front="可用余额" :end="`${$fomatFloat(item.left_money,4)} ${item.choose_coins_info.coinBase}`"></ListItem>
                    <ListItem front="浮动盈亏" :end="`${$fomatFloat(item.profit_loss,4)} ${item.choose_coins_info.coinBase}`"></ListItem>
                </section>
            </div>
        </div>
    </div>
</template>
<script>
import ListItem from "@/components/listItem";
import mixin from "./mixin";
import { getCurrentLever } from "@/api/leverage";
export default {
    components: { ListItem },
    data () {
        return {
            params: {
                curpage: 1,
                pageSize: 10,
            },
            list: [],
        };
    },
    mixins: [mixin],
    computed: {
    },
    methods: {
        async getCurrentLever () {
            const { data } = await getCurrentLever(this.params);
            this.list = data.data;
        },
        toPath(item) {
            this.$store.commit('SET_TRADE_TYPE', 'lever')
            this.$router.push({
                name: 'Trade',
                params: {
                    symbolName: item.choose_coins_info.coinName,
                    l_id: item.id
                }
            })
        }
    },
    created () {
        this.getCurrentLever();
    },
};
</script>
<style lang="scss" scoped>
.leverageList_body{
    background: #F9F9F9;
    padding:  0 15px;
    min-height: calc(100% - 36px);
}
.module {
    background: #fff;
    border-radius: 12px;
    padding: 15px 14px;
    margin-bottom: 20px;
    &:last-child{
        margin-bottom: 0;
    }
}
.header {
    dl {
        flex: 1;
    }
    .info {
        .title {
            color: #fd9e00;
            font-size: 14px;
            font-weight: 500;
        }
        .time_box {
            color: #bdbdbd;
            font-size: 12px;
            margin-top: 8px;
        }
    }
    .btn {
        a {
            color: $main-blue;
            width: 68px;
            height: 29px;
            background: #f9fbfe;
            border-radius: 4px;
            &:first-child {
                margin-right: 12px;
            }
        }
    }
}
.list {
    margin-top: 8px;
}
</style>