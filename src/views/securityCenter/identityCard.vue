<!-- 
  	author        MrYi
	time          2021/03/12
	description   身份证认证
 -->
<template>
	<div class="identityCard bind_public_style" v-loading:updata="loading">
		<div class="error_text">
			<p class="col-center" v-if="isErr"><i class="iconfont iconlaba"></i>【驳回原因】 图片不真实</p>
		</div>
		<div class="identityCard_top bind_public_content">
			<div class="upload_body">
				<p class="upload_title">上传身份证照片</p>
				<div class="upload_content flexC_S">
                    <!-- <van-uploader class="img_box" v-model="fileList" multiple :max-count="1" :max-size="5 * 1024 * 1024" lazy-load>
                        <div class="center column" @click="openUploadCard(1)">
                            <div class="t_c" v-if="!imgObj.img1">
                                <i class="iconfont iconxianpaizhao color_b"></i>
                                <p class="color_c">身份证正面照片</p>
                            </div>
                            <img class="upload_img" v-else :src="imgObj.img1" />
                        </div>
                    </van-uploader> -->
					<div class="img_box center column" @click="openUploadCard(1)">
						<div class="t_c" v-if="!imgObj.img1">
							<i class="iconfont iconxianpaizhao color_b"></i>
							<p class="color_c">身份证正面照片</p>
						</div>
						<img class="upload_img" v-else :src="imgObj.img1" />
					</div>
					<div class="img_box center column" @click="openUploadCard(2)">
						<div class="t_c" v-if="!imgObj.img2">
							<i class="iconfont iconxianpaizhao color_b"></i>
							<p class="color_c">身份证反面照片</p>
						</div>
						<img class="upload_img" v-else :src="imgObj.img2" />
					</div>
				</div>
			</div>
		</div>
		<div class="identityCard_btm bind_public_content">
			<Input label="真实姓名" v-model="formData.realname" type="text" placeholder="请输入您的名字" maxlength="11"></Input>
			<Input label="身份证号码" v-model="formData.card" type="text" placeholder="请输入您的身份证号码"></Input>
			<div class="check_box col-center">
                <van-checkbox v-model="checkState" icon-size="16px" shape="square">我承认提交信息所述本人，不存在</van-checkbox><span  class="color_b">盗用行为</span>
			</div>
            <van-button class="van-mybutton" type="info" :disabled="disabled" block @click="submit">提交</van-button>
		</div>
		<input type="file" ref='fileIpt' id="fileIpt" accept="image/png, image/jpg, image/jpeg, image/gif"
			style="display: none;"  @change="uploadCard"/>
	</div>
</template>

<script>
	import { uploadFile } from '@/api/common/index.js'
    import { userAuth } from '@/api/securityCenter'
	import { mapState } from 'vuex'
	export default {
		name: 'identityCard',
		data() {
			return {
                loading:false,
                checkState: false,
                formData:{
                    realname: '',
                    card: '',
					img1: '',
					img2: '',
					// img3: '',
				},
                imgObj:{
                    img1: '',
					img2: '',
					// img3: '',
                },
				isErr: false,
				imgType:1,
			}
		},
		computed: {
			...mapState({
				userInfo: (state) => state.user.userInfo,
			}),
			disabled() {
				if (this.formData.realname && this.formData.card && this.checkState && this.formData.img1 && this.formData.img2) {
					return false
				}
				return true
			}
		},
		components: {
		},
		methods: {
			openUploadCard(type) {
				this.imgType = type
				this.$refs.fileIpt.click()
			},
			submit() {
                let _IDRe18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
                let _IDre15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/
                // 校验身份证：
                if(_IDRe18.test(this.formData.card) || _IDre15.test(this.formData.card)) {
                    let obj = this.formData
                    obj.uid = this.userInfo.uid
                    if(this.imgObj.img1 === this.imgObj.img2){
                        return this.$toast({
                            message:'身份证正反面不能一致！'
                        })
                    }
                    userAuth(obj).then(res => {
                        this.$toast({
                            message:'提交成功'
                        })
                        this.$store.dispatch('updateUserInfo')
                        this.$router.replace('/personalCenter')
                    })
                }else{
                    this.$toast({
                        message:'身份证信息有误'
                    })
                }
                
            },
            uploadCard(el) {
                this.loading = true
                this.$uploadCard(el).then(res => {
                    let reader = res
                    uploadFile(reader.formData).then(res => {
                        this.imgObj['img' + this.imgType] = reader.result;
                        this.formData['img' + this.imgType] = res.data.url;
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
		},
		mounted() {

		},
	}
</script>

<style lang="scss" scoped>
	@import "./index.scss";

	.identityCard {
		.error_text {
			padding: 10px 0;
			color: #FD9E00;
			font-size: 14px;

			p {
				height: 24px;
			}

			.iconfont {
				font-size: 22px;
			}
		}

		.identityCard_top {
			margin-bottom: 20px;

			.holdJustTemplate {
				width: 78px;
				height: 70px;
			}
		}

		.identityCard_btm {
			.check_box {
				height: 57px;
				font-size: 12px;
			}
		}
	}
</style>
