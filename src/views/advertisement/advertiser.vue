<!-- 
  	author        MrYi
	time          2021/03/17
	description   广告商 / 未申请 1  已申请  2
 -->
<template>
	<div class="advertiser">
		<div class="advertiser_top flexC_S">
			<span>{{applyType == 2 ? '已成为广告商' : '广告商申请'}}</span>
			<span class="color_c">{{applyType == 2 ? '冻结' : '需支付'}}{{bond_level.bond_num + bond_level.coin_name}}</span>
		</div>
		<div class="interval_bj"></div>
		<div class="advertiser_content">
			<p class="col-center check_body" v-if="applyType == 1">
                <van-checkbox v-model="type" icon-size="16px" shape="square">我已阅读并知晓</van-checkbox><router-link to="/agreement" class="color_b">《广告商服务协议》 </router-link>
			</p>
			<ul class="explain color_c">
				<li>广告商说明：</li>
				<li>1.法币钱包支付完成之后，即可成为广告服务商；</li>
				<li>2.该笔费用作为广告商的押金，会处于冻结状态，在您从广告商退出时解冻。</li>
			</ul>
		</div>
		<div class="fixed_content_btm">
            <van-button class="van-mybutton" type="info" block @click="submit" :disabled="disabled">{{applyType == 2 ? '解冻退出' : '立即申请'}}</van-button>
		</div>
	</div>
</template>

<script>
	import { bondSetOtcPoster , bondGetOtcPoster} from "@/api/advertisement"
	import { mapState } from 'vuex' 
	export default {
		name: 'advertiser',
		data() {
			return {
				type: false,
                advertiserData:'',
                bond_level:{}
			}
		},
		computed: {
			...mapState({
				userInfo: (state) => state.user.userInfo,
                appConfig: (state) => state.appConfig,
			}),
			disabled() {
				return this.applyType == 1 ? !this.type : false
			},
			applyType(){
				return this.$route.query.applyType || 1
			}
		},
		components: {
		},
		methods: {
            submit(){
                if(this.userInfo.realnameStatus == 1 || this.userInfo.realnameStatus == 2){
                    return this.$dialog.confirm({
                        title: '温馨提示',
                        confirmButtonText:'确定',
                        message: `实名认证待审核中...`,
                    })
                    .then(() => {
                        
                    })
                    .catch(() => {
                        this.$router.go(-1)
                    });
                }
                if (Number(this.userInfo.authGrade) === 1 && this.appConfig.realNameSwitch === 1) {
                    return this.$dialog.confirm({
                        title: '温馨提示',
                        confirmButtonText:'去认证',
                        message: `需要实名认证后方可操作`,
                    })
                    .then(() => {
                        this.$router.push({ path: "/identityCard" });
                    })
                    .catch(() => {
                        this.$router.go(-1)
                    });
                }
                let obj = {
                    uid:this.userInfo.uid,
                    num:this.bond_level.bond_num,
                    coin_name:this.bond_level.coin_name
                }
                bondSetOtcPoster(obj).then(res => {
                    this.$toast({
                        message:"申请操作成功"
                    })
                    this.$router.replace('/personalCenter')
                    this.$router.go(-1)
                })
            }
        },
		mounted() {
            let obj = {
                uid:this.userInfo.uid
            }
            bondGetOtcPoster(obj).then(res => {
                this.advertiserData = res.data
                this.bond_level = this.advertiserData.bond_level[0] || {}
            })
        }
	}
</script>

<style lang="scss" scoped>
	.advertiser {
		height: 100%;

		.advertiser_top {
			padding: 20px 16px;

			span {
				&:nth-child(1) {
					font-size: 16px;
				}
			}

			.color_c {
				.iconfont {
					margin-left: 25px;
				}
			}
		}

		.advertiser_content {
			padding: 20px 16px;
			font-size: 12px;

			.check_body {
				margin-bottom: 20px;

				input {
					margin-right: 5px;
				}
			}

			.explain {
				li {
					line-height: 17px;
					margin-bottom: 8px;
				}
			}
		}
	}
</style>
