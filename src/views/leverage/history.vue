<template>
    <div class="container no-data">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :offset="10"
            @load="getHistoryLever"
            v-if="list.length > 0"
        >
        <div class="module" v-for="item in list" :key="item.id" @click="toHistoryDetail(item.id)">
            <dl class="flex column between upper">
                <dd class="black">
                    {{item.choose_coins_name}}{{ item.type_flag | transTitle }}{{ item.multiple }}倍（{{item.allocation_id}}）
                </dd>
                <dd class="gry">
                    {{ new Date(item.begin_time * 1000).Format("yyyy-MM-dd") }}~{{new Date(item.end_time * 1000).Format("yyyy-MM-dd")}}
                </dd>
                <dd class="gry">
                    总配资资金：{{ $fomatFloat(item.total_allocation,4) }}{{ coin.base }}
                </dd>
                <dd class="gry">风险保证金：{{ $fomatFloat(item.bonds,4) }}{{ coin.base }}</dd>
                <dd class="orange">累计盈亏：{{ $fomatFloat(item.profit_loss,4) }}{{ coin.base }}</dd>
            </dl>
            <i class="end-icon"></i>
        </div>
        </van-list>
        <div class="no-data" v-else-if="!loading && finished"></div>
    </div>
</template>
<script>
import { getHistoryLever } from "@/api/leverage";
import mixin from "./mixin";
import { List } from 'vant'
export default {
    data () {
        return {
            params: {
                curpage: 1,
                pageSize: 10,
            },
            list: [],
            total: 0,
            loading: true,
            finished: false
        };
    },
    components: {
        [List.name]:List
    },
    mixins: [mixin],
    computed: {
        coin () {
            if (this.list.length) {
                const s = this.list[0].choose_coins_name.split("/");
                return { base: s[1], quote: s[0] };
            }
        },
    },
    methods: {
        toHistoryDetail (id) {
            this.$router.push({ path: "/leverage/historyDetail", query: { id } });
        },
        async getHistoryLever () {
            this.loading = true
            const { data } = await getHistoryLever(this.params);
            this.total = data.totalRows
            let list = data.data || []
            this.list = this.params.curpage == 1 ? list : [...this.list,...list];
            this.loading = false
            if (this.list.length >= this.total) return this.finished = true
            this.params.curpage += 1
        },
    },
    created () {
        this.getHistoryLever();
    },
};
</script>
<style lang="scss" scoped>
.container {
    background: #F9F9F9;
    padding:  0 15px;
    min-height: calc(100% - 36px);
}
.module {
    background: #fff;
    border-radius: 6px;
    position: relative;
    margin-bottom: 15px;
    dl {
        padding: 15px 10px 10px 15px;
        dd{
            margin-bottom: 8px;
        }
    }
    .black {
        line-height: 20px;
        font-weight: 500;
    }
    .gry {
        font-size: 12px;
        color: #9a9a9a;
        line-height: 17px;
    }
    .orange {
        color: #fd9e00;
        font-size: 14px;
        line-height: 20px;
        font-weight: 500;
    }
    .end-icon {
        display: inline-block;
        width: 70px;
        height: 62px;
        background: url("~@/assets/imgs/leverage-end-icon.png") no-repeat;
        background-size: contain;
        position: absolute;
        top: 50%;
        transform:translateY(-50%);
        right: 10px;
    }
}
</style>