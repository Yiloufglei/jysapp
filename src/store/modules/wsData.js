export default {
	state: () => ({
		clientId: '',
		klineData:{},
        overviewData:{},
        dealData:[],
        rankingData:[],
		symbol: 'btc_usdt',
		hqSymbol: '',
	}),
	getters: {
		clientId: state => state.clientId,
	},
	mutations: {
		SET_WS_CLIENTID(state, id) {
			state.clientId = id
		},
		SET_KLINE_DATA(state, data) {
			state.klineData = data
		},
        SET_KLINE_OVERDATA(state, data) {
			state.overviewData = data
		},
        SET_DEAL_DATA(state, data) {
			state.dealData = data
		},
        SET_RANKING_DATA(state, data) {
			state.rankingData = data
		},
		SET_SYMBOL(state, val) {
			state.symbol = val
        },
        SET_HQSYMBOL(state, val) {
			state.hqSymbol = val
		}
	}
}
