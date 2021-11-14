import http from '@/api/http.js'

export function login(params) {
  return http.request({ url: 'user/login', method: 'post', data: params })
}