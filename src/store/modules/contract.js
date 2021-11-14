export default {
    state: () => ({
        contractSymbol: '',
        tradeBaseCoin:''
    }),
    mutations: {
        SET_CONTRACT_SYMBOL(state, value) {
            state.contractSymbol = value
        },
        SET_CONTRACT_TRADE_BASE_COIN(state, val) {
            state.tradeBaseCoin = val
        },
    }
}