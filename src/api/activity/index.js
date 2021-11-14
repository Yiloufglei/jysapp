import http from '@/api/http'

// 我的奖金
export function taskMyGold(params) {
  return http.request({ url: 'task/myGold', method: 'get', params })
}

// 任务列表
export function taskIndex(params) {
    return http.request({ url: 'task/index', method: 'get', params })
}
// 领取奖金
export function taskWinPrise(params) {
    return http.request({ url: 'task/winPrise', method: 'get', params })
}
// 划转
export function taskTransfer(data) {
    return http.request({ url: 'task/transfer', method: 'post', data })
}
// 划转记录
export function taskTransferRecord(params) {
    return http.request({ url: 'task/transferRecord', method: 'get', params })
}

// 活动列表
export function activityList(params) {
    return http.request({ url: 'activity/index', method: 'get', params })
}
// 活动详情
export function activityDetail(params) {
    return http.request({ url: 'activity/detail', method: 'get', params })
}
// 关于我们
export function aboutDetail(params) {
    return http.request({ url: 'about/detail', method: 'get', params })
}