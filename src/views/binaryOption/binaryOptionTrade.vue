<template>
    <div class="binaryOptionTrade" ref="overflowPatibleBox">
        <h2 class="header flexC_S">
            <div class="col-center">
                <i class="iconfont iconzuo" @click="back"></i>
                <span class="line"></span>
                <span class="col-center" @click="showSideBar = true">
                    <i class="iconfont icongengduo"></i>
                    <em class="upper">{{ splitSymbol }}</em>
                </span>
            </div>
            <div class="col-center">
                <i class="iconfont iconshangxiayidongjiantou" @click="$router.push(`/capitalTransfer?account=qnum`)"></i>
                <!-- <i class="iconfont iconjilu" @click="$router.push(`/binaryOptionHistory`)"></i> -->
            </div>
        </h2>
        <div class="binaryOption_body overflowPatible">
            <div class="header_box flexC_S color_c">
                <div class="header_box_l">
                    <h2 :class="styleComp">{{ overviewData.close }}</h2>
                    <p>≈ CNY {{ overviewData.tolRmb }}<span :class="styleComp"><em  v-if="overviewData.close > overviewData.open">+</em>{{ percent }}%</span></p>
                </div>
                <div class="header_box_r">
                    <p class="flexC_S"><span>最高</span><span>{{ overviewData.high }}</span></p>
                    <p class="flexC_S"><span>最低</span><span>{{ overviewData.low }}</span></p>
                    <p class="flexC_S"><span>24h量</span><span>{{ $numberFormat(((overviewData.amount * (appConfig.option || 1) || 0)).toFixed(2)) }}</span></p>
                </div>
            </div>
            <div class="noticeBar_body flexC_S">
                <i class="iconfont iconlingsheng"></i>
                <div id="noticeBar_div">
                    <ul id="noticeBar_ul"  @webkitAnimationEnd="removeDom">
                        <li  v-for="(item,index) in noticeList" :key="index">{{`恭喜用户${item.nick_name}买${item.status === 1 ? '涨' : '跌'}盈利${item.award_amt}USDT`}}</li>
                    </ul>
                </div>
            </div>
            <div class="chart-box color_c">
                <div class="resolution-group flexC_S border_b_c">
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
                    <div><i class="iconfont iconfullScreen"  @click="$router.push(`/horizontalHq?symbolName=${symbolName}&currentPeriod=${interval}&chartType=${chartType}&type=optionTrade`)"></i></div>
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
                        theme="white"
                        :symbolName="symbolName"
                        :period="interval"
                        :chartType="chartType"
                        :splitSymbol="splitSymbol"
                        chartEntrance="optionTrade"
                        :pricePrecision="optConfig.amount_precision"
                        @setOverviewData="setOverviewData"
                        @setMarketList="setMarketList"
                        @optMarquee="optMarquee"
                        @refreshOrderClose="refreshOrderClose"
                        @setTradeBaseCoin="setTradeBaseCoin">
                    </HqChart>
                </div>
            </div>
            <div class="position_box">
                <div class="interval_bj"></div>
                <div class="position_title  border_b_c flexC_S">
                    <h4><span>持有仓位</span><span @click="goOptionHistory">交易记录</span></h4>
                    <p>
                        <span class="color_c">USDT:</span><span>{{$fomatFloat(currentCoinBalance,pricePrecision)}}</span>
                    </p>
                </div>
                <div class="position_list border_b_c" v-for="(item,index) in orderList" :key="item.id">
                    <div class="position_list_l">
                        <p>倒计时</p>
                        <p><loopPie :text="item.calc_time" :total="item.total" :val="item.calc_time" :color="item.trans_type === 1 ? '#6950a1' : '#f47920'"/></p>
                    </div>
                    <div class="position_list_r upper">
                        <div class="position_list_r_t flexC_S">
                            <p>{{item.symbol}}<span :class="colorStyle(item.trans_type)">{{item.trans_type === 1 ? '买涨' : '买跌'}}</span></p>
                            <span class="position_list_time">{{$formatDate(item.created_at,'s')}}</span>
                        </div>
                        <div class="position_list_r_c">
                            <span>数量：</span>{{item.order_amt + ' '}}{{item.base_currency}}
                        </div>
                        <div class="position_list_r_b flexC_S">
                            <p><span>开仓价：</span>{{item.order_price}}</p>
                            <p><span>结算价：</span>{{ overviewData.close }}</p>
                            <p :class="colorStyle(item.profit,'num')">{{item.profit ? item.profit : '等待'}}</p>
                        </div>
                    </div>
                </div>
                <div class="no-data" v-if="positionList.length === 0"></div>
            </div>
        </div>
        <div class="trad-info">
            <!-- <van-button type="primary"  class="bg_b" @click="submit(2)">买平</van-button> -->
            <van-button type="primary"  class="bg-buy" @click="submit(1)">买涨</van-button>
            <van-button type="primary"  class="bg-sell" @click="submit(2)">买跌</van-button>
        </div>
        <Sidebar
            v-model="showSideBar"
            title="期权交易"
            :marketList="marketList"
            :tradeBaseCoin="tradeBaseCoin"
            :pricePrecision="optConfig.amount_precision"
            @switchSymbolFun="switchSymbolFun"
            @checkBaseCoin="setTradeBaseCoin"
        />
        <van-dialog v-model="showPlaceOrder" title="" :showConfirmButton="false" :lazy-render="false">
            <div class="placeOrder_top flexC_S">
                <span></span><span>订单确认</span><span class="right_i"><i class="iconfont iconshanchu color_c" @click="cancelClick"></i></span>
            </div>
            <div class="placeOrder_body">
                <div class="flexC_S placeOrder_title"><p>USDT:{{$fomatFloat(currentCoinBalance,pricePrecision)}}</p><p class="flex">划转：<i class="iconfont iconshangxiayidongjiantou sell-color" @click="$router.push(`/capitalTransfer?account=qnum`)"></i></p></div>
                <div class="flexC_S placeOrder_title"><p>预计结算时间</p><p class="color_c"><span>{{$formatDate(timeMsg,'s')}}</span></p></div>
                <ul class="placeOrder_ui">
                    <li @click="placeOrderClick(item)" v-for="item in placeOrderList" :style="placeOrderObj.id === item.id ? styleColor('placeOrderItem')  : ''" :key="item.id"><h4>{{item.calc_time}}S</h4><p>收益{{item.income}}%</p></li>
                </ul>
                <ul class="amount_ui flexC_S">
                    <li @click="amountSetClick(item)" v-for="item in amountTopList" :style="amountIndex === item.val ? styleColor('confirm')  : ''" :key="item.id">
                        {{item.text}}
                    </li>
                </ul>
                <ul class="amount_ui flexC_S">
                    <li @click="amountSetClick(item)" v-for="item in amountBtmList" :style="amountIndex === item.val ? styleColor('confirm')  : ''" :key="item.id">
                        {{item.text}}
                    </li>
                </ul>
                <div class="placeOrder_title"><p>下注数量（USDT）</p></div>
                <Input class="placeOrderIpt" @input="placeOrderValInt" :precision="optConfig.price_precision" height="36px" type="number" fontSize="12px" :isFocus="false" v-model="placeOrderVal" :placeholder="`请输入下注数量，最高不得超过${optConfig.max_order_amt}USDT`" :max="optConfig.max_order_amt" />
                <div class="flexC_S placeOrder_title"><p>当前价格：{{ overviewData.close }}</p><p><span>本次操作：</span><span :style="styleColor('text')">{{colorObj[placeOrderType].text}}</span></p></div>
                <div class="submit_btn flexC_S">
                    <!-- <van-button type="primary" :style="styleColor('cancel')" @click="cancelClick">思考一下</van-button> -->
                    <van-button plain type="primary" block :style="styleColor('confirm')" @click="confirm" :disabled="isdisabled">确认买入</van-button>
                </div>
            </div>
        </van-dialog>
        <van-popup v-model="showOptionHistory" :duration="0.2" position="right" :style="{ width: '80%',height:'100%' }">
            <binaryOptionHistory ref="OptionHistory"/>
        </van-popup>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Sidebar from "@/components/sidebar";
import HqChart from '@/components/hqChart'
import { optSet ,optOrderBuy ,optOrderList} from "@/api/binaryOption"
import _cloneDeep from 'lodash/cloneDeep'
import binaryOptionHistory from './binaryOptionHistory'
import loopPie from './loopPie'
export default {
    name: 'binaryOptionTrade',
    components: {
        Sidebar,
        HqChart,
        loopPie,
        binaryOptionHistory
    },
    computed: {
        ...mapGetters(["usdt_cny"]),
        ...mapState({
            token: (state) => state.user.token,
            qlistAccount: state => state.assets.qlistAccount,
            tradeBaseCoin: (state) => state.optionTrade.tradeBaseCoin,
            symbol: (state) => state.wsData.hqSymbol,
            appConfig: (state) => state.appConfig,
            placeConisOrderObj: (state) => state.optionTrade.placeConisOrderObj,
        }),
        // 当前币对下的余额
        currentCoinBalance () {
            let obj = this.qlistAccount.find((item) =>item.coin_name === this.splitSymbol.split('/')[1])
            return (
                obj && obj.num || 0
            );
        },
        optConfig(){
            return this.placeConisOrderObj[this.symbolName] || {}
        },
        pricePrecision () {
            return this.optConfig.price_precision || 2
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
                if(from.fullPath.indexOf('horizontalHq') === -1 && from.fullPath != '/'){
                    vm.fromPath = from.fullPath;
                }
            }
        });
    },
    data() {
        return {
            showOptionHistory:false,
            colorObj:{
                1:{
                    bjColor:'rgba(5, 172, 146, .1)',
                    brColor:'rgba(5, 172, 146, 1)',
                    textColor:'rgba(5, 172, 146, 1)',
                    text:'买涨'
                },
                2:{
                    bjColor:'rgba(209, 75, 100, .1)',
                    brColor:'rgba(209, 75, 100, 1)',
                    textColor:'rgba(209, 75, 100, 1)',
                    text:'买跌'
                },
                3:{
                    bjColor:'rgba(78, 130, 243, .1)',
                    brColor:'rgba(78, 130, 243, 1)',
                    textColor:'rgba(78, 130, 243, 1)',
                    text:'买平'
                },
            },
            fromPath: '/binaryOption',
            timeMsg:'',
            interval: this.$route.query.currentPeriod || 4,
            showSideBar: false,
            chartType: this.$route.query.chartType || 'minute',
            moreBtnActive: -1,
            attachedFigures:'VOL',
            mainPicture:'',
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
            positionList:[],
            marketList:{},
            overviewData:{},
            showPlaceOrder:false,
            placeOrderType:1,
            placeOrderList:[],
            amountTopList:[
                {val:10,text:'10'},
                {val:50,text:'50'},
                {val:100,text:'100'},
                {val:500,text:'500'},
            ],
            amountBtmList:[
                {val:1000,text:'1000'},
                {val:5000,text:'5000'},
                {val:10000,text:'1W'},
                {val:20000,text:'2W'},
            ],
            placeOrderObj:{},
            placeOrderVal:'',
            timer:null,
            amountIndex:'',
            noticeList:[],
            allnoticeList:[],
            ultranslateX:0,
            ulW:0,
            liW:0,
            divW:null,
            updateCustomYObj:{},
            isdisabled:false,
            orderList:[],
            orderListTimer:null
        }
    },
    watch:{
        positionList:function (params) {
            this.orderList = params
            this.inintorderList()
            if(!this.orderList.length && (this.updateCustomYObj['buy_trans'] || this.updateCustomYObj['sell_trans'])){
                for (const key in this.updateCustomYObj) {
                    this.updateCustomYObj[key] = null
                }
                this.$refs.hqchart.UpdateCustomY(this.updateCustomYObj)
            }
        }
    },
    mounted() {
        if(this.token){
            this.getoptOrderList()
            this.$store.dispatch("getwalletAssetsLlist");
        }
        this.init();
        this.divW = document.getElementById('noticeBar_div').offsetWidth
        this.liW = this.divW
        this.$store.dispatch("set_usdt_cny");
        document.styleSheets[0].insertRule(
            `
                @keyframes aim_move0 {
                    0% {
                        -webkit-transform: translateX(${this.liW + 'px'});
                        transform: translateX(${this.liW + 'px'});
                    }
                    100% {
                        -webkit-transform: translateX(0);
                        transform: translateX(0);
                    }
                }
            `
        ,0)
        document.styleSheets[1].insertRule(
            `
                @keyframes aim_move1 {
                    0% {
                        -webkit-transform: translateX(0);
                        transform: translateX(0);
                    }
                    100% {
                        -webkit-transform: translateX(-${this.liW + 'px'});
                        transform: translateX(-${this.liW + 'px'});
                    }
                }
            `
        ,0)
        document.addEventListener("visibilitychange", this.hiddenChange,false);
    },
    methods: {
        inintorderList(){
            if(this.orderListTimer && this.orderList.length){
                clearInterval(this.orderListTimer)
                this.orderListTimer = null
                this.initorderList()
            }else{
                clearInterval(this.orderListTimer)
                this.orderListTimer = null
            }
            if(this.orderList.length){
                this.orderListTimer = setInterval(() => {
                    this.initorderList()
                },1000)
            }
        },
        initorderList(){
            this.orderList.forEach((v) =>{
                v.calc_time = v.calc_time <= 0 ? 0 : v.calc_time - 1
            })
        },
        removeDom(e){
            const ul = document.getElementById('noticeBar_ul')
            if(this.noticeList.length > 1){
                this.noticeList.shift()
                ul.style.width = (this.liW * this.noticeList.length) + 'px'
                ul.style.transform = `translateX(0px)`
            }
            ul.className = ''
            this.allnoticeList.shift()
            setTimeout(() => {
                if(this.allnoticeList.length){
                    let list = this.allnoticeList[0]
                    this.noticeList.push(list)
                    this.initpao()
                }
            }, 0);
        },
        initpao(){
            const length = this.noticeList.length
            const ul = document.getElementById('noticeBar_ul')
            ul.style.width = (this.liW * length) + 'px'
            if(length > 1){
                ul.style.transform = `translateX(${this.liW}px)`
                ul.className='move1'
            }else{
                ul.className='move0'
            }
        },
        goOptionHistory(){
            if(!this.token){
                this.$router.push(`/login`)
                return
            }
            this.showOptionHistory = true
        },
        optMarquee(val){
            let obj = JSON.parse(val)
            const ul = document.getElementById('noticeBar_ul')
            if(ul.className !== 'move0' && ul.className !== 'move1'){
                this.allnoticeList.push(obj)
                let list = this.allnoticeList[0]
                this.noticeList.push(list)
                this.initpao()
            }else{
                this.allnoticeList.push(obj)
            }
        },
        getoptOrderList(){
            let obj = {
                symbol:this.symbolName,
                status:1,
                page:1,
                page_size:100,
            }
            optOrderList(obj).then(res => {
                let list = res.data.list || []
                list.forEach((v) => {
                    v.total = v.calc_time
                })
                this.positionList = list
            })
        },
        refreshOrderClose(val){
            let obj = JSON.parse(val)
            this.positionList = _cloneDeep(this.positionList).filter( v => { return v.order_id !== obj.order_id})
            for (const key in this.updateCustomYObj) {
                let v = this.updateCustomYObj[key]
                if(v && v.order_id === obj.order_id){
                    this.updateCustomYObj[key] = null
                }
            }
            this.$refs.hqchart.UpdateCustomY(this.updateCustomYObj)
            this.$store.dispatch("getwalletAssetsLlist");
            let OptionHistory = this.$refs.OptionHistory
            if(OptionHistory && (OptionHistory.pageData.status === 4 || OptionHistory.pageData.status === obj.status) && (OptionHistory.pageData.symbol === '' || OptionHistory.pageData.symbol === obj.symbol)){
                this.$refs.OptionHistory.tabData.unshift(obj)
            }
        },
        colorStyle (msg,type) {
            if(type === 'num'){
                if(!msg){
                    return ''
                }
                if(msg > 0){
                    return 'buy-color'
                }else if(msg < 0){
                    return 'sell-color'
                }
            }else{
                if(msg === 1){
                    return 'bg-buy'
                }
                return "bg-sell";
            }
        },
        placeOrderValInt(){
            if(this.amountIndex != this.placeOrderVal){
                this.amountIndex = ''
            }
        },
        amountSetClick(item){
            this.amountIndex = item.val
            this.placeOrderVal = item.val
        },
        cancelClick(){
            this.showPlaceOrder = false
            clearInterval(this.timer)
        },
        confirm(){
            if(!this.token) {
                this.$router.push({ path: '/login' })
                return
            }
            if(!this.placeOrderVal){
                this.$toast('请输入数量！')
                return
            }
            if (this.placeOrderVal < this.optConfig.min_order_amt) {
                this.$toast(`最小下单量${this.optConfig.min_order_amt}`)
                return
            }
            let obj = {
                symbol:this.symbolName,
                tran_type:this.placeOrderType,
                order_amt:this.placeOrderVal,
                order_item:this.placeOrderObj.item_name,
            }
            this.isdisabled = true
            optOrderBuy(obj).then((res) => {
                this.$toast('下单成功')
                // this.getoptOrderList()
                res.data.total = res.data.calc_time
                this.positionList.unshift(res.data)
                this.showPlaceOrder = false
                this.$store.dispatch("getwalletAssetsLlist");
                if(res.data.trans_type === 1){
                    this.updateCustomYObj['buy_trans'] = res.data
                }
                if(res.data.trans_type === 2){
                    this.updateCustomYObj['sell_trans'] = res.data
                }
                this.$refs.hqchart.UpdateCustomY(this.updateCustomYObj)
                this.isdisabled = false
                clearInterval(this.timer)
            }).catch(() => {
                this.isdisabled = false
            })
        },
        styleColor(type){
            if(type === 'text'){
                return {
                    color: this.colorObj[this.placeOrderType].textColor
                }
            }
            let obj = {
                'border-color': this.colorObj[this.placeOrderType].brColor
            }
            if(type === 'placeOrderItem'){
                obj['background-color'] =  this.colorObj[this.placeOrderType].bjColor
            }
            if(type === 'cancel'){
                obj['background-color'] = this.colorObj[this.placeOrderType].bjColor
                obj['color'] = this.colorObj[this.placeOrderType].textColor
            }
            if(type === 'confirm'){
                obj['background-color'] = this.colorObj[this.placeOrderType].brColor
                obj['color'] = '#fff'
            }
            return obj
        },
        placeOrderClick(item){
            this.placeOrderObj = item
            clearInterval(this.timer)
            this.timeMsg = (Date.parse(new Date()) / 1000) + this.placeOrderObj.calc_time
            this.timer = setInterval(this.timeFun,1000)
        },
        setMarketList(val) {
            this.marketList = val
        },
        setOverviewData(val) {
            this.overviewData = val
        },
        setTradeBaseCoin(val) {
            this.$store.commit("SET_OPTION_TRADE_BASE_COIN", val);
        },
        timeFun(){
            this.timeMsg = (Date.parse(new Date()) / 1000) + this.placeOrderObj.calc_time
        },
        submit(type){
            this.timeMsg = (Date.parse(new Date()) / 1000) + this.placeOrderObj.calc_time
            this.timer = setInterval(this.timeFun,1000)
            this.placeOrderType = type
            this.showPlaceOrder = true
        },
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
            optSet().then(res => {
                let conisList = res.data.conis || [];
                this.placeOrderList = res.data.items || []
                this.placeOrderObj = this.placeOrderList[0] || {}
                this.$store.commit('SET_PLACE_ORDER_LIST',conisList)
            })
        },
        back() {
            // this.$router.replace({ path: this.fromPath });
            this.$router.replace('/binaryOption')
            // this.$router.go(-1)
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
            this.$store.commit('SET_HQSYMBOL', newVal.toLowerCase().replace('/', '_'))
            this.showSideBar = false
            // 切换币种，滚动到顶部
            this.$refs.overflowPatibleBox.scrollTop = 0
            this.placeOrderVal = ""
            if(this.token){
                this.getoptOrderList()
            }
        },
        hiddenChange(){
            if(document.hidden) {
                clearInterval(this.timer)
                clearTimeout(this.orderListTimer)
                this.orderListTimer = null
            }else{
                if(this.token){
                    this.getoptOrderList()
                }
                if(this.showPlaceOrder){
                    this.timer = setInterval(this.timeFun,1000)
                }
            }
        },
    },
    beforeDestroy(){
        clearInterval(this.timer)
        clearTimeout(this.orderListTimer)
        this.orderListTimer = null
        document.removeEventListener('visibilitychange',this.hiddenChange,false);
    }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
.color-up {
    color: $buy;
}
.color-down {
    color: $sell;
}
.move0{
    animation : aim_move0 2s linear forwards
}
.move1{
    animation : aim_move1 2s linear forwards
}
.binaryOptionTrade{
    height: 100%;
    ::v-deep .van-dialog{
        background-color: rgba($color: #fff, $alpha: .8);
        transition: .1s;
        font-size: 14px;
    }
    .placeOrder_top{
        padding-bottom: 20px;
        font-weight: 500;
        line-height: 24px;
        span{
            text-align: center;
            flex: 1;
            font-size: 16px;
        }
        .right_i{
            text-align: right;
        }
    }
    .placeOrder_body{
        .placeOrder_title{
            line-height: 20px;
            height: 20px;
            margin-bottom: 10px;
            .color_c{
                font-size: 12px;
            }
            .iconshangxiayidongjiantou{
                font-size: 20px;
                display: inline-block;
                transform: rotate(90deg);
            }
        }
        .placeOrderIpt{
            background: #E6E6E6;
            border-radius: 4px;
            height: 36px;
            margin-bottom: 10px;
            padding: 0 10px;
            ::v-deep input{
                &::placeholder {
                    color: #fff;
                    font-size: 12px;
                }
            }
        }
        .submit_btn {
            padding-top: 10px;
            .van-button{
                // width: 130px;
                border-radius: 6px;
                height: 40px;
            }
        }
        .placeOrder_ui{
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            li{
                text-align: center;
                height: 65px;
                border: 1px solid #E6E6E6;
                border-radius: 6px;
                width: 80px;
                font-size: 12px;
                padding-top: 10px;
                margin-bottom: 10px;
                box-sizing: border-box;
                h4{
                    line-height: 28px;
                    font-size: 20px;
                    font-weight: 500;
                }
                p{
                    line-height: 17px;
                }
                &:nth-child(3n + 2){
                    margin: 0 calc(50% - 120px);
                }
            }
        }
        .amount_ui{
            flex-wrap: wrap;
            li{
                text-align: center;
                height: 30px;
                line-height: 30px;
                border: 1px solid #E6E6E6;
                border-radius: 6px;
                width: 20%;
                font-size: 12px;
                margin-bottom: 10px;
                box-sizing: border-box;
            }
        }
    }
    .header{
        height: 55px;
        z-index: 9;
        width: 100%;
        padding: 0 15px;
        font-weight: 500;
        height: 55px;
        line-height: 55px;
        font-size: 17px;
        span.line{
            width: 1px;
            background: #000;
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
        .iconshangxiayidongjiantou{
            font-size: 20px;
            transform: rotate(90deg);
            margin-right: 5px;
        }
        .iconjilu{
            font-size: 24px;
        }
    }
    .binaryOption_body{
        height: calc(100% - 135px);
        .header_box{
            padding: 15px 15px 0;
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
                    color: #000;
                }
            }
        }
        .noticeBar_body{
            line-height: 20px;
            height: 20px;
            padding: 0 15px;
            color: #7eb337;
            background: rgba(234,245,215,1);;
            .iconfont{
                width: 20px;
                font-size: 18px;
            }
            div{
                width: calc(100% - 20px);
                height: 20px;
                overflow: hidden;
                ul{
                    height: 100%;
                    li{
                        width: 325px;
                        float: left;
                    }
                }
            }
        }
        .chart-box {
            height: calc(100% - 145px);
            position: relative;
            .more_list{
                position: absolute;
                width: 100%;
                left: 0;
                top: 45px;
                background: rgba(230, 230, 230, .63);
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
                        background: #fff;
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
                height: calc(100% - 35px);
            }
            .resolution-group {
                width: 100%;
                padding: 0 16px;
                height: 35px;
                font-size: 12px;
                box-sizing: border-box;
                .resolution_list{
                    flex: 1;
                    line-height: 35px;
                }
                .more_body {
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
        .position_box{
            .position_title{
                padding: 4px 16px 0;
                height: 40px;
                h4{
                    font-size: 16px;
                    line-height: 22px;
                    font-weight: 500;
                    border: 1px solid #f5f5f5;
                    border-radius: 4px;
                    padding: 2px;
                    span{
                        text-align: center;
                        border-radius: 2px;
                        padding: 0 10px;
                        &:nth-child(1){
                            background: #f5f5f5;
                        }
                    }
                }
                P{
                    line-height: 20px;
                    span{
                        margin-left: 10px;
                    }
                }
            }
            
        }
    }
    .trad-info {
        width: 100%;
        height: 80px;
        position: fixed;
        background: #fff;
        left: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        .van-button{
            height: 40px;
            border: none;
        }
        .bg-sell, .bg-buy{
            width: 36%;
            border-radius: 5px;
            // transform: skewX(-20deg);
            .van-button__text{
                // transform: skewX(20deg);
                font-size: 16px;
            }
        }
        .bg-buy{
            margin-right: 8%;
        }
        // .bg-sell{
        //     width: 104px;
        //     border-radius:  0 20px 20px 0;
        //     &::after{
        //         content: '';
        //         position: absolute;
        //         left: -5px;
        //         bottom: -5px;
        //         width: 10px;
        //         height: 50px;
        //         background: #fff;
        //         transform: rotate(12deg);
        //         z-index: 1;
        //     }
        // }
        // .bg_b{
        //     width: 84px;
        // }
        // .bg-buy{
        //     width: 104px;
        //     border-radius: 20px 0 0 20px;
        //     position: relative;
        //     &::after{
        //         content: '';
        //         position: absolute;
        //         right: -5px;
        //         bottom: -5px;
        //         width: 10px;
        //         height: 50px;
        //         background: #fff;
        //         transform: rotate(12deg);
        //         z-index: 1;
        //     }
        // }
        // .skew_bj{
        //     display: inline-block;
        //     width: 15px;
        //     height: 40px;
        //     position: relative;
        //     background: #fff;
        //     transform:rotate(10deg);
        //     z-index: 1;
        // }
    }
}
</style>