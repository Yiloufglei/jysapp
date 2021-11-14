import axios from 'axios'
import qs from 'qs'
import { Toast } from 'vant';
import store from '@/store'

const instance = axios.create({
	baseURL: process.env.VUE_APP_API_HOST,
	timeout: 1000 * 30
})

instance.interceptors.request.use(config => {
	if (config.method === 'post') {
		let isStringify = config.isStringify || "true"
		config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
		config.data = isStringify === 'true' ? qs.stringify(config.data) : config.data
	}
	config.headers['authtoken'] = store.state.user.token
	return config
}, err => {
	console.log('request err:', err)
	Toast({ message: err })
	return Promise.reject(err)
})

instance.interceptors.response.use(res => {
	const { data } = res
	if (data.code === 0) {
		return Promise.resolve(data)
	} else if (data.code === 401) {
		const p = location.protocol
		const h = location.host
		store.commit('REMOVE_INFO')
		setTimeout(() => {
			location.href = `${p}//${h}/#/login`
		}, 0)
		return Promise.reject(data)
	}else {
		// 没返回msg不做提示
		if (data.msg) {
			Toast({ message: data.msg })
		}
		return Promise.reject(data)
	}
}, err => {
    if(err && err.response && err.response.status == 502){
        const p = location.protocol
        const h = location.host
        store.commit('REMOVE_INFO')
        setTimeout(() => {
            location.href = `${p}//${h}/#/maintenance`
        }, 0)
    }
	Toast({ message: err.message })
	return Promise.reject(err)
})

export default instance
