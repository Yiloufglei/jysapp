<template>
    <div class="binaryOptionIndex">
        <myHeader title="期权交易" :back="back" />
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
import { worker } from "@/utils/webWorker.js";
import myHeader from '@/components/common/header'
import { optSet } from "@/api/binaryOption"
import { mapState } from "vuex"
import VirtualList from 'vue-virtual-scroll-list'
import Item from './Item'
import _cloneDeep from 'lodash/cloneDeep'
export default {
    name:'binaryOptionIndex',
    components: {
        VirtualList,
        myHeader
    },
    data () {
        return {
            rateSort: '',
            baseCoin:'', //当前基币
            isResponse: false,
            itemComponent: Item,
            curMarketList:[]
        };
    },
    computed:{
        ...mapState({
            myStoreSymbols:(state) => state.user.mySymbols,
            stateRateSort:(state) => state.rateSort,
            coinConfig: (state) => state.coinConfig,
            placeConisOrderObj: (state) => state.optionTrade.placeConisOrderObj,
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
            }
            if (this.searchText) {
                return list.filter((item) => { return item.symbol.toLowerCase().includes(this.searchText.toLowerCase()); });
            } else {
                return list;
            }
        }
    },
    methods: {
        back(){
            this.$router.replace('/')
        },
        rateSortFun(){
            if(!this.rateSort){
                this.rateSort = 1
            }else{
                this.rateSort = this.rateSort === 1 ? 2 : ''
            }
            this.$store.commit('SET_RATESORT',this.rateSort)
        },
        listenWSData (data) {
            if (data.type === "rank_q") {
                let val = JSON.parse(data.data)
                let list = _cloneDeep(val['USDT'])
                if (list) {
                    list.symbollist.forEach(v => {
                        let info = this.coinConfig.info[v.symbol.toLowerCase()]
                        let keyVal = v.quote.toLowerCase() + v.base.toLowerCase()
                        let priceprecision = this.placeConisOrderObj[keyVal] && this.placeConisOrderObj[keyVal].amount_precision || 2
                        if(info){
                            v.info.price = this.$fomatFloat(Number(v.info.price || 0),priceprecision)
                            v.info.quote_price = this.$fomatFloat(Number(v.info.quote_price || 0),info.rmbAccuracy)
                        }
                    });
                    this.curMarketList =  list.symbollist || [];
                }
            }
        },
        init(){
            worker.postMessage({ type: "CREATE_WEBSOCKET" });
            worker.onmessage = (ev) => {
                const { data } = ev;
                if (data.type === "WEBSOCKET_ON_OPEN") {
                    worker.postMessage({ type: "MARKETQ" ,data:{optional:''} });
                }
                if (data.type === "WEBSOCKET_DATA") {
                    this.listenWSData(data.data);
                }
            };
            optSet().then(res => {
                let conisList = res.data.conis || [];
                this.$store.commit('SET_PLACE_ORDER_LIST',conisList)
            })
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
.binaryOptionIndex{
    height: 100%
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
    height: calc(100% - 80px);
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
    .symbol-item {
        padding: 10px 0 15px;
        border-bottom: 1px solid #E6E6E6;
    }
}
</style>