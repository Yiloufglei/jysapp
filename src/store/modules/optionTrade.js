export default {
    state: () => ({
        symbol: 'btc/usdt',
        tradeBaseCoin: '',
        tabIndex: 0,
        holdTabIndex: 0,
        config: {},
        placeOrderList:[],
        placeConisOrderObj:{}
    }),
    mutations: {
        SET_PLACE_ORDER_LIST(state, value) {
            state.placeOrderList = value
            value.forEach(v => {
                state.placeConisOrderObj[v.symbol] = v
            });
        },
        SET_OPTION_TRADE_SYMBOL(state, value) {
            state.symbol = value
        },
        SET_OPTION_TRADE_BASE_COIN(state, val) {
            state.tradeBaseCoin = val
        },
        SET_OPTION_TRADE_TAB_INDEX(state, val) {
            state.tabIndex = val
        },
        SET_OPTION_TRADE_HOLD_TAB_INDEX(state, val) {
            state.holdTabIndex = val
        },
        SET_OPTION_TRADE_CONFIG (state, val) {
            state.config = val
        }
    }
}