import http from '@/api/http'

// 合约首页
export function treatyIndex(params) {
    return http.request({ url: '/treaty/index', method: 'get', params})
}

// 合约币对信息
export function treatyCoinConfig() {
  return http.request({ url: '/treaty/coinConfig', method: 'get'})
}

// 开仓
export function treatyBuy(params) {
    return http.request({ url: '/treaty/buy', method: 'post', data: params})
}
// 开仓
export function treatyOpening(params) {
    return http.request({ url: '/treaty/opening', method: 'get', data: params})
}
// 止盈设置
export function treatyStopProfit(params) {
    return http.request({ url: '/treaty/stopProfit', method: 'post', data: params})
}

// 止损设置
export function treatyStopLoss(params) {
    return http.request({ url: '/treaty/stopLoss', method: 'post', data: params})
}

// 交易详情
export function treatyDetail(params) {
    return http.request({ url: '/treaty/detail', method: 'post', data: params})
}

// 历史记录
export function treatyHistory(params) {
    return http.request({ url: '/treaty/history', method: 'post', data: params})
}