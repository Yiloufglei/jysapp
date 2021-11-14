import http from '@/api/http.js'

// 我的团队
export function myTeam(data) {
  return http.request({ url: 'agent/my_team', method: 'post', data })
}

// 邀请页面
export function invitation(data) {
  return http.request({ url: 'agent/invitation', method: 'post', data })   
}

// 我的业绩
export function myAchievement(data) {
  return http.request({ url: 'agent/my_achievement', method: 'post', data })   
}

// 业绩明细
export function detailAchievement(data) {
  return http.request({ url: 'agent/detail_achievement', method: 'post', data })
}

// 佣金收入明细
export function detailCommission(data) {
  return http.request({ url: 'agent/detail_commission', method: 'post', data })
}

// 邀请链接
export function inviteLink(data) {
  return http.request({ url: 'agent/invite_link', method: 'post', data })
}

// 团队业绩
export function teamAchievement(data) {
  return http.request({ url: 'agent/team_achievement', method: 'post', data })
}