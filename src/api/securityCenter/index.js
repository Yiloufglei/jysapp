import http from '@/api/http.js'

// 修改资金密码
export function modifyTpassword(params) {
  return http.request({ url: 'user/modify_tpassword', method: 'post', data: params })
}

// 帮助中心
export function userHelp(params) {
    return http.request({ url: 'user/help', method: 'post', data: params })
}
// 帮助中心详情
export function userHelpInfo(params) {
    return http.request({ url: 'user/help_info', method: 'post', data: params })
}
// 意见反馈
export function userFeedback(params) {
    return http.request({ url: 'user/feedback', method: 'post', data: params })
}
// 修改登录密码
export function modifyPassword(params) {
  return http.request({ url: 'user/modify_password', method: 'post', data: params })
}
//设置收款方式
export function paymentSet(params) {
  return http.request({ url: 'payment/payment_set', method: 'post', data: params })
}

//收款方式列表
export function paymentList(params) {
  return http.request({ url: 'payment/payment_list', method: 'post', data: params })
}

//删除收款方式
export function paymentDel(params) {
    return http.request({ url: 'payment/payment_del', method: 'post', data: params })
}

//提交身份认证
export function userAuth(params) {
    return http.request({ url: 'user/auth', method: 'post', data: params })
}

//公告列表
export function getNoticeIndex(params) {
    return http.request({ url: 'notice/index', method: 'get', data: params })
}

//公告详情
export function getNoticeDetail(params) {
    return http.request({ url: `notice/detail?id=${params.id}`, method: 'get', data: params })
}

// 修改用户头像
export function modifyPhoto(params) {
  return http.request({ url: `user/modifyPhoto`, method: 'post', data: params })
}