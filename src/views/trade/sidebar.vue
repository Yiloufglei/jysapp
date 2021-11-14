<template>
    <div class="sidebar" :class="[theme]">
        <div class="mask" v-show="value" @click="$emit('input', false)"></div>
        <transition name="slideInRight">
            <div class="content" v-show="value">
                <div class="header">
                    <h2>{{ tradeType === "spot" ? "币币" : "逐仓配资" }}</h2>
                    <dl class="nav upper">
                        <dd :class="{ 'nav-active': coin.key === trade_base_coin }" v-for="coin in marketTab"
                            :key="coin.kdy" @click="checkBaseCoin(coin.key)">
                            {{ coin.value }}
                        </dd>
                    </dl>
                    <div class="input-box col-center">
                        <i class="iconfont iconsousuo"></i>
                        <input class="upper" type="text" placeholder="搜索币种" v-model="searchText" />
                    </div>
                </div>
                <div class="list-box">
                    <div class="symbol-list upper">
                        <dl class="between" v-for="v in curMarketList" :key="v.symbol" @click="chooseSymbol(v.symbol)">
                            <dd>
                                <em>{{ v.symbol.split("/")[0] }}</em> /
                                {{ v.symbol.split("/")[1] }}
                            </dd>
                            <dd :class="v | colorStyle">{{ v.info.price }}</dd>
                        </dl>
                        <div class="no-data" v-if="curMarketList.length === 0"></div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import market_mixin from "@/views/market/market_mixin";
import { mapState } from 'vuex'
export default {
    props: {
        value: { type: Boolean, default: false },
        tradeType: { type: String, default: "spot" },
        theme: { type: String, default: "white" } // 主题 默认白色
    },
    data () {
        return {
            searchText: "",
        };
    },
    mixins: [market_mixin],
    filters: {
        colorStyle (data) {
            if (data.info.price > data.info.open) return "up-color";
            else if (data.info.price < data.info.open) return "down-color";
            else return "";
        },
    },
    computed: {
        ...mapState({}),
        curMarketList () {
            let list = this.market_list[this.trade_base_coin]
            if (list) {
                if (this.searchText) {
                    return list.symbollist.filter((item) => { return item.symbol.toLowerCase().includes(this.searchText.toLowerCase()); });
                } else {
                    return list.symbollist;
                }
            } else return [];
        },
    },
    methods: {
        chooseSymbol (symbol) {
            const s = symbol.split("/").join("_").toLowerCase();
            this.$emit("switchSymbolFun",symbol);
        },
    },
    watch: {
        value (newVal) {
            if (newVal) {
                document.body.style.overflow = "hidden";
            } else {
                this.searchText = "";
                document.body.style.overflow = "";
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/components/assets/css/common.scss";
@import "@/components/assets/css/animation.scss";

.mask {
    @include mask();
}
.black{
    .content{
        background: #131e32 !important;
        .symbol-list{
            dl{
                border-bottom: none !important;
                em{
                    color: #fff !important;
                }
            }
        }
    }
    .header{
        background: #131e32 !important;
        h2{
            color: #fff;
        }
    }
    .input-box{
        border: 1px solid #131e32 !important;
        background: #333f54;
        .iconsousuo{
            color: #707a8d !important;
        }
        input {
            background: #333f54;
            color: #fff;
            &::-webkit-input-placeholder{
                color: #707a8d !important;
            }
        }
    }
}
.content {
    width: 70%;
    background: #fff;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1001;
    .header {
        position: absolute;
        left: 0;
        top: 0;
        height: 120px;
        width: 100%;
        padding: 16px 16px 0 16px;
        z-index: 99;
        background: #fff;
    }
    h2 {
        text-align: center;
        font-size: 16px;
    }
    .nav {
        margin: 6px 0 10px 0;
        overflow-x: scroll;
        white-space: nowrap;
        &::-webkit-scrollbar {
            display: none;
            -ms-overflow-style: none;
            overflow: -moz-scrollbars-none;
        }
        dd {
            padding: 6px 0;
            display: inline-block;
            &:not(:last-child) {
                margin-right: 20px;
            }
            &.nav-active {
                color: $main-blue;
            }
        }
    }
    .list-box {
        padding: 120px 16px 16px;
        overflow: scroll;
        height: 100%;
    }
    .input-box {
        border: 1px solid #e6e6e6;
        height: 32px;
        border-radius: 6px;
        padding: 0 10px 0 40px;
        position: relative;
        .iconsousuo {
            position: absolute;
            left: 10px;
            top: 50%;
            margin-top: -8px;
            color: #e6e6e6;
        }
        input {
            width: 100%;
            font-size: 14px;
            &::placeholder {
                color: #e6e6e6;
                font-weight: 500;
            }
        }
    }
    .symbol-list {
        margin-top: 5px;
        dl {
            padding: 15px 0;
            border-bottom: 1px solid #e6e6e6;
            dd {
                color: #9c9ba5;
            }
            dd:first-child {
                em {
                    color: #233b55;
                    font-weight: 500;
                }
            }
        }
    }
}
</style>