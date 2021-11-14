<template>
  <div class="trade">
    <div class="symbol-title" @click="showSideBar = true">
        <i class="iconfont icongengduo"></i>
        <span class="upper">{{ symbol }}</span>
    </div>
    <div class="header_box flexC_S">
        <div class="header_box_l">
            <h2 :class="styleComp">{{ overviewData.close }}</h2>
            <p>≈ CNY {{ overviewData.tolRmb }}<span :class="styleComp"><em  v-if="overviewData.close > overviewData.open">+</em>{{ percent }}%</span></p>
        </div>
        <div class="header_box_r">
            <p class="flexC_S"><span>最高</span><span>{{ overviewData.high }}</span></p>
            <p class="flexC_S"><span>最低</span><span>{{ overviewData.low }}</span></p>
            <p class="flexC_S"><span>24h量</span><span>{{ $numberFormat((overviewData.amount * (appConfig.option || 1) || 0).toFixed(2)) }}</span></p>
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
            <ul class="more-resolution col-center" v-if="chartType !== 'minute'">
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
                :period="interval"
                :chartType="chartType"
                :splitSymbol="symbol"
                chartEntrance="optionTrade"
                @setOverviewData="setOverviewData"
                @setMarketList="setMarketList"
                @setTradeBaseCoin="setTradeBaseCoin"
                @refresh="refresh"></HqChart>
        </div>
    </div>
    <div class="handle-module">
        <div class="handle-header flexC_S">
            <div class="left" @click="showActionSheet = true">
                <span>{{actionObj.name}}</span>
                <i class="iconfont iconsanjiao-top"></i>
            </div>
            <div class="right" v-if="actionObj.value === '2'">
                <van-stepper v-model.number="stepperValue" :step="100" :input-width="104" button-size="30px"/>
            </div>
        </div>
        <div class="handle-center">
            <div class="left item">
                <div class="title upper">买入{{symbol.split('/')[0]}}数量</div>
                <Input
                    type="number"
                    v-model="order_amt"
                    :precision="optConfig.amount_precision"
                    @input="setOrderBond"/>
            </div>
            <div class="lever item">
                <div class="title">杠杆倍数</div>
                <div class="num" @click="showPopup = true">{{leverValue + 'X'}}</div>
            </div>
            <div class="right item">
                <div class="title upper">保证金{{symbol.split('/')[1]}}</div>
                <Input
                    type="number"
                    v-model="order_bond"
                    :precision="optConfig.price_precision"
                    @input="setOrderAmt"/>
            </div>
        </div>
        <div class="text-box">
            <div class="tips upper">买入市值 ≈ {{buyCoinPrice}}{{symbol.split('/')[1]}}</div>
            <div class="pay-text flexC_S upper">
                <div class="pay-text_lr">
                    <p class="text_l">您需支付</p>
                    <p>{{order_bond}}{{symbol.split('/')[1]}}</p>
                </div>
                <div>
                    <div v-if="token"  class="pay-text_lr">
                        <p class="text_r">可用</p>
                        <p>{{$fomatFloat(currentCoinBalance,pricePrecision)}}{{symbol.split('/')[1]}}<span class="transfer" @click="$router.push(`/capitalTransfer?coin_name=${symbol.split('/')[1]}`)">划转</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="bottom-btn">
        <div class="btn-box">
            <van-button class="van-myNbButton left" type="info" block @click="submitOrder('1')" :disabled="buyDisabled(1)">买涨 {{ overviewData.close }}</van-button>
            <van-button class="van-myNbButton right" type="info" block @click="submitOrder('2')" :disabled="buyDisabled(2)">买跌 {{ overviewData.close }}</van-button>
        </div>
    </div>
    <van-popup
        v-model="showPopup"
        class="lever-popup"
        position="bottom">
        <div class="header">
            <span>选择杠杆倍数</span>
            <div class="close" @click="showPopup = false">关闭</div>
        </div>
        <div class="lever-list">
            <div class="stepper_box">
                <van-stepper
                    v-model.number="sliderValue"
                    :max="optConfig.leverage_ratio_max"
                    :min="optConfig.leverage_ratio_min"
                    :integer="true"
                    async-change
                    @change="changeStepper"
                    button-size="35px" />
                <span class="absSpan" :style="{transform: `translate(${String(sliderValue).length * 5}px,-50%)`}">X</span>
            </div>
            <div class="slider">
                <van-slider v-model="sliderValue" :max="optConfig.leverage_ratio_max" :min="optConfig.leverage_ratio_min"></van-slider>
            </div>
            <van-button class="van-mybutton confirm" type="info" block @click="confirmLever">确定</van-button>
        </div>
    </van-popup>
    <van-action-sheet
        v-model="showActionSheet"
        :actions="actionSheetList"
        @select="actionSheetChange"
        :round="false"
        cancel-text="关闭" />
    <Sidebar
        v-model="showSideBar"
        theme="black"
        title="期权交易"
        :marketList="marketList"
        :tradeBaseCoin="tradeBaseCoin"
        @switchSymbolFun="switchSymbolFun"
        @checkBaseCoin="setTradeBaseCoin"/>
  </div>
</template>

<script>
import HqChart from "@/components/hqChart";
import Sidebar from "@/components/sidebar";
import Input from "./input"
import { optSet, optOrderTrust } from "@/api/optionTrade"
import { mapState } from "vuex"
import VanSlider from '@/components/common/vanSlider'
export default {
    name: 'Trade',
    components: {
        HqChart,
        Sidebar,
        Input,
        VanSlider,
    },
    data() {
        return {
            isLoad:true,
            showSideBar: false,
            overviewData: {
                close: 0,
                tolRmb: 0,
                open: 0,
                high: 0,
                low: 0,
                amount: 0,
            },
            marketList: {},
            showPopup: false,
            showActionSheet: false,
            actionSheetList: [
                { name: '市价下单', value: '1', color: '#4E82F3' }, 
                // { name: '触发价格', value: '2', color: ''  }
            ],
            actionObj: { name: '市价下单', value: '1' },
            stepperValue: 0,
            leverValue: '',
            optConfig: {
                leverage_ratio: []
            },
            order_amt: 0,
            order_bond: 0,
            sliderValue: 1,
            interval: this.$route.query.currentPeriod || 4,
            chartType: this.$route.query.chartType || 'minute',
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
            moreBtnActive: -1,
            attachedFigures:'VOL',
            mainPicture:'MA',
        }
    },
    computed: {
        ...mapState({
            token: (state) => state.user.token,
            coinConfig: (state) => state.coinConfig,
            tradeBaseCoin: (state) => state.optionTrade.tradeBaseCoin,
            symbol: state => state.optionTrade.symbol,
            qlistAccount: state => state.assets.qlistAccount,
            appConfig: (state) => state.appConfig,
        }),
        // 当前币对下的余额
        currentCoinBalance () {
            let obj = this.qlistAccount.find((item) =>item.coin_name === this.symbol.split('/')[1])
            return (
                obj && obj.num || 0
            );
        },
        symbolAccuracy(){
            return this.coinConfig.info[this.symbol] && this.coinConfig.info[this.symbol].basicCoinAccuracy || 2
        },
        symbolConfig(){
            let list = this.coinConfig.list
            let obj = list.find((v) => v.coinName == this.symbol)
            return obj || {}
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
        percent () {
            if (this.overviewData.close) {
                return Number( ((this.overviewData.close - this.overviewData.open) / this.overviewData.open) * 100 ).toFixed(2);
            } else return "";
        },
        // 当前买入市值
        buyCoinPrice () {
            let price = this.actionObj.value === '2' ? this.stepperValue : this.overviewData.close
            return this.$fomatFloat((this.order_amt * price),this.pricePrecision)
        },
        pricePrecision () {
            return this.optConfig.price_precision
        },
        amountPrecision () {
            return this.optConfig.amount_precision
        },
        symbolName() {
            return this.symbol.split("/").join("");
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
    },
    created() {
        this.getoptSet()
    },
    watch: {
        leverValue(val) {
            this.setOrderAmt()
        },
        stepperValue(val) {
            this.setOrderAmt()
        },
        'actionObj.value'() {
            this.setOrderAmt()
        }
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
        //切换周期
        resolutionBtnHandle (item) {
            if(item.chartType === "minute"){
                this.attachedFigures = ''
                this.mainPicture = ''
            }else{
                this.attachedFigures = 'VOL'
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
            if(item.chartType === "minute"){
                this.attachedFigures = ''
                this.mainPicture = ''
            }else{
                this.attachedFigures = 'VOL'
                this.mainPicture = 'MA'
            }
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
        hiddenChange(){
            if(document.hidden) {
                this.isLoad = false
            }else{
                this.isLoad = true
            }
        },
        getoptSet() {
            optSet({
                symbol: this.symbol.split('/').join('')
            }).then(res => {
                this.optConfig = res.data.set
                // this.leverValue = this.optConfig.leverage_ratio[0]
                // 设置默认值
                this.leverValue = this.optConfig.leverage_ratio_min
                this.$store.commit('SET_OPTION_TRADE_CONFIG', res.data.set)
            })
        },
        buyDisabled(type) {
            // type 1 买张 2买跌
            let disabled = false
            if (!this.optConfig.symbol || this.optConfig.state === 2) {
                // 未配置币对或者未启用
                disabled = true
            } else {
                if (this.optConfig.state === 1 && this.optConfig.state_min === 2) {
                    // 启用状态下是否可交易 1是 2否
                    disabled = true
                } else {
                    // 市价买卖：允许买涨1，允许买跌2，允许买涨跌3 trans_fixed
                    // 触发： 允许买涨1，允许买跌2，允许买涨跌3 trans_float
                    if (this.actionObj.value === '1' && this.optConfig.trans_fixed === (type === 2 ? 1 : 2)) {
                        disabled = true
                    }
                    if (this.actionObj.value === '2' && this.optConfig.trans_float === (type === 2 ? 1 : 2)) {
                        disabled = true
                    }
                }
            }
            return disabled
        },
        setOrderBond() {
            let price = this.actionObj.value === '2' ? this.stepperValue : this.overviewData.close
            this.order_bond = this.$fomatFloat(this.order_amt * price / this.leverValue,this.optConfig.price_precision)
        },
        setOrderAmt() {
            let price = this.actionObj.value === '2' ? this.stepperValue : this.overviewData.close
            this.order_amt = !price ? 0 : this.$fomatFloat(Number(this.order_bond * this.leverValue / price), this.optConfig.amount_precision)
        },
        submitOrder(type) {
            if(!this.token) {
                this.$router.push({ path: '/login' })
                return
            }
            if (!this.optConfig.symbol) {
                this.$toast('暂停交易')
                return
            }
            if (this.order_amt <= 0) {
                this.$toast('下单量必须大于0')
                return
            }
            if (this.order_amt < this.optConfig.min_order_amt) {
                this.$toast(`最小下单量${this.optConfig.min_order_amt}`)
                return
            }
            if (this.order_amt > this.optConfig.max_order_amt) {
                this.$toast(`最大下单量${this.optConfig.max_order_amt}`)
                return
            }
            let params = {
                symbol: this.symbol.split('/').join(''),
                trans_type: this.actionObj.value,
                trans_intention: type,
                order_amt: this.order_amt,
                order_bond: this.order_bond,
                order_price: this.actionObj.value === '2' ? this.stepperValue : this.$fomatFloat(this.overviewData.close,this.optConfig.price_precision),
                leverage_ratio: this.leverValue
            }
            optOrderTrust(params).then(res => {
                if (res.code === 0) {
                    this.$toast('下单成功！')
                    // 清空数量 保证金 杠杆倍数信息
                    this.order_amt = 0
                    this.order_bond = 0
                    this.sliderValue = this.optConfig.leverage_ratio_min
                    this.leverValue = this.sliderValue
                    // 重新查询余额
                    this.$store.dispatch("getwalletAssetsLlist");
                    this.$store.commit('SET_OPTION_TRADE_TAB_INDEX', 1)
                    this.$store.commit('SET_OPTION_TRADE_HOLD_TAB_INDEX', 0)
                }
            })
        },
        refresh() {
           this.$emit('refresh') 
        },
        setMarketList(val) {
            this.marketList = val
            this.$emit('setMarketList', val)
        },
        setOverviewData(val) {
            this.overviewData = val
        },
        setTradeBaseCoin(val) {
            this.$store.commit("SET_OPTION_TRADE_BASE_COIN", val);
        },
        selectLever(item) {
            this.leverValue = item
            this.showPopup = false
        },
        confirmLever() {
            this.leverValue = this.sliderValue
            this.showPopup = false
        },
        actionSheetChange(item) {
            this.actionSheetList.map(res =>{
                res.color = ''
            })
            item.color = '#4E82F3'
            this.actionObj = item
            this.showActionSheet = false
        },
        // 切换币种
        switchSymbolFun(newVal){
            this.$store.commit('SET_OPTION_TRADE_SYMBOL', newVal.toLowerCase())
            this.showSideBar = false
            this.getoptSet()
            // 切换币种，滚动到顶部
            // this.$refs.overflowPatibleBox.scrollTop = 0
        },
        changeStepper(val) {
            if (val === '' || val < this.optConfig.leverage_ratio_min) this.sliderValue = this.optConfig.leverage_ratio_min
            if (val > this.optConfig.leverage_ratio_max) this.sliderValue = this.optConfig.leverage_ratio_max
        }
    },
    mounted(){
        document.addEventListener("visibilitychange", this.hiddenChange,false);
    },
    beforeDestroy () {
        document.removeEventListener('visibilitychange',this.hiddenChange,false);
    },
}
</script>

<style lang="scss" scoped>
.color-up {
    color: $buy;
}
.color-down {
    color: $sell;
}
.van-button--disabled{
    opacity: 1;
}
.trade{
    height: 100%;
    .symbol-title{
        padding-left: 15px;
        color: #fff;
        display: flex;
        align-items: center;
        line-height: 24px;
        height: 24px;
        font-size: 17px;
        .icongengduo {
            margin-right: 5px;
            font-size: 30px;
        }
    }
    .header_box{
        padding: 10px 15px 0;
        height: 75px;
        font-size: 12px;
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
    .chart-box{
        width: 100%;
        min-height: 200px;
        height: calc(100% - 270px)
    }
    .interval-line{
        height: 10px;
        background: #071724;
    }
    .iconsanjiao-top{
        font-size: 12px;
        margin-left: 4px;
    }
    .handle-module{
        padding-bottom: 44px;
        .handle-header{
            height: 40px;
            border-bottom: 1px solid #071724;
            padding: 0 15px;
            .right{
                color: #fff;
            }
        }
        .handle-center{
            display: flex;
            justify-content: space-between;
            padding: 0 15px;
            .item{
                flex: 1;
                .title{
                    padding: 10px 0;
                }
                input{
                    width: 100px;
                    height: 35px;
                    background: #071724;
                    border-radius: 6px;
                    text-align: center;
                    font-size: 14px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #FFFFFF;
                    line-height: 35px;
                }
                .num{
                    display: inline-block;
                    width: 75px;
                    height: 35px;
                    background: #071724;
                    border-radius: 6px;
                    text-align: center;
                    color: #FFFFFF;
                    line-height: 35px;
                }
            }
            .lever,.right{
                text-align: right;
            }
            .right{
                margin-left: 20px;
            }
        }
    }
    .text-box{
        padding: 0 15px;
        .tips{
            font-size: 12px;
            padding-top: 15px;
        }
        .pay-text{
            padding: 20px 0;
            font-weight: 500;
            .pay-text_lr{
                display: flex;
                .text_l{
                    margin-right: 10px;
                }
                .text_r{
                    margin-right: 5px;
                }
            }
            .transfer{
                padding-left: 20px;
                color: #2C57AB;
            }
        }
    }
    .bottom-btn{
        height: 44px;
        position: fixed;
        bottom: 0px;
        left: 0;
        width: 100%;
        .btn-box{
            height: 44px;
            line-height: 44px;
            display: flex;
            font-weight: 500;
            font-size: 16px;
            .van-button{
                flex: 1;
                height: 44px;
                line-height: 44px;
                text-align: center;
                border-radius: 0;
                color: #fff;
                &:disabled {
                    background: #c8cfd5 !important;
                }
            }
            .left{
                background: $buy;
            }
            .right{
                background: $sell;
            }
        }
    }
    .lever-list{
        padding: 15px;
        // display: grid;
        // grid-template: [] '1 1 1' 35px;
        // grid-gap: 10px 20px;
        // .item{
        //     border: 2px solid #071724;
        //     border-radius: 6px;
        //     text-align: center;
        //     line-height: 35px;
        //     font-weight: 500;
        //     &.active{
        //         border: 2px solid #4E82F3;
        //         color: #4E82F3;
        //     }
        // }
        .slider{
            padding-top: 22px;
        }
        .confirm{
            height: 40px;
            width: 100%;
            background: #071724;
            border: 1px solid $main-blue;
            border-radius: 6px;
            font-size: 14px;
            color: #fff;
            margin-top: 50px;
        }
        ::v-deep .van-stepper__input{
            width: calc(100% - 70px);
        }
    }
    ::v-deep .van-stepper__input{
        margin: 0;
        background-color: #071724;
        color: #9B9B9B;
    }
    ::v-deep.van-stepper__minus, ::v-deep.van-stepper__plus{
        background-color: #071724;
        color: #fff
    }
    .stepper_box {
        position: relative;
        .absSpan{
            position: absolute;
            top: 50%;
            left: 50%;
            font-size: 14px;
        }
    }
    .lever-popup{
        background: #131E30 !important;
        .header{
            height: 55px;
            line-height: 55px;
            text-align: center;
            position: relative;
            font-size: 18px;
            .close{
                position: absolute;
                width: 45px;
                height: 55px;
                text-align: left;
                right: 0;
                top: 0;
                font-size: 14px;
            }
        }
    }
    ::v-deep .van-action-sheet {
        background: #131E30 !important;
        .van-action-sheet__item~.van-action-sheet__item{
            border-top: 1px solid #000;
        }
        .van-action-sheet__item, .van-action-sheet__cancel{
            background: #131E30 !important;
            color: #9B9B9B;
            font-size: 14px;
        }
        .van-action-sheet__gap{
            background: #000 !important;
            height: 1px;
        }
    }
}
.chart-box {
    height: calc(100% - 280px);
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
</style>