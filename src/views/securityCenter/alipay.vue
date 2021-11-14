<!-- 
  	author        MrYi
	time          2021/03/12
	description   支付宝
 -->
<template>
	<div class="alipay bind_public_style"  v-loading:updata="loading">
		<div class="bind_public_title col-center">
			<p><i class="iconfont iconanquan"></i><span class="color_c">将为您加密处理信息，请放心使用</span></p>
		</div>
		<div class="bind_public_content">
            <Input v-model="formData.real_name" label="支付宝姓名" placeholder="请输入您的支付宝真实姓名" />
            <Input v-model="formData.account" label="支付宝账号" placeholder="请输入您的支付宝账号" />
			<div class="upload_body border_b_c">
				<p class="upload_title">支付宝收款码</p>
				<div class="upload_content center" @click="openUploadCard">
					<div class="img_box center column" v-if="!img">
						<i class="iconfont iconxianpaizhao color_b"></i>
						<p class="color_c">上传支付宝收款码</p>
					</div>
					<div class="img_box center column" v-else>
						<img :src="img" class="upload_img"/>
					</div>
				</div>
			</div>
            <van-button class="van-mybutton" type="info" block @click="submit" :disabled="disabled">提交</van-button>
		</div>
		<fundPasswordModal @confirm="submitNotice" :visible.sync="isvisible"/>
		<input type="file" ref='fileIpt' id="fileIpt" accept="image/png, image/jpg, image/jpeg, image/gif"
			style="display: none;"  @change="uploadCard"/>
	</div>
</template>

<script>
	import fundPasswordModal from "@/components/fundPasswordModal";
	import { mapState } from 'vuex' 
	import { paymentSet } from '@/api/securityCenter'
    import { uploadFile } from '@/api/common/index.js'
	export default {
		name: 'alipay',
		data() {
			return {
                isvisible:false,
                loading:false,
				formData:{
					real_name:'',
					account:'',
					p_type:'alipay',
					t_password:'',
					img:''
				},
                img:''
			}
		},
		components: {
			fundPasswordModal
		},
		computed: {
			...mapState({
				userInfo: (state) => state.user.userInfo,
			}),
			userId(){
				return {
					uid:this.userInfo.uid 
				}
			},
			disabled() {
				if (this.formData.real_name && this.formData.account) {
					return false
				}
				return true
			}
		},
		methods: {
			openUploadCard() {
				this.$refs.fileIpt.click()
			},
            uploadCard(el) {
                this.loading = true
                this.$uploadCard(el).then(res => {
                    let reader = res
                    uploadFile(reader.formData).then(res => {
                        this.img = reader.result;
                        this.formData.img = res.data.url;
                        this.$toast({
                            message:'上传图片成功'
                        })
                        this.loading = false
                    }).catch(() =>{
                        this.loading = false
                    })
                }).catch(err => {
                    this.loading = false
                })
            },
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
	@import "./index.scss";
	.alipay{
		::v-deep .publicDialog .publicDialog_content .publicDialog_content_footer{
			padding:20px 20px 30px;
		}
	}
</style>
