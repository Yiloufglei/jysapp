import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import store from '@/store'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const Maintenance = () => import(/* webpackChunkName: "NoRouter" */ '@/views/maintenance')
const NoRouter = () => import(/* webpackChunkName: "NoRouter" */ '@/views/404')
const Home = () => import(/* webpackChunkName: "Home" */ '@/views/home')



const Market = () => import(/* webpackChunkName: "Trade" */ '@/views/market')
const Trade = () => import(/* webpackChunkName: "Trade" */ '@/views/trade')
const ChartView = () => import(/* webpackChunkName: "Trade" */ '@/views/chart')
const TradeHistory = () => import(/* webpackChunkName: "Trade" */ '@/views/trade/history')
const TradeHistoryDetail = () => import(/* webpackChunkName: "Trade" */ '@/views/trade/historyDetail')


const binaryOption = () => import(/* webpackChunkName: "binaryOption" */ '@/views/binaryOption/index')
const binaryOptionHistory = () => import(/* webpackChunkName: "binaryOption" */ '@/views/binaryOption/binaryOptionHistory')
const binaryOptionTrade = () => import(/* webpackChunkName: "binaryOption" */ '@/views/binaryOption/binaryOptionTrade')


const OptionTrade = () => import(/* webpackChunkName: "OptionTrade" */ '@/views/optionTrade')
const OptionTradeOrderDetail = () => import(/* webpackChunkName: "OptionTrade" */ '@/views/optionTrade/orderDetail')
const Leverage = () => import(/* webpackChunkName: "Leverage" */ '@/views/leverage')
const LeverageApply = () => import(/* webpackChunkName: "Leverage" */ '@/views/leverage/leverApply')
const LeverageList = () => import(/* webpackChunkName: "Leverage" */ '@/views/leverage/leverageList')
const LeverageHistoryDetail = () => import(/* webpackChunkName: "Leverage" */ '@/views/leverage/historyDetail')
const LeverageAccountInformation = () => import(/* webpackChunkName: "Leverage" */ '@/views/leverage/accountInformation')
const LeverageCapitalDetail = () => import(/* webpackChunkName: "Leverage" */ '@/views/leverage/capitalDetail')

const Login = () => import(/* webpackChunkName: "LoginRegister" */ '@/views/login')
const Register = () => import(/* webpackChunkName: "LoginRegister" */ '@/views/register')
const Forget = () => import(/* webpackChunkName: "LoginRegister" */ '@/views/forget')

const PersonalCenterIndex = () => import(/* webpackChunkName: "PersonalCenterIndex" */ '@/views/personalCenter/index')
const PersonalCenterInviteFriends = () => import(/* webpackChunkName: "PersonalCenterIndex" */ '@/views/personalCenter/inviteFriends')
const PersonalCenterPaymentMethod = () => import(/* webpackChunkName: "PersonalCenterIndex" */ '@/views/personalCenter/paymentMethod')
const PersonalCenterTeamPerformance = () => import(/* webpackChunkName: "PersonalCenterIndex" */ '@/views/personalCenter/teamPerformance')
const PersonalCenterMyPerformance = () => import(/* webpackChunkName: "PersonalCenterIndex" */ '@/views/personalCenter/myPerformance')
const PersonalCenterFeedback = () => import(/* webpackChunkName: "PersonalCenterIndex" */ '@/views/personalCenter/feedback')
const PersonalCenterHelpCenter = () => import(/* webpackChunkName: "PersonalCenterIndex" */ '@/views/personalCenter/helpCenter')
const PersonalCenterHelpDetail = () => import(/* webpackChunkName: "PersonalCenterIndex" */ '@/views/personalCenter/helpDetail')
const PersonalCenterNoticeList = () => import(/* webpackChunkName: "PersonalCenterIndex" */ '@/views/personalCenter/noticeList')
const PersonalCenterNoticeDetail = () => import(/* webpackChunkName: "PersonalCenterIndex" */ '@/views/personalCenter/noticeDetail')
const aboutUs = () => import(/* webpackChunkName: "PersonalCenterIndex" */ '@/views/personalCenter/aboutUs')
const InviteRule = () => import(/* webpackChunkName: "PersonalCenterIndex" */ '@/views/personalCenter/inviteRule')

const AdvertisementAdvertiser = () => import(/* webpackChunkName: "AdvertisementAdvertiser" */ '@/views/advertisement/advertiser')
const AdvertisementMyAdvertisement = () => import(/* webpackChunkName: "AdvertisementAdvertiser" */ '@/views/advertisement/myAdvertisement')
const AdvertisementEditReleaseAd = () => import(/* webpackChunkName: "AdvertisementAdvertiser" */ '@/views/advertisement/editReleaseAd')
const AdvertisementAdDetails = () => import(/* webpackChunkName: "AdvertisementAdvertiser" */ '@/views/advertisement/adDetails')
const Agreement = () => import(/* webpackChunkName: "AdvertisementAdvertiser" */ '@/views/advertisement/agreement')

const Assets = () => import(/* webpackChunkName: "Assets" */ '@/views/assets')
const AssetsHistory = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/history')
const AssetsTransferHistory = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/transferHistory')
const AssetsAllocationHistory = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/allocationHistory')
const AssetsHistoryDetail = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/historyDetail')
const AssetsCapitalTransfer = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/capitalTransfer')
const AssetsCurrencyAccount = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/currencyAccount')
const AssetsCoinslAccount = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/coinslAccount')
const AssetsLegalCurrencyAccount = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/legalCurrencyAccount')
const AssetsChainAddress = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/chainAddress')
const AssetsAddChainAddress = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/addChainAddress')
const AssetsWithdrawMoney = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/withdrawMoney')
const AssetsChargeMoney = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/chargeMoney')
const AssetsMyOrder = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/myOrder')
const QnumAccount = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/qnumAccount')
const binaryOptionAccount = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/binaryOptionAccount')
const contractAccount = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/contractAccount')
const contractTradeDetail = () => import(/* webpackChunkName: "Assets" */ '@/views/assets/contractTradeDetail')

const SecurityCenterIndex = () => import(/* webpackChunkName: "securityCenterIndex" */ '@/views/securityCenter/index')
const SsecurityChangeLoginPassword = () => import(/* webpackChunkName: "securityCenterIndex" */ '@/views/securityCenter/changeLoginPassword')
const SecurityChangeCapitalPassword = () => import(/* webpackChunkName: "securityCenterIndex" */ '@/views/securityCenter/changeCapitalPassword')
const SecurityIdentityCard = () => import(/* webpackChunkName: "securityCenterIndex" */ '@/views/securityCenter/identityCard')
const SecurityCenterBankCard = () => import(/* webpackChunkName: "securityCenterIndex" */ '@/views/securityCenter/bankCard')
const SecurityCenterWeChat = () => import(/* webpackChunkName: "securityCenterIndex" */ '@/views/securityCenter/weChat')
const SecurityCenterAlipay = () => import(/* webpackChunkName: "securityCenterIndex" */ '@/views/securityCenter/alipay')

const legalCurrencyTradeIndex = () => import(/* webpackChunkName: "legalCurrencyTradeIndex" */ '@/views/legalCurrencyTrade/index')
const legalCurrencyTradeStayPayment = () => import(/* webpackChunkName: "legalCurrencyTradeIndex" */ '@/views/legalCurrencyTrade/stayPayment')
const legalCurrencyTradePendingPayment = () => import(/* webpackChunkName: "legalCurrencyTradeIndex" */ '@/views/legalCurrencyTrade/pendingPayment')
const legalCurrencyTradeAlreadyPayment = () => import(/* webpackChunkName: "legalCurrencyTradeIndex" */ '@/views/legalCurrencyTrade/alreadyPayment')
const legalCurrencyTradePaymentPage = () => import(/* webpackChunkName: "legalCurrencyTradeIndex" */ '@/views/legalCurrencyTrade/paymentPage')
const legalCurrencyTradeSellerConfirm = () => import(/* webpackChunkName: "legalCurrencyTradeIndex" */ '@/views/legalCurrencyTrade/sellerConfirm')
const legalCurrencyTradeBusinessDetail = () => import(/* webpackChunkName: "legalCurrencyTradeIndex" */ '@/views/legalCurrencyTrade/businessDetail')
const legalCurrencyTradeTradeSuccess = () => import(/* webpackChunkName: "legalCurrencyTradeIndex" */ '@/views/legalCurrencyTrade/tradeSuccess')
// const legalCurrencyTradeOrderDetail = () => import(/* webpackChunkName: "legalCurrencyTradeIndex" */ '@/views/legalCurrencyTrade/orderDetail')
const legalCurrencyTradeOrderDetail = () => import(/* webpackChunkName: "legalCurrencyTradeIndex" */ '@/views/legalCurrencyTrade/orderDetailV2')
const legalCurrencyTradeAppealConduct = () => import(/* webpackChunkName: "legalCurrencyTradeIndex" */ '@/views/legalCurrencyTrade/appealConduct')
const legalCurrencyTradeAppeal = () => import(/* webpackChunkName: "legalCurrencyTradeIndex" */ '@/views/legalCurrencyTrade/appeal')

const contractIndex = () => import(/* webpackChunkName: "contractIndex" */ '@/views/contract/index')
const contractHistory = () => import(/* webpackChunkName: "contractIndex" */ '@/views/contract/history')
const contractTransactionDetail = () => import(/* webpackChunkName: "contractIndex" */ '@/views/contract/transactionDetail')
const contractanswer = () => import(/* webpackChunkName: "answerIndex" */ '@/views/contract/answer')
const contractLearningvideo = () => import(/* webpackChunkName: "LearningvideoIndex" */ '@/views/contract/Learningvideo')




const missionCenter = () => import(/* webpackChunkName: "missionCenter" */ '@/views/missionCenter/index')
const activeAccount = () => import(/* webpackChunkName: "missionCenter" */ '@/views/missionCenter/activeAccount')

// const redEnvelopes = () => import(/* webpackChunkName: "activityGames" */ '@/views/activityGames/redEnvelopes')

//登录注册协议
const loginAgreement = () => import(/* webpackChunkName: "loginAgreement" */ '@/views/login/loginAgreement')
const nesting = () => import(/* webpackChunkName: "nesting" */ '@/views/nesting')
// 活动中心
const activityCenter = () => import(/* webpackChunkName: "activityCenter" */ '@/views/activityCenter')
const activityDetail = () => import(/* webpackChunkName: "activityCenter" */ '@/views/activityCenter/activityDetail')

const horizontalHq = () => import(/* webpackChunkName: "horizontalHq" */ '@/components/horizontalHq')

const routes = [
    {
        path: '/',
        component: Index,
        children: [
            { path: '', name: 'Home', meta: { title: '主页', no_header_require: true }, component: Home },
            {
                path: 'leverage', component: Leverage,
                children: [
                    { path: '', name: 'LeverageApply', meta: { title: '配资区', no_header_require: true }, component: LeverageApply },
                    { path: 'leverageList', name: 'LeverageList', meta: { title: '交易区', login_require: true, no_header_require: true }, component: LeverageList }
                ]
            },
            { path: 'market', name: 'Market', meta: { title: '行情', no_header_require: true }, component: Market },
            { path: 'trade/:type?', name: 'Trade', meta: { title: '交易', no_header_require: true }, component: Trade },
            { path: 'contractIndex', name: 'contractIndex', meta: { title: '合约', no_header_require: true }, component: contractIndex },
            { path: 'assets', name: 'Assets', meta: { title: '资产', login_require: true, no_header_require: true }, component: Assets },
        ]
    },
    //活动游戏
    // { path: '/redEnvelopes', name: 'redEnvelopes', meta: { title: '红包活动' }, component: redEnvelopes },
    { path: '/nesting', name: 'nesting', meta: { title: '' ,no_header_require: true }, component: nesting },

    { path: '/optionTrade', name: 'OptionTrade', meta: { title: '期权交易', no_header_require: true }, component: OptionTrade },
    { path: '/optionTradeOrderDetail', name: 'OptionTradeOrderDetail', meta: { title: '订单详情', no_header_require: true }, component: OptionTradeOrderDetail },
    
    { path: '/contractHistory', name: 'contractHistory', meta: { title: '历史记录'}, component: contractHistory },
    { path: '/contractTransactionDetail', name: 'contractTransactionDetail', meta: { title: '成交详情'}, component: contractTransactionDetail },
    { path: '/contractAnswer', name: 'contractanswer', meta: { title: ' ',}, component: contractanswer },
    { path: '/contractLearningVideo', name: 'Learningvideo', meta: { title: ' ',}, component: contractLearningvideo },

    //二元期权
    
    { path: '/binaryOption', name: 'binaryOption', meta: { title: '期权交易', no_header_require: true}, component: binaryOption },
    { path: '/binaryOptionHistory', name: 'binaryOptionHistory', meta: { title: '历史记录'}, component: binaryOptionHistory },
    { path: '/binaryOptionTrade', name: 'binaryOptionTrade', meta: { title: '记录详情', no_header_require: true}, component: binaryOptionTrade },

    { path: '/market/chart', name: 'MarketChart', meta: { title: '交易', no_header_require: true }, component: ChartView },
    { path: '/tradeHistory', name: 'tradeHistory', meta: { title: '委托历史' , login_require : true}, component: TradeHistory },
    { path: '/tradeDetail', name: 'tradeDetail', meta: { title: '成交详情' , login_require : true}, component: TradeHistoryDetail },
    { path: '/leverage/historyDetail', name: 'LeverAccount', meta: { title: '账户信息', login_require : true }, component: LeverageHistoryDetail },
    { path: '/accountInformation', name: 'accountInformation', meta: { title: '账户信息' , login_require : true}, component: LeverageAccountInformation },
    { path: '/capitalDetail', name: 'capitalDetail', meta: { title: '资金明细', login_require : true }, component: LeverageCapitalDetail },
    { path: '/login', name: 'Login', meta: { title: '登录' }, component: Login },
    { path: '/register', name: 'Register', meta: { title: '注册' }, component: Register },
    { path: '/forget', name: 'Forget', meta: { title: '找回密码' }, component: Forget },
    { path: '*', name: '404', meta: { title: '404' }, component: NoRouter },
    { path: '/maintenance', name: 'Maintenance', meta: { title: '系统维护', no_header_require: true }, component: Maintenance },
    { path: '/loginAgreement', name: 'loginAgreement', meta: { title: '用户隐私条款'}, component: loginAgreement },
    
    { path: '/missionCenter', name: 'missionCenter', meta: { title: '任务中心', login_require: true}, component: missionCenter },
    { path: '/activeAccount', name: 'activeAccount', meta: { title: '活动账户', login_require: true}, component: activeAccount },

    //个人中心  
    { path: '/personalCenter', name: 'personalCenter', meta: { title: '个人中心' ,backLink:'/'}, component: PersonalCenterIndex },
    { path: '/paymentMethod', name: 'paymentMethod', meta: { title: '收款方式', login_require: true }, component: PersonalCenterPaymentMethod },
    { path: '/inviteFriends', name: 'inviteFriends', meta: { title: '邀请好友', login_require: true }, component: PersonalCenterInviteFriends},
    { path: '/teamPerformance', name: 'teamPerformance', meta: { title: '团队业绩', login_require: true }, component: PersonalCenterTeamPerformance },
    { path: '/myPerformance', name: 'myPerformance', meta: { title: '我的业绩', login_require: true }, component: PersonalCenterMyPerformance },
    { path: '/feedback', name: 'feedback', meta: { title: '意见反馈' }, component: PersonalCenterFeedback },
    { path: '/helpCenter', name: 'helpCenter', meta: { title: '帮助中心' }, component: PersonalCenterHelpCenter },
    { path: '/helpDetail', name: 'helpDetail', meta: { title: '帮助详情' }, component: PersonalCenterHelpDetail },
    { path: '/noticeList', name: 'noticeList', meta: { title: '公告列表' }, component: PersonalCenterNoticeList },
    { path: '/noticeDetail', name: 'noticeDetail', meta: { title: '公告详情' }, component: PersonalCenterNoticeDetail },
    { path: '/aboutUs', name: 'AboutUs', meta: { title: '关于我们' }, component: aboutUs },
    { path: '/inviteRule', name: 'InviteRule', meta: { title: '邀请规则', login_require: true }, component: InviteRule},


    // 广告模块
    { path: '/advertiser', name: 'advertiser', meta: { title: '广告商申请', login_require: true }, component: AdvertisementAdvertiser },
    { path: '/myAdvertisement', name: 'myAdvertisement', meta: { title: '我的广告', login_require: true , no_header_require: true}, component: AdvertisementMyAdvertisement },
    { path: '/editReleaseAd', name: 'editReleaseAd', meta: { title: '编辑发布广告', login_require: true, no_header_require: true }, component: AdvertisementEditReleaseAd },
    { path: '/adDetails', name: 'adDetails', meta: { title: '广告详情', login_require: true }, component: AdvertisementAdDetails },
    { path: '/agreement', name: 'agreement', meta: { title: '广告商服务协议', login_require: true }, component: Agreement },
    
    // 资产
    { path: '/withdrawhistory', name: 'withdrawhistory', meta: { title: '充币历史记录' , login_require : true }, component: AssetsHistory },
    { path: '/chargeHistory', name: 'chargeHistory', meta: { title: '提币历史记录' , login_require : true }, component: AssetsHistory },
    { path: '/transferHistory', name: 'transferHistory', meta: { title: '划转历史记录' , login_require : true }, component: AssetsTransferHistory },
    { path: '/allocationHistory', name: 'allocationHistory', meta: { title: '配资历史记录' , login_require : true }, component: AssetsAllocationHistory },
    { path: '/historyDetail', name: 'historyDetail', meta: { title: '详情' , login_require : true }, component: AssetsHistoryDetail },
    { path: '/contractTradeDetail', name: 'contractTradeDetail', meta: { title: '详情' , login_require : true }, component: contractTradeDetail },
    { path: '/capitalTransfer', name: 'capitalTransfer', meta: { title: '资金划转' , login_require : true  ,no_header_require : true}, component: AssetsCapitalTransfer },
    { path: '/currencyAccount', name: 'currencyAccount', meta: { title: '逐仓账户' , login_require : true }, component: AssetsCurrencyAccount },
    { path: '/coinslAccount', name: 'coinslAccount', meta: { title: '币币账户' , login_require : true }, component: AssetsCoinslAccount},
    { path: '/contractAccount', name: 'contractAccount', meta: { title: '合约账户' , login_require : true }, component: contractAccount},
    { path: '/legalCurrencyAccount', name: 'legalCurrencyAccount', meta: { title: '法币账户' , login_require : true }, component: AssetsLegalCurrencyAccount },
    { path: '/chainAddress', name: 'chainAddress', meta: { title: '链地址' , login_require : true }, component: AssetsChainAddress },
    { path: '/addChainAddress', name: 'addChainAddress', meta: { title: '新增链地址' , login_require : true }, component: AssetsAddChainAddress },
    { path: '/withdrawMoney', name: 'withdrawMoney', meta: { title: '充币' , login_require : true ,no_header_require : true}, component: AssetsWithdrawMoney },
    { path: '/chargeMoney', name: 'chargeMoney', meta: { title: '提币' , login_require : true ,no_header_require : true}, component: AssetsChargeMoney },
    { path: '/myOrder', name: 'myOrder', meta: { title: '我的订单' , login_require : true  ,no_header_require : true}, component: AssetsMyOrder },
    { path: '/qnumAccount', name: 'qnumAccount', meta: { title: '期权账户' , login_require : true }, component: QnumAccount },
    { path: '/binaryOptionAccount', name: 'binaryOptionAccount', meta: { title: '二元期权' , login_require : true }, component: binaryOptionAccount },
    
    
    // 安全中心    绑定认证 
    { path: '/securityCenter', name: 'securityCenter', meta: { title: '安全中心', login_require: true }, component: SecurityCenterIndex },
    { path: '/changeLoginPassword', name: 'changeLoginPassword', meta: { title: '修改登录密码', login_require: true }, component: SsecurityChangeLoginPassword },
    { path: '/changeCapitalPassword', name: 'changeCapitalPassword', meta: { title: '设置资金密码', login_require: true }, component: SecurityChangeCapitalPassword },
    { path: '/identityCard', name: 'identityCard', meta: { title: '身份认证', login_require: true }, component: SecurityIdentityCard },
    { path: '/bankCard', name: 'bankCard', meta: { title: '银行卡绑定', login_require: true }, component: SecurityCenterBankCard },
    { path: '/weChat', name: 'weChat', meta: { title: '微信绑定', login_require: true }, component: SecurityCenterWeChat },
    { path: '/alipay', name: 'alipay', meta: { title: '支付宝绑定', login_require: true }, component: SecurityCenterAlipay },

    // 法币交易
    { path: '/legalCurrencyTrade', name: 'legalCurrencyTrade', meta: { title: '法币交易' ,no_header_require : true}, component: legalCurrencyTradeIndex },
    { path: '/stayPayment', name: 'stayPayment', meta: { title: '待付款' , login_require : true }, component: legalCurrencyTradeStayPayment },
    { path: '/pendingPayment', name: 'pendingPayment', meta: { title: '待收款' , login_require : true }, component: legalCurrencyTradePendingPayment },
    { path: '/alreadyPayment', name: 'alreadyPayment', meta: { title: '卖家确认' , login_require : true }, component: legalCurrencyTradeAlreadyPayment },
    { path: '/paymentPage', name: 'paymentPage', meta: { title: '支付页' , login_require : true }, component: legalCurrencyTradePaymentPage },
    { path: '/sellerConfirm', name: 'sellerConfirm', meta: { title: '卖家确认' , login_require : true, backLink:'/myOrder' }, component: legalCurrencyTradeSellerConfirm },
    { path: '/businessDetail', name: 'businessDetail', meta: { title: '商家详情' , login_require : true }, component: legalCurrencyTradeBusinessDetail },
    { path: '/tradeSuccess', name: 'tradeSuccess', meta: { title: '交易成功' , login_require : true ,no_header_require : true }, component: legalCurrencyTradeTradeSuccess },
    { path: '/orderDetail', name: 'orderDetail', meta: { title: '交易详情' , login_require : true }, component: legalCurrencyTradeOrderDetail },
    { path: '/appealConduct', name: 'appealConduct', meta: { title: '申诉中' , login_require : true }, component: legalCurrencyTradeAppealConduct },
    { path: '/appeal', name: 'appeal', meta: { title: '申诉' , login_require : true }, component: legalCurrencyTradeAppeal},

    // 活动中心
    { path: '/activityCenter', name: 'ActivityCenter', meta: { title: '活动中心' }, component: activityCenter },
    { path: '/activityDetail', name: 'ActivityDetail', meta: { title: '活动详情' }, component: activityDetail},

    { path: '/horizontalHq', name: 'horizontalHq', meta: { title: '', no_header_require: true }, component: horizontalHq },
]

const router = new VueRouter({
    routes,
    scrollBehavior: (to, from, savePosition) => {
        return { x: 0, y: 0 }
    }
})

const changeIosBgColor = (type) => {
    let ua = navigator.userAgent;
    let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
    let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isiOS) {
        try {
            window.webkit.messageHandlers.changeBackgroundColor.postMessage(type);
        } catch(error) {
            console.log("ios error");
        }
    }
    if (isAndroid) {
        try {                    
            window.android.changeBackgroundColor(type) 
        } catch(error) {
            console.log("Android error");
        }
    }
}
const whitePath = ['/login', '/register', '/forget']
const blackBjColor = ['/market/chart','/optionTrade','/optionTradeOrderDetail','/horizontalHq']
const blueBjColor = ['/legalCurrencyTrade','/tradeSuccess']
router.beforeEach((to, from, next) => {
    if (blackBjColor.includes(to.path)) {
        changeIosBgColor(2)
    }else if (blueBjColor.includes(to.path)) {
        changeIosBgColor(3)
    }else{
        changeIosBgColor(1)
    }
    if (store.state.user.token) {
        if (whitePath.includes(to.path)) {
            next('/')
        } else {
            next()
        }
    } else {
    //login_require登录权限页面
        if (to.meta.login_require) {
            if(from.name === 'Login'){
                next('/')
            }else{
                next('/login')
            }
        } else {
            next()
        }
    }
})
router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    const targetPath = router.history.pending.fullPath;
    if (isChunkLoadFailed) {
      router.replace(targetPath);
    }
});
export {
    router,
    whitePath
}