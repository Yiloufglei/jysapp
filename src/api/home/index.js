
import http from '@/api/http.js'

export function getHome() {
  return http.request({ url: 'ads/index', method: 'get' })
}

// 佣金排行榜
export function agentRank(data) {
  return http.request({ url: 'agent/rank', method: 'post', data  })
}
