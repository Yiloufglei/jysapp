<!-- 
  	author        MrYi
	time          2021/03/18
	description   账户信息
 -->
<template>
    <div class="accountInformation">
        <div class="accountInformation_content" :class="{'overflowPatible' : !supplementVisible}">
            <div class="interval_bj"></div>
            <div class="content_top">
                <p class="content_topt">
                    <span class="upper">{{ detailData.choose_coins_name }}</span>{{ detailData.type_flag | transTitle }}{{ detailData.multiple }}倍（{{detailData.allocation_id}}）
                </p>
                <p class="content_topb color_c">
                    {{ new Date(detailData.begin_time * 1000).Format("yyyy-MM-dd") }}~{{new Date(detailData.end_time * 1000).Format("yyyy-MM-dd")}}
                </p>
            </div>
            <div class="interval_bj"></div>
            <div class="content_total">
                <p class="assets upper color_c">合约总资产（{{ coin.base }}）</p>
                <p class="assetsNumber color_b">{{ $fomatFloat(detailData.total_money,5) }} <span  @click="routePath('/capitalDetail?id=' + detailData.allocation_id)">明细</span></p>
                <ul class="flexC_S t_c content_ul">
                    <li>
                        <p class="color_c">持仓市值</p>
                        <p class="t_l">{{ $fomatFloat(detailData.position_money,4) }}</p>
                    </li>
                    <li>
                        <p class="color_c">持仓比例(%)</p>
                        <p>{{ $fomatFloat(detailData.position) }}</p>
                    </li>
                    <li>
                        <p class="color_c">可用额度</p>
                        <p class="t_r">{{ $fomatFloat(detailData.left_money,4) }}</p>
                    </li>
                </ul>
            </div>
            <div class="interval_bj"></div>
            <div class="content_profitLoss">
                <div class="title  color_c">总配资资金（USDT）</div>
                <div class="profitLoss  fzboid" :class="lossClass">{{ $fomatFloat(detailData.total_allocation,4) }}</div>
            </div>
            <div class="content_manage">
                <ul class="flexC_S t_c content_ul">
                    <li class="li_left">
                        <p class="color_c">当前盈亏</p>
                        <p :class="styleClassName(detailData.cur_profit)">{{ $fomatFloat(detailData.cur_profit,4) }}</p>
                    </li>
                    <li>
                        <p class="color_c">申请额度</p>
                        <p>{{ $fomatFloat(detailData.allocation_money,4) }}</p>
                    </li>
                    <li class="li_right">
                        <p class="color_c">风险保证金</p>
                        <p>{{ $fomatFloat(detailData.bonds,4) }}</p>
                    </li>
                </ul>
                <ul class="flexC_S t_c content_ul">
                    <li class="li_left">
                        <p class="color_c">收益分成(%)</p>
                        <p>{{ detailData.share }}</p>
                    </li>
                    <li>
                        <p class="color_c">亏损警戒线</p>
                        <p>{{ $fomatFloat(detailData.alert_money,4) }}</p>
                    </li>
                    <li class="li_right">
                        <p class="color_c">亏损平仓线</p>
                        <p>{{ $fomatFloat(detailData.close_money,4) }}</p>
                    </li>
                </ul>
                <div class="interval_bj"></div>
                <div class="manageList_body">
                    <div class="flexC_S manageList border_b_c">
                        <span class="color_c">账户管理费</span><span class=" upper">{{ $fomatFloat(detailData.manager_cost,4) }}{{ coin.base }}</span>
                    </div>
                    <div class="flexC_S manageList">
                        <span  class="color_c">已操盘天数</span><span>{{ detailData.trade_days }}个交易日</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="actionBar flexC_S fzboid">
            <div class="actionBa_list center show-panel" @click="supplementVisible = true;">
                <p>调整配资资产</p>
            </div>
            <div class="actionBa_list center" @click="applyClose">
                <p>申请结算</p>
            </div>
            <div class="actionBa_list">
                <a class="trade-btn center" @click="toPath"><p>配资交易</p></a>
            </div>
        </div>
        <van-dialog v-model="supplementVisible" :title="`追加${supplementType === 1 ? '配资' : '保证金'}`" @confirm="supplementHandler" showCancelButton	confirmButtonText="立即追加" cancelButtonText="取消">
            <div class="supplement-content">
                <div class="title_tab color_c">
                    <span @click="showSupplement(1)" :class="{'supplement_ative':supplementType === 1}">追加配资</span>
                    <span @click="showSupplement(2)" :class="{'supplement_ative':supplementType === 2}">追加保证金</span>
                </div>
                <Input :precision="4" type="number" v-model="supplementNum" :inputsFocus="true"><template v-slot:after><span class="upper">{{ coin.base }}</span></template></Input>
                <p class="supplement-balance flexC_S upper color_c"><span>最低1000.0000{{ coin.base }}</span></p>
                <p class="available-balance flexC_S upper color_c"><span>可用余额</span><span>{{$fomatFloat(detailData.left_money,4)}}{{ coin.base }}</span></p>
                 <!-- <div class="flexC_S">
                    <van-button class="van-mybutton" style="width:40%" type="default"  @click="supplementVisible = false">取消</van-button>
                    <van-button class="van-mybutton" style="width:40%" type="info"  @click="supplementHandler">立即追加</van-button>
                </div> -->
            </div>
        </van-dialog>
    </div>
</template>

<script>
import {
    getCurrentLeverDetail,
    applyClose,
    supplementLever,
    supplementDeposit,
} from "@/api/leverage";
import mixin from "./mixin";
export default {
    name: "accountInformation",
    data () {
        return {
            supplementVisible: false,
            supplementType: 1, // 1 追加配资；2 追加保证金
            detailData: {},
            supplementNum: "",
        };
    },
    components:{
    },
    mixins: [mixin],
    computed: {
        lossClass () {
            if (this.detailData.cur_profit > 0) return "up-color";
            else if (this.detailData.cur_profit < 0) return "down-color";
        },
        coin () {
            if (this.detailData.choose_coins_name) {
                const arr = this.detailData.choose_coins_name.split("/");
                return { base: arr[1], quote: arr[0] };
            } else return {};
        },
    },
    methods: {
        styleClassName(val){
            return val < 0 ? 'sell-color' : 'buy-color'
        },
        routePath (url) {
            this.$router.push(url);
        },
        showSupplement (type) {
            this.supplementType = type;
        },
        // 追加处理
        supplementHandler () {
            if (this.supplementType === 1) this.supplementLever();
            else if (this.supplementType === 2) this.supplementDeposit();
        },
        // 追加配资
        async supplementLever () {
            await supplementLever({
                allocationId: this.detailData.allocation_id,
                money: this.supplementNum,
            });
            this.supplementVisible = false;
            this.$toast({ message: "追加成功" });
        },
        // 追加保证金
        async supplementDeposit () {
            await supplementDeposit({
                allocationId: this.detailData.allocation_id,
                bonds: this.supplementNum,
            });
            this.supplementVisible = false;
            this.$toast({ message: "追加成功" });
        },

        // 申请结算
        async applyClose () {
            return this.$dialog.confirm({
                title: '温馨提示',
                message: `确定申请结算？`,
            })
            .then(() => {
                applyClose({ allocationId: this.detailData.allocation_id }).then(res => {
                    this.$toast({ message: "申请成功"});
                    setTimeout(() => {
                        this.$router.go(-1);
                    }, 500);
                })
            })
            .catch(() => {
                // on cancel
            });
        },
        async getCurrentLeverDetail () {
            const { data } = await getCurrentLeverDetail({
                id: this.$route.query.id,
            });
            this.detailData = data.data;
        },
        toPath() {
            this.$store.commit('SET_TRADE_TYPE', 'lever')
            this.$router.push({
                name: 'Trade',
                params: {
                    symbolName: this.detailData.choose_coins_name,
                    l_id: this.detailData.id
                }
            })
        }
    },
    created () {
        this.getCurrentLeverDetail();
    },
    watch: {
        supplementVisible (newVal) {
            if (!newVal) {
                this.supplementNum = "";
            }
        },
    },

};
</script>

<style lang="scss" scoped>
.accountInformation {
    height: 100%;
    ::v-deep .publicDialog_content{
        border-radius: 0;
        .publicDialog_content_footer{
            padding: 20px 40px;
            .btn-content{
                width: 110px;
            }
            .btn{
                font-size: 14px;
            }
        }
    }
    .actionBar {
        height: 50px;
        .actionBa_list{
            p{
                width: 80%;
                line-height: 36px;
                text-align: center;
                background: $main-blue;
                color: #fff;
                border-radius: 6px;
            }
        }
    }
    .accountInformation_content {
        height: calc(100% - 50px);
        .content_ul {
            font-size: 12px;
            li {
                p {
                    line-height: 17px;
                    &:nth-child(1) {
                        margin-bottom: 10px;
                    }
                }
            }

            .li_left {
                width: 100px;
                text-align: left;
            }

            .li_right {
                width: 100px;
                text-align: right;
            }
        }

        .content_manage {
            padding: 15px  15px;

            ul {
                margin-bottom: 15px;
            }

            .manageList_body {
                .manageList {
                    line-height: 42px;
                }
            }
        }

        .content_profitLoss {
            padding: 15px 15px 0;
            .title{
                margin-bottom: 8px;
            }
            .title ,.profitLoss{
                font-size: 14px;
                line-height: 20px;
            }
        }

        .content_total {
            padding: 10px 15px;

            .assets {
                line-height: 20px;
                margin-bottom: 10px;
                font-size: 14px;
            }

            .assetsNumber {
                line-height: 20px;
                margin-bottom: 17px;
                span{
                    border: 1px solid #5B78EE;
                    border-radius: 2px;
                    padding:1px 3px;
                    font-size: 10px;
                    margin-left: 10px;
                }
            }
        }

        .content_top {
            padding: 15px;
            .content_topt {
                font-size: 16px;
                line-height: 22px;
                margin-bottom: 10px;
                font-weight: 500;
            }

            .content_topb {
                font-size: 14px;
                line-height: 20px;
            }
        }
    }
}
.supplement-content {
    .supplement-balance {
        font-size: 10px;
        margin-top: 10px;
    }
    .available-balance{
        font-size: 14px;
        line-height: 20px;
        margin-top: 15px;
    }
    .title_tab{
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        span{
            line-height: 22px;
            display: inline-block;
            width: 100px;
            transition: all 0.1s;
        }
        .supplement_ative{
            font-size: 20px;
            line-height: 28px;
            color: $main-blue;
        }
    }
}
</style>