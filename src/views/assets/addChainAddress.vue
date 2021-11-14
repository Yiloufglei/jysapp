<!-- 
  	author        MrYi
	time          2021/03/15
	description   新增链地址
 -->
<template>
	<div class="addChainAddress">
		<div class="title">地址：</div>
        <Input v-model="address" placeholder="请输入或者粘贴地址" />
		<div class="title">备注：</div>
        <Input v-model="remark" placeholder="请输入您需要备注的信息" />
		<div class="flexC_S swith_body">
			<p>设为默认地址</p>
            <van-switch v-model="value" size="20px"/>
		</div>
        <van-button class="van-mybutton" type="info" style="margin-top: 160px;" block @click="submit" :disabled="disabled">保存</van-button>
		<MySecondaryDialog
			:visible="dialogVisible"
			title="安全验证"
			:disabled="dialogBtnDisabled"
			@cancel="dialogVisible = false"
			@confirm="dialogConfirm"
			>
			<div class="dialog-content">
				<p class="dialog-sub-tilte">添加钱包地址时需要安全验证</p>
				<Input
					v-model="code"
					placeholder="请输入验证码"
				>
				<template v-slot:after>
					<SendCodeBtn ref="sendCode" :phone="phone" type="withdrawads" />
				</template>
				</Input>
				<p class="send-tips">验证码短信已发送至手机号{{ filterNumber }}</p>
			</div>
		</MySecondaryDialog>
	</div>
</template>

<script>
import { setWithdrawAddress } from "@/api/assets"
import SendCodeBtn from "@/components/sendCodeBtn"
import _get from "lodash/get"
	export default {
		name: 'addChainAddress',
		data() {
			return {
				value:false,
                address:'',
                remark:'',
				dialogVisible: false,
				code: ''
			}
		},
		computed:{
			routeQuery(){
				return this.$route.query.route
			},
            disabled(){
                if(this.address && this.remark){
                    return false
                }
                return true
            },
			dialogBtnDisabled() {
				return !this.code;
			},
			phone() {
				return _get(this.$store.state, 'user.userInfo.phone', '')
			},
			filterNumber() {
				return this.phone.slice(0, 3) + "****" + this.phone.slice(-4);
			},
		},
		components: {
			SendCodeBtn,
		},
		methods: {
			async dialogConfirm() {
                this.dialogVisible = false
				let obj = {
                    coin_name:this.$route.query.coin_name,
                    address:this.address,
                    remark:this.remark,
                    dft	:this.value ? 1 : 2,
					smsCode: this.code
                }
                setWithdrawAddress(obj).then(res =>{
                    this.$router.replace(`/chainAddress?route=${this.routeQuery}&coin_name=${this.$route.query.coin_name}`)
				    this.$router.go(-1)
                })
			},
			submit(){
				this.dialogVisible = true
			}
		},
		mounted() {},
	}
</script>

<style lang="scss" scoped>
.addChainAddress{
	height: 100%;
	padding: 10px 16px;
	.swith_body{
		height: 22px;
		font-size: 16px;
		margin-top: 20px;
	}
	.title{
		font-size: 16px;
		line-height: 22px;
		margin-top: 20px;
	}
	.input-content{
		padding: 12px 0;
	}
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
</style>
