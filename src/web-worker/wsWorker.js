export default function () {
    const wsUrl = process.env.VUE_APP_WS_HOST + "?systemId=market"
    let webSocket = null
    let clientId = null

    function sendMessage(type, data) {
        self.postMessage({
            type,
            data
        })
    }

    function pakageData(data) {
        data.clientId = clientId
        return JSON.stringify(data)
    }

    self.onmessage = function (ev) {
        const {
            data
        } = ev
        // console.log('worker event:', data)
        switch (data.type) {
            case "CREATE_WEBSOCKET": // 创建ws链接
                if (!webSocket) {
                    createWebSocket()
                } else {
                    sendMessage('WEBSOCKET_ON_OPEN')
                }
                break
            case "HOMERANKINF": // k 线
                getRanking(data.data)
                break
            case "KLINE": // k 线
                getKlineData(data.data)
                break
            case "TRADEHISTORY": // 历史成交数据
                getTradeHistory(data.data)
                break
            case "TRADE": // 实时成交数据
                getTrade(data.data)
                break
            case "MARKET": // 全币种行情
                getMarketData(data.data)
                break
            case "MARKETB": // 币币行情
                getMarketBData(data.data)
                break
            case "MARKETQ": // 期权行情
                getMarketQData(data.data)
                break
            case "MARKETP": // 配资行情
                getMarketPData(data.data)
                break
            case "OVERVIEW": // 单币对信息
                getOverview(data.data)
                break
            case "TRADEORDER": // 交易委托单
                tradeOrder(data.data)
                break
            case "HANDICAP": // 盘口
                handicap(data.data)
                break
            case "UNSUB": // 取消订阅
                unsub(data.data)
                break
            case "CLOSE_WEBSOCKET": // 关闭ws
                if (webSocket) {
                    webSocket.close()
                    webSocket = null
                }
                break
            case "LOGIN": // 登录
                login(data.data)
                break
            case "LOGOUT": // 退出
                logout(data.data)
                break
        }
    }
    // 创建websocket
    function createWebSocket() {
        if (wsUrl) {
            webSocket = new WebSocket(wsUrl)
            webSocketEvent()
        }
    }
    // 监听 ws 事件
    function webSocketEvent() {
        webSocket.onopen = (ev) => {
            if (webSocket.readyState === 1) {
                setTimeout(() => {
                    sendMessage('WEBSOCKET_ON_OPEN', webSocket.readyState)
                }, 100)
            }
        }
        webSocket.onmessage = ev => {
            const wsData = JSON.parse(ev.data)
            if (wsData.data.clientId) {
                clientId = wsData.data.clientId
            }
            sendMessage('WEBSOCKET_DATA', wsData)
        }
        webSocket.onerror = err => {
            console.log('ws_error::', err)
        }
        webSocket.onclose = () => {
            sendMessage('WEBSOCKET_ON_CLOSE')
        }
    }
    // 取消订阅
    function unsub(data) {
        webSocket.send(pakageData(data))
    }
    // 获取 K 线图数据
    function getKlineData(data) {
        data.clientId = clientId
        webSocket.send(JSON.stringify(data))
    }
    // 获取 当前币种成交历史
    function getTradeHistory(data) {
        data.clientId = clientId
        webSocket.send(JSON.stringify(data))
    }
    // 获取 实时成交历史
    function getTrade(data) {
        data.clientId = clientId
        webSocket.send(JSON.stringify(data))
    }
    // 获取 首页实时排行
    function getRanking(data) {
        data.clientId = clientId
        webSocket.send(JSON.stringify(data))
    }
    // 获取 行情列表数据
    function getMarketData(data) {
        let obj = {
            operate: "getcoins"
        }
        if(data){
            obj.data = data
        }
        webSocket.send(pakageData(obj))
    }
    // 获取 期权列表数据
    function getMarketQData(data) {
        let obj = {
            operate: "getcoins_q"
        }
        if(data){
            obj.data = data
        }
        webSocket.send(pakageData(obj))
    }
    // 获取 币币列表数据
    function getMarketBData(data) {
        let obj = {
            operate: "getcoins_b"
        }
        if(data){
            obj.data = data
        }
        webSocket.send(pakageData(obj))
    }
    // 获取 配资列表数据
    function getMarketPData(data) {
        let obj = {
            operate: "getcoins_p"
        }
        if(data){
            obj.data = data
        }
        webSocket.send(pakageData(obj))
    }
    // 获取单币对行情数据
    function getOverview(data) {
        webSocket.send(pakageData({
            operate: "getdetail",
            data
        }))
    }
    // 交易
    function tradeOrder(data) {
        webSocket.send(pakageData({
            operate: 'entrust',
            data
        }))
    }
    // 盘口
    function handicap(data) {
        webSocket.send(pakageData({
            operate: 'handicap',
            data
        }))
    }
    // 登录
    function login(data) {
        webSocket.send(pakageData({
            operate: 'login',
            data
        }))
    }
    // 退出
    function logout(data) {
        webSocket.send(pakageData({
            operate: 'logout',
            data
        }))
    }
}