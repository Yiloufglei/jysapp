<!-- 
  	author        MrYi
	time          2021/03/13
	description   待付款
 -->
<template>
	<div class="stayPayment publicOrderTradeStyle">
		<div class="publicOrderTrade_top flexC_S">
			<div class="top_l">
				<p class="fzboid top_l_t">请付款</p>
				<p class="color_c top_l_b">付款时间剩余<span class="color_b">{{timeout}}</span> </p>
			</div>
			<img class="right-icon" src="@/assets/imgs/wait-icon.png" alt="">
		</div>
		<div class="interval_bj"></div>
		<div class="purchaseMsg">
			<div class="purchaseMsg_top col-center"><i class="iconfont iconUSDT buy-color"></i><span
					class="fzboid upper">购买{{orderDetail.coin_name}}</span></div>
			<ul class="publicMsg">
				<li class="flexC_S"><span class="color_c">总价</span><span>¥{{orderDetail.cny}}</span></li>
				<li class="flexC_S"><span class="color_c">价格</span><span>¥{{orderDetail.coin_price}}</span></li>
				<li class="flexC_S upper"><span class="color_c">数量</span><span>{{$fomatFloat(orderDetail.num,6)}} {{orderDetail.coin_name}}</span></li>
				<li class="flexC_S">
                    <span class="color_c">订单号</span>
                    <span class="col-center">{{orderDetail.order_id}}<i class="iconfont iconfuzhi" @click="$copyText(orderDetail.order_id)"></i></span>
                 </li>
			</ul>
		</div>
		<div class="interval_bj"></div>
		<div class="purchaseType">
			<ul class="publicMsg">
				<li class="flexC_S" @click="pathRouter">
                    <span class="color_c">卖家昵称</span><span class="col-center">{{orderDetail.s_nickname || '--'}}
                        <i  v-if="orderDetail.s_user_type == 2" class="iconfont iconyou1 color_c"	style="font-size: 12px;"></i>
                    </span>
                </li>
				<li class="flexC_S"><span class="color_c">卖家姓名</span>
                    <span class="col-center">{{paymentObj.real_name || "--"}}<i class="iconfont iconfuzhi" @click="$copyText(paymentObj.real_name)"></i></span>
                </li>
				<li class="flexC_S" @click="visible = true"><span class="color_c">收款方式</span>
                    <span class="col-center"><i class="iconfont  text_c" style="font-size: 12px;" :class="$iconClassName(paymentObj.account_type)"></i>
                    {{$constant.paymentType[paymentObj.account_type]}}<i class="iconfont iconyou1 color_c" style="font-size: 12px;"></i></span></li>
			</ul>
		</div>
		<div class="flexC_S fixed_content_btm">
            <van-button class="van-mybutton button_body_l" type="default" block  @click="cancelVisible = true" v-if="orderDetail.s_user_type == 2">取消订单</van-button>
            <van-button class="van-mybutton button_body_r" type="info" block  @click="paymentConfirm">去付款</van-button>
		</div>
		<MySecondaryDialog :visible="cancelVisible" title="确认取消交易" @confirm="cancelConfirm" @cancel="cancelVisible = false"  :disabled="!type">
			<div class="cancelSecondaryDialog_body">
				<p class="title_text">如果您已向买家付款，请不要取消交易</p>
				<div class="color_c flex cancelConfirm_body">
					<div class="left">取消规则：</div>
					<div class="right">买家当天累计取消4笔会限制当日买入功能</div>
				</div>
				<div class="check_body col-center">
                    <van-checkbox v-model="type" icon-size="16px" shape="square"><span class="color_c">我确认还没付款给对方</span></van-checkbox>
				</div>
			</div>
		</MySecondaryDialog>
        <van-action-sheet
            v-model="visible"
            :actions="setList"
            cancel-text="取消"
            close-on-click-action
            @select="itemClick"
            @cancel="visible = false"
            close-on-popstate
            description='选择付款方式'
            safe-area-inset-bottom
        />
	</div>
</template>

<script>
    import {  pleasePayOtcTrans , transCleanOtcTrans} from '@/api/legalCurrencyTrade'
	export default {
		name: 'stayPayment',
		data() {
			return {
                visible:false,
				paymentVisible:false,
				cancelVisible:false,
				type:false,
                orderDetail:{},
                paymentObj:{},
                list:[],
                timer:null,
                timeout:'',
                orderID:'',
                slidelist: [
                    { name: '银行卡', id: 1, type: 'unionpay' },
                    { name: '微信', id: 2, type: 'wechat' },
                    { name: '支付宝', id: 3, type: 'alipay' },
                ],
			}
		},
		components: {
		},
		methods: {
            itemClick (item) {
                this.paymentObj = this.list.find((val) => val.account_type == item.type)
                this.visible = false
            },
			paymentConfirm() {
				this.$router.push(`/paymentPage?orderID=${this.orderID}&account_type=${this.paymentObj.account_type}`)
			},
			cancelConfirm() {
                transCleanOtcTrans({trans_id:this.orderDetail.id}).then(res => {
					// 用户取消
					this.$store.commit('SET_ORDER_STATE', '4')
                })
			},
            pathRouter(){
                if(this.orderDetail.s_user_type == 2) this.$router.push(`/businessDetail?poster_uid=${this.orderDetail.puid}`)
            }
		},
        computed:{
            setList () {
                let arr = []
                this.slidelist.forEach(item => {
                    let data = this.list.find((val) => val.account_type == item.type)
                    if(data){
                        arr.push(item)
                    }
                    arr.forEach((v) => {
                        if(v.id === this.paymentObj.id){
                            v.color = '#4e82f3'
                        }
                    })
                    return arr
                });
                return arr
            }
        },
        beforeDestroy() {
			if(this.timer){
                clearInterval(this.timer)
            }
		},
		mounted() {
            this.orderID = this.$route.query.orderID
            pleasePayOtcTrans({trans_id:this.orderID}).then(res => {
                this.orderDetail = res.data.pay
                let endtime = this.orderDetail.timeout
                this.list = this.orderDetail.S_paymentinfo || []
                this.paymentObj = this.list[0] || {}
                this.timer = setInterval(() => {
                    let startTime = Date.parse(new Date()) / 1000
                    if(endtime - startTime <= 0){
                        clearInterval(this.timer)
                        this.$router.replace('/legalCurrencyTrade')
                    }
                    let time = Math.abs(endtime - startTime)
                    let hour = parseInt(time / 60);
                    let minute = time % 60;
                    hour = hour < 10 ? '0' + hour : hour
                    minute = minute < 10 ? '0' + minute : minute
                    this.timeout = hour + ':' + minute
                }, 1000);
            })
        },
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';

	.stayPayment {
		.fixed_content_btm {
			.button_body_l {
				width: 110px;
				margin-right: 10px;
				font-size: 14px;
			}

			.button_body_r {
				flex: 1;
			}
		}
		.paymentSecondaryDialog_body{
			padding: 50px 0 10px;
			font-size: 14px;
			line-height: 20px;
			.title_text{
				margin-bottom: 12px;
			}
		}
	}
</style>
