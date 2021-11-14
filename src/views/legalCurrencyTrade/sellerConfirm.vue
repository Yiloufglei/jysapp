<!-- 
  	author        MrYi
	time          2021/03/15
	description   等待卖家确认
 -->
<template>
	<div class="sellerConfirm publicOrderTradeStyle">
        <div class="publicOrderTrade_top flexC_S">
            <div class="top_l">
                <p class="fzboid top_l_t">{{orderDetail.state == 6 ? $constant.orderState[orderDetail.state] : '等待卖家确认'}}</p>
                <p class="color_c top_l_b" v-if="orderDetail.state == 6">等待后台处理，详情可联系客服</p>
				<p class="color_c top_l_b" v-else>订单预计会在5分钟内完成</p>
            </div>
            <img v-if="orderDetail.state != 6" class="right-icon" src="@/assets/imgs/wait-icon.png" alt="">
			<img v-else class="right-icon" src="@/assets/imgs/sigh-icon.png" alt="">
        </div>
        <div class="interval_bj"></div>
        <div class="purchaseMsg">
            <div class="purchaseMsg_top col-center"><i class="iconfont  iconUSDT buy-color"></i><span
                    class="fzboid upper">购买{{orderDetail.coin_name}}</span></div>
            <ul class="publicMsg">
                <li class="flexC_S"><span class="color_c">总价</span><span>¥{{orderDetail.cny}}</span></li>
                <li class="flexC_S"><span class="color_c">价格</span><span>¥{{orderDetail.coin_price}}</span></li>
                <li class="flexC_S upper"><span class="color_c">数量</span><span>{{$fomatFloat(orderDetail.num,6)}} {{orderDetail.coin_name}}</span></li>
                <li class="flexC_S">
                    <span class="color_c">订单号</span>
                    <span class="col-center">{{orderDetail.order_id}}
                        <i class="iconfont iconfuzhi" @click="$copyText(orderDetail.order_id)"></i>
                    </span>
                </li>
            </ul>
        </div>
        <div class="interval_bj"></div>
        <div class="purchaseType">
            <ul class="publicMsg">
                <li class="flexC_S" @click="pathRouter">
                    <span class="color_c">卖家昵称</span>
                    <span class="col-center">{{orderDetail.s_nickname || '--'}}
                        <i v-if="orderDetail.s_user_type == 2" class="iconfont iconyou1 color_c" style="font-size: 12px;"></i>
                    </span>
                </li>
                <li class="flexC_S">
                    <span class="color_c">收款方式</span>
                    <span class="col-center">
                        <i class="iconfont text_c" style="font-size: 12px;" :class="$iconClassName(orderDetail.pay_type)"></i>
                        {{$constant.paymentType[orderDetail.pay_type]}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="flexC_S fixed_content_btm" v-if="orderDetail.state != 6">
            <van-button class="van-mybutton button_body_l" type="info" block @click="cancelVisible = true" v-if="orderDetail.s_user_type == 2">取消订单</van-button>
            <van-button class="van-mybutton button_body_r" type="default" block @click="appeal">申诉</van-button>
        </div>
		<MySecondaryDialog :visible="cancelVisible" title="确认取消交易" @confirm="cancelConfirm" @cancel="cancelVisible = false" :disabled="!type">
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
	</div>
</template>

<script>
    import { pleasePayOtcTrans , transCleanOtcTrans} from '@/api/legalCurrencyTrade'
    import util from "@/utils/util";
	export default {
		name: 'sellerConfirm',
		data() {
			return {
				cancelVisible:false,
                orderDetail:{},
				type:false,
                timer:null
			}
		},
		components: {
		},
		methods: {
            pathRouter(){
                if(this.orderDetail.s_user_type == 2) this.$router.push(`/businessDetail?poster_uid=${this.orderDetail.puid}`)
            },
			appeal(){
                // 申述 带上当前url参数
                this.$router.push(`/appeal?${util.queryParams(this.$route.query)}`)
                
			},
			cancelConfirm() {
                transCleanOtcTrans({trans_id:this.orderDetail.id}).then(res => {
                    this.$toast({
                        message:'取消成功',
                    })
                    this.$store.commit('SET_ORDER_STATE', '4')
                })
			},
            init(){
                this.orderID = this.$route.query.orderID
                this.account_type = this.$route.query.account_type
                pleasePayOtcTrans({trans_id:this.orderID}).then(res => {
                    this.orderDetail = res.data.pay
                    if(this.orderDetail.state == 3){
                        clearInterval(this.timer)
                        this.$router.push(`/tradeSuccess?tradeType=1&cny=${this.orderDetail.cny}&num=${this.orderDetail.num}&coin_name=${this.orderDetail.coin_name}&id=${this.orderDetail.id}`)
                    }
                    if(this.orderDetail.state == 6){
                        clearInterval(this.timer)
                    }
                })
            }
		},
        beforeDestroy() {
			if(this.timer){
                clearInterval(this.timer)
            }
		},
		mounted() {
            this.init()
            this.timer = setInterval(() => {
                this.init()
            }, 3000);
        },
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
	.sellerConfirm{
		.fixed_content_btm{
			.button_body_l{
				margin-right: 10px;
			}
		}
	}
</style>
