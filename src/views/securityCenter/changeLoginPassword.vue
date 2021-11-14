<!-- 
  	author        MrYi
	time          2021/03/17
	description   修改登录密码
 -->
<template>
	<div class="changeLoginPassword">
		<Input type="text" v-model="phone" placeholder="请输入注册时手机号"></Input>
		<Input type="text" v-model="code" placeholder="输入验证码">
			<template v-slot:after>
				<SendCodeBtn ref="sendCode" :phone="phone" type="modifyLoginPassword" />
			</template>
		</Input>
		<Input :type="pwd1Show ? '' : 'password'" v-model="password" placeholder="请输入至少6位登录密码" autocomplete="new-password">
            <template v-slot:after>
                <i class="iconfont" :class="{'iconxianshi':pwd1Show,'iconicon-test':!pwd1Show}" @click="pwd1Show = !pwd1Show"></i>
            </template>
        </Input>
		<Input :type="pwd2Show ? '' : 'password'" v-model="tpassword" placeholder="请在此输入新登录密码" autocomplete="new-password">
            <template v-slot:after>
                <i class="iconfont" :class="{'iconxianshi':pwd2Show,'iconicon-test':!pwd2Show}" @click="pwd2Show = !pwd2Show"></i>
            </template>
        </Input>
        <van-button class="van-mybutton" style="margin-top: 50px" type="info" block @click="submit" :disabled="disabled">确定</van-button>
	</div>
</template>

<script>
	import {
		modifyPassword
	} from "@/api/securityCenter";
	import SendCodeBtn from "@/components/sendCodeBtn";

	export default {
		name: 'changeLoginPassword',
		data() {
			return {
				phone: '',
                pwd1Show:false,
                pwd2Show:false,
				code: '',
				password: '',
				tpassword: '',
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
				// 校验
				if (this.password.length < 6 || this.tpassword.length < 6) {
					return this.$toast({ message: '密码不能小于6位数' })
				}
				modifyPassword({
					phone: this.phone,
					smsCode: this.code,
					pwd: this.$md5(this.password),
					surePwd: this.$md5(this.tpassword)
				}).then(res => {
					if (res.code === 0) {
						this.$toast({ message: '修改成功' })
						this.$router.go(-1)
					} else {
						this.$toast({ message: res.msg })
					}
				})
			}
		},
		mounted() {},
	}
</script>

<style lang="scss" scoped>
	.changeLoginPassword {
		padding: 20px 38px 0;

		.input-content {
			padding: 0;
			height: 60px;
			align-items: center;
		}
	}
</style>
