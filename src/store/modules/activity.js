export default {
	state: () => ({
		myGold: {
            have: 0,
            total: 0,
            wait: 0,
            totalRMB: 0
        }
	}),
	mutations: {
		SET_MY_GOLD(state, val) {
            Object.assign(state.myGold, val)
        },
	}
}
