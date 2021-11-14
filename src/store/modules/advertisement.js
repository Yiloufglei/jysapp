export default {
	state: () => ({
		advertiserInfo:{}
	}),
	mutations: {
		SET_ADDETAILS(state, val) {
            state.advertiserInfo = val
        },
	}
}
