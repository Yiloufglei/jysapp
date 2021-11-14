<!-- 
  	author        MrYi
	time          2021/03/18
	description   意见反馈
 -->
<template>
	<div class="feedback">
		<textarea maxlength="50" v-model="content" class="border_c" placeholder="请输入意见反馈,字数要求5-50"></textarea>
        <van-button class="van-mybutton" type="info" block @click="submit" :disabled="disabled">提交</van-button>
	</div>
</template>

<script>
    import { userFeedback } from "@/api/securityCenter";
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'feedback',
		data() {
			return {
				content:''
			}
		},
		computed: {
			...mapState({}),
            disabled(){
                let str = this.content.replace(/\s/g,"")
                if(str.length >= 5){
                    return false
                }
                return true
            }
		},
		components: {},
		methods: {
			submit(){
                if(!this.loginType){
                    this.$router.push('login')
                    return false
                }
				userFeedback({content:this.content.replace(/\s/g,"")}).then(res => {
                    this.$toast('提交成功，感谢您的反馈！')
                    this.content = ''
                })
			}
		},
		mounted() {},
	}
</script>

<style lang="scss" scoped>
.feedback{
	padding: 20px 16px;
	textarea{
		width: calc(100% - 20px);
		height: 90px;
		padding: 10px;
		border-radius: 6px;
		margin-bottom: 20px;
		&::-webkit-input-placeholder{
			color: $c-999;
		}
	}
}
</style>
