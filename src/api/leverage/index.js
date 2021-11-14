import http from '@/api/http.js'

// 获取配资申请列表
export function getLeverApply() {
  return http.request({ url: 'allocation/index' })
}
// 配资币对配置信息
export function getAllocationConfig() {
    return http.request({ url: 'allocation/coinsConfig' })
}
// 配资申请
export function applyLever(params) {
  return http.request({ url: 'allocation/createAllocation', method: 'post', data: params })
}
// 当前配资
export function getCurrentLever(params) {
  return http.request({ url: 'allocation/allocationList', params })
}
// 配资账户信息(钱包)
export function getAllocationAccout(params) {
    return http.request({ url: 'allocation/allocationAccout', params })
}
// 当前配资详情
export function getCurrentLeverDetail(params) {
  return http.request({ url: 'allocation/detail', params })
}
// 申请结算
export function applyClose(params) {
  return http.request({ url: 'allocation/settlement', method: 'post', data: params })
}
// 配资资金明细
export function getLeverAssetsBill(params) {
  return http.request({ url: 'allocation/moneyDetail', params })
}
// 获取历史配资
export function getHistoryLever(params) {
  return http.request({ url: 'allocation/historyList', params })
}
// 获取历史配资详情
export function getHistoryLeverDetail(params) {
  return http.request({ url: 'allocation/historyDetail', params })
}
// 追加配资
export function supplementLever(params) {
  return http.request({ url: 'allocation/addAllocation', method: 'post', data: params })
}
// 追加保证金
export function supplementDeposit(params) {
  return http.request({ url: 'allocation/addBonds', method: 'post', data: params })
}