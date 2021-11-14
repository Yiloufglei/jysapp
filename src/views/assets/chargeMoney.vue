<!-- 
  	author        MrYi
	time          2021/03/15
	description   提币
 -->
<template>
    <div class="chargeMoney upper">
        <myHeader title="提币">
            <template v-slot:right>
                <i class="iconfont iconshiyongjilu" @click="routerPath(`/chargeHistory?type=2&coin_name=${codeInfo.coin_name}`)"></i>
            </template>
        </myHeader>
        <div class="chargeMoney_body overflowPatible">
            <div class="selectCurrency-top">
                <div class="title fzboid">选择币种</div>
                <div class="select_li flexC_S border_b_c" @click="isSelectCurrency = true">
                    <span class="color_b">{{codeInfo.coin_name}}</span>
                    <i class="iconfont iconyou1"></i>
                </div>
                <div class="title fzboid">链名称</div>
            </div>
            <div class="selectContent">
                <div class="flex">
                    <div class="center clickBtn" v-for="(item,index) in dataInfo.link" :key="index"
                        :class="{active : addressType === index}" @click="switchAddressType(item,index)">
                        {{item.coin_link}}</div>
                </div>
                <div class="ipt_body">
                    <div class="title fzboid">提币地址</div>
                    <Input type="text" placeholder="请输入提币地址" v-model="address">
                        <template v-slot:after>
                            <div class="afterRight" style="padding-left: 20px;" @click="routerPath(`/chainAddress?route=chargeMoney&coin_name=${codeInfo.coin_name}`)"><i class="iconfont iconliebiao1"></i></div>
                        </template>
                    </Input>
                </div>
                <div class="ipt_body">
                    <div class="title fzboid">提币数量</div>
                    <Input type="number" :precision="codeInfo.withdraw_decimal" :placeholder="'最小提币数量' + (codeInfo.withdraw_min || '')" v-model="num">
                    <template v-slot:after>
                        <div class="afterRight">
                            <span class="color_c">{{codeInfo.coin_name}}</span><i style="margin: 0 15px;">|</i><span @click="num = codeInfo.bnum">全部</span>
                        </div>
                    </template>
                    </Input>
                    <p class="available color_c">可用：{{$fomatFloat((codeInfo.bnum || 0),(codeInfo.withdraw_decimal || 2)) + ' ' + (codeInfo.coin_name || '')}}</p>
                </div>
                <div class="ipt_body serviceCharge">
                    <div class="title fzboid">手续费</div>
                    <Input type="number" disabled v-model="codeInfo.withdraw_fee">
                    <template v-slot:after>
                        <div class="color_c afterRight">{{codeInfo.coin_name}}</div>
                    </template>
                    </Input>
                </div>
            </div>
            <ul class="explain color_c">
                <li>温馨提示</li>
                <li>1、为了资金安全，当您的账户安全策略发生变化，密码发生变动，我们将对提币进行手工审核，请耐心等待工作人员的电话或邮件联系。</li>
                <li>2、提币至上述地址后，网络节点需要确认可能存在一段时间的延迟，请耐心等待。</li>
                <li>3、请务必确保计算机和浏览器是安全的，以防止信息被篡改或泄露。</li>
            </ul>
            <div class="chargeMoneyOperation">
                <p class="flexC_S"><span>到账数量：</span><span>{{arrivalNum  + ' ' + (codeInfo.coin_name || '')}}</span></p>
                <van-button class="van-mybutton" type="info" block @click="openPasswordModal" :disabled="disabled">提币</van-button>
            </div>
        </div>
        <selectCurrency @select="select" :isShow.sync="isSelectCurrency" :list="list" />
        <MySecondaryDialog :visible="dialogVisible" title="安全验证" :disabled="dialogBtnDisabled"
            @cancel="dialogVisible = false" @confirm="submitNotice">
            <div class="dialog-content">
                <Input v-model="code" placeholder="请输入验证码">
                    <template v-slot:after>
                        <SendCodeBtn ref="sendCode" :phone="userInfo.phone" type="withdraw" />
                    </template>
                </Input>
                <p class="send-tips">验证码短信已发送至手机号{{ filterNumber }}</p>
            </div>
        </MySecondaryDialog>
    </div>
</template>

<script>
import SendCodeBtn from "@/components/sendCodeBtn";
import selectCurrency from "@/components/selectCurrency"
import { walletWithdrawCreat, walletCoinSet } from "@/api/assets"
import myHeader from '@/components/common/header'
import {
    mapState
} from 'vuex'
export default {
    name: 'chargeMoney',
    data () {
        return {
            dialogVisible:false,
            isSelectCurrency: false,
            num: '',
            list: [],
            code:'',
            dataInfo: {},
            from:{},
            address: '',
            addressType: 0,
            codeInfo: {},
            t_password: ''
        }
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.user.userInfo,
            storeAddress: (state) => state.assets.address,
            selectCode: (state) => state.assets.selectCode,
            storeAddressType: (state) => state.assets.addressType,
            filterNumber() {
                return this.userInfo.phone.slice(0, 3) + "****" + this.userInfo.phone.slice(-4);
            },
            dialogBtnDisabled() {
                return !this.code;
            },
        }),
        arrivalNum () {
            let x = this.$fomatFloat((this.num - (this.codeInfo.withdraw_fee || 0)),(this.codeInfo.withdraw_decimal || 2))
            return x < 0 ? 0 : x
        },
        disabled () {
            if (this.address && (this.num >= this.codeInfo.withdraw_min) && (this.num > 0)) {
                return false
            }
            return true
        }
    },
    components: {
        SendCodeBtn,
        myHeader,
        selectCurrency,
    },
    methods: {
        openPasswordModal () {
            let num = String(this.num)
            if (num.split('.')[1] && num.split('.')[1].length > this.codeInfo.withdraw_decimal) {
                this.$toast('最大精度' + this.codeInfo.withdraw_decimal)
                return
            }
            this.$dialog.confirm({
                title: '提币提醒',
                message: `是否提到${this.codeInfo.coin_link}的账户?`,
            })
            .then(() => {
                this.dialogVisible = true
            })
            .catch(() => {
                // on cancel
            });
            
        },
        submitNotice (val) {
            this.t_password = val
            this.submit()
        },
        select (item) {
            this.isSelectCurrency = false
            this.dataInfo = item
            this.codeInfo = item.link[0] || {}
            this.$store.commit('SET_SELECT_CODE', item)
        },
        submit () {
            let obj = {
                num: this.num,
                coin_name: this.codeInfo.coin_name,
                address: this.address,
                code:this.code,
                // t_password: this.t_password,
                coin_link: this.codeInfo.coin_link
            }
            walletWithdrawCreat(obj).then(() => {
                this.$store.commit('SET_ASSETS', '')
                this.$store.commit('SET_SELECT_CODE', {})
                this.$store.commit('SET_ADDRESS_TYPE', 0)
                this.$router.push('/assets')
            })
        },
        routerPath (url) {
            this.$router.push(url)
        },
        switchAddressType (val, index) {
            this.addressType = index
            this.codeInfo = val
            this.$store.commit('SET_ADDRESS_TYPE', this.addressType)
        },
        getwalletCoin () {
            walletCoinSet({ operation: 2 }).then(res => {
                let data = res.data.list || []
                this.list = data
                if (this.storeAddressType) {
                    this.addressType = this.storeAddressType
                }
                if (this.selectCode.coin_name) {
                    this.dataInfo = this.selectCode
                    this.codeInfo = this.selectCode.link[this.addressType]
                    return
                }
                let coin_name = this.$route.query.coin_name
                if (coin_name) {
                    this.dataInfo = data.find(v => v.coin_name.toLowerCase() === coin_name.toLowerCase())
                    this.codeInfo = this.dataInfo.link[this.addressType]
                    return
                }
                this.dataInfo = data[0] || {}
                this.codeInfo = data[0] && data[0].link[this.addressType] || {}
            })
        },
        init () {
            this.getwalletCoin()
        }
    },
    mounted () {
        if (this.$route.query.address) {
            this.address = this.$route.query.address
            this.$store.commit('SET_ASSETS', this.address)
            this.$router.go(-1)
        } else {
            if (this.storeAddress) {
                this.address = this.storeAddress
            }
        }
        this.init();
    },
}
</script>

<style lang="scss" scoped>
@import "./index.scss";

.chargeMoney {
    height: 100%;
    .chargeMoney_body {
        padding: 0 16px 90px;
        height: calc(100% - 45px);
        overflow: auto;
    }
    .dialog-content {
        padding: 0 15px;

        .dialog-sub-tilte {
            color: #bdbdbd;
            text-align: center;
            margin: 17px 0;
        }

        .send-tips {
            color: #d9021c;
            font-size: 11px;
            margin: 7px 0 22px;
        }
    }

    .ipt_body {
        .afterRight {
            font-size: 16px;
        }

        .title {
            margin-top: 20px;
        }

        .available {
            font-size: 12px;
            line-height: 17px;
            margin-top: 8px;
        }
    }

    .serviceCharge {
        ::v-deep .input-content input {
            background-color: #ffffff;
        }
    }

    .explain {
        margin-top: 40px;
    }

    .chargeMoneyOperation {
        position: fixed;
        padding: 0 16px;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 90px;
        background: #ffffff;
        box-shadow: 0px -3px 6px rgba(118, 118, 118, 0.16);

        p {
            font-size: 16px;
            line-height: 22px;
            margin: 8px 0 10px;
        }
    }
}
</style>
