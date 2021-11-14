import http from '@/api/http.js'

// 获取期权币对配置
export function optSet() {
  return http.request({ url: 'opt/set', method: 'get' })
}

// 期权下单(买涨买跌)
export function optOrderBuy(data) {
    return http.request({ url: 'opt/order_buy', method: 'post', data })
}
// 期权订单列表
export function optOrderList(data) {
    return http.request({ url: 'opt/order_query', method: 'post', data })
}

// 期权订单详情
export function optOrderInfo(data) {
    return http.request({ url: 'opt/order_detail', method: 'post', data })
}