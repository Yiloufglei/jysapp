export default {
    state: () => ({
        market_base_coin: 'optional', // 行情当前基币 默认显示自选
        trade_base_coin: '', // 交易当前基币 默认非自选第一个
        market_list: [], // 行情列表数据
    }),
    getters: {
        market_base_coin: state => state.market_base_coin,
        market_list: state => state.market_list,
        trade_base_coin: state => state.trade_base_coin
    },
    mutations: {
        SET_MARKET_BASE_COIN(state, symbol) {
            state.market_base_coin = symbol
        },
        SET_TRADE_BASE_COIN(state, symbol) {
            state.trade_base_coin = symbol
        },
        SET_MARKET_LIST(state, list) {
            state.market_list = list
        }
    }
}