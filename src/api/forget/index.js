import http from '@/api/http'

export function forgetValid(params) {
  return http.request({ url: 'user/find_password', method: 'post', data: params })
}
export function resetPwd(params) {
  return http.request({ url: 'user/set_password', method: 'post', data: params })
}