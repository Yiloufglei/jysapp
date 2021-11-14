<template>
    <div class="hqchart-container overflowPatible_box" ref="overflowPatibleBox">
        <h2 class="header col-center">
            <i class="iconfont iconzuo" @click="back"></i>
            <span class="line"></span>
            <span class="col-center" @click="showSideBar = true">
                <i class="iconfont icongengduo"></i>
                <em class="upper">{{ splitSymbol }}</em>
            </span>
        </h2>
        <div class="header_box flexC_S">
            <div class="header_box_l">
                <h2 :class="styleComp">{{ overviewData.close }}</h2>
                <p>≈ CNY {{ overviewData.tolRmb }}<span :class="styleComp"><em  v-if="overviewData.close > overviewData.open">+</em>{{ percent }}%</span></p>
            </div>
            <div class="header_box_r">
                <p class="flexC_S"><span>最高</span><span>{{ overviewData.high }}</span></p>
                <p class="flexC_S"><span>最低</span><span>{{ overviewData.low }}</span></p>
                <p class="flexC_S"><span>24h量</span><span>{{ $numberFormat(((overviewData.amount * (appConfig.coins || 1) || 0)).toFixed(2)) }}</span></p>
            </div>
        </div>
        <div class="chart-box">
            <div class="resolution-group flexC_S">
                <div v-for="item in btnList" class="resolution_list"
                    :class="{'resolution-active': interval == item.period && chartType == item.chartType,}"
                    :key="item.id" @click="resolutionBtnHandle(item)">
                    <span>{{ item.text }}</span>
                </div>
                <div class="more_body">
                    <div class="more-btn" :class="{ 'resolution-active': showMoreResolutionStyle }"
                        @click="showMoreResolution = !showMoreResolution">
                        {{ moreResolutionText }}<i class="iconfont iconsanjiao-top"></i>
                    </div>
                </div>
                <div><i class="iconfont iconfullScreen"  @click="$router.push(`/horizontalHq?symbolName=${symbolName}&currentPeriod=${interval}&chartType=${chartType}`)"></i></div>
            </div>
            <div class="more_list"  v-show="showMoreResolution">
                <ul class="more-resolution col-center">
                    <li :class="{'more-btn-active': mItem.period == interval && mItem.chartType == chartType,}"
                        v-for="(mItem, index) in moreBtnList" :key="mItem.resolution"
                        @click="moreResolutionBtnHandle(mItem, index)">
                        {{ mItem.text }}
                    </li>
                </ul>
                <ul class="more-resolution col-center">
                    <li :class="{'more-btn-active': mItem.ID == mainPicture}"
                        v-for="mItem in mainPictureMenu" :key="mItem.ID"
                        @click="ChangeMainPictureMenuIndex(mItem)">
                        {{ mItem.Name }}
                    </li>
                </ul>
                <ul class="more-resolution col-center">
                    <li :class="{'more-btn-active': mItem.ID == attachedFigures}"
                        v-for="mItem in attachedFiguresMenu" :key="mItem.ID"
                        @click="ChangeAttachedFiguresIndex(mItem)">
                        {{ mItem.Name }}
                    </li>
                </ul>
            </div>
            <div class="tv_box">
                <HqChart
                    ref="hqchart"
                    :symbolName="symbolName"
                    @coinProfile="init"
                    :period="interval"
                    :chartType="chartType"
                    :splitSymbol="splitSymbol"></HqChart>
            </div>
        </div>
        <section class="trad-info">
            <dl class="trad-info-tab flex">
                <dd :class="{ 'trad-info-tab-active': infoTabType === 0 }" @click="infoTabType = 0">
                    成交
                </dd>
                <dd :class="{ 'trad-info-tab-active': infoTabType === 1 }" @click="infoTabType = 1" v-if="!tradeType">
                    简介
                </dd>
            </dl>
            <div class="comp-box">
                <component :is="comp" :info="info"></component>
            </div>
            <footer class="footer between col-center">
                <dl class="btns flexC_S">
                    <van-button class="van-myNbButton bg-buy" type="info" block @click="buySell(1)">买入</van-button>
                    <van-button class="van-myNbButton bg-sell" type="info" block @click="buySell(2)">卖出</van-button>
                </dl>
                <dl class="operation flex">
                    <div class="t_c">
                        <img v-if="isSymbol" @click="collectSymbols('del')" src="@/assets/imgs/operation1.png" alt="">
                        <img v-else @click="collectSymbols('add')" src="@/assets/imgs/operation.png" alt="">
                        <p>自选</p>
                    </div>
                </dl>
            </footer>
        </section>
        <Sidebar v-model="showSideBar" theme="black" :tradeType="type" @switchSymbolFun="switchSymbolFun"/>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Sidebar from "@/views/trade/sidebar";
import HqChart from '@/components/hqChart'
import Table from "./table";
import Intro from "./intro";
import { coinProfile } from '@/api/common'
export default {
    name: 'Hqchart',
    components: {
        Sidebar,
        HqChart,
        Table,
        Intro
    },
    computed: {
        ...mapGetters(["usdt_cny"]),
        ...mapState({
            coinConfig: (state) => state.coinConfig,
            klineData: (state) => state.wsData.klineData,
            myStoreSymbols: (state) => state.user.mySymbols,
            overviewData: (state) => state.wsData.overviewData,
            symbol: (state) => state.wsData.symbol,
            appConfig: (state) => state.appConfig,
        }),
        comp () {
            return this.infoTabType === 0 ? Table : Intro;
        },
        symbolName() {
            return this.symbol.split("_").join("");
        },
        splitSymbol () {
            return this.symbol.split("_").join("/");
        },
        percent () {
            if (this.overviewData.close) {
                return Number( ((this.overviewData.close - this.overviewData.open) / this.overviewData.open) * 100 ).toFixed(2);
            } else return "";
        },
        moreResolutionText () {
            if (this.moreBtnActive < 0) {
                return "更多";
            } else {
                return this.moreBtnList[this.moreBtnActive].text;
            }
        },
        showMoreResolutionStyle () {
            return this.showMoreResolution || this.moreResolutionText !== "更多";
        },
        isSymbol () {
            let obj = this.myStoreSymbols.find(v => (v.symbol.toLowerCase()) === (this.splitSymbol.toLowerCase())) || {}
            if (JSON.stringify(obj) != '{}') {
                return true
            }
            return false
        },
        styleComp () {
            if (Object.keys(this.overviewData).length) {
                if (this.overviewData.close > this.overviewData.open) {
                    return "color-up";
                } else {
                    return "color-down";
                }
            } else return "";
        },
        tradeType(){
            return this.$route.query.tradeType === 'contract'
        },
    },
    beforeRouteEnter (to, from, next) {
        next((vm) => {
            if (from.fullPath) {
                if(from.fullPath.indexOf('horizontalHq') === -1){
                    vm.fromPath = from.fullPath;
                }
            }
        });
    },
    data() {
        return {
            fromPath: '/',
            type:'spot', // 交易类型 头部tab
            infoTabType: 0,
            info:{},
            interval: this.$route.query.currentPeriod || 6,
            showSideBar: false,
            chartType: this.$route.query.chartType || 'kline',
            moreBtnActive: -1,
            attachedFigures:'VOL',
            mainPicture:'MA',
            moreBtnList: [
                { text: "1分", period: 4, chartType: 'kline' },
                { text: "5分", period: 5, chartType: 'kline' },
                { text: "30分", period: 7, chartType: 'kline' },
                { text: "1周", period: 1, chartType: 'kline' },
                { text: "1月", period: 2, chartType: 'kline' },
            ],
            btnList: [
                { text: "分时", period: 4, chartType: 'minute' },
                { text: "15分", period: 6, chartType: 'kline' },
                { text: "1小时", period: 8, chartType: 'kline' },
                { text: "4小时", period: 12, chartType: 'kline' },
                { text: "日线", period: 0, chartType: 'kline' },
            ],
            mainPictureMenu:[
                {Name:'MA', ID:'MA', WindowIndex:0 },
                {Name:'BOLL', ID:'BOLL', WindowIndex:0 },
            ],
            attachedFiguresMenu:[
                {Name:'VOL', ID:'VOL', WindowIndex:1 },
                {Name:'KDJ', ID:'KDJ', WindowIndex:1 },
                {Name:'MACD', ID:'MACD', WindowIndex:1 },
                {Name:'RSI', ID:'RSI', WindowIndex:1 },
            ],
            showMoreResolution: false,
        }
    },
    mounted() {
        this.$store.dispatch("set_usdt_cny");
        this.init();
    },
    methods: {
        ChangeMainPictureMenuIndex(item)  {
            this.mainPicture = item.Name
            this.$refs.hqchart.ChangeMainPictureMenuIndex(item)
        },
        ChangeAttachedFiguresIndex(item){
            if(!this.attachedFigures){
                return false
            }
            this.attachedFigures = item.Name
            this.$refs.hqchart.ChangeAttachedFiguresIndex(item)
        },
        init () {
            let coin = this.symbol.split('_')[0]
            coinProfile({coin}).then(res => {
                this.info = res.data.info || {}
            })
        },
        buySell(type){
            this.setTradeData(this.$route.query.type || 'spot')
            this.$store.commit('SET_TRADE_MODE', {
                tradeType: this.$route.query.type || 'spot',
                mode: type
            })
            this.$router.push({
                path: "/trade"
            });
        },
        setTradeData(tradeType) {
            this.$store.commit('SET_TRADE_TYPE', tradeType)
            this.$store.commit('SET_USERSYMBOL', {
                tradeType: tradeType,
                symbolName: this.splitSymbol
            })
        },
        back() {
            this.$router.replace({ path: this.fromPath });
        },
        //切换周期
        resolutionBtnHandle (item) {
            if(item.chartType === "minute"){
                // this.attachedFigures = ''
                this.mainPicture = ''
            }else{
                // this.attachedFigures = 'VOL'
                this.mainPicture = 'MA'
            }
            this.moreBtnActive = -1;
            this.$refs.hqchart.ChangePeriod(item.period, item.chartType)
            // this.$refs.tv_ref.changeResolution(item);
            this.showMoreResolution = false
            this.interval = item.period;
            this.chartType = item.chartType;
        },
        //切换周期
        moreResolutionBtnHandle (item, index) {
            this.moreBtnActive = index;
            this.$refs.hqchart.ChangePeriod(item.period, item.chartType)
            // this.$refs.tv_ref.changeResolution(item);
            this.interval = item.period;
            this.chartType = item.chartType;
        },
        // 切换币种
        switchSymbolFun(newVal){
            this.$store.commit('SET_SYMBOL', newVal.toLowerCase().replace('/', '_'))
            this.showSideBar = false
            // 切换币种，滚动到顶部
            this.$refs.overflowPatibleBox.scrollTop = 0
        },
        collectSymbols(type){
            if(!this.loginType){
                this.$router.push('/login')
                return
            }
            let obj = {
                type:type,
                symbol:(this.splitSymbol.toUpperCase())
            }
            this.$store.dispatch('handleMySymbols',obj)
        },
    }
}
</script>

<style lang="scss" scoped>
.color-up {
    color: $buy;
}
.color-down {
    color: $sell;
}
.hqchart-container{
    height: 100%;
    background: #131e32;
    color: #9b9b9b;
    position: fixed;
    width: 100%;
    top: 0px;
    left: 0px;
    .header{
        position: fixed;
        height: 55px;
        top: 0px;
        left: 0px;
        z-index: 9;
        background: #131e32;
        width: 100%;
        padding: 0 20px;
        font-weight: 500;
        height: 55px;
        line-height: 55px;
        font-size: 17px;
        margin-left: -5px;
        color: #fff;
        span.line{
            width: 1px;
            background: #707070;
            margin: 0 10px;
            height: 20px;
        }
        .iconzuo {
            font-size: 24px;
        }
        .icongengduo {
            margin-right: 5px;
            font-size: 32px;
        }
    }
    .header_box{
        padding: 15px 15px 0;
        height: 75px;
        font-size: 12px;
        margin-top: 55px;
        .header_box_l{
            flex: 1;
            h2{
                font-size: 26px;
                font-weight: 500;
                line-height: 37px;
            }
            p{
                span{
                    margin-left: 12px;
                }
            }
        }
        .header_box_r ,.header_box_l{
            display: flex;
            height: 100%;
            flex-flow: column;
            justify-content: space-between;
        }
        .header_box_r{
            width: 120px;
            p span:nth-child(2){
                color: #fff;
            }
        }
    }
    .chart-box {
        height: calc(100% - 235px);
        position: relative;
        .more_list{
            position: absolute;
            width: 100%;
            left: 0;
            top: 45px;
            background: rgba($color: #131e32, $alpha: 0.9);
            padding: 10px 16px;
            z-index: 10;
            .more-resolution {
                width: 100%;
                margin-bottom: 10px;
                li {
                    width: 50px;
                    height: 25px;
                    line-height: 25px;
                    text-align: center;
                    background: #182233;
                    border-radius: 4px;
                    font-size: 12px;
                    border: 1px solid transparent;
                    &:not(:last-child) {
                        margin-right: 18px;
                    }
                    &.more-btn-active {
                        border: 1px solid $main-blue;
                        color: $main-blue;
                    }
                }
            }
        }
        .tv_box{
            height: calc(100% - 45px);
        }
        .resolution-group {
            background: #131e32;
            width: 100%;
            padding: 0 16px;
            height: 45px;
            font-size: 12px;
            border-bottom: 1px solid #212c37;
            box-sizing: border-box;
            .iconfullScreen{
                color: #fff;
            }
            .resolution_list{
                flex: 1;
                line-height: 45px;
            }
            .more_body {
                color: #FFFFFF;
                text-align: left;
                height: 100%;
                flex: 1;
                display: flex;
                align-items: center;
                span {
                    display: inline-block;
                    display: flex;
                    align-items: center;
                    height: 100%;
                }
            }
            .more-btn {
                width: 44px;
            }
            .iconsanjiao-top{
                font-size: 12px;
                margin-left: 4px;
            }
            .resolution-active {
                color: $main-blue !important;
                span {
                    position: relative;
                    display: inline-block;
                    height: 100%;
                    &::after {
                        content: "";
                        width: 100%;
                        height: 2px;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        background: $main-blue;
                    }
                }
            }

        }
    }
    .trad-info {
        // background: #182842;
        .trad-info-tab {
            border-bottom: 1px solid #212C37;
            dd {
                flex: 1;
                text-align: center;
                height: 45px;
                line-height: 45px;
                font-size: 16px;
                font-weight: 500;
                &.trad-info-tab-active {
                    color: $main-blue;
                }
            }
        }
        .comp-box {
            padding: 0 0 60px;
        }
    }
    .footer {
        padding: 0 20px 0 10px;
        height: 60px;
        // background: #3e424c;
        background: #182842;
        position: fixed;
        left: 0;
        bottom: 0;
        right: 0;
        .btns {
            flex: 1;
            button {
                width: 120px;
                height: 40px;
                border-radius: 6px;
                color: #fff;
                font-size: 16px;
                font-weight: 500;
            }
        }
        .operation {
            width: 90px;
            justify-content: flex-end;
            height: 100%;
            div {
                margin-left: 10px;
                display: flex;
                flex-flow: column;
                justify-content: center;
                align-items: center;
                img{
                    width: 24px;
                    height: 24px;
                    display: inline-block;
                }
                p{
                    line-height: 20px;
                }
            }
        }
    }
}
</style>