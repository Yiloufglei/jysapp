import http from '@/api/http.js'

// 注册
export function register(params) {
  return http.request({ url: 'user/register', method: 'post', data: params })
}