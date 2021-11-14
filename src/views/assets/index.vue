<!--
   	author        MrYi
 	time          2021/03/11 
 	description   资产首页
  -->
<template>
    <div class="assets_body" ref="assetsBody">
        <div class="asstes_top">
            <div class="asstes_top_overview">
                <div class="capital">
                    <div class="capital_t col-center">
                        <span>总资产估值</span>
                        <i v-show="!isShow" class="iconfont iconicon-test" @click="isShow = true"></i>
                        <i v-show="isShow" class="iconfont iconxianshi" @click="isShow = false"></i>
                    </div>
                    <div class="capital_c">
                        {{ hideShow(($fomatFloat((totalSum.UsdtNum || 0),8) + " USDT"))}}
                    </div>
                    <div class="capital_b">
                        {{ hideShow((" ≈ " + $fomatFloat(totalSum.numCny || 0) + " CNY")) }}
                    </div>
                    <div class="capital_profit">
                        <p class="col-center">今日收益<i class="iconfont iconwenhao" @click="showProfit=true"></i></p>
                        <div>
                            <span class="profit_num">{{hideShow(profitSymbol(totalSum.today_commission) + ($fomatFloat(Math.abs(totalSum.today_commission || 0),5)))}}</span>
                            <span>{{hideShow(profitSymbol(totalSum.today_commission_rate) + ($fomatFloat(Math.abs(totalSum.today_commission_rate || 0),2) + " %"))}}</span>
                        </div>
                    </div>
                    <div class="Jump_body flexC_S">
                        <div @click="routerPath('/withdrawMoney')">充币</div>
                        <div @click="routerPath('/chargeMoney')">提币</div>
                        <div @click="routerPath('/capitalTransfer')">划转</div>
                    </div>
                </div>
            </div>
        </div>
        <van-sticky>
            <div class="assets_choice">
                <section class="type-tab between">
                    <dl :class="{ 'type-tab-active': choiceType === item.type }" v-for="item in typeTab" :key="item.type"
                        @click="assetsChoice(item)">
                        {{ item.name }}
                    </dl>
                </section>
                <div v-show="choiceType === '1'">
                    <div class="allocationChoice flexC_S fzboid">
                        <div :class="{ allocationPress: allocationType === 1 }" class="center" @click="allocationChoice(1)">
                            逐仓配资
                        </div>
                        <div :class="{ allocationPress: allocationType === 2 }" class="center" @click="allocationChoice(2)">
                            全仓配资
                        </div>
                    </div>
                    <p class="equivalent fzboid">配资净资产折合(USDT)</p>
                    <p class="equivalentNumber fzboid">
                        {{ hideShow(($fomatFloat((accountSum.pusdt_num || 0),8) + " USDT" + ' ≈ ' + $fomatFloat(accountSum.pnum_cny || 0) + " CNY"))}}
                    </p>
                </div>
                <div v-show="choiceType === '2'">
                    <p class="equivalent fzboid">币币总资产折合（USDT）</p>
                    <p class="equivalentNumber fzboid">
                        {{ hideShow(($fomatFloat((accountSum.busdt_num || 0),8) + " USDT" + ' ≈ ' + $fomatFloat(accountSum.bnum_cny || 0) + " CNY"))}}
                    </p>
                </div>
                <div v-show="choiceType === '3'">
                    <p class="equivalent fzboid">法币总资产折合（USDT）</p>
                    <p class="equivalentNumber fzboid">
                        {{ hideShow(($fomatFloat((accountSum.fusdt_num || 0),8) + " USDT" + ' ≈ ' + $fomatFloat(accountSum.fnum_cny || 0) + " CNY"))}}
                    </p>
                </div>
                <div v-show="choiceType === '4'">
                    <p class="equivalent fzboid">期权总资产折合（USDT）</p>
                    <p class="equivalentNumber fzboid">
                        {{ hideShow(($fomatFloat((accountSum.qusdt_num || 0),8) + " USDT" + ' ≈ ' + $fomatFloat(accountSum.qnum_cny || 0) + " CNY"))}}
                    </p>
                </div>
                <div v-show="choiceType === '6'">
                    <p class="equivalent fzboid">二元期权总资产（USDT）</p>
                    <p class="equivalentNumber fzboid">
                        {{ hideShow(($fomatFloat((accountSum.qusdt_num || 0),8) + " USDT" + ' ≈ ' + $fomatFloat(accountSum.qnum_cny || 0) + " CNY"))}}
                    </p>
                </div>
                <!-- <div v-show="choiceType === '5'">
                    <p class="equivalent fzboid">合约总资产（USDT）</p>
                    <p class="equivalentNumber fzboid">
                        1.8112101USDT ≈ 012  CNY
                    </p>
                </div> -->
            </div>
            <div class="interval_bj"></div>
            <div class="assetsList_search flex">
                <div class="search_left">
                    <van-field v-model="searchVal" left-icon="search" class="van-myfield" center clearable placeholder="输入您想搜索的币种" />
                </div>
                <div class="search_right">
                    <van-checkbox v-model="hideSmall" shape="square" icon-size="16px">隐藏小额资产</van-checkbox>
                </div>
            </div>
        </van-sticky>
        <div class="assetsList">
            <div class="assetsList_body" v-for="item in computeAssetList" :key="item.id">
                <div class="assetsList_title between col-center" @click="assetsListRouterPath(item)">
                    <span class="coin_name fzboid">{{ item.coin_name }}</span>
                    <i class="iconfont iconyou1"></i>
                </div>
                <div class="assetsList_ul"  v-if="choiceType === '5'">
                    <div class="assetsList_li flex">
                        <div>
                            <p>账户权益(USDT)</p>
                            <p class="ep-hd">{{ hideShow($fomatFloat(item.num,8)) }}</p>
                        </div>
                        <div style="padding-left:10px">
                            <p>预估强平价(USDT)</p>
                            <p class="ep-hd">{{ hideShow($fomatFloat(item.frozen,8)) }}</p>
                        </div>
                        <div class="t_r">
                            <p>担保资产率</p>
                            <p class="ep-hd">{{ hideShow($fomatFloat(item.cny))}}</p>
                        </div>
                    </div>
                    <p class="color_c" style="font-size:12px;margin-bottom:12px">折合 102.25 CNY</p>
                </div>
                <div class="assetsList_ul"  v-else>
                    <div class="assetsList_li flex">
                        <div>
                            <p>可用</p>
                            <p class="ep-hd">{{ hideShow($fomatFloat(item.num,8)) }}</p>
                        </div>
                        <div style="padding-left:10px">
                            <p>冻结</p>
                            <p class="ep-hd">{{ hideShow($fomatFloat(item.frozen,8)) }}</p>
                        </div>
                        <div class="t_r">
                            <p>折合(CNY)</p>
                            <p class="ep-hd">{{ hideShow($fomatFloat(item.cny))}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 今日收益弹窗 -->
        <van-dialog v-model="showProfit" title="" :showConfirmButton="false">
            <p class="title">说明</p>
            <p class="conten_text upper">每日24点左右进行佣金结算，收益值计算以佣金结算后的资产为准，结算结束后，可展示正常当日收益。</p>
            <van-row type="flex" justify="space-between">
                <van-col span="24">
                    <van-button type="info" block size="small" @click="showProfit = false" class="van-mybutton">知道了</van-button>
                </van-col>
            </van-row>
        </van-dialog>
    </div>
</template>
<script>
import { mapState } from "vuex";
import { Sticky } from 'vant';
export default {
    name: "assets",
    components: {
        [Sticky.name]: Sticky
    },
    data () {
        return {
            isShow: true,
            show: false,
            choiceType: "2",
            allocationType: 1,
            searchVal: "",
            hideSmall: false,
            showProfit:false,
            typeTab: [
                // {
                //     type: "1",
                //     name: "配资",
                // },
                {
                    type: "2",
                    name: "币币",
                },
                // {
                //     type: "5",
                //     name: "合约",
                // },
                {
                    type: "3",
                    name: "法币",
                },
                {
                    type: "4",
                    name: "期权",
                },
                // {
                //     type: "6",
                //     name: "二元期权",
                // },
            ],
        };
    },
    beforeRouteLeave (to, from, next) {
        // 离开页面之前, 记录滚动位置
        if (!this.$refs.assetsBody) next()
        // this.$store.commit('SET_ASSETS_SCROLLTOP', this.$refs.assetsBody.scrollTop)
        this.$store.commit('SET_ASSETS_SCROLLTOP', this.$parent.$el.scrollTop)
        next()
    },
    computed: {
        ...mapState({
            stateChoiceType: (state) => state.assets.choiceType,
            totalSum: (state) => state.assets.totalSum,
            accountSum: (state) => state.assets.accountSum,
            soptAccount: (state) => state.assets.soptAccount,
            leverAccount: (state) => state.assets.leverAccount,
            legalAccount: (state) => state.assets.legalAccount,
            qlistAccount: (state) => state.assets.qlistAccount,
            scrollTop: (state) => state.assets.scrollTop,
            hideSmallType: (state) => state.hideSmallType
        }),

        computeAssetList () {
            let list = [];
            switch (this.choiceType) {
                case "1":
                    list = this.leverAccount;
                    break;
                case "2":
                    list = this.soptAccount;
                    break;
                case "3":
                    list = this.legalAccount;
                    break;
                case "4":
                    list = this.qlistAccount;
                    break
                case "6":
                    list = this.qlistAccount;
                    break
                // case "5":
                //     list = this.legalAccount;
                    break;
            }
            if (!list) return []
            const search = list.filter((item) => {
                return item.coin_name.includes(this.searchVal.toLowerCase());
            });
            if (this.hideSmall) {
                list = this.searchVal ? search.filter((item) => this.isZero(item)) : list.filter((item) => this.isZero(item));
            } else {
                list = this.searchVal ? search : list
            }
            return list
        },
    },
    mounted () {
        if (this.stateChoiceType) {
            this.choiceType = this.stateChoiceType;
        }
        this.init();
        this.$nextTick(() => {
            // 滚动到原来位置
            this.$parent.$el.scrollTop = this.scrollTop
            // this.$refs.assetsBody.scrollTop = this.scrollTop
        })
        this.hideSmall = this.hideSmallType
    },
    watch:{
        hideSmall:function (e) {
            this.$store.commit('SET_HIDESMALL_TYPE',e)
        }   
    },
    methods: {
        profitSymbol(val){
            if(val > 0){
                return "+"
            }else if(val < 0){
                return "-"
            }else{
                return ''
            }
            
        },
        hideShow(val){
            if(this.isShow){
                return val
            }
            return '******'
        },
        isZero (item) {
            if (this.choiceType === "1") {
                return (
                    Number(item.cny) > 0 ||
                    Number(item.frozen) > 0 ||
                    Number(item.num) > 0 ||
                    Number(item.pborrowed) > 0
                );
            } else {
                return (
                    Number(item.cny) > 0 ||
                    Number(item.frozen) > 0 ||
                    Number(item.num) > 0
                );
            }
        },
        init () {
            this.$store.dispatch("getwalletAssetsLlist");
        },
        assetsListRouterPath (item) {
            this.$store.commit('SET_INDEX_SELECTITEM',item)
            switch (this.choiceType) {
                case "1":
                    this.$router.push("/currencyAccount");
                    break;
                case "2":
                    this.$router.push("/coinslAccount");
                    break;
                case "3":
                    this.$router.push("/legalCurrencyAccount");
                    break;
                case "4":
                    this.$router.push("/qnumAccount");
                    break;
                case "6":
                    this.$router.push("/binaryOptionAccount");
                    break;
                // case "5":
                //     this.$router.push("/contractAccount");
                //     break;
                default:
                    this.$router.push("/currencyAccount");
                    break;
            }
        },
        allocationChoice (index) {
            if (index == 2) {
                this.$toast("暂未开放全仓配资");
                return;
            }
            this.allocationType = index;
        },
        assetsChoice (item) {
            this.choiceType = item.type;
            this.$store.commit("SET_CHOICETYPE", item.type);
        },
        handlerClick () {
            this.show = !this.show;
        },
        routerPath (val) {
            this.$router.push(val);
        },
    },
};
</script>
<style lang="scss" scoped>
.assets_body {
    background: #fff;
    text-transform: uppercase;
    .van-search .van-search__content{
        height: 28px;
    }
    .van-dialog{
        .title{
            font-size: 20px;
            font-weight: 500;
            line-height: 28px;
        }
        .conten_text{
            padding: 10px 0;
            min-height: 100px;
            line-height: 20px;
        }
        .van-row .van-mybutton{
            font-size: 16px;
        }
    }
    .asstes_top {
        padding: 16px 10px 0;
        .asstes_top_overview {
            .capital {
                width: 100%;
                background: #2c57ab;
                border-radius: 12px;
                padding: 20px 18px;
                font-size: 14px;
                color: #a6badf;

                .capital_t {
                    align-items: center;
                    height: 20px;

                    .iconfont {
                        font-size: 18px;
                        margin-left: 10px;
                        position: relative;
                        top: 1px;
                    }
                }

                .capital_c {
                    font-size: 22px;
                    font-weight: 500;
                    line-height: 30px;
                    color: #fff;
                }

                .capital_b {
                    line-height: 20px;
                    margin-bottom: 15px;
                }
                .capital_profit{
                    margin-bottom: 10px;
                    p{
                        line-height: 20px;
                        margin-bottom: 5px;
                        i{
                            margin-left: 5px;
                            font-size: 14px;
                            position: relative;
                            top: 1px;
                        }
                    }
                    div{
                        line-height: 20px;
                        .profit_num{
                            margin-right: 20px;
                            color: #fff;
                        }
                    }
                }
                .Jump_body {
                    div {
                        width: 30%;
                        height: 30px;
                        background: #3a68c1;
                        border: 1px solid #618ce2;
                        border-radius: 6px;
                        line-height: 28px;
                        text-align: center;
                        color: #fff;
                    }
                }
            }
        }
    }

    .assets_choice {
        padding: 10px 16px 15px;
        background: #fff;
        .type-tab {
            justify-content: start;
            border-bottom: 1px solid #F9F9F9;
            dl {
                color: $c-999;
                font-size: 14px;
                font-weight: 500;
                padding: 10px;

                &.type-tab-active {
                    color: $main-blue;
                    border-bottom: 2px solid $main-blue;
                }
            }
        }

        .allocationChoice {
            padding: 15px 0 0 0;
            font-size: 14px;

            div {
                width: 45%;
                height: 26px;
                border: 1px solid #9B9B9B;
                border-radius: 2px;
            }

            .allocationPress {
                background: #f8fbff;
                color: $main-blue;
                border: 1px solid $main-blue;
            }
        }

        .equivalent {
            line-height: 20px;
            margin: 20px 0 10px 0;
            color: $c-999;
        }

        .equivalentNumber {
            line-height: 20px;
        }
    }
    .assetsList_search {
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px 5px 15px;
        background: #fff;
        .search_left {
            width: 200px;
            .van-myfield{
                border: 1px solid #edeff3;
                padding: 0 10px;
                height: 28px;
                align-items: center;
                display: flex;
                border-radius: 4px;
                ::v-deep .van-cell__value .van-field__control {
                    &::placeholder {
                        color: $c-999;
                        font-size: 12px;
                    }
                }
            }
            .searchIcon {
                width: 45px;
            }
            ::v-deep .input-content input{
                height: 26px;
                font-size: 12px;
            }
        }

        .search_right {
            display: flex;
            align-items: center;
            font-size: 12px;
            span {
                margin-left: 5px;
            }
        }
        
    }
    .assetsList {
        padding: 10px 15px;
        .assetsList_body{
            border-bottom: 1px solid #F9F9F9;
            .coin_name{
                color: $main-blue;
                font-size: 14px;
                font-family: PingFang SC;
            }
            .assetsList_title {
                padding: 10px 0;
            }
        }

        .assetsList_ul {
            .assetsList_name {
                font-size: 14px;
                line-height: 20px;
                margin-bottom: 10px;
            }

            .assetsList_li {
                color: $c-999;
                font-size: 12px;

                div {
                    flex: 1;
                    p {
                        line-height: 17px;
                        margin-bottom: 10px;
                    }
                    p.ep-hd{
                        font-family: PingFang SC;
                        font-weight: 500;
                        color: #233B55;
                    }
                }
            }
        }
    }
}
</style>
