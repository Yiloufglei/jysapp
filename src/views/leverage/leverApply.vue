<template>
    <div class="upper" v-if="Object.keys(cTypeData).length" style="height: calc(100% - 58px);">
        <div class="overflowPatible_box">
            <section class="type-tab between">
                <dl :class="{'type-tab-active': Number(cType) === item.id,}" v-for="item in list" :key="item.id" @click="checkType(item)">
                    {{ item.productName }}
                </dl>
            </section>
            <section class="content-box">
                <div class="content">
                    <div class="free-tips" v-if="cTypeData.typeFlag === 4">
                        <i
                            class="tips-icon"></i>【提示】免息配资操作{{ cTypeData.days }}天，盈亏自负，如有盈利，交易所仅收取{{ cTypeData.shareRatio }}%盈利分成
                    </div>
                    <div class="col-center topItem_ul">
                        <ListItem style="flex: 1" class="upper" front="配资交易对" :end="symbol.coinName"
                            @click.native="showSymbolList = true"></ListItem>
                        <i class="iconfont iconyou1" style="color: #999999"></i>
                    </div>
                    <div class="topItem_ul">
                        <ListItem front="风险保证金" class="upper">
                        <Input padding="0" :max="cTypeData.maxMoney" bmColor="#fff" :precision="4" class="input" type="number" v-model="buyNum" :isFocus="false" :placeholder="`最少${cTypeData.mixMoney}，最多${cTypeData.maxMoney}`" />
                    </ListItem>
                    </div>
                    <ListItem front="申请额度" :border="false"></ListItem>
                    <Multiple :multipleData="multipleData" :rate="cTypeData.rate" :buyNum="buyNum"
                        @select="(m) => (multiple = m)" />
                    <ul class="item_ul">
                        <li class="flexC_S"><div><p>持仓时间</p></div><span class="color_c">{{takePosTime}}</span></li>
                        <li class="flexC_S"><div><p>风险保证金</p></div><span class="color_c">{{securityFund + ' ' + coinBase}}</span></li>
                        <li class="flexC_S"><div><p>亏损警戒线</p><span class="color_c">{{'配资资金+保证金*' + config.alertRate}}</span></div><span class="color_c">{{warningLine + ' ' + coinBase}}</span></li>
                        <li class="flexC_S"><div><p>亏损平仓线</p><span class="color_c">{{'配资资金+保证金*' + config.closeRate}}</span></div><span class="color_c">{{closeLine + ' ' + coinBase}}</span></li>
                        <li class="flexC_S"><div><p>总配资资金</p><span class="color_c">{{'配资资金+保证金'}}</span></div><span class="color_c">{{totalLeverFund + ' ' + coinBase}}</span></li>
                        <li class="flexC_S"><div><p>预存管理费</p><span class="color_c">{{'配资资金*日利率*' + cTypeData.days}}</span></div><span class="color_c">{{prestoreCost + ' ' + coinBase}}</span></li>
                    </ul>
                    <div class="service-protocol col-center">
                        <van-checkbox v-model="check" icon-size="16px" shape="square">我已阅读并知晓</van-checkbox>
                        <router-link to="/">《交易所服务协议》</router-link>
                    </div>
                    <div class="balance">
                        <dl>账户余额：{{ $fomatFloat(balance,4) }} {{coinBase}}</dl>
                        <dl>
                            共应支付：{{ $fomatFloat((Number(buyNum) + Number(prestoreCost) || 0),4) }} {{coinBase}}
                        </dl>
                    </div>
                    <van-button class="van-mybutton" type="info" style="margin-top: 15px" block @click="apply" :disabled="disabled">立即申请</van-button>
                </div>
            </section>
        </div>
        <div class="symbol-list" v-show="showSymbolList">
            <div class="symbol-header">
                <h2>选择币对</h2>
                <div class="col-center">
                    <div class="search-box col-center">
                        <i class="iconfont iconsousuo"></i>
                        <input class="search upper" type="text" v-model="symbolSearch" placeholder="搜索币种" />
                    </div>
                    <span class="cencel-btn" @click="hideSymbolList">取消</span>
                </div>
            </div>
            <ul class="list">
                <li class="symbol-item upper" v-for="coin in symbolList" :key="coin.id" @click="chooseSymbol(coin)">
                    <span>{{ coin.symbolArr[0] }}</span>
                    <span> / {{ coin.symbolArr[1] }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import ListItem from "@/components/listItem";
import Multiple from "./multiple";
import { getLeverApply, applyLever } from "@/api/leverage";
import { mapState } from "vuex";

export default {
    components: { ListItem, Multiple },
    data () {
        return {
            check: false,
            buyNum: "",
            balance: 0, // 账户余额
            list: [],
            config: {},
            multiple: 0, // 已选择的倍数
            showSymbolList: false,
            symbolSearch: "",
            symbol: {}, // 币对
        };
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.user.userInfo,
            cType: (state) => state.leverage.leverageType,
            coinName: (state) => state.leverage.coinName
        }),
        disabled(){
            if(this.cTypeData.productStatus == 1 && this.check && this.buyNum){
                return false
            }
            return true
        },
        // 当前类型数据
        cTypeData () {
            if (this.list.length) {
                const ctd = this.list.find((item) => item.id === this.cType);
                return ctd ? ctd : {}
            }
            return {};
        },
        coinBase () {
            return this.symbol.coinBase
        },
        // 币对列表
        symbolList () {
            const list = this.cTypeData.coins.map((item) => {
                item.symbolArr = item.coinName.split("/");
                return item;
            });
            if (this.symbolSearch) {
                return list.filter((item) => {
                    return item.coinName.includes(this.symbolSearch);
                });
            }
            return list;
        },
        // 当前类型倍数
        multipleData () {
            const cData = this.cTypeData.multiples;
            if (cData) {
                return cData.split(",");
            } else return [];
        },
        // 持仓时间
        takePosTime () {
            if (this.cTypeData.typeFlag === 4) return "不可续期";
            else return "自动续期" || "";
        },
        // 配资资金
        leverFund () {
            return this.$fomatFloat((this.buyNum * this.multiple),4)
        },
        // 风险保证金
        securityFund () {
            if (Number(this.buyNum)) return this.$fomatFloat(Number(this.buyNum),4);
            else return "0.0000";
        },
        // 亏损警戒线
        warningLine () {
            if(Number(this.leverFund)){
                return this.$fomatFloat((Number(this.leverFund) + this.buyNum * (this.config.alertRate) / 100),4);
            }
            return "0.0000";
        },
        // 平仓线
        closeLine () {
            if(Number(this.leverFund)){
                return this.$fomatFloat((Number(this.leverFund) + this.buyNum * (this.config.closeRate) / 100),4);
            }
            return "0.0000";
        },
        // 总配资资金
        totalLeverFund () {
            if(Number(this.leverFund)){
                return this.$fomatFloat((Number(this.leverFund) + Number(this.buyNum)),4);
            }
            return "0.0000";
        },
        // 预存管理费
        prestoreCost () {
            if(Number(this.leverFund)){
                return this.$fomatFloat((Number(this.leverFund) *this.cTypeData.days *(this.cTypeData.rate) / 100),4);
            }
            return "0.0000";
        },
    },
    methods: {
        hideSymbolList () {
            this.symbolSearch = "";
            this.showSymbolList = false;
        },
        chooseSymbol (coin) {
            this.symbol = coin;
            this.showSymbolList = false;
            // 选择币对，更新vuex中币种名称
            this.$store.commit('SET_COIN_NAME', coin.coinName.split('/')[0])
        },
        checkType (item) {
            this.$store.commit('SET_USER_BEHAVIOR',{key:'fundingArea',val:item.id})
            if (this.cType !== item.id) {
                this.$store.commit('SET_LEVERAGE_TYPE', item.id)
                // 切换配资方案
                if (JSON.stringify(this.cTypeData) !== {}) {
                    // 更新币种，传入当前币种对象信息
                    this.updateSymbol(this.symbol)
                }
            }
        },
        updateSymbol(obj) {
            // object类型 表示传入币对对象，string类型表示传入币种名称
            const tempSymbol = this.cTypeData.coins.find(item => {
                return typeof obj !== 'string' ? obj.Id === item.Id : obj === item.coinName.split('/')[0]
            })
            if (!obj || !tempSymbol) {
                // 如果没有缓存 或者 币对不在方案中，默认选中第一个币种，更新缓存中的币种名称
                this.symbol = this.cTypeData.coins[0];
                this.$store.commit('SET_COIN_NAME', this.symbol.coinName.split('/')[0])
            } else {
                this.symbol = tempSymbol
            }
        },
        apply () {
            if (Number(this.userInfo.authGrade) === 1) {
                return this.$dialog.confirm({
                    title: '温馨提示',
                    confirmButtonText:'去认证',
                    message: `需要实名认证后方可操作`,
                })
                .then(() => {
                    this.$router.push({ path: "/identityCard" });
                })
                .catch(() => {
                    // on cancel
                });
            }
            let bNum = Number(this.buyNum);
            if (bNum < this.cTypeData.mixMoney) {
                return this.$toast({
                    message: `风险保证金最小单位为${this.cTypeData.mixMoney}`,
                });
            }
            if (bNum + Number(this.prestoreCost) > this.balance) {
                return this.$toast({
                    message: "账户余额不足",
                });
            }
            if (bNum % this.config.minAllocationMoney !== 0) {
                return this.$toast({
                    message: `风险保证金最小公倍数为${this.config.minAllocationMoney}`,
                });
            }
            this.applyLever();
        },
        async getLeverApply () {
            const { data } = await getLeverApply();
            this.list = data.data || [];
            this.config = data.configs;
            this.balance = data.availables;
            if (this.cType === '') {
                // 如果配资配型为空，默认显示配资列表第一个
                this.$store.commit('SET_LEVERAGE_TYPE', this.list[0].id)
            }
            // 更新币种，传入缓存中的币种名称
            this.updateSymbol(this.coinName)
        },
        async applyLever () {
            await applyLever({
                pid: this.cTypeData.id,
                bonds: this.buyNum,
                multiple: this.multiple,
                cid: this.symbol.Id,
            });
            this.$toast({ message: "申请成功"});
            setTimeout(() => {
                this.$router.push({ path: "/leverage/leverageList" });
            }, 1500);
        },
    },
    created () {
        this.getLeverApply();
    },
    watch: {
        showSymbolList: function (newVal) {
            if (newVal) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.type-tab {
    padding:5px 30px 10px ;
    dl {
        color: #9c9ba5;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        &.type-tab-active {
            color: $main-blue;
        }
    }
}
.topItem_ul {
    ::v-deep .item {
        dl{
            &:nth-child(1){
                color: #000;
            }
        }
        .end{
            color: #999;
        }
    }
    .input {
        ::v-deep input{
            text-align: right;
        }
        &::placeholder {
            color: $c-999;
        }
    }
}

.item_ul{
    li{
        padding: 12px 0 10px;
        border-bottom: 1px solid #f5f5f5;
        div{
            display: flex;
            flex-flow: column;
            p{
                line-height: 20px;
                margin-bottom: 10px;
            }
            span{
                font-size: 12px;
                line-height: 17px;
            }
        }
    }
}
.content-box {
    background: #f9f9f9;
    padding: 10px 16px;
}
.content {
    padding: 20px 14px;
    background: #fff;
    border-radius: 12px;
    .free-tips {
        color: #fd9e00;
        font-size: 14px;
    }
    .tips-icon {
        width: 17px;
        height: 16px;
        display: inline-block;
        background: url("~@/assets/imgs/tips-icon.png") no-repeat;
        background-size: contain;
        vertical-align: middle;
    }
    
}
.service-protocol {
    font-size: 12px;
    margin: 20px 0;
    i {
        width: 20px;
        height: 20px;
        display: inline-block;
        background: url("~@/assets/imgs/checked-icon.png") no-repeat;
        background-size: contain;
        margin-right: 10px;
    }
    a {
        color: $main-blue;
    }
}
.balance {
    dl {
        flex: 1;
        color: $main-blue;
        line-height: 20px;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 10px;
    }
}
.symbol-list {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 1000;
    overflow-y: scroll;
    padding: 0 16px;
    .symbol-header {
        position: fixed;
        left: 16px;
        top: 0;
        right: 16px;
        background: #fff;
        padding-top: 16px;
    }
    h2 {
        text-align: center;
        font-size: 17px;
        font-weight: 500;
        margin-bottom: 20px;
    }
    .search-box {
        height: 32px;
        line-height: 32px;
        border: 1px solid #e6e6e6;
        border-radius: 6px;
        padding: 0 16px;
        flex: 1;
        .iconsousuo {
            font-size: 17px;
            color: #e6e6e6;
            margin-right: 16px;
        }
        .search {
            width: 100%;
            font-size: 14px;
            font-weight: 500;
            flex: 1;
            &::placeholder {
                color: #e6e6e6;
            }
        }
    }
    .cencel-btn {
        padding-left: 20px;
        color: #9b9b9b;
    }
    .list {
        padding-top: 100px;
        .symbol-item {
            padding: 16px 0;
            border-bottom: 1px solid #e6e6e6;
            span {
                font-weight: 500;
                &:last-child {
                    color: #9c9ba5;
                }
            }
        }
    }
}
</style>