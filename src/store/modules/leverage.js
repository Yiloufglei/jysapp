export default {
    state: () => ({
        leverageType: '', // 配资类型
        coinName: '' // 币种名称
    }),
    mutations: {
        SET_LEVERAGE_TYPE(state, type) {
            state.leverageType = type
        },
        SET_COIN_NAME(state, val) {
            state.coinName = val
        }
    }
}