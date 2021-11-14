import { mapGetters,mapState} from "vuex";

export default {
    computed: {
        ...mapGetters(["market_base_coin", "market_list", "trade_base_coin"]),
        ...mapState({
            coinConfig: (state) => state.coinConfig,
        }),
        marketTab() {
            let tab = Object.keys(this.market_list)
            tab.sort((o, t) => {
                return this.market_list[o].sort - this.market_list[t].sort
            })
            tab = tab.map(item => {
                if (item === 'optional') {
                    return {
                        key: item,
                        value: '自选'
                    }
                }
                return {
                    key: item,
                    value: item
                }
            })
            return tab;
        },
        isMarket() {
            // 是否行情页面
            return this.$route.name === 'Market'
        },
        curMarketList() {
            const key = this.isMarket ? this.market_base_coin : this.trade_base_coin
            let list = this.market_list[key]
            if (list) {
                list.symbollist.forEach(v => {
                    let info = this.coinConfig.info[v.symbol.toLowerCase()]
                    if(info){
                        v.info.price = this.$fomatFloat(Number(v.info.price || 0),info.basicCoinAccuracy)
                        v.info.quote_price = this.$fomatFloat(Number(v.info.quote_price || 0),info.rmbAccuracy)
                    }
                });
                return list.symbollist;
            } else return [];
        },
    },
    methods: {
        // 切换基币
        checkBaseCoin(coin) {
            const key = this.isMarket ? 'SET_MARKET_BASE_COIN' : 'SET_TRADE_BASE_COIN'
            this.$store.commit(key, coin);
        }
    },
}