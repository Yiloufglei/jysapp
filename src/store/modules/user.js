export default {
    state: () => ({
        userInfo: {},
        token: '',
        mySymbols:[],
        tradeArea:'',
        inviteCode:''
    }),
    mutations: {
        SET_USER_INFO(state, info) {
            state.userInfo = info
        },
        SET_INVITE_CODE(state, data) {
            state.inviteCode = data
        },
        SET_TOKEN(state, token) {
            state.token = token
        },
        SET_USER_IMG(state, img) {
            state.userInfo.img = img
        },
        //行为
        SET_USER_BEHAVIOR(state, data){
            state[data.key] = data.val
        }
    },
    actions: {}
}