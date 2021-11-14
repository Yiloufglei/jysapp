export default {
    state: () => ({
        legalCurrencyTrade: {
            comeinPath: ''
        }
    }),
    mutations: {
        SET_COMEIN_PATH(state, { model, path }) {
            state[model].comeinPath = path
        }
    },
    actions: {}
}