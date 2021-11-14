import http from '@/api/http'

// 法币交易 - 广告列表
export function postersOtcTrans(params) {
    return http.request({ url: 'otc_trans/posters', method: 'post', data: params })
}

// 法币交易 - 商家详情
export function postersMcOtcTrans(params) {
    return http.request({ url: 'otc_trans/posters_mc', method: 'post', data: params })
}

// 法币交易 - 买币卖币下单
export function transCreatOtcTrans(params) {
    return http.request({ url: 'otc_trans/trans_creat', method: 'post', data: params })
}

// 法币交易 - 我的订单
export function myTransOtcTrans(params) {
    return http.request({ url: 'otc_trans/my_trans', method: 'post', data: params })
}

// 法币交易 - 卖家查看待支付订单
export function waitPayOtcTrans(params) {
    return http.request({ url: 'otc_trans/wait_pay', method: 'post', data: params })
}

// 法币交易 - 买家查看待支付订单
export function pleasePayOtcTrans(params) {
    return http.request({ url: 'otc_trans/please_pay', method: 'post', data: params })
}

// 法币交易 - 买家取消订单
export function transCleanOtcTrans(params) {
    return http.request({ url: 'otc_trans/trans_clean', method: 'post', data: params })
}

// 法币交易 - 买家确认付款
export function payConfirmOtcTrans(params) {
    return http.request({ url: 'otc_trans/pay_confirm', method: 'post', data: params })
}

// 法币交易 - 卖家确认放币
export function transConfirmOtcTrans(params) {
    return http.request({ url: 'otc_trans/trans_confirm', method: 'post', data: params })
}

// 交易申诉 - 获取申诉类型
export function appealTypeOtcTrans(params) {
    return http.request({ url: 'otc_trans/appeal_type', method: 'post', data: params })
}

// 交易申诉 - 提交申诉
export function appealOtcTrans(params) {
    return http.request({ url: 'otc_trans/appeal', method: 'post', data: params })
}

// 交易申诉 - 申诉详情
export function appealInfoOtcTrans(params) {
    return http.request({ url: 'otc_trans/appeal_info', method: 'post', data: params })
}

// 交易申诉 - 取消申诉详情
export function appealClearOtcTrans(params) {
    return http.request({ url: 'otc_trans/appeal_clear', method: 'post', data: params })
}

// 交易申诉 - 交易订单详情
export function transInfoTrans(params) {
    return http.request({ url: 'otc_trans/trans_info', method: 'post', data: params })
}