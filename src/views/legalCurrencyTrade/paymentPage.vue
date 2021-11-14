<!-- 
  	author        MrYi
	time          2021/03/13
	description   支付页面
 -->
<template>
	<div class="paymentPage">
		<div class="surplus_time">
			<p class="title color_c">向卖家付款</p>
			<h2><span>¥</span>{{orderDetail.cny}}</h2>
			<div class="timeText color_c">支付剩余时间<span class="color_g">{{timeout}}</span></div>
			<div class="explain color_c upper">您正在向交易所认证的卖家购买{{$fomatFloat(orderDetail.num,6)}}{{orderDetail.coin_name}}</div>
		</div>
		<div class="interval_bj"></div>
		<div class="paymentPageMsg">
			<div class="userMsg col-center">
				<img src="@/assets/imgs/holdJustTemplate.png" @click="pathRouter"/>
				<span>{{orderDetail.s_nickname || '--'}}</span>
			</div>
			<ul class="col-center paymentGrade">
				<li class="col-center"><i class="iconfont iconrenzheng color_b"></i>已认证</li>
                <template v-if="orderDetail.s_user_type == 2">
                    <li class="col-center"><i class="iconfont icondaikuangailan color_gr"></i>已缴纳保证金</li>
				    <li class="col-center"><i class="iconfont icondanbao color_g"></i>担保交易</li>
                </template>
			</ul>
			<ul class="publicMsg">
				<li class="flexC_S"><span class="color_c">卖家姓名</span><span class="col-center">{{name}}<i @click="$copyText(name)" class="iconfont iconfuzhi"></i></span></li>
				<li class="flexC_S"><span class="color_c">{{$constant.paymentType[account.account_type]}}收款账号</span><span class="col-center">{{account.account}}<i @click="$copyText(account.account)" class="iconfont iconfuzhi"></i></span></li>
                <template v-if="account.account_type === 'unionpay'">
                    <li class="flexC_S"><span class="color_c">收款人姓名</span><span class="col-center">{{account.real_name}}<i @click="$copyText(account.real_name)" class="iconfont iconfuzhi"></i></span></li>
                    <li class="flexC_S"><span class="color_c">开户行</span><span class="col-center">{{account.third + account.third_child}}<i @click="$copyText(account.third + account.third_child)" class="iconfont iconfuzhi"></i></span></li>
                </template>
			</ul>
		</div>
		<div class="fixed_content_btm">
            <van-button class="van-mybutton" type="info" block @click="dialogVisible = true">我已付款成功</van-button>
		</div>
        <MySecondaryDialog :visible="dialogVisible" title="付款确认" 
            @cancel="dialogVisible = false" @confirm="submit">
            <div class="dialog-content">
                <p>请确认已向卖家付款</p>
                <p class="color_c">恶意点击将直接冻结账户</p>
            </div>
        </MySecondaryDialog>
        <MySecondaryDialog :visible="cancelTradeVisible" title="确认离开支付"  :disabled="!type" @confirm="cancelConfirm"
            @cancel="cancelTradeVisible = false">
            <div class="dialog-content">
                <p>如果您已付款<br/>请务必先点击“我已付款成功”</p>
                <p class="color_c">订单将在{{orderTimeout}}后超时取消</p>
            </div>
            <div class="check_body col-center">
                <van-checkbox v-model="type" icon-size="16px" shape="square"><span class="color_c">我确认还没付款给对方</span></van-checkbox>
            </div>
        </MySecondaryDialog>
	</div>
</template>

<script>
import { pleasePayOtcTrans , payConfirmOtcTrans } from '@/api/legalCurrencyTrade'
	export default {
		name: 'paymentPage',
		data() {
			return {
                dialogVisible:false,
                type:false,
                isBack:false,
                cancelTradeVisible:false,
                list:[],
                timer:null,
                name:'',
                timeout:'',
                orderDetail:{},
                orderID:'',
                account_type:''
            }
		},
        computed:{
            account(){
                return  this.list.find((val) => val.account_type == this.account_type) || 'unionpay'
            },
            orderTimeout() {
                let date = new Date(this.orderDetail.timeout*1000)
                return this.addZore(date.getHours()) + ':' + this.addZore(date.getMinutes()) + ':' + this.addZore(date.getSeconds())
            }
        },
		components: {
		},
        //离开当前页面
        beforeRouteLeave(to, from, next) {
            if(to.path == "/orderDetail" && !this.isBack){
                next(false)
                setTimeout(() =>{
                    this.cancelTradeVisible = true
                })
            }else{
                next(true)
            }
        },
        beforeDestroy() {
			if(this.timer){
                clearInterval(this.timer)
            }
		},
		methods: {
            addZore(num) {
                return num < 10 ? '0' + num : num
            },
            cancelConfirm(){
                this.isBack = true
                this.$router.go(-1)
            },
            pathRouter(){
                if(this.orderDetail.s_user_type == 1){
                    return
                }
                this.$router.push(`/businessDetail?poster_uid=${this.orderDetail.puid}`)
            },
			submit(){
                let obj = {
                    trans_id:this.orderID,
                    pay_type:this.account_type
                }
                payConfirmOtcTrans(obj).then(res => {
                    // 付款成功，待放币状态
                    this.$store.commit('SET_ORDER_STATE', '2')
                    this.isBack = true
                    this.$router.go(-1)
                })
			}
		},
		mounted() {
            this.orderID = this.$route.query.orderID
            this.account_type = this.$route.query.account_type
            pleasePayOtcTrans({trans_id:this.orderID}).then(res => {
                this.orderDetail = res.data.pay
                let endtime = this.orderDetail.timeout
                this.list = this.orderDetail.S_paymentinfo || []
                this.name = this.orderDetail.S_paymentinfo.find( v => v.account_type === this.account_type).real_name
                this.timer = setInterval(() => {
                    let startTime = Date.parse(new Date()) / 1000
                    if(endtime - startTime <= 0){
                        this.timeout = '00 : 00'
                        clearInterval(this.timer)
                        // this.$router.replace('/legalCurrencyTrade')
                        // 支付超时取消订单
                        this.$store.commit('SET_ORDER_STATE', '5')
                        this.isBack = true
                        this.$router.go(-1)
                        return
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
.paymentPage{
    height: calc(100% - 90px);
    overflow-y: auto;
    .dialog-content{
        padding-top: 40px;
        p{
            text-align: center;
            line-height: 20px;
            margin-bottom: 12px;
            font-size: 14px;
        }
    }
	.paymentPageMsg{
		padding: 0 16px;
		.userMsg{
			margin: 20px 0;
			font-size: 18px;
			img{
				width: 38px;
				height: 38px;
				border-radius: 50%;
				margin-right: 10px;
			}
		}
		.paymentGrade{
			height: 20px;
			margin-bottom: 20px;
			li{
				margin-right: 16px;
				.iconfont{
					font-size: 18px;
				}
			}
		}
	}
	.surplus_time{
		padding: 30px 0 20px 0;
		text-align: center;
		font-size: 14px;
		.title{
			line-height: 20px;
		}
		h2{
			font-size: 49px;
			font-weight: 500;
			line-height: 70px;
			margin: 16px 0 20px 0;
			span{
				font-size: 36px;
				margin-right: 17px;
			}
		}
		.timeText{
			line-height: 20px;
			span{
				margin-left: 10px;
			}
		}
		.explain{
			line-height: 20px;
			margin-top: 15px;
		}
	}
    .check_body{
        font-size: 14px;
    }
}
</style>
