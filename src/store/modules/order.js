export default {
    state: () => ({
        // 订单状态
        orderState: '',
        aid: '', // 订单申诉id
    }),
    mutations: {
        SET_ORDER_STATE(state, val) {
            state.orderState = val
        },
        SET_ORDER_AID(state, val) {
            state.aid = val
        }
    },
    actions: {}
}