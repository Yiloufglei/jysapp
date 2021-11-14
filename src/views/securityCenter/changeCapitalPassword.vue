<!-- 
  	author        MrYi
	time          2021/03/17
	description   修改资金密码
 -->
<template>
	<div class="changeCapitalPassword">
		<Input type="text" v-model="phone" :maxlength="11" placeholder="请输入注册时手机号"></Input>
		<Input type="text" v-model="code" placeholder="输入验证码" :maxlength="4">
			<template v-slot:after>
				<SendCodeBtn ref="sendCode" :phone="phone" type="modifyTpassword" />
			</template>
		</Input>
		<Input :type="pwd1Show ? '' : 'password'" v-model="password" :maxlength="6" placeholder="请输入6位支付密码" autocomplete="new-password">
            <template v-slot:after>
                <i class="iconfont" :class="{'iconxianshi':pwd1Show,'iconicon-test':!pwd1Show}" @click="pwd1Show = !pwd1Show"></i>
            </template>
        </Input>
		<Input :type="pwd2Show ? '' : 'password'" :maxlength="6" v-model="tpassword" placeholder="请再次输入支付密码" autocomplete="new-password">
            <template v-slot:after>
                <i class="iconfont" :class="{'iconxianshi':pwd2Show,'iconicon-test':!pwd2Show}" @click="pwd2Show = !pwd2Show"></i>
            </template>
        </Input>
        <van-button class="van-mybutton" style="margin-top: 50px" type="info" block @click="submit" :disabled="disabled">确定</van-button>
	</div>
</template>

<script>
	import SendCodeBtn from "@/components/sendCodeBtn";
	import { modifyTpassword } from "@/api/securityCenter"
	export default {
		name: 'changeCapitalPassword',
		data() {
			return {
				phone: '',
				code: '',
				password: '',
                pwd1Show:false,
                pwd2Show:false,
				tpassword: ''
			}
		},
		computed: {
			disabled() {
				return this.phone === '' || this.code === '' || this.password === '' || this.tpassword === '' 
			}
		},
		components: {
			SendCodeBtn
		},
		methods: {
			submit() {
				if (this.password.length !== 6 ) return this.$toast({ message: '支付密码必须是6位' })
				if (this.password !== this.tpassword) return this.$toast({ message: '两次密码输入不一致' })
				modifyTpassword({
					phone: this.phone,
					smsCode: this.code,
					pwd: this.$md5(this.password),
					surePwd: this.$md5(this.tpassword)
				}).then(() => {
                    this.$toast({ message: '修改成功' })
                    this.$store.dispatch('updateUserInfo')
                    this.$router.go(-1)
				})
			}
		},
		mounted() {},
	}
</script>

<style lang="scss" scoped>
.changeCapitalPassword {
	padding: 20px 38px 0;
	.input-content {
		padding: 0;
		height: 60px;
		align-items: center;
	}
}
</style>
