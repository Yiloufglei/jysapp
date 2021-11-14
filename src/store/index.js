import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from './modules/user'
import wsData from './modules/wsData'
import contract from './modules/contract'
import advertisement from './modules/advertisement'
import market from './modules/market'
import assets from './modules/assets'
import publicData from './modules/publicData'
import { Toast } from 'vant';
import router from './modules/router'
import order from './modules/order'
import leverage from './modules/leverage'
import activity from './modules/activity'
import optionTrade from './modules/optionTrade'
import {
    getUserInfo,
    handleSymbols,
    getCoinConfig,
    getAppConfig
} from '@/api/common'

Vue.use(Vuex)

const cachePath = [
    'user.token',
    'user.userInfo',
    'user.mySymbols',
    'user.inviteCode',
    'advertisement.advertiserInfo',
    'assets.accountSum',
    'assets.historyDetail',
    'assets.indexSelectItem',
    'assets.soptAccount',
    'assets.leverAccount',
    'assets.legalAccount',
    'assets.choiceType',
    'assets.qlistAccount',
    'coinConfig',
    'router',
    'contract',
    'order',
    'leverage',
    'wsData.symbol',
    'wsData.hqSymbol',
    'hideSmallType',
    'tradeType',
    'userSymbol',
    'tradeMode',
    'activity',
    'optionTrade.symbol',
    'optionTrade.tradeBaseCoin',
    'optionTrade.holdTabIndex',
    'optionTrade.config',
    'optionTrade.placeOrderList',
    'optionTrade.placeConisOrderObj',
    'appConfig'
]

var isAppFun = () => {
    var userAgent = navigator.userAgent;//获取UA信息
    return userAgent.indexOf("IosAndroidIdentification") != -1
}
export default new Vuex.Store({
    state: {
        rateSort:'',
        coinConfig: {},
        userSymbol:{
            lever:'',
            spot:''
        },
        tradeMode: {
            lever:'',
            spot:''
        }, // 交易买入卖出存储
        appConfig:{},
        hideSmallType:false,
        tradeType: 'spot',
        home: {
            tabIndex: 0, // 首页tab
            scrollTop: 0, // 首页滚动调位置
            listData: {} // 缓存首页排行榜数据
        }
    },
    getters: {},
    mutations: {
        // 缓存数据清除
        REMOVE_INFO(state) {
            state.user.userInfo = {}
            state.user.token = ''
            state.user.inviteCode = ''
            state.user.mySymbols = []
            state.assets.accountSum = {}
            state.assets.historyDetail = {}
            state.assets.indexSelectItem = {}
            state.assets.soptAccount = []
            state.assets.leverAccount = []
            state.assets.legalAccount = []
        },
        SET_MYSYMBOLS(state, data) {
            state.user.mySymbols = data
        },
        SET_HIDESMALL_TYPE(state, data) {
            state.hideSmallType = data
        },
        SET_USERSYMBOL(state, params) {
            state.userSymbol[params.tradeType] = params.symbolName
        },
        SET_TRADE_MODE(state, params) {
            state.tradeMode[params.tradeType] = params.mode
        },
        SET_CIONCONFIG(state, data) {
            let info = {}
            data.forEach(v => {
                info[v.coinName] = v
            });
            state.coinConfig = {
                list:data,
                info:info
            }
        },
        SET_TRADE_TYPE(state, val) {
            state.tradeType = val
        },
        SET_HOME_TABINDEX(state, val) {
            state.home.tabIndex = val
        },
        SET_HOME_SCROLLTOP(state, val) {
            state.home.scrollTop = val
        },
        SET_HOME_LIST_DATA(state, val) {
            state.home.listData = val
        },
        SET_RATESORT(state, val) {
            state.rateSort = val
        },
        SET_APPCONFIG(state, val) {
            state.appConfig = val
        }
    },
    actions: {
        //更新用户信息
        updateUserInfo(context) {
            getUserInfo().then(res => {
                context.commit('SET_USER_INFO', res.data.userInfos);
            })
        },
        //保存币币配资选择币种
        setUserSymbol(context,params){
            context.commit('SET_USERSYMBOL', params);
        },
        //更新用户信息
        getCoinConfig(context) {
            getCoinConfig().then(res => {
                context.commit('SET_CIONCONFIG', res.data.list || []);
            })
        },
        //系统配置信息
        getAppConfig(context) {
            return new Promise((resolve,reject) => {
                getAppConfig().then(res => {
                    context.commit('SET_APPCONFIG', res.data.info || {});
                    resolve(res.data.info || {})
                })
            })
        },
        //收藏币对接口
        handleMySymbols(context, params) {
            return new Promise((resolve) => {
                let obj = {
                    operate: params.type
                }
                if (params.symbol) {
                    obj.symbol = params.symbol
                }
                handleSymbols(obj).then((res) => {
                    let data = res.data.symbols || []
                    context.commit('SET_MYSYMBOLS', data);
                    if (params.type === 'add' || params.type === 'del') {
                        Toast({
                            message: params.type === 'add' ? '收藏成功' : '取消成功'
                        })
                    }
                    resolve(data)
                })
            })
        }
    },
    modules: {
        user,
        contract,
        wsData,
        advertisement,
        market,
        assets,
        publicData,
        router,
        order,
        leverage,
        activity,
        optionTrade
    },
    plugins: [createPersistedState({
        storage: isAppFun() ? window.localStorage : window.sessionStorage,
        paths: cachePath
    })]
})