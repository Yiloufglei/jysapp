import http from '@/api/http'

// 获取钱包支持币种
export function walletCoinList(params) {
    return http.request({ url: 'wallet/coin_list', method: 'post', data: params })
}

// 资产列表，包括所有类型资产列表
export function walletCoinSet(params) {
    return http.request({ url: 'wallet/coin_set', method: 'post', data: params })
}

// 获取资产币配置，包括充值、提现、划转的配置
export function walletAssetsLlist(params) {
    return http.request({ url: 'wallet/assets_list', method: 'post', data: params })
}

// 获取充币地址
export function getWalletAssetsLlist(params) {
    return http.request({ url: 'wallet/withdraw_address_list', method: 'post', data: params })
}

// 添加/编辑提币地址
export function setWithdrawAddress(params) {
    return http.request({ url: 'wallet/withdraw_address', method: 'post', data: params })
}

// 删除提币地址
export function setWithdrawAddressDel(params) {
    return http.request({ url: 'wallet/withdraw_address_del', method: 'post', data: params })
}

// 获取钱包地址
export function getWalletAddress(params) {
    return http.request({ url: 'wallet/recharge_address', method: 'post', data: params })
}

// 资金划转
export function walletTransfer(params) {
    return http.request({ url: 'wallet/transfer', method: 'post', data: params })
}
// 合约资金划转
export function treatyTransfer(params) {
    return http.request({ url: 'treaty/transfer', method: 'post', data: params })
}
// 合约资金划转
export function Contracttransfercurrency(params) {
    return http.request({ url: 'uctt/uctt_symbol', method: 'post', data: params })
}
// 合约可划转金额
export function getucttcantrans(params) {
    return http.request({ url: 'uctt/getucttcantrans', method: 'post', data: params })
}
// 申请提现
export function walletWithdrawCreat(params) {
    return http.request({ url: 'wallet/withdraw_creat', method: 'post', data: params })
}

// 记录
export function walletAssetsLog(params) {
    return http.request({ url: 'wallet/assets_log', method: 'post', data: params })
}

// 详情
export function walletAssetsLogInfo(params) {
    return http.request({ url: 'wallet/assets_log_info', method: 'post', data: params })
}