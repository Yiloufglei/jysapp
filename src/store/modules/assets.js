import { walletAssetsLlist } from '@/api/assets'
export default {
    state: () => ({
        totalSum: {}, // 总资产
        accountSum: {}, // 账户总资产
        soptAccount: [], // 币币账户列表
        leverAccount: [], // 逐仓账户列表
        allLeverAccount: [], // 全仓账户列表
        legalAccount: [], // 法币账户列表
        qlistAccount: [], // 期权账户列表
        address: '',
        choiceType: '',
        selectCode: {},
        buySellType: '',
        addressType:'',//链接选择类型
        indexSelectItem:{},//首页列表选择对象
        scrollTop: 0, // 滚动条位置
    }),
    mutations: {
        SET_ASSETS_DATA(state, data) {
            state.totalSum = data.count_sum
            state.accountSum = data.sum_usdt
            state.soptAccount = data.Blist || []
            state.leverAccount = data.Plist || []
            state.allLeverAccount = data.Palist || []
            state.legalAccount = data.Flist || []
            state.qlistAccount =  data.Qlist || []
            let list = []
            switch (state.choiceType) {
                case "1":
                    list = state.leverAccount || [];
                    break;
                case "2":
                    list = state.soptAccount || [];
                    break;
                case "3":
                    list = state.legalAccount || [];
                    break;
                case "4":
                    list = state.qlistAccount || [];
                    break;
            }
            if(JSON.stringify(state.indexSelectItem) == '{}'){
                return false
            }
            let indexSelectItem = list.find( v => v.coin_name.toLowerCase() === state.indexSelectItem.coin_name.toLowerCase())
            if(indexSelectItem){
                state.indexSelectItem = indexSelectItem
            }
        },
        SET_ASSETS(state, data) {
            state.address = data
        },
        SET_INDEX_SELECTITEM(state, data) {
            state.indexSelectItem = data
        },
        SET_CHOICETYPE(state, data) {
            state.choiceType = data
        },
        SET_SELECT_CODE(state, data) {
            state.selectCode = data
        },
        SET_ADDRESS_TYPE(state, data) {
            state.addressType = data
        },
        SET_BUYSELL_TYPE(state, data) {
            state.buySellType = data
        },
        SET_TOTAL_SUM() {
            state.totalSum = data
        },
        SET_ASSETS_SCROLLTOP(state, val) {
            state.scrollTop = val
        },
    },
    actions: {
        //更新用户信息
        getwalletAssetsLlist({ commit }) {
            walletAssetsLlist().then(res => {
                commit('SET_ASSETS_DATA', res.data)
            })
        }
    },
}