import http from '@/api/http'

// 发送验证码
export function sendCode(params) {
  return http.request({ url: 'sms', method: 'post', data: params })
}

// 上传文件
export function uploadFile(params) {
  return http.request({ url: 'upload', method: 'post', data: params, isStringify: 'false' })
}


// 上传文件
export function getUserInfo(params) {
  return http.request({ url: 'user/userInfo', method: 'post', data: params, isStringify: 'false' })
}

// 获取usdt - cny 汇率
export function getUsdtCnyRate(params) {
  return http.request({ url: 'common/usdt_price', method: 'post' })
}

// 自选币对  收藏 get、add、del
export function handleSymbols(params) {
    return http.request({ url: 'common/my_symbols', method: 'post', data: params })
}

// 币种简介
export function coinProfile(params) {
    return http.request({ url: 'common/coin_profile', method: 'post', data: params })
}

// 币对配置信息获取
export function getCoinConfig(params) {
    return http.request({ url: 'common/coin_config', method: 'get'})
}

// 系统配置信息
export function getAppConfig(params) {
    return http.request({ url: 'common/appConfig', method: 'get'})
}
