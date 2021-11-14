<template>
    <div class="buy-sell-dialog">
        <van-dialog v-model="show" :title="(type === 1 ? '购买' : '出售') + 'USDT'" :show-confirm-button="false">
			<div class="purchaseSell">
				<div class="unitPrice fzboid">单价 ¥ {{tradeItem.coin_price}}</div>
				<ul class="col-center color_c">
					<li :class="{color_b : sellType === 2}" @click="sellTypeClick(2)">按金额{{buySellText}}</li>
					<li :class="{color_b : sellType === 1}" @click="sellTypeClick(1)">按数量{{buySellText}}</li>
				</ul>
				<div class="ipt_body">
					<Input v-model="val" type="number" labelWidth="50px" :precision="sellType === 2 ? 2 : 6" :label="sellType === 2 ? 'CNY' : 'USDT'" >
						<template v-slot:after>
							<div class="t_c color_b" @click="allDone">全部{{buySellText}}</div>
						</template>
					</Input>
				</div>
				<div class="quota color_c">限额¥{{tradeItem.trans_min}} - ¥{{tradeItem.trans_max}}</div>
				<div class="tradeNumder color_c flexC_S" v-if="sellType === 2"><span>交易数量</span><span>{{tradeNumder}} USDT</span></div>
                <div class="tradeNumder color_c flexC_S" v-else><span>交易金额</span><span>{{tradeCny}} CNY</span></div>
			</div>
            <div class="flexC_S btn_body">
                <div style="width: 120px;"><van-button class="van-mybutton" type="info" block @click="initial">{{timeText}}s后自动取消</van-button></div>
                <div style="width: 110px;"><van-button class="van-mybutton" type="info" block @click="placeOrder" :disabled="disabled">下单</van-button></div>
            </div>
        </van-dialog>
		<!-- 出售下单时 法币支付密码验证 -->
        <MySecondaryDialog :visible="dialogVisible" title="安全验证" :disabled="!payPassword"
            @cancel="payCancel" @confirm="submitOrder">
            <div class="dialog-content">
                <Input v-model="payPassword" type="password" placeholder="请输入法币支付密码" style="text-align: center"></Input>
            </div>
        </MySecondaryDialog>
    </div>
</template>
<script>
import { transCreatOtcTrans } from '@/api/legalCurrencyTrade'
import { mapState } from "vuex"
import _find from 'lodash/find'
export default {
    name: 'buySellDialog',
    props: {
        //1买  2卖
        type: {
            type: Number,
            default: 1
        },
        isShow: {
            type: Boolean,
            default: false
        },
        tradeItem: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    computed: {
        ...mapState({
            legalAccount: (state) => state.assets.legalAccount,
        }),
        disabled(){
            if(this.sellType == 2 && this.val && this.val <= this.tradeItem.trans_max && this.val >= this.tradeItem.trans_min){
                return false
            }
            if(this.sellType == 1 && this.val && (this.val * this.tradeItem.coin_price <= this.tradeItem.trans_max) && (this.val * this.tradeItem.coin_price >= this.tradeItem.trans_min)){
                return false
            }
            return true
        },
        buySellText(){
            return this.type === 1 ?  '买入' : '出售'
        },
        tradeNumder(){
            let x = 0
            if(this.sellType == 1){
                x = this.val
            }
            if(this.sellType == 2){
                x = parseInt(this.val / this.tradeItem.coin_price  * 1000000) / 1000000
            }
            return x || 0
        },
        tradeCny() {
            return (this.val * this.tradeItem.coin_price).toFixed(2)
        }
    },
    data() {
        return {
            show: false,
            dialogVisible: false,
            payPassword: '',
            val:'',
            sellType: 2,
            timer: null,
            timeText: 60
        }
    },
    watch: {
        isShow(val) {
           this.show = val 
           if (val) {
               this.timer = setInterval(() => {
                    this.timeText --
                    if(this.timeText <= 0){
                        this.initial()
                    }
                },1000)
           }
        }
    },
    created() {
        this.show = this.isShow
    },
    methods: {
        getAccountObj(name) {
            return _find(this.legalAccount, {coin_name: name}) || {}
        },
        payCancel() {
            // 取消支付
            this.dialogVisible = false
            this.show = true
            this.payPassword = ''
        },
        sellTypeClick(type){
            this.sellType = type
            this.val = ''
        },
        allDone(){
            if(this.sellType == 1){
                // 按数量
                let x = this.tradeItem.over_num * this.tradeItem.coin_price
                let y = x > this.tradeItem.trans_max ? (this.tradeItem.trans_max / this.tradeItem.coin_price) : this.tradeItem.over_num
                const num = this.getAccountObj('usdt').num || 0
                // 卖出 添加账户余额判断
                y = this.type !== 1 ? (y < num ? y : num) : y
                this.val = parseInt(y * 1000000) / 1000000
            }
            if(this.sellType == 2){
                // 按金额
                let x = this.tradeItem.over_num * this.tradeItem.coin_price
                let y = x > this.tradeItem.trans_max ? this.tradeItem.trans_max : x
                const cny = (this.getAccountObj('usdt').num * this.tradeItem.coin_price).toFixed(2)
                // 卖出 添加账户余额判断
                this.val = this.type !== 1 ? (y < cny ? y : cny) : y
            }
        },
        initial(){
            if(this.timer){
                clearInterval(this.timer)
            }
            this.sellType = 2
            this.val = ''
            this.show = false
            this.$emit('cancel')
            this.timeText = 60
        },
        placeOrder(){
            if (this.type === 2) {
                // 卖出下单 显示密码支付弹窗
                this.dialogVisible = true
                this.show = false
                return
            }
            this.submitOrder()
        },
        submitOrder() {
            let obj = {
                poster_id: this.tradeItem.id,
                buy_or_sell:this.type,
                trans_type:this.sellType,
                sub_num: this.val,
            }
            if (this.type === 2) {
                obj.t_password = this.$md5(this.payPassword)
            }
            transCreatOtcTrans(obj).then(res => {
                this.initial()
                this.$store.commit('SET_ORDER_STATE', '1')
                this.$router.push(`/orderDetail?orderID=${res.data.tranid}&sellRole=${this.type}`)
            })
        },
    },
    beforeDestroy() {
        this.initial()
    }
}
</script>
<style lang="scss" scoped>
    .buy-sell-dialog{
        ::v-deep .publicDialog_content{
			border-radius: 0;
			.publicDialog_content_footer{
				padding: 20px 40px;
				.btn{
					font-size: 14px;
				}
			}
		}
        .btn_body{
            margin-top: 20px;
        }
        .van-button{
            padding: 0;
        }
		.purchaseSell {
			.title {
				font-size: 16px;
				line-height: 62px;
			}

			.unitPrice {
				font-size: 14px;
				line-height: 20px;
				margin-bottom: 20px;
			}

			ul {
				height: 20px;
				margin-bottom: 5px;
				li {
					margin-right: 20px;
					font-size: 16px;
				}
			}
			.tradeNumder{
				line-height: 20px;
			}
			.quota{
				line-height: 17px;
				margin: 12px 0 15px;
			}
			
		}
    }
</style>