import http from '@/api/http'

// 获取otc交易币种配置
export function oinsetOtcTrans(params) {
  return http.request({ url: 'otc_trans/coinset', method: 'post', data: params })
}
// 申请成为广告商
export function bondSetOtcPoster(params) {
  return http.request({ url: 'otc_poster/bond_set', method: 'post', data: params })
}
// 获取广告商保证金
export function bondGetOtcPoster(params) {
  return http.request({ url: 'otc_poster/bond_get', method: 'post', data: params })
}
// 获取服务时段起止时间配置
export function openingTimeOtcPoster(params) {
    return http.request({ url: 'otc_poster/opening_time', method: 'post', data: params })
  }
// 保证金退保(预留)
export function bondDelOtcPoster(params) {
  return http.request({ url: 'otc_poster/bond_del', method: 'post', data: params })
}
// 发布广告
export function bondCreatOtcPoster(params) {
  return http.request({ url: 'otc_poster/poster_creat', method: 'post', data: params })
}
// 我的广告
export function myPosterOtcPoster(params) {
  return http.request({ url: 'otc_poster/my_poster', method: 'post', data: params })
}
// 我的广告详情
export function posterInfoOtcPoster(params) {
  return http.request({ url: 'otc_poster/poster_info', method: 'post', data: params })
}
// 编辑广告
export function posterEditOtcPoster(params) {
  return http.request({ url: 'otc_poster/poster_edit', method: 'post', data: params })
}
// 删除广告
export function posterDeleteOtcPoster(params) {
  return http.request({ url: 'otc_trans/poster_delete', method: 'post', data: params })
}
// 广告上下架  状态 上架1 下架2
export function posterStateOtcPoster(params) {
  return http.request({ url: 'otc_poster/poster_state', method: 'post', data: params })
}