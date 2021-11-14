<template>
    <div class="tradeContainer overflowPatible">
        <nav class="nav row-center">
            <dl @click="typeChange('spot')" :class="{ 'nav-active': routeQuery === 'spot' }">
                币币
            </dl>
            <dl @click="$router.push('binaryOption')" :class="{ 'nav-active': routeQuery === 'lever' }">
                期权交易
            </dl>
            <router-link to="/legalCurrencyTrade">法币</router-link>
        </nav>
        <div class="container_box">
            <section class="trade-panel">
                <section class="trade-symbol between col-center">
                    <div class="symbol-name flex col-center" @click="showSideBar = true">
                        <span class="upper">{{ symbol }}</span><i class="iconfont iconyou1"></i>
                    </div>
                    <div class="sym-cur-info col-center" :class="percentRange + '-color'">
                        <span>{{ realPrice }}</span>
                        <span>{{ percent }}</span>
                        <a @click="toChart"><i class="view-chart"></i></a>
                    </div>
                </section>
                <section class="trade-content flex clear-both">
                    <section class="trade-left">
                        <div class="trade-btn between">
                            <van-button class="van-myNbButton" type="info" :class="{ 'bg-buy': tradeMode === 1 }" block @click="tradeSet(1)">买入</van-button>
                            <van-button class="van-myNbButton" type="info" :class="{ 'bg-sell': tradeMode === 2 }" block @click="tradeSet(2)">卖出</van-button>
                        </div>
                        <!-- 选择配资 -->
                        <div class="buy-type" v-if="routeQuery === 'lever'">
                            <div class="buy-type-current between" @click="showLever = !showLever">
                                <span class="lever-select" v-if="cLever">{{ cLever.type_flag | transTitle }}{{ cLever.multiple }}倍：{{cLever.allocation_id}}</span>
                                <span v-else>请选择配资</span>
                                <i class="iconfont iconsanjiao"></i>
                            </div>
                            <ul class="buy-type-select" v-show="showLever">
                                <li v-if="!leverList.length">暂无任何配资</li>
                                <li :class="{'option-active': cLever.id === item.id,}" v-for="(item, index) in leverList" :key="index" @click="chooseLever(item)">
                                    <p>{{ item.type_flag | transTitle }}{{ item.multiple }}倍：</p>
                                    <p class="text_es">{{item.allocation_id}}</p>
                                </li>
                            </ul>
                        </div>
                        <!-- 限价、市价 -->
                        <div class="buy-type">
                            <!-- <div class="buy-type-current"> -->
                            <van-popover
                                v-model="showBuyType"
                                trigger="click"
                                overlay
                                :actions="buyTypeList"
                                @select="chooseBuyType"
                                :get-container="getPopoverContainer">
                                <template #reference>
                                    <div class="buy-type-current">
                                        {{ currentBuyType.text }} <i class="iconfont iconsanjiao-top"></i>
                                    </div>
                                </template>
                            </van-popover>
                            <!-- <ul class="buy-type-select" v-show="showBuyType">
                                <li :class="{'option-active': currentBuyType.value === item.value,}" v-for="item in buyTypeList" :key="item.value" @click="chooseBuyType(item.value)">{{ item.text }}</li></ul> -->
                        </div>
                        <div class="buy-input">
                            <div class="market-price-input" v-if="buyType === 2">
                                以当前最优价格{{ tradeMode === 1 ? "买入" : "卖出" }}
                            </div>
                            <Input type="number" v-else v-model="buyPrice" :coinName="coin.base" placeholder="价格"
                                @focus="priceInput = true" :precision="symbolConfig.basicCoinAccuracy" @input="buyPriceChange"/>
                            <div class="cny">
                                <span v-if="buyType !== 2">≈{{ cCnyPrice }} CNY</span>
                            </div>
                            <Input v-if="buyType === 1" type="number" @input="buyNumberChange" v-model="buyNumber" :precision="symbolConfig.currencyAccuracy" :coinName="coin.quote" placeholder="数量" @focus="priceInput = true" />
                            <Input v-if="buyType === 2" type="number" @input="buyNumberChange" v-model="buyNumber" :precision="symbolConfig.currencyAccuracy" :coinName="tradeMode === 1 ? coin.base : coin.quote" :placeholder="tradeMode === 1 ? '交易额' : '数量'" @focus="priceInput = true" />
                        </div>
                        <div class="limit-group between">
                            <slider ref="slider" @setOpacityConfig="setOpacityConfig" :tradeMode="tradeMode"></slider>
                        </div>
                        <div class="total upper">
                            <Input v-if="buyType === 1" type="number" @input="tradingUsdtChange" v-model="tradingUsdt" :precision="symbolConfig.basicCoinAccuracy" :coinName="coin.base" placeholder="交易额" @focus="priceInput = true" />
                            <!-- <div v-if="buyType === 1" class="flexC_S"><span>总额</span><em>{{ totalUsdt }} {{ coin.base }}</em></div> -->
                        </div>
                        <van-button class="van-myNbButton submit" type="info" :class="tradeMode === 1 ? 'bg-buy' : 'bg-sell'" block @click="submitTrade" :disabled="disableSubBtn">{{ submitBtnText }}</van-button>
                        <div class="balance upper flexC_S">
                            可用余额
                            <span class="ep-hd">{{ availableBalance }} {{ tradeMode === 1 ? coin.base : coin.quote }}</span>
                        </div>
                        <div v-if="routeQuery === 'spot'" class="assets-trans" @click="$router.push(`/capitalTransfer?coin_name=${coin.quote}`)">资金划转<i class="iconfont iconyou1" style="font-size: 10px; margin-left: 2px"></i></div>
                    </section>
                    <section class="trade-right">
                        <div class="handicap-title between upper">
                            <span>价格({{ coin.base }})</span>
                            <span>数量({{ coin.quote }})</span>
                        </div>
                        <div class="handicap-sell">
                            <Handicap :depthData="sellList" type="sell" @setPrice="setPrice"/>
                        </div>
                        <div class="handicap-buy">
                            <Handicap :depthData="buyList" type="buy"  @setPrice="setPrice"/>
                        </div>
                    </section>
                </section>
            </section>
            <div style="height: 10px; background: #f9f9f9"></div>
            <section>
                <div class="trande-order-header between">
                    <dl class="header-left">当前委托</dl>
                    <dl class="hander-right flex" v-if="token">
                        <dd v-if="tradeList.length > 0" @click="revokeAll">全部撤单</dd>
                        <router-link :to="`/tradeHistory?type=${routeQuery}`">历史</router-link>
                    </dl>
                </div>
                <div class="trade-box" v-for="item in tradeList" :key="item.id">
                    <TradeOrder revoke @revoke="revoke" :orderData="item" />
                </div>
                <div class="no-data" v-if="!tradeList.length"></div>
            </section>
        </div>
        <Sidebar v-model="showSideBar" :tradeType="routeQuery" @switchSymbolFun="switchSymbolFun"/>
        <!-- <div class="page-mask" v-show="showMask" @click="closeMask"></div> -->
    </div>
</template>
<script>
import Input from "./input";
import Handicap from "./handicap";
import TradeOrder from "./tradeOrder";
import Sidebar from "./sidebar";
import { worker } from "@/utils/webWorker.js";
import { mapGetters, mapState } from "vuex";
import leverMixin from "@/views/leverage/mixin.js";
import { getCurrentLever } from "@/api/leverage";
import { submitTrade, submitAllocationTrade,revoke, revokeAll,allocationRevoke,allocationRevokeAll } from "@/api/trade";
import { _debounce } from '@/utils/util'
import slider from "@/components/slider";
import _find from 'lodash/find'

export default {
    components: { Input, Handicap, TradeOrder, Sidebar ,slider},
    name:'tradeContainer',
    data () {
        return {
            per:0,
            // tradeMode: 1, // 交易模式，买入/卖出
            showBuyType: false, // 显示购买类型下拉框
            buyType: 2, // 购买类型
            buyTypeList: [
                // { value: 1, text: "限价委托", className: 'active' },
                { value: 2, text: "市价委托", className: 'active' },
            ],
            showLever: false, // 显示配资下拉框
            cLeverIndex: 1,
            leverList: [], // 当前配资列表
            limitGroup: [
                { text: "全仓", limit: 1 },
                { text: "1/2", limit: 0.5 },
                { text: "1/3", limit: 0.33 },
                { text: "1/4", limit: 0.25 },
            ],
            showSideBar: false,
            overviewData: {}, // 当前币对数据
            priceInput: false, // 价格输入时
            buyPrice: "", // 购买价格
            buyNumber: '', // 购买数量
            buyDisable: false,
            buyList: [], // 盘口：买盘数据
            sellList: [], // 盘口：卖盘数据
            tradeList: [], // 委托列表
            firstType: true, //首次进去页面
            // symbolName:'',//当前币种
            tradingUsdt: '', // 交易总额
        };
    },
    mixins: [leverMixin],
    computed: {
        ...mapGetters(["usdt_cny"]),
        ...mapState({
            token: (state) => state.user.token,
            userSymbol: (state) => state.userSymbol,
            coinConfig: (state) => state.coinConfig,
            myStoreSymbols: (state) => state.user.mySymbols,
            soptAccount: (state) => state.assets.soptAccount,
            leverAccount: (state) => state.assets.leverAccount,
            tradeModeObj: (state) => state.tradeMode,
            appConfig: (state) => state.appConfig,
            userInfo: (state) => state.user.userInfo,
        }),
        availableBalance(){
            return this.$fomatFloat((this.cSymbolBanlance || 0),(this.tradeMode === 2 ? this.symbolConfig.currencyAccuracy : this.symbolConfig.basicCoinAccuracy))
        },
        symbolAccuracy(){
            return this.coinConfig.info[this.symbol] && this.coinConfig.info[this.symbol].basicCoinAccuracy || 2
        },
        symbolConfig(){
            let list = this.coinConfig.list
            let obj = list.find((v) => v.coinName == this.symbol)
            return obj || {}
        },
        saleBuy(){
            let fang = false
            if(this.buyType === 2 && this.symbolConfig.saleBuy){
                //市价交易
                if(this.tradeMode === 1){
                    fang = this.symbolConfig.saleBuy && this.symbolConfig.saleBuy.indexOf('1') != -1
                }else if(this.tradeMode === 2){
                    fang = this.symbolConfig.saleBuy && this.symbolConfig.saleBuy.indexOf('2') != -1
                }
            }
            if(this.buyType === 1 && this.symbolConfig.limitSaleBuy){
                //限价交易
                if(this.tradeMode === 1){
                    fang = this.symbolConfig.limitSaleBuy.indexOf('1') != -1
                }else if(this.tradeMode === 2){
                    fang = this.symbolConfig.limitSaleBuy.indexOf(2) != -1
                }
            }
            return fang
        },
        disableSubBtn () {
            if(!this.loginType){
                return false
            }
            if(this.buyDisable || !this.saleBuy){
                return true
            }
            return false
        },
        submitBtnText () {
            if(!this.token) return "登录";
            if(!this.saleBuy) return "暂停交易";
            if(this.routeQuery === 'lever' && !this.cLever){
                return '暂无配资'
            }
            return this.tradeMode === 1 ? "买入" : "卖出";
        },
        // 当前币对下的余额
        cSymbolBanlance () {
            if (this.routeQuery === "lever") {
                return this.cLever && (this.tradeMode === 1 ? this.cLever.left_money : this.cLever.leftCoins ) || 0
            } else if (this.routeQuery === "spot") {
                let obj = this.soptAccount.find((item) =>item.coin_name === (this.tradeMode === 1 ? this.coin.base : this.coin.quote))
                return (
                    obj && obj.num || 0
                );
            }
        },
        // showMask () {
        //     return this.showBuyType || this.showLever;
        // },
        currentBuyType () {
            return this.buyTypeList.find((item) => item.value === this.buyType);
        },
        symbolName() {
            return this.userSymbol[this.routeQuery]
        },
        // 币对
        symbol () {
            return this.symbolName
        },
        // 币对对象  页面显示
        coin () {
            const arr = this.symbolName.split("/");
            return { base: arr[1], quote: arr[0] };
        },
        // 币对字符串 ws需要的币种
        symbolStr () {
            return (this.symbolName.split("/").join(""))
        },
        // 涨跌百分比
        percent () {
            if (this.overviewData.close) {
                let x = this.overviewData.close - this.overviewData.open
                return  (x > 0 ? '+' : '') + Number((x / this.overviewData.open) * 100).toFixed(2) + "%"
            } else return "0%";
        },
        percentRange () {
            if (this.overviewData.close - this.overviewData.open > 0) return "up";
            else if (this.overviewData.close - this.overviewData.open < 0)
                return "down";
            else return "";
        },
        // 实时价格
        realPrice () {
            if (this.overviewData.close) {
                const p = this.$fomatFloat(this.overviewData.close,this.symbolAccuracy)
                if (!this.priceInput) {
                    this.buyPrice = p;
                }
                return p;
            }
            return 0
        },
        // 当前cny价格
        cCnyPrice () {
            return  this.$fomatFloat((this.buyPrice * this.usdt_cny),this.symbolConfig.rmbAccuracy)
        },
        // 购买总额
        totalUsdt () {
            if (this.buyNumber && this.buyPrice) {
                if(this.buyNumber==0 || this.buyPrice == 0){
                    return "0.00"
                }
                if(this.buyType === 2){
                    return  this.$fomatFloat(this.buyNumber,this.symbolConfig.basicCoinAccuracy)
                }else{
                    return  this.$fomatFloat(this.buyPrice * this.buyNumber,this.symbolConfig.basicCoinAccuracy)
                }
            } else return "0.00";
        },
        // 当前选择配资
        cLever () {
            const { l_id } = this.$route.params;
            if (l_id) {
                return this.leverList.find((item) => item.id === Number(l_id));
            } else {
                if (this.leverList.length) {
                    return this.leverList[0];
                } else return "";
            }
        },
        routeQuery() {
            return this.$store.state.tradeType || 'spot'
        },
        tradeMode() {
            // 买入卖出 默认1-买入
            return this.tradeModeObj[this.routeQuery] || 1
        }
    },
    methods: {
        tradeSet(type){
            // this.tradeMode = type;
            this.$store.commit('SET_TRADE_MODE', {
                tradeType: this.routeQuery,
                mode: type
            })
            // this.buyNumber= this.$fomatFloat(0,this.symbolConfig.currencyAccuracy || 2);
            this.buyNumber = ""
            this.$refs.slider.buyNumberChange(0)
        },
        setTradingUsdt() {
            let num = "0.00"
            if (this.buyNumber && this.buyPrice) {
                if(this.buyNumber==0 || this.buyPrice == 0){
                    num = "0.00"
                } else {
                    num = this.$fomatFloat(this.buyPrice * this.buyNumber,this.symbolConfig.basicCoinAccuracy)
                }
            }
            this.tradingUsdt = num
        },
        tradingUsdtChange() {
            // 更改交易总额
            if(this.buyType === 1){
                this.buyNumber = this.$fomatFloat(this.tradingUsdt / this.buyPrice, this.symbolConfig.currencyAccuracy)
                let x = 0
                if (this.tradeMode === 1) {
                    x = this.buyPrice / this.cSymbolBanlance * this.buyNumber * 100;
                } else {
                    x = Number(this.buyNumber) / this.cSymbolBanlance * 100;
                }
                x = parseInt(x) >= 100 ? 100 : parseInt(x)
                this.$refs.slider.buyNumberChange(x)
            }
        },
        buyPriceChange() {
            // this.buyNumber = 0
            // this.$refs.slider.buyNumberChange(0)
            // this.tradingUsdt = 0
            this.buyNumberChange()
        },
        buyNumberChange(){
            let x = 0
            if(this.cSymbolBanlance == 0){
                x = 0
            }else{
                if(this.buyType === 2){//市价
                    x = this.buyNumber / this.availableBalance * 100
                }else{
                    if (this.tradeMode === 1) {
                        x = this.buyPrice / this.cSymbolBanlance * this.buyNumber * 100;
                    } else {
                        x = Number(this.buyNumber) / this.cSymbolBanlance * 100;
                    }
                }
            }
            x = parseInt(x) >= 100 ? 100 : parseInt(x)
            this.$refs.slider.buyNumberChange(x)
            this.setTradingUsdt()
        },
        setOpacityConfig(val){
            if(val == 0){
                this.buyNumber = 0
                this.setTradingUsdt()
                return
            }
            if(this.buyType === 2){//市价
                let accuracy = this.tradeMode === 1 ? this.symbolConfig.basicCoinAccuracy : this.symbolConfig.currencyAccuracy
                this.buyNumber = this.$fomatFloat(Number(this.availableBalance)  * val / 100,accuracy)
                this.setTradingUsdt()
            }else{
                //限价
                if (this.tradeMode === 1) {
                    if(!this.buyPrice){
                        return
                    }
                    this.buyNumber = this.$fomatFloat((this.cSymbolBanlance / this.buyPrice * val / 100),this.symbolConfig.currencyAccuracy)
                } else {
                    this.buyNumber = this.$fomatFloat(this.cSymbolBanlance * val / 100,this.symbolConfig.currencyAccuracy)
                }
                this.setTradingUsdt()
            }
            
        },
        setPrice(val){
            this.priceInput = true
            this.buyPrice = val
            this.setTradingUsdt()
        },
        subOverview () {
            // 单币对信息
            worker.postMessage({type: "OVERVIEW",data: { coin: this.symbolStr },});
        },
        unsubOverview () {
            // 关闭单币对信息
            worker.postMessage({type: "UNSUB",data: {operate: "deldetail",data: { coin: this.symbolStr },},});
        },
        subHandicap () {
            // 盘口
            if(this.routeQuery == 'lever'){
                worker.postMessage({type: "HANDICAP",data: { coin: this.symbolStr ,type:'2',step:'1' }});
            }else{
                worker.postMessage({type: "HANDICAP",data: { coin: this.symbolStr ,type:'1',step:'1' }});
            }
        },
        unsubHandicap () {
            // 关闭盘口
            if(this.routeQuery == 'lever'){
                worker.postMessage({type: "UNSUB",data: { operate: "delhandicap",data: { coin : this.symbolStr,type:'2',step:'1' },},});
            }else{
                worker.postMessage({type: "UNSUB",data: { operate: "delhandicap",data: { coin : this.symbolStr,type:'1',step:'1'},},});
            }
        },
        subCoins (optional) {
            // 行情
            if(this.routeQuery == 'lever'){
                worker.postMessage({ type: "MARKETP" ,data:{optional:optional} });
            }else{
                worker.postMessage({ type: "MARKETB" ,data:{optional:optional} });
            }
        },
        unsubCoins () {
            // 关闭行情
            if(this.routeQuery == 'lever'){
                worker.postMessage({ type: "UNSUB", data: { operate: "delcoins_p" } });
            }else{
                worker.postMessage({ type: "UNSUB", data: { operate: "delcoins_b" } });
            }
        },
        subToken () {
            // 委托
            if(this.routeQuery == 'lever'){
                worker.postMessage({type: "TRADEORDER",data: { authtoken: this.token ,type:'2'},});
            }else{
                worker.postMessage({type: "TRADEORDER",data: { authtoken: this.token ,type:'1'},});
            }
        },
        unsuToken () {
            // 关闭委托
            if(this.routeQuery == 'lever'){
                worker.postMessage({type: "UNSUB",data: { operate: "delentrust", authtoken: this.token,type:'2' },});
            }else{
                worker.postMessage({type: "UNSUB",data: { operate: "delentrust", authtoken: this.token,type:'1' },});
            }
        },
        // 交易类型切换
        typeChange (type) {
            this.overviewData = {}
            if (type === this.routeQuery) return
            this.buyNumber = this.$fomatFloat(0,this.symbolConfig.currencyAccuracy);
            this.firstType = true
            this.priceInput = false
            this.switchSymbol('',type)
        },
        // closeMask () {
        //     this.showBuyType = false;
        //     this.showLever = false;
        // },
        // 选择配资
        chooseLever (item) {
            this.$router.push({ params: { l_id: item.id } });
            this.showLever = false;
        },
        // 选择交易模式
        chooseBuyType (item) {
            this.buyType = item.value;
            this.buyTypeList.map(list => {list.className = ''})
            item.className = 'active'
            this.showBuyType = false;
            this.buyPrice = '';
            this.buyNumber = '';
            this.$refs.slider.buyNumberChange(0)
        },
        // 撤单
        async revoke (itemData) {
            if(this.routeQuery == 'lever'){
                await allocationRevoke({ tradeId: itemData.tradeId });
                this.getCurrentLever();
            }else{
                await revoke({ tradeId: itemData.tradeId });
                this.$store.dispatch("getwalletAssetsLlist");
            }
            this.$toast("撤单成功");
        },
        // 全部撤单
        async revokeAll () {
            if(this.routeQuery == 'lever'){
                await allocationRevokeAll();
                this.getCurrentLever();
            }else{
                await revokeAll();
                this.$store.dispatch("getwalletAssetsLlist");
            }
            this.$toast("撤单成功");
        },
        // 下单
        submitTrade: _debounce(async function () {
            // 判断登录状态
            if(!this.token){
                this.$router.push('/login')
                return
            }
            // 判断实名认证 实名认证开关(1:开启,2:关闭) 1:'待审核,'2:'审核中',3:'已认证',4:'审核失败'
            if (this.appConfig.realNameSwitch === 1 && this.userInfo.realnameStatus !== 3) {
                return this.$toast("请先完成实名认证！");
            }
            if(this.routeQuery === 'lever' && !this.cLever){
                this.$router.push('/leverage')
                return
            }
            if(this.buyType === 1){
                if (!this.buyPrice || !Number(this.buyPrice)) {
                    return this.$toast("请输入价格")
                };
                if (!this.buyNumber || !Number(this.buyNumber)) {
                    return this.$toast("请输入数量")
                };
                if(this.buyNumber < this.symbolConfig.minOrders){
                    return this.$toast(`最少下单量为${this.symbolConfig.minOrders}`)
                }
            }
            if(this.buyType === 2){
                if ((!this.buyNumber || !Number(this.buyNumber)) && this.tradeMode === 1) {
                    return this.$toast("请输入总额")
                };
                if ((!this.buyNumber || !Number(this.buyNumber))  && this.tradeMode === 2) {
                    return this.$toast("请输入数量")
                };
                if(this.tradeMode === 1){
                    if(this.buyNumber < 5){
                        return this.$toast(`最少下单金额为5${this.coin.base}`)
                    }
                }else{
                    if(this.buyNumber < this.symbolConfig.minOrders){
                        return this.$toast(`最少下单量为${this.symbolConfig.minOrders}`)
                    }
                }
            }
            let total = this.tradeMode === 1 ? this.totalUsdt : this.buyNumber
            if ((this.cSymbolBanlance || 0) < total) {
                return this.$toast("可用余额不足");
            }
            let params = {
                entrustNums: this.buyNumber,
                entrustPrice: this.buyType === 2 ? 0 : this.buyPrice,
                tradeType: this.buyType,
                tradeDirection: this.tradeMode,
            };
            this.buyDisable = true;
            try {
                if (this.routeQuery === "lever") {
                    params.coin = this.symbol
                    params.allocationId = this.cLever.allocation_id
                    await submitAllocationTrade(params);
                    this.getCurrentLever();
                } else if (this.routeQuery === "spot") {
                    params.coins = this.symbol
                    await submitTrade(params);
                    this.$store.dispatch("getwalletAssetsLlist");
                }
                // this.buyNumber = this.$fomatFloat(0,this.symbolConfig.currencyAccuracy);
                this.buyNumber = ''
                this.$toast("下单成功");
                this.$refs.slider.buyNumberChange(0)
                this.tradingUsdt = ''
                this.buyDisable = false;
            } catch (error) {
                this.buyDisable = false;
            }
        }, 500),
        // 获取当前配资
        async getCurrentLever () {
            const { data } = await getCurrentLever({coins:this.symbolName});
            this.leverList = data.data || [];
        },
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
        // ws数据处理
        listenWSData (data) {
            if (data.type === "rank_b" || data.type === "rank_p") {//币币列表行情
                let val = JSON.parse(data.data)
                if(this.firstType){
                    // 获取基币数据非自选的第一条基币名称
                    const key = this.getMarketTab(val)[0]
                    let tempName = this.symbolName
                    if (key) {
                        this.$store.commit('SET_TRADE_BASE_COIN', key)
                        let list  = val[key].symbollist
                        if(list.length){
                            // 如果缓存中的币对不在币对列表中，则获取第一个
                            if (!_find(list, { quote: this.coin.quote.toUpperCase() })) {
                                tempName = list[0].symbol.toLowerCase()
                            }
                        }
                    }
                    let params = {
                        tradeType : this.routeQuery,
                        symbolName : tempName,
                    }
                    this.$store.commit('SET_USERSYMBOL', params)
                    this.firstType = false
                    this.subHandicap();
                    this.subOverview();
                    if (this.token && this.routeQuery === "lever") {
                        this.getCurrentLever();
                    }
                }
                this.$store.commit("SET_MARKET_LIST", val);
            }
            if (data.type === "detail") {//单币对行情
                this.overviewData = JSON.parse(data.data);
            }
            if (data.type === "handicap") {//盘口
                if (data.data) {
                    const wsData = JSON.parse(data.data);
                    let buyList = wsData.buy || [];
                    let sellList = wsData.sell || [];
                    let sNum  = sellList.reduce((prev, cur) => {
                        return prev + cur[1];
                    },0)
                    let bNum  = buyList.reduce((prev, cur) => {
                        return prev + cur[1];
                    },0)
                    buyList.forEach((v) => {
                        v[0] = this.$fomatFloat(v[0] ,this.symbolAccuracy)
                        v[1] = this.$numberFormat2(v[1] ,this.symbolConfig.currencyAccuracy)
                        v[2] = ((v[1] / bNum) * 100).toFixed(2)  
                    })
                    sellList.forEach((v) => {
                        v[0] = this.$fomatFloat(v[0] ,this.symbolAccuracy)
                        v[1] = this.$numberFormat2(v[1] ,this.symbolConfig.currencyAccuracy)
                        v[2] = ((v[1] / sNum) * 100).toFixed(2)  
                    })
                    this.buyList = buyList
                    this.sellList = sellList
                }
            }
            if (data.type === "entrust") {
                const { entrustList } = JSON.parse(data.data);
                if (entrustList) {
                    let list = entrustList.sort((a,b) => {
                        return b.createdAt - a.createdAt
                    })
                    this.tradeList = list;
                }else{
                    this.tradeList = []
                }
            }
        },
        //切换币种处理中心
        switchSymbol (newSymbol,type) {
            this.unsubOverview();
            this.unsubHandicap();
            this.unsubCoins()
            if (this.token) {
                //交易委托单
                this.unsuToken()
            }
            let tempName = newSymbol ? newSymbol.toLowerCase() : this.userSymbol[this.routeQuery] || ''
            this.$store.commit('SET_USERSYMBOL', {
                tradeType: this.routeQuery,
                symbolName: tempName
            })
            if(type){
                this.$store.commit('SET_TRADE_TYPE', type)
            }
            this.firstType = true
            this.init()
        },
        init(){
            worker.postMessage({ type: "CREATE_WEBSOCKET" });
            worker.onmessage = (ev) => {
                const { data } = ev;
                if (data.type === "WEBSOCKET_ON_OPEN") {
                    if (this.token) {
                        //交易委托单
                        this.subToken()
                    }
                    let optional = []
                    this.myStoreSymbols.forEach((v,index) => {
                        optional.push(v.symbol)
                    });
                    optional = optional.join('|')
                    // 全币种行情
                    this.subCoins(optional)
                }
                if (data.type === "WEBSOCKET_DATA") {
                    this.listenWSData(data.data);
                }
            };
        },
        delws(){
            this.unsubCoins()
            this.unsubHandicap();
            this.unsubOverview();
            if (this.token) {
                //交易委托单
                this.unsuToken()
            }
            worker.postMessage({ type: "CLOSE_WEBSOCKET" });
        },
        switchSymbolFun(newVal){
            this.switchSymbol(newVal);
            this.showSideBar = false
            this.buyNumber = this.$fomatFloat(0,this.symbolConfig.currencyAccuracy);
            this.$nextTick(() => {
                this.priceInput = false
            })
            this.$refs.slider.buyNumberChange(0)
        },
        toChart() {
            this.$store.commit('SET_SYMBOL', `${this.coin.quote}_${this.coin.base}`)
            this.$router.push({
                path: "/market/chart?type="+this.routeQuery
            });
        },
        getPopoverContainer() {
            return document.querySelector('.buy-type');
        },
        hiddenChange(){
            if(document.hidden) {
                this.delws()
            }else {
                this.firstType = true
                this.init()
            }
        }
    },
    created () {
        let params = this.$route.params
        if(params.type){
            this.$store.commit('SET_TRADE_TYPE', params.type)
        }
        if(params.symbolName){
            this.$store.commit('SET_USERSYMBOL', {
                tradeType: this.routeQuery,
                symbolName: params.symbolName
            })
        }
        // if(params.tradeMode){
        //     this.tradeMode = Number(params.tradeMode)
        // }
        if (this.token) {
            this.$store.dispatch("getwalletAssetsLlist");
        }
        this.$store.dispatch("set_usdt_cny");
        this.$nextTick(() => {
            this.$parent.$el.scrollTop = 0
        })
    },
    mounted () {
        this.init()
        document.addEventListener("visibilitychange", this.hiddenChange,false);
    },
    beforeDestroy () {
        document.removeEventListener('visibilitychange',this.hiddenChange,false);
        this.delws()
    },
    watch: {
        // showMask (newVal) {
        //     if (newVal) {
        //         document.body.style.overflow = "hidden";
        //     } else {
        //         document.body.style.overflow = "";
        //     }
        // },
        buyNumber () {
            this.priceInput = true;
        },
    },
};
</script>
<style lang="scss" scoped>
.tradeContainer{
    height: calc(100% - 50px);
    .nav {
        height: 48px;
        line-height: 48px;
        border-bottom: 1px solid #eff2f4;
        box-sizing: border-box;
        background: #fff;
        a,
        dl {
            padding: 0 11px;
            height: 100%;
            color: #555;
            font-size: 18px;
            font-weight: bold;
        }
        dl {
            transition: all 0.1s;
            margin-right: 15px;
            &.nav-active {
                color: $main-blue;
                font-size: 20px;
            }
        }
    }
    .container_box{
        height: calc(100% - 48px);
        overflow: auto;
    }
    .trade-panel {
        padding-bottom: 20px;
    }
    
    .trade-symbol {
        padding:0 16px;
        height: 54px;
        font-size: 14px;
        color: $main-font-c;
        .symbol-name {
            font-size: 16px;
            .iconyou1 {
                // font-size: 12px;
                margin-left: 8px;
                transform: rotateZ(90deg);
            }
        }
        .sym-cur-info {
            justify-content: space-between;
            span {
                &:nth-of-type(1) {
                    margin-right: 15px;
                }
                &:nth-of-type(2) {
                    margin-right: 15px;
                }
            }
            a {
                display: inline-block;
                width: 20px;
                height: 20px;
                .view-chart {
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    background: url("~@/assets/imgs/view-chart-icon.png") no-repeat;
                    background-size: contain;
                }
            }
        }
    }
    .trade-content {
        padding-left: 15px;
    }
    .trade-left {
        flex: 1;
        min-width: 180px;
        overflow: hidden;
        .trade-btn {
            .van-button {
                background: #c8cfd5;
                width: 48%;
                height: 28px;
                color: #fff;
                border-radius: 2px;
            }
        }
        .buy-type {
            margin: 10px 0;
            position: relative;
            border: 1px solid #c8cfd5;
            border-radius: 2px;
            .van-popover__wrapper{
                width: 100%;
            }
            ::v-deep.van-popover{
                width: 100% !important;
                .van-popover__action{
                    width: 100% !important;
                }
                .active{
                    color: $main-blue;
                }
            }
            .buy-type-current {
                padding: 0 10px;
                height: 26px;
                line-height: 26px;
                .iconsanjiao-top {
                    float: right;
                    margin-top: 6px;
                    font-size: 12px;
                }
                .lever-select {
                    overflow: hidden;
                    word-break: break-all;
                    flex: 1;
                    // @include ellipsis;
                }
            }
            .buy-type-select {
                width: 102%;
                max-height: 250px;
                overflow-y: scroll;
                padding: 4px 0;
                position: absolute;
                top: 30px;
                left: -2px;
                background: #fff;
                z-index: 10001;
                border-radius: 2px;
                li {
                    padding: 0 10px;
                    line-height: 30px;
                    color: #8c9fad;
                    &.option-active {
                        background: #f5f5f5;
                        color: $main-font-c;
                    }
                }
            }
        }
    }
    .buy-input {
        .cny {
            // margin: 6px 0 10px;
            text-align: right;
            font-size: 11px;
            color: #9b9b9b;
            line-height: 26px;
        }
    }
    .market-price-input {
        background: #e7ebee;
        height: 38px;
        line-height: 38px;
        text-align: center;
        color: #9b9b9b;
        border-radius: 2px;
        margin-bottom: 10px;
    }
    .limit-group {
        margin-top: 10px;
        height: 30px;
    }
    .total {
        margin: 10px 0;
        font-size: 12px;
        white-space: nowrap;
        em {
            margin-left: 16px;
        }
    }
    .balance {
        font-size: 11px !important;
        margin: 10px 0 14px;
        color: #9b9b9b;
        font-size: 12px;
    }
    .submit {
        width: 100%;
        height: 34px;
        line-height: 25px;
        text-align: center;
        border-radius: 2px;
        font-weight: 500;
        font-size: 18px;
        color: #fff;
        &:disabled {
            background: #c8cfd5 !important;
        }
    }
    
    .assets-trans {
        color: $main-font-c;
        font-size: 12px;
        display: inline-block;
    }
    .trade-right {
        flex: 0.8;
        margin-left: 20px;
        max-width: 155px;
        overflow-x: hidden;
        padding-right: 10px;
        .handicap-title {
            span {
                font-size: 12px;
            }
        }
        .handicap-sell {
            padding: 6px 0 10px;
        }
        .handicap-buy {
            padding-top: 6px;
            border-top: 1px solid #edeff3;
        }
    }
    .trande-order-header {
        padding: 0 16px;
        height: 48px;
        line-height: 48px;
        .header-left{
            font-size: 16px;
        }
        .hander-right {
            color: #9b9b9b;
            margin-right: -15px;
            a {
                color: #9b9b9b;
                padding: 0 15px;
            }
            dd {
                padding: 0 15px;
                position: relative;
                &:first-child {
                    &::before {
                        content: "";
                        display: inline-block;
                        width: 1px;
                        height: 15px;
                        background: #e6e6e6;
                        position: absolute;
                        right: 0;
                        top: 50%;
                        margin-top: -8px;
                    }
                }
            }
        }
    }
    .page-mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        background: rgba($color: #000000, $alpha: 0.2);
    }
}
</style>