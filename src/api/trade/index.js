import http from '@/api/http.js'

// 获取委托历史
export function getTradeHistory(params) {
    return http.request({ url: 'trade/historyEntrust', params })
}
// 获取委托历史详情
export function getTradeHistoryDetail(params) {
    return http.request({ url: 'trade/historyDetail', params })
}
export function allocationTradeDetailRead(params) {
    return http.request({ url: 'allocation/tradeDetailRead', params })
}
// 币币下单
export function submitTrade(params) {
    return http.request({ url: 'trade/order', method: 'post', data: params })
}
// 委托下单
export function submitAllocationTrade(params) {
    return http.request({ url: 'allocation/trade', method: 'post', data: params })
}

export function allocationTradeList(params) {
    return http.request({ url: 'allocation/tradeList', method: 'get', params })
}

// 币币撤单
export function revoke(params) {
    return http.request({ url: 'trade/cancle', params })
}
// 币币全部撤单
export function revokeAll(params) {
    return http.request({ url: 'trade/cancleAll', params })
}
// 配资撤单
export function allocationRevoke(params) {
    return http.request({ url: 'allocation/cancle', params })
}
// 配资全部撤单
export function allocationRevokeAll(params) {
    return http.request({ url: 'allocation/cancleAll', params })
}