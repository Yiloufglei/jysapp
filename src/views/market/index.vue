<template>
    <div class="market_box">
        <section class="market-tab flex">
            <span :class="{ tabActive: market_base_coin === item.key }" v-for="item in marketTab" :key="item.key"
                @click="checkBaseCoin(item.key)">{{ item.value }}</span>
        </section>
        <div class="search_body">
            <div class="input-box col-center">
                <i class="iconfont iconsousuo"></i>
                <input class="upper" type="text" placeholder="搜索币种" v-model="searchText" />
            </div>
        </div>
        <section class="t-head flex flex_ul">
            <div class="list_l">币种</div>
            <div class="list_c">最新价</div>
            <div class="list_r flex" @click="rateSortFun">涨跌幅
                <div class="row-center column">
                    <i class="iconfont iconsanjiao-btm" :class="{'color_b' : rateSort === 2}"></i>
                    <i class="iconfont iconsanjiao-top" :class="{'color_b' : rateSort === 1}"></i>
                </div>
            </div>
        </section>
        <div class="symbol-list">
            <virtual-list style="height: 100%; overflow-y: auto;"
                data-key="symbol"
                v-if="dataList.length > 0"
                :data-sources="dataList"
                :data-component="itemComponent"
            />
            <div class="no-data" v-if="dataList.length === 0 && isResponse"></div>
        </div>
    </div>
</template>
<script>
import market_mixin from "./market_mixin";
import { worker } from "@/utils/webWorker.js";
import { mapState } from "vuex"
import VirtualList from 'vue-virtual-scroll-list'
import Item from './Item'
import _cloneDeep from 'lodash/cloneDeep'
export default {
    name:'market_box',
    components: {
        VirtualList
    },
    data () {
        return {
            searchText:'',
            rateSort: '',
            baseCoin:'', //当前基币
            isResponse: false,
            itemComponent: Item
        };
    },
    mixins: [market_mixin],
    computed:{
        ...mapState({
            myStoreSymbols:(state) => state.user.mySymbols,
            stateRateSort:(state) => state.rateSort
        }),
        dataList(){
            let list = _cloneDeep(this.curMarketList) || []
            if(this.rateSort){
                list =  list.sort((a,b) => {
                    if(this.rateSort === 1){
                        return (b.info.rate || 0) - (a.info.rate || 0)
                    }
                    return (a.info.rate || 0) - (b.info.rate || 0)
                })
            }else{
                // list =  list.sort((a,b) => {
                //     return (b.info.amount * b.info.quote_price) - (a.info.amount * a.info.quote_price)
                // })
            }
            if (this.searchText) {
                return list.filter((item) => { return item.symbol.toLowerCase().includes(this.searchText.toLowerCase()); });
            } else {
                return list;
            }
        }
    },
    methods: {
        getMarketTab(data) {
            // 获取推送的key值
            let tab = Object.keys(data)
            tab.sort((o, t) => {
                return data[o].sort - data[t].sort
            })
            tab = tab.filter(item => {
                // 过滤自选
                return item !== 'optional'
            })
            return tab
        },
        rateSortFun(){
            if(!this.rateSort){
                this.rateSort = 1
            }else{
                this.rateSort = this.rateSort === 1 ? 2 : ''
            }
            this.$store.commit('SET_RATESORT',this.rateSort)
        },
        colorStyle (data,type) {
            if ((data.info.rate || 0) < 0) return type == 2 ? 'bg-sell' :  "sell-color";
            else if ((data.info.rate || 0) > 0) return type == 2 ? 'bg-buy' :  "buy-color ";
            else return type == 2 ? "bj-flat" :  "" ;
        },
        toChart (symbol) {
            this.$store.commit('SET_SYMBOL', symbol.split("/").join("_").toLowerCase())
            this.$router.push({
                path: "/market/chart"
            });
        },
        listenWSData (data) {
            if (data.type === "rank_b") {
                this.isResponse = true
                if (!this.baseCoin) {
                    const key = this.getMarketTab(JSON.parse(data.data))[0]
                    if (!this.myStoreSymbols.length && key) {
                        // 如果用户没有自选，默认显示其他基币
                        this.$store.commit('SET_MARKET_BASE_COIN', key)
                    }
                    this.baseCoin = key
                }
                this.$store.commit("SET_MARKET_LIST", JSON.parse(data.data));
            }
        },
        init(){
            worker.postMessage({ type: "CREATE_WEBSOCKET" });
            worker.onmessage = (ev) => {
                const { data } = ev;
                if (data.type === "WEBSOCKET_ON_OPEN") {
                    let optional = ''
                    this.myStoreSymbols.forEach((v,index) => {
                        optional += (v.symbol) + (this.myStoreSymbols.length-1 === index ?  ''  : '|')
                    });
                    worker.postMessage({ type: "MARKETB" ,data:{optional:optional} });
                }
                if (data.type === "WEBSOCKET_DATA") {
                    this.listenWSData(data.data);
                }
            };
        },
        hiddenChange(){
            if(document.hidden) {
                worker.postMessage({ type: "CLOSE_WEBSOCKET" });
            }else {
                this.init()
            }
        }
    },
    mounted () {
        this.rateSort = this.stateRateSort
        this.init()
        document.addEventListener("visibilitychange", this.hiddenChange,false);
    },
    beforeDestroy () {
        document.removeEventListener('visibilitychange',this.hiddenChange,false);
        worker.postMessage({type: "UNSUB",data: { operate: "delcoins_b" },});
        worker.postMessage({ type: "CLOSE_WEBSOCKET" });
    },
};
</script>
<style lang="scss" scoped>
.market_box{
    height: calc(100% - 50px);
}
.market-tab {
    height: 45px;
    line-height: 45px;
    padding: 0 15px;
    font-size: 14px;
    span {
        font-weight: 500;
        font-size: 14px;
        color: #9c9ba5;
        &:not(:last-child) {
            margin-right: 25px;
        }
        &.tabActive {
            color: $main-blue;
        }
    }
}
.search_body{
    padding: 0 15px 10px;
    height: 40px;
    .input-box {
        border: 1px solid #e6e6e6;
        height: 30px;
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
}
.t-head {
    background: #f9f9f9;
    height: 35px;
    line-height: 35px;
    padding: 0 15px;
    color: #9b9b9b;
    font-size: 14px;
}
.flex_ul{
    font-size: 14px;
    .list_l{
        flex: 1;
        
    }
    .iconfont{
        line-height: 1; 
        font-size: 12px; 
        line-height: 8px;
        transform: scale(0.8,0.8);
    }
    .list_c,.list_r{
        flex: 1;
        justify-content: flex-end;
        text-align: right;
    }
}
.symbol-list {
    height: calc(100% - 120px);
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
    .symbol-item {
        padding: 10px 0 15px;
        border-bottom: 1px solid #E6E6E6;
    }
}
</style>