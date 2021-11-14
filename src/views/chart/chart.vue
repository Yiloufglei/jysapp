<template>
  <div class="hqchart-test" ref="line_chart">
    <div ref='DivButtons' class="DivButtons" onselectstart="return false;" unselectable="on">
    </div>
    <div class="hqchart_box">
        <div id="kline" ref='DivKLine'></div>
        <van-loading size="44px" vertical color="#0094ff" v-if="loading">加载中...</van-loading>
        <div class="mask_info" :style="maskStyle">
            <p><span>时间</span><span>{{$formatDate(maskInfo.id,'/') || maskInfo.timeId}}</span></p>
            <p><span>开</span><span>{{maskInfo.Open}}</span></p>
            <p><span>高</span><span>{{maskInfo.High}}</span></p>
            <p><span>低</span><span>{{maskInfo.Low}}</span></p>
            <p><span>收</span><span>{{maskInfo.Close}}</span></p>
            <p><span>涨跌额</span><span :class="colorStyle(maskInfo.rate)">{{(maskInfo.rate > 0 ? '+' : '') + (maskInfo.rate)}}</span>
            </p>
            <p><span>涨跌幅</span><span :class="colorStyle(maskInfo.rate)">{{(maskInfo.rate > 0 ? '+' : '') + (maskInfo.rate / maskInfo.Open * 100).toFixed(2) + '%'}}</span>
            </p>
            <p><span>成交量</span><span>{{$numberFormat($fomatFloat(maskInfo.Vol, 2))}}</span></p>
        </div>  
    </div>
  </div>
</template>

<script>
import HQChart from 'hqchart'
// import 'hqchart/src/jscommon/umychart.resource/css/tools.css'
// import 'hqchart/src/jscommon/umychart.resource/font/iconfont.css'
import { worker } from "@/utils/webWorker.js";
import { Loading } from 'vant';
import { mapState, mapGetters } from 'vuex'
var JSCommon=HQChart.Chart;
function DefaultData() { }
// 禁用日志
HQChart.Chart.JSConsole.Chart.Log=()=>{ }
HQChart.Chart.JSConsole.Complier.Log=()=>{ }
DefaultData.GetMainPictureMenu=function() //指标菜单配置
{
    var data=   //ID=指标ID Name=菜单显示的名字  WindowIndex=切换指标对应的窗口索引
    [
        {Name:'BOLL', ID:'BOLL', WindowIndex:0 },
        {Name:'MA', ID:'MA', WindowIndex:0 },
    ];
    return data;
}
DefaultData.GetAttachedFiguresMenu=function() //指标菜单配置
{
    var data=   //ID=指标ID Name=菜单显示的名字  WindowIndex=切换指标对应的窗口索引
    [
        {Name:'VOL', ID:'VOL', WindowIndex:1 },
        {Name:'KDJ', ID:'KDJ', WindowIndex:1 },
        {Name:'MACD', ID:'MACD', WindowIndex:1 },
        {Name:'RSI', ID:'RSI', WindowIndex:1 },
    ];
    return data;
}
DefaultData.GetKLineOption=function(){
    //K线配置信息
    var option=  {
        Type:'历史K线图',   //创建图形类型
        CorssCursorInfo:{
            Left:0, 
            Right:2, 
            Bottom:1, 
            IsShowCorss:true, 
            // VPenType:2, 
            HPenType:0, 
            PressTime: 300
        },  //十字光标刻度设置
        Windows: //窗口指标
        [
            {
                Index:'MA',
                IsShowTitleArraw:false,
                IndexParamSpace: 10,
                IsShowIndexName: false,
                Args:[{ Name:'M1', Value: 5}, { Name:'M2', Value: 10 }, { Name:'M3', Value: 30} ],
                OutName:[ {Name:'MA1',DynamicName:"MA{M1}" },  {Name:'MA2',DynamicName:"MA{M2}" },{Name:'MA3',DynamicName:"MA{M3}" }],
                Close: false,
                Modify: false,
                Change: false
            },
            {
                Index:"VOL", 
                Identify:'myvol',
                IsShowTitleArraw:false,
                IndexParamSpace: 10,
                IsShowIndexName: false,
                Close: false,
                Modify: false,
                Change: false,
                IsShowXLine: false,
                IsShowYLine: false,
                IsShowRightText: false
            },
        ], 

        IsAutoUpdate: true,              //是自动更新数据
        AutoUpdateFrequency:1000,       //数据更新频率
        IsShowRightMenu:false,          //右键菜单

        IsApiPeriod:true,             //复权,周期都使用后台数据
        IsCorssOnlyDrawKLine: true,
        CorssCursorTouchEnd: true,
        IsClickShowCorssCursor:true,
        EnableScrollUpDown:true,
        EnableRemoveZero: false, // 所有Y轴显示刻度如果小数位后面是0， 就抹去0。 默认是开启的
        StepPixel:0,        //移动一个K线需要的手势移动的像素(默认4)
        //ZoomStepPixel:8,    //缩放一次,2个手指需要移动的间距像素(默认5)
        IsShowCorssCursorInfo:true,    //是否显示十字光标的刻度信息
        KLine:  //K线设置
        {
            DragMode:1,                 //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
            Right:0,                    //复权 0 不复权 1 前复权 2 后复权
            Period: 4,                   //周期 0 日线 1 周线 2 月线 3 年线 分钟线 20001 1分钟 20002 2分钟 类推  40003 3日 40004 4日 类推
            MaxReqeustDataCount:1000,    //数据个数
            MaxRequestMinuteDayCount:10, //分钟数据取5天
            PageSize:30,                 //一屏显示多少数据
            IsShowTooltip:false,          //是否显示 div K线提示信息 (手机端要填false)
            DrawType:0,                   //K线类型 0=实心K线柱子 1=收盘价线 2=美国线 3=空心K线柱子 4=收盘价面积图
            RightSpaceCount:8,
            KLineDoubleClick:false, //禁止双击弹框
        },

        KLineTitle: //标题设置
        {
            IsShowName: false,       //不显示股票名称
            IsShowSettingInfo: false //不显示周期/复权
        },
        // BorderLine: '2|8',
        Border: //边框
        {
            Left:0,         //左边间距
            Right: 0,       //右边间距
            Bottom:25,      //底部间距
            Top:0          //顶部间距
        },
        
        Frame:  //子框架设置
        [
            {   
                SplitType:1,
                // YCoordinateType:2,
                // SplitCount:8,
                // BorderLine:false,
                IsShowLeftText:false,
                // IsShowXLine:false,IsShowYLine:false,
                // FrameSplitPen: "red",          //分割线
                // FrameSplitTextColor: "red",     //刻度文字颜色
                // FrameTitleBGColor: "red",      //标题栏背景色
                Height:8,
                Custom:[
                    { 
                        Type:0,
                        Position:'right',
                    }
                ]
            },
            {
                SplitCount:2,
                IsShowIndexName: false,
                IsShowLeftText: false,
                IsShowRightText: false,
                Height:2,
                // IsShowXLine: false,
                // IsShowYLine: false
            },
        ],
        // EnableYDrag:
        // {
        //     Right:true,  //右边Y轴是否可以拖拽
        //     Left:true,   //左边Y轴是否可以拖拽
        // },
        ExtendChart:    //扩展图形
        [
            // {Name:'KLineTooltip' }  //手机端tooltip
        ],
        EnableFlowCapital:
        {
            BIT:false,
        },
        DragDownload: { 
            Minute: { Enable:true },    //开启分钟数据拖拽下载
            Day: { Enable:true }        //开启日线数据拖拽下载
        },
        // EventCallback: [{
        //     event: 'ON_DRAW_KLINE_LAST_POINT',
        //     callback: function(res, test) {
        //         console.log(res)
        //     }
        // }]
    };

    return option;
}
export default {
    name: 'HQChartDemo',
    props: {
        symbolName: {
            type: String,
            default: "btcusdt"
        },
        splitSymbol: {
            type: String,
            default: "btc/usdt"
        },
        period: {
            type: Number | String,
            default: 6
        },
        chartType: {
            type: String,
            default: 'kline'
        },
    },
    data() {
        return {
            loading:true,
            isShowMask:false,
            maskInfo:{},
            HQChartData: {
                Symbol:'BTCUSDT.BIT',  //代码
                Chart:null,          //图形控件
            },
            DivApp: null,
            DivKLine: null,
            DivButtons: null,
            identifyId:'',
            TestCount: 0,
            Cache: [],
            // symbolName: 'btcusdt',
            //1分钟历史更新回调
            UpdateHistoryMinuteData: null,
            //1分钟增量数据更新回调
            UpdateMinuteData: null,
            // 日线历史更新回调
            UpdateHistoryData: null,
            // 日线增量数据更新回调
            UpdateRealtimeData: null,
            historyData: [],
            // 当前K线周期
            currentPeriod: 0,
            // 上一个K线周期
            lastPeriod: 0,
            // 日线拖拽历史数据回调
            dragDayData: null,
            // 分钟拖拽历史数据回调
            dragMinuteData: null,
            // 历史数据第一条
            historyFirst: null,
            // case 0:     //日线
            // case 1:     //周
            // case 2:     //月
            // case 3:     //年
            // case 9:     //季线
            // case 21:    //双周
            // case 4:     //1分钟
            // case 5:     //5分钟
            // case 6:     //15分钟
            // case 7:     //30分钟
            // case 8:     //60分钟
            // case 11:    //2小时
            // case 12:    //4小时
            periodMap: {
                0: '1day',
                1: '1week',
                2: '1mon',
                4: '1min',
                5: '5min',
                6: '15min',
                7: '30min',
                8: '60min',
                11: '2hour',
                12: '4hour'
            },
            // 分时走势
            minuteData: null,
            clientW:document.documentElement.clientWidth,
            LastPointX:0,
            PointColorID: 0,
            SpanPoint: null,
            // 精度
            MARKET_SUFFIX_NAME: 2,
            MainPictureMenuIndex: {
                Menu:DefaultData.GetMainPictureMenu(),       //菜单项
                SelItem:DefaultData.GetMainPictureMenu()[0],
                IsShow:true,
            },
            AttachedFiguresMenuIndex: {
                Menu:DefaultData.GetAttachedFiguresMenu(),       //菜单项
                SelItem:DefaultData.GetAttachedFiguresMenu()[0],
                IsShow:true,
            },
            MainPictureIndex:'',
            AttachedFiguresIndex:'',
            mainFrameHeight: 0,
            firstType: true, //首次进去页面
        }
    },
    components:{
        [Loading.name]: Loading,
    },
    computed:{
        maskStyle () {
            if(this.isShowMask){
                if((this.LastPointX / 2) > (this.clientW * 0.5)){
                    return 'left:5px; display: block'
                }
                return 'right:5px; display: block'
            }
        },
        ...mapGetters(["usdt_cny"]),
        ...mapState({
            appConfig: (state) => state.appConfig,
            coinConfig: (state) => state.coinConfig,
            myStoreSymbols: (state) => state.user.mySymbols,
        }),
        symbolAccuracy () {
            return this.coinConfig.info[this.splitSymbol] && this.coinConfig.info[this.splitSymbol].basicCoinAccuracy || 2
        },
        symbolRmbAccuracy () {
            return this.coinConfig.info[this.splitSymbol] && this.coinConfig.info[this.splitSymbol].rmbAccuracy || 2
        },
    },
    mounted() {
        window.onresize = ()=>{ this.OnSize() }
        this.OnSize()
        this.CreateKLineChart(this.period)
        this.init()
        this.DivTitle = document.getElementsByClassName('mask_info')[0]
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    },
    methods: {
        //设置指标窗口个数
        ChangeIndexWindowCount (count) {
            let chart=this.HQChartData.Chart.JSChartContainer; //获取内部K线控件
            chart.ChangeIndexWindowCount(count)
        },
        ChangeMainPictureMenuIndex(item)  {
            if (this.HQChartData.Chart) {
                // let flag = (this.MainPictureIndex === item.ID || this.MainPictureIndex === "") ? 'EMPTY' :  item.ID
                this.HQChartData.Chart.ChangeIndex(0,item.ID);
                // if(flag === 'EMPTY'){
                //     this.MainPictureIndex = 'EMPTY'
                // }else{
                //     this.MainPictureIndex = item.ID
                // }
            }
        },
        ChangeAttachedFiguresIndex(item){
            if (this.HQChartData.Chart) {
                // let flag = (this.AttachedFiguresIndex === item.ID || this.AttachedFiguresIndex === "") ? 'EMPTY' :  item.ID
                this.HQChartData.Chart.ChangeIndex(1,item.ID);
                // if(flag === 'EMPTY'){
                //     this.AttachedFiguresIndex = 'EMPTY'
                // }else{
                //     this.AttachedFiguresIndex = item.ID
                // }
            }
        },
        Modify(val) {
            var kline = this.HQChartData.Chart.JSChartContainer
            const maData = {
                'M1': 5,
                'M2': 10,
                'M3': 30
            }
            for (let index = 0; index < kline.WindowIndex.length; index++) {
                let item = kline.WindowIndex[index]
                if(item.Arguments && item.Arguments.length) {
                    item.Arguments.map(subItem => {
                        subItem.Value = val ? maData[subItem.Name] : 0;
                    })
                }
                kline.UpdateWindowIndex(index)
            }
            const options = {
                Windows: //窗口指标
                [
                    {
                        Index:"VOL", 
                        IsShowTitleArraw:false,
                        IndexParamSpace: 10,
                        IsShowIndexName: false,
                        IsShowLeftText: false,
                        IsShowRightText: false,
                        Close: false,
                        Modify: false,
                        Change: false,
                        IsShowXLine: false,
                        IsShowYLine: false
                    },
                ],
            }
            // DefaultData.GetKLineOption()
            kline.ChangeIndexWindowCount(val ? 2 : 1, options);
            this.OnCreatedHQChart(this.HQChartData.Chart.JSChartContainer)
            // this.OnSize()
            // this.HQChartData.Chart.Frame.CalculateChartBorder()
            // this.HQChartData.Chart.Frame.SetSizeChage(true);
        },
        undateKline(Value){
            if(!this.identifyId){
                var option={
                    WindowIndex:0, 
                    IndexName:Value, 
                    Identify:"guid_66991"
                };
                this.HQChartData.Chart.AddOverlayIndex(option);
                this.identifyId = option.Identify
            }else{
                this.identifyId = ''
                this.HQChartData.Chart.DeleteOverlayWindowsIndex('guid_66991')
            }
        },
        colorStyle (data) {
            return data > 0 ? 'buy-color' : "sell-color";
        },
        UpdateTitle(event, data, obj){
            var klineItem=data.Draw;
            //手是否在屏幕上
            this.isShowMask = false
            if (this.HQChartData.Chart.JSChartContainer.IsOnTouch==true && event.FunctionName=='DrawDynamicInfo'){
                this.LastPointX = this.HQChartData.Chart.JSChartContainer.LastPoint.X
                let drawObj = data.Draw
                // toFixed 只能处理正数科学计数法
                if (drawObj.Close < drawObj.Open) {
                    drawObj.rate = '-'+((drawObj.Open - drawObj.Close).toFixed(this.symbolAccuracy))
                } else {
                    drawObj.rate = (drawObj.Close - drawObj.Open).toFixed(this.symbolAccuracy)
                }
                let ym = String(drawObj.Date)
                let hms = String(drawObj.Time)
                hms = hms.length === 3 ? ('0' + hms) : hms
                let ms = drawObj.Time ? `${hms.slice(0,2)}:${hms.slice(2,4)}:00` : '00:00:00'
                var time = `${ym.slice(0,4)}-${ym.slice(4,6)}-${ym.slice(6,8)} ${ms}`;
                var timeId = Date.parse(new Date(time)) / 1000;
                drawObj.id = timeId
                drawObj.timeId = time
                this.maskInfo = drawObj
                this.isShowMask = true
            }
        },
        init(){
            //初始连接
            worker.postMessage({ type: "CREATE_WEBSOCKET" });
            worker.onmessage = (ev) => {
                const { data } = ev;
                //已有ws链接
                if (data.type === "WEBSOCKET_ON_OPEN") {
                    this.subCoinInfo(this.symbolName)
                    // 全币种行情
                    let optional = []
                    this.myStoreSymbols.forEach((v, index) => {
                        optional.push(v.symbol)
                    });
                    optional = optional.join('|')
                    this.subCoins(optional)
                    // 获取历史数据
                    this.getHistoryBars(this.currentPeriod)
                }
                if (data.type === "WEBSOCKET_DATA") {
                    this.listenWSData(data.data);
                }
            };
        },
        timeDifference(){
            return 0
        },
        listenWSData(data) {
            if (data.data && data.type === "history") {
                const wsData = JSON.parse(data.data);
                const klineType = Object.keys(wsData);
                let datas = [];
                for (let d of wsData[klineType]) {
                    if (d) {
                        datas.push(d);
                    }
                }
                // 加载历史k线数据
                let callbackData = JSON.parse(JSON.stringify(datas))
                // console.log([20200107,12.52,12.52,12.53,12.52,12.52,40346,505192,1037])
                this.RecvHistoryMinuteData(callbackData)
                this.loading =false
                // 如果不是第一次请求K线历史数据 直接返回
                if (this.historyFirst) {
                    this.historyFirst = datas[0]
                    return
                }
                this.historyFirst = datas[0]
                //获取k线实时数据
                this.subscribeBars(this.currentPeriod)
            }
            if (data.data && data.type === "kline") {
                const wsData = JSON.parse(data.data);
                const klineType = Object.keys(wsData);
                const d = wsData[klineType][0];
                if (!d) {
                    return false
                }
                this.RecvMinuteRealtimeData([d])
            }
            if (data.data && data.type === "detail") {
                let obj = JSON.parse(data.data)
                obj.amount = parseInt(obj.amount)
                obj.vol = (obj.vol * (this.appConfig.coins || 1))
                obj.close = this.$fomatFloat(obj.close, this.symbolAccuracy)
                obj.high = this.$fomatFloat(obj.high, this.symbolAccuracy)
                obj.low = this.$fomatFloat(obj.low, this.symbolAccuracy)
                obj.tolRmb = this.$fomatFloat((obj.close * this.usdt_cny), this.symbolAccuracy)
                this.$store.commit('SET_KLINE_OVERDATA', obj)
            }
            if (data.data && data.type === "trade_history") {
                let list = JSON.parse(data.data) || []
                this.$store.commit('SET_DEAL_DATA', list)
                const sendData = { operate: "trade", data: { coin: this.symbolName } }
                worker.postMessage({ type: "TRADE", data: sendData });
            }
            if (data.data && data.type === "trade") {
                let list = this.$store.state.wsData.dealData || []
                let obj = JSON.parse(data.data) || {}
                list.unshift(obj)
                list.pop()
                this.$store.commit('SET_DEAL_DATA', list)
            }
            if (data.data && (data.type === "rank_b" || data.type === "rank_p")) {//币币列表行情
                let val = JSON.parse(data.data)
                if (this.firstType) {
                    // 获取基币数据非自选的第一条基币名称
                    const key = this.getMarketTab(val)[0]
                    this.firstType = false
                    this.$store.commit('SET_TRADE_BASE_COIN', key)
                }
                this.$store.commit("SET_MARKET_LIST", val);
            }
        },
        getMarketTab (data) {
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
        subCoinInfo (coin) {
            // 发起推送
            worker.postMessage({ type: "OVERVIEW", data: { coin }, });
            worker.postMessage({ type: "TRADEHISTORY", data: { operate: "trade_history", data: { coin } } });
        },
        unsubCoinInfo (coin) {
            // 关闭推送
            worker.postMessage({ type: "UNSUB", data: { operate: "deldetail", data: { coin }, }, });
            worker.postMessage({ type: "TRADE", data: { operate: "deltrade", data: { coin } } });
            // 清空数据，防止下次进来显示历史数据
            this.$store.commit('SET_KLINE_OVERDATA', {})
            this.$store.commit('SET_DEAL_DATA', [])
        },
        subCoins (optional) {
            // 行情
            if (this.type == 'lever') {
                worker.postMessage({ type: "MARKETP", data: { optional: optional } });
            } else {
                worker.postMessage({ type: "MARKETB", data: { optional: optional } });
            }
        },
        OnSize() {
            // var app= this.DivApp.value;
            // console.log(app.value);
            // var height= app.offsetHeight;
            // var width = app.offsetWidth;
            // console.log(`[HQChartDemo::OnSize] width=${width} height=${height}`); 
            var DivButtons = this.$refs.DivButtons;
            // //获取屏幕大小 动态设置K线的div大小
            var kline= this.$refs.DivKLine;
            kline.style.width=DivButtons.offsetWidth+'px';
            kline.style.height=document.getElementsByClassName('hqchart_box')[0].offsetHeight + 'px'
            if (this.HQChartData.Chart) this.HQChartData.Chart.OnSize();
        },
        ClearChart() {
            if (this.HQChartData.Chart)
            {
                this.HQChartData.Chart.StopAutoUpdate();
                this.HQChartData.Chart=null;
            }
            this.DivKLine=document.getElementById('kline');
			while (this.DivKLine.hasChildNodes()) 
			{
                this.DivKLine.removeChild(this.DivKLine.lastChild);
			}
        },
        CreateKLineChart(period) {
            this.currentPeriod = period
            this.ClearChart();
            var option=DefaultData.GetKLineOption();
            if(this.chartType === 'minute'){
                option.KLine.DrawType = 4;
                // option.Windows = [];
            }
            option.Symbol=this.HQChartData.Symbol;
            option.Period=period;
            this.DivKLine=document.getElementById('kline');
            //黑色风格设置, 默认是白色风格
            var blackStyle=JSCommon.HQChartStyle.GetStyleConfig(JSCommon.STYLE_TYPE_ID.BLACK_ID);
            HQChart.Chart.JSChart.SetStyle(blackStyle);
            this.DivKLine.style.backgroundColor="rgb(0,0,0)";
            
            var resource= HQChart.Chart.JSChart.GetResource()
            //最高最低值显示配置
            resource.CorssCursorVPenColor="rgba(130,130,130,0.6)";	//修改垂直线颜色
            resource.KLine.MaxMin.Font="32px 微软雅黑";
            resource.KLine.MaxMin.HighYOffset=20;
            resource.KLine.MaxMin.LeftArrow="—"
            resource.KLine.MaxMin.RightArrow="—"
            resource.KLine.MaxMin.LowYOffset=-20;
            resource.UpBarColor = 'rgb(3, 173, 143)'
            resource.DownBarColor = 'rgb(209, 75, 100)'
            resource.BGColor = "rgb(0,0,0)"
            resource.FrameTitleBGColor =  "rgb(0,0,0)"
            resource.UpTextColor = 'rgb(3, 173, 143)'
            resource.DownTextColor = 'rgb(209, 75, 100)'
            resource.UnchagneBarColor = 'rgb(3, 173, 143)'
            // 分时图配色
            resource.CloseLineColor = 'rgb(78,130,243)'
            resource.CloseLineAreaColor=['rgba(78,130,243,0.6)','rgba(78,130,243,0.05)']
            //Y轴最新价格刻度颜色
            resource.FrameLatestPrice = {
                TextColor:'rgb(255,255,255)',   //最新价格文字颜色
                UpBarColor:"rgb(3, 173, 143)",    //上涨
                DownBarColor:"rgb(209, 75, 100)",   //下跌
                UnchagneBarColor:"rgb(3, 173, 143)",   //平盘
                BGAlpha:0.6		// 刻度文字显示在坐标内部，背景的透明度
            };
            resource.FrameBorderPen = "rgba(19,30,50,0.8)"     //边框.
            resource.FrameSplitPen = "rgba(19,30,50,0.8)"          //分割线
            var chart=HQChart.Chart.JSChart.Init(this.DivKLine);
            option.NetworkFilter=(data, callback)=> { this.NetworkFilter(data, callback); } ;
            // option.StepPixel = 18
            // option.OnCreatedCallback = (chart) => { this.OnCreatedHQChart(chart); }
            chart.SetOption(option);
            // 设置精度
            this.setBITDecimal()
            this.HQChartData.Chart = chart;
            this.mainFrameHeight = chart.JSChartContainer.Frame.SubFrame[0].Frame.ChartBorder.GetHeight()
            // 设置Y周刻度为 等分类型
            this.HQChartData.Chart.JSChartContainer.ChangeCoordinateType({
                Type: 4
            })
            // 标题信息绘制事件
            this.HQChartData.Chart.AddEventCallback(
                {
                    event:HQChart.Chart.JSCHART_EVENT_ID.ON_TITLE_DRAW, 
                    callback:(event, data, obj)=>{
                        this.UpdateTitle(event, data, obj); 
                    }
                }
            );
            // 监听最后一根K线
            this.HQChartData.Chart.AddEventCallback({
                event: HQChart.Chart.JSCHART_EVENT_ID.ON_DRAW_KLINE_LAST_POINT,
                callback: (event, data, obj)=>{ this.OnDrawLastPoint(event, data, obj); }
            });
        },
        OnCreatedHQChart (chart) {
            //计算每个子窗口大小高度
            var frame=chart.Frame;
            frame.CalculateChartBorder=()=> { this.CalculateChartBorder(frame); }
        },
        CalculateChartBorder (frame) {
            if (frame.SubFrame.length<=0) return;   //0个窗口指标
            var bottom=frame.ChartBorder.GetChartHeight();  //底部
            var top=frame.ChartBorder.GetTop();             //顶部   
            var height=frame.ChartBorder.GetHeight(); //所有指标窗口的高度
            var mainHeight= frame.SubFrame.length === 1 ? height : this.mainFrameHeight; //主窗口350固定高
            var count=frame.SubFrame.length;
            var item=frame.SubFrame[0];
            item.Frame.ChartBorder.Top=top; //顶部间距
            item.Frame.ChartBorder.Left=frame.ChartBorder.Left;
            item.Frame.ChartBorder.Right=frame.ChartBorder.Right;
            item.Frame.ChartBorder.LeftExtendWidth=frame.ChartBorder.LeftExtendWidth;
            item.Frame.ChartBorder.RightExtendWidth=frame.ChartBorder.RightExtendWidth;
            item.Frame.ChartBorder.Bottom=bottom-mainHeight-top; //底部间距
            top+=mainHeight;

            if (count-1>0)
            {
                var frameHeight=(height-mainHeight)/(count-1); //附图窗口平分剩下的高度
                for(var i=1; i<frame.SubFrame.length; ++i)
                {
                    var item=frame.SubFrame[i];
                    item.Frame.ChartBorder.Top=top; //顶部间距
                    item.Frame.ChartBorder.Left=frame.ChartBorder.Left;
                    item.Frame.ChartBorder.Right=frame.ChartBorder.Right;
                    item.Frame.ChartBorder.LeftExtendWidth=frame.ChartBorder.LeftExtendWidth;
                    item.Frame.ChartBorder.RightExtendWidth=frame.ChartBorder.RightExtendWidth;
                    item.Frame.ChartBorder.Bottom=bottom-top-frameHeight; //底部间距
                    top+=frameHeight;
                }
            }
        },
        OnDrawLastPoint(event, data, obj) {
            // console.log('[KLineChart::OnDrawLastPoint] event, data', event , data);
            if (data.LastPoint && data.LastPoint.X>0 && data.LastPoint.Y>0)
            {
                if (!this.SpanPoint)
                {
                    this.SpanPoint=document.createElement("span");
                    this.SpanPoint.id='flash_point';
                    this.SpanPoint.className="js-iconfont icondian";
                    this.DivKLine.appendChild(this.SpanPoint);
                }

                var pixelTatio = HQChart.Chart.GetDevicePixelRatio(); //获取设备的分辨率
                var point=data.LastPoint;
                var imageSize=8; //图片大小
                //居中
                this.SpanPoint.style.left=point.X/pixelTatio-imageSize/2+'px';
                this.SpanPoint.style.top=point.Y/pixelTatio-imageSize/2+'px';
                this.SpanPoint.style.display='inline';
            }
            else
            {
                if (this.SpanPoint) this.SpanPoint.style.display='none';
            }
        },
        // 切换K线周期
        ChangePeriod(period, type = 'kline') {
            if (period === this.currentPeriod && this.chartType === type) return
            this.loading = true
            if (this.SpanPoint) this.SpanPoint.style.display='none';
            // 0-k线图，4 面积图（分时走势）
            this.HQChartData.Chart.ChangeKLineDrawType(type === 'minute' ? 4 : 0)
            // 切换周期
            this.HQChartData.Chart.ChangePeriod(period);
            this.Modify(type !== 'minute')
            
            this.historyFirst = null
            this.historyData = []
            //终止推送
            this.unsubscribeBars(this.currentPeriod, this.symbolName)
            // 赋值新的周期
            this.currentPeriod = period
            // 获取新的周期历史数据
            this.getHistoryBars(period)
        },
        getHistoryBars(period, to = '') {
            let data = {
                coin: this.symbolName,
                step: this.periodMap[period]
            }
            if (to) data.to = to
            worker.postMessage({ type: "KLINE", data: {
                data,
                operate: "history"
            }});
        },
        // 订阅k线
        subscribeBars(period) {
            worker.postMessage({ type: "KLINE", data: {
                data: {
                    coin: this.symbolName,
                    step: this.periodMap[period],
                    group: "kline"
                },
                operate: "bindgroup"
            }});
        },
        // 取消K线实时订阅
        unsubscribeBars(period,oldSymbol) {
            worker.postMessage({ type: "KLINE", data: {
                data: {
                    coin: oldSymbol || this.symbolName,
                    step: this.periodMap[period],
                    group: "kline"
                },
                operate: "exitgroup"
            }});
        },
        // 切换币种
        changeSymbol(symbol,oldSymbol) {
            this.loading  =true
            // 取消其他订阅
            this.unsubscribeBars(this.currentPeriod,oldSymbol)
            this.historyFirst = null
            this.historyData = []
            // 开启当前币种订阅
            // this.symbolName = symbol.toLowerCase() + 'usdt'
            this.HQChartData.Symbol = symbol.toUpperCase()+'.BIT';
            this.HQChartData.Chart.ChangeSymbol(this.symbolName);
            // 设置精度
            this.setBITDecimal()
            this.getHistoryBars(this.currentPeriod)
        },
        setBITDecimal() {
            HQChart.Chart.MARKET_SUFFIX_NAME.GetBITDecimal=(symbol)=> { return this.symbolAccuracy; }
        },
        NetworkFilter(data, callback) {
            console.log('[NetworkFilter] data', data);
            data.PreventDefault=true;
            // if (!this.UpdateMinuteData) this.UpdateMinuteData = callback
            switch(data.Name)
            {
                case 'KLineChartContainer::ReqeustHistoryMinuteData':   //1分钟全量数据下载
                    this.UpdateHistoryMinuteData = callback
                    break;
                // case 'KLineChartContainer::RequestMinuteRealtimeData':  //1分钟增量数据更新
                //     this.RequestMinuteRealtimeData(data,callback);
                //     break;
                case 'KLineChartContainer::RequestHistoryData':     //日线全量数据下载
                    this.UpdateHistoryMinuteData = callback
                    break;
                // case 'KLineChartContainer::RequestRealtimeData':    //日线增量数据更新
                //     this.RequestRealtimeData(data,callback);
                //     break;
                case 'KLineChartContainer::RequestDragMinuteData':    // 分钟拖拽下载历史数据
                    this.RequestDragMinuteData(data,callback)
                    break;
                case 'KLineChartContainer::RequestDragDayData':    // 日线拖拽下载历史数据
                    this.RequestDragDayData(data,callback)
                    break;
            }
        },
        RequestDragMinuteData(data,callback) {
            this.dragMinuteData = callback
            this.getDragData()
        },
        RequestDragDayData(data,callback) {
            this.dragDayData = callback
            this.getDragData()
        },
        getDragData() {
            let dataTo = ''
            if (this.historyFirst && this.historyFirst.id) dataTo = String(this.historyFirst.id)
            this.getHistoryBars(this.currentPeriod, dataTo)
        },
        RecvHistoryMinuteData(data) {
            // 历史K线数据
            var hqChartData={code:0, data:[]};
            hqChartData.symbol= `${this.symbolName.toUpperCase()}.BIT`;
            hqChartData.name= this.symbolName.toUpperCase();
            var yClose=null;
            let tempData = []
            for(var i=0; i<data.length; i++){
                var item=data[i];
                var timestamp = item.id;
                var dateTime = new Date();
                dateTime.setTime(timestamp * 1000);
                var date=dateTime.getFullYear()*10000+(dateTime.getMonth()+1)*100+dateTime.getDate();
                var time=dateTime.getHours()*100+dateTime.getMinutes();
                // let timeId = item.id
                var newItem=[date,yClose, item.open, item.high, item.low, item.close, (item.amount * (this.appConfig.coins || 1)), item.amount, time];
                yClose=item.close;
                tempData.push(newItem);
            }
            hqChartData.data = tempData
            if (this.historyData.length) {
                // 存在历史数据 表示为拖拽加载分页
                // 判断是日线还是分线
                let dayArr = [0,1,2,3]
                const actions = dayArr.indexOf(this.currentPeriod) !== -1 ? this.dragDayData : this.dragMinuteData
                actions(hqChartData)
            } else {
                this.UpdateHistoryMinuteData(hqChartData);
            }
            this.historyData = hqChartData.data
            this.Modify(this.chartType !== 'minute')
        },
        RecvMinuteRealtimeData(data) {
            var hqChartData={code:0, data:[], ver:2.0 };
            hqChartData.symbol= `${this.symbolName.toUpperCase()}.BIT`;
            hqChartData.name= this.symbolName.toUpperCase();
            var yClose=null;
            for(var i=0; i<data.length; i++)
            {
                var item=data[i];
                var timestamp = item.id;
                var dateTime = new Date();
                dateTime.setTime(timestamp * 1000);

                var date=dateTime.getFullYear()*10000+(dateTime.getMonth()+1)*100+dateTime.getDate();
                var time=dateTime.getHours()*100+dateTime.getMinutes();
                var newItem=[date,yClose, item.open, item.high, item.low, item.close, (item.amount * (this.appConfig.coins || 1)), item.amount, time];

                yClose=item.close;
                hqChartData.data.push(newItem);
            }
            // 更新K线数据
            this.HQChartData.Chart.JSChartContainer.RecvMinuteRealtimeData(hqChartData)
        },
        UpdateCustomY(){
            //修改指标1上Y轴自定义刻度
            this.HQChartData.Chart.JSChartContainer.Frame.SubFrame[0].Frame.YSplitOperator.Custom=
            [
                { 
                    Type:1, 
                    Position:'left',IsShowLine:true,
                    Data:
                    [
                        {
                            Value:32500.55,
                            Color:'rgb(255,185,255)', TextColor:'rgb(255,255,255)',    //Color:线段及文字背景色 TextColor:文字颜色
                        },
                        {
                            Value:32550.31,
                            Color:'rgb(255,185,0)', TextColor:'rgb(255,255,255)',    //Color:线段及文字背景色 TextColor:文字颜色
                        },
                    ] 
                },
                { 
                    Type:0,
                    Position:'right',
                }
            ];
        
            this.HQChartData.Chart.JSChartContainer.UpdateFrameMaxMin();	//重新计算最大最小值
            this.HQChartData.Chart.JSChartContainer.ResetFrameXYSplit();	//重新计算X，Y刻度
            this.HQChartData.Chart.JSChartContainer.Draw();					//重绘
        }
    },
    watch: {
        symbolName (val, oldVal) {
            // 如果币对发生更改 并且TV实例已经存在
            if (val !== oldVal && this.HQChartData.Chart) {
                // 关闭旧币对相关推送
                this.unsubCoinInfo(oldVal)
                this.subCoinInfo(val)
                this.changeSymbol(val,oldVal)
                this.$emit('coinProfile')
            }
        }
    },
    beforeDestroy() {
        this.unsubCoinInfo(this.symbolName)
        worker.postMessage({ type: "CLOSE_WEBSOCKET" });
    }
}
</script>
<style lang="scss" scoped>
.hqchart-test{
    -webkit-touch-callout:none; /*系统默认菜单被禁用*/
    -webkit-user-select:none; /*webkit浏览器*/
    -khtml-user-select:none; /*早期浏览器*/
    -moz-user-select:none;/*火狐*/
    -ms-user-select:none; /*IE10*/
    user-select:none; 
    height: 100%;
}
.hqchart_box{
    width: 100%;
    // height: 400px;
    height: 100%;
    position: relative;
    .van-loading{
        background: rgba($color: #000000, $alpha: 1.0);
        position: absolute;
        height: 400px;
        width: 100%;
        top: 0;
        left: 0;
        justify-content: center;
    }
}
.mask_info {
    padding: 5px;
    min-width: 120px;
    color: #fff;
    background: rgba($color: #000000, $alpha: 0.7);
    border-radius: 5px;
    position: absolute;
    top: 25px;
    border: 0.5px solid #999999;
    z-index: 888;
    // opacity: 0;
    display: none;
    transition: all .8s;
    P {
        display: flex;
        font-size: 10px;
        height: 18px;
        align-items: center;
        justify-content: space-between;
        span {
            &:nth-child(1) {
                margin-right: 20px;
            }
        }
    }
    -moz-user-select:none;
    -webkit-user-select:none;
    user-select:none;
}
</style>