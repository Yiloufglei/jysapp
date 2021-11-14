<!-- 
  	author        MrYi
	time          2021/03/12
	description   银行卡
 -->
<template>
  <div class="bankCard bind_public_style">
		<div class="bind_public_title col-center">
			<p><i class="iconfont iconanquan"></i><span class="color_c">将为您加密处理信息，请放心使用</span></p>
		</div>
		<div class="bind_public_content">
            <Input v-model="formData.real_name" label="开户姓名" placeholder="请输入您的真实姓名" />
            <Input v-model="formData.bank" label="开户银行" placeholder="请输入您的开户银行" />
            <Input v-model="formData.bankli" label="开户支行" placeholder="请输入您的银行所在支行" />
            <Input v-model="formData.account" label="银行卡卡号" placeholder="请输入您的银行卡号" />
            <van-button style="margin-top:20px" class="van-mybutton" type="info" block @click="submit" :disabled="disabled">提交</van-button>
		</div>
		<fundPasswordModal  @confirm="submitNotice" :visible.sync="isvisible"/>
  </div>
</template>

<script>
import fundPasswordModal from "@/components/fundPasswordModal";
import { paymentSet } from '@/api/securityCenter'
import { mapState } from 'vuex' 
export default {
  	name: 'bankCard',
  	data () {
    	return {
            isvisible:false,
			formData:{
				real_name:'',
				bank:'',
				bankli:'',
				account:'',
				p_type:'unionpay',
				t_password:''
			}
    	}
  	},
 	components: {
 		fundPasswordModal
 	},
	computed:{
		...mapState({
			userInfo: (state) => state.user.userInfo,
		}),
		userId(){
			return {
				uid:this.userInfo.uid 
			}
		},
		disabled(){
			if(this.formData.real_name && this.formData.bank && this.formData.bankli && this.formData.account){
				return false
			}
			return true
		}
	},
 	methods: {
		submitNotice(val){
			this.formData.t_password = val
			this.paymentSet()
		},
		paymentSet(){
			let obj = Object.assign({},this.formData,this.userId)
			paymentSet(obj).then(res => {
                this.$toast({ message: '添加成功' })
                this.isvisible = false
                this.$router.replace('/paymentMethod')
			})
		},
		submit(){
			this.isvisible = true
		}
	},
 	mounted() {},
}
</script>

<style lang="scss" scoped>
@import "./index.scss"
</style>
