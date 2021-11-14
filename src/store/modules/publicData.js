import {
    getUsdtCnyRate
} from '@/api/common'
export default {
    state: () => ({
        usdt_cny: 0, // usdt 对人民币价格
    }),
    getters: {
        usdt_cny: state => state.usdt_cny,
    },
    mutations: {
        SET_USDT_CNY(state, price) {
            state.usdt_cny = price.toFixed(2)
        },
    },
    actions: {
        async set_usdt_cny({
            commit
        }) {
            const {
                data
            } = await getUsdtCnyRate()
            commit('SET_USDT_CNY', data.price)
        }
    }
}