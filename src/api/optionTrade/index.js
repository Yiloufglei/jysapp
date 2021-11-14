import http from '@/api/http.js'

// 获取期权币对配置
export function optSet(data) {
  return http.request({ url: 'opt/set', method: 'post', data })
}

// 期权委托下单(买涨买跌)
export function optOrderTrust(data) {
    return http.request({ url: 'opt/order_trust', method: 'post', data })
}

// 期权撤单操作
export function optClearOrder(data) {
    return http.request({ url: 'opt/clear_order', method: 'post', data })
}

// 订单止盈止损编辑
export function optEditOrder(data) {
    return http.request({ url: 'opt/edit_order', method: 'post', data })
}

// 手动平仓
export function optCloseOrder(data) {
    return http.request({ url: 'opt/close_order', method: 'post', data })
}

// 期权订单列表
export function optOrderList(data) {
    return http.request({ url: 'opt/order_list', method: 'post', data })
}

// 期权订单详情
export function optOrderInfo(data) {
    return http.request({ url: 'opt/order_info', method: 'post', data })
}