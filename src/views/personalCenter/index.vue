<!-- 
  	author        MrYi
	time          2021/03/16
	description   个人中心
 -->
<template>
	<div class="personalCenter overflowPatible_box"  v-loading:updata="loading">
		<div class="personalCenter_top">
			<div class="bj_top"></div>
			<div class="bj_btm"></div>
			<div class="user_detail flexC_S" v-if="loginType">
				<div class="user_detail_l col-center">
					<img v-if="userImg" :src="userImg"  @click="openUploadCard"/>
					<img v-else src="@/assets/imgs/home-user.png"  @click="openUploadCard"/>
                    <input type="file" accept="image/*" ref="fileIpt" @change="uploadCard" style="display: none;">
                    <!-- <input ref="fileIpt" type="file" id='fileIpt' accept="image/*" style="display:none"  @change="uploadCard">  -->
                    <!-- capture='camera' -->
					<div>
						<p class="user_name">{{userInfo.nickName}}</p>
						<p class="user_id color_c">ID:{{userInfo.uid}}</p>
					</div>
				</div>
				<div class="user_detail_r" v-if="userInfo.userType == 1" v-auth="advertiserPath">
					申请广告商
				</div>
				<div class="advertisers t_r" v-if="userInfo.userType == 2">
					<p class="color_b fzboid">身份：广告商</p>
					<p class="freeze color_c">冻结: {{$fomatFloat((userInfo.bondnum || 0),6) + ' USDT'}}</p>
				</div>
			</div>
			<div class="user_detail flexC_S" v-else>
				<p class="color_b notlogin_box"><span @click="routerPath('/login')">登录</span><i style="margin: 0 2px;">/</i><span
						@click="routerPath('/register')">注册</span></p>
			</div>
		</div>
		<ul class="personalCenter_ul">
			<li class="border_b_c" @click="routerPath('/inviteFriends')">
				<span>邀请好友</span>
				<div class="level flexC_S">
					<img src="@/assets/imgs/level-icon.png"/>
					<span class="num">{{userInfo.level || 0}}</span>
					<span>邀请有奖<i class="iconfont iconyou1"></i></span>
				</div>
			</li>
			<li class="border_b_c" @click="identityCard" v-if="appConfig.realNameSwitch === 1"><span>身份认证</span><span>{{$constant.realnameStatus[userInfo.realnameStatus]}}<i
						class="iconfont iconyou1"></i></span></li>
			<li class="border_b_c" @click="routerPath('/securityCenter')"><span>安全中心</span><span><i
						class="iconfont iconyou1"></i></span></li>
			<li class="border_b_c" v-auth="advertiser"><span>发布广告</span><span>{{$constant.bondState[userInfo.bondstate]}}<i
						class="iconfont iconyou1"></i></span></li>
			<li class="border_b_c" @click="routerPath('/paymentMethod')"><span>收款设置</span><span><i
						class="iconfont iconyou1"></i></span></li>
			<!-- <li class="border_b_c" @click="routerPath('/feedback')"><span>意见反馈</span><span><i
						class="iconfont iconyou1"></i></span></li> -->
			<li class="border_b_c" @click="routerPath('/aboutUs')"><span>关于我们</span><span><i
						class="iconfont iconyou1"></i></span></li>
			<li class="border_b_c" @click="routerPath('/helpCenter')"><span>帮助中心</span><span><i
						class="iconfont iconyou1"></i></span></li>
			<li class="border_b_c" @click="changeEnv"><span>版本号</span><span>最新V1.01</span></li>
		</ul>
		<div class="btm_body" v-if="loginType">
            <van-button class="van-mybutton" type="info" block @click="logOut">退出登录</van-button>
		</div>
		<van-action-sheet cancel-text="取消" close-on-click-action v-model="showChangeEnv" :actions="actions" @select="onSelect" />
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
    import { uploadFile } from '@/api/common/index.js'
	import { modifyPhoto } from '@/api/securityCenter'
	export default {
		name: 'personalCenter',
		data() {
			return {
                loading:false,
                bond_level: {},
				showChangeEnv: false,
				actions: [
					{ name: '测试环境', url: 'http://app.fserwe.xyz/#/' },
					{ name: '本地环境', url: 'http://192.168.31.216:8080/' },
				],
				clickNum: 0
            }
		},
		computed: {
			...mapState({
				userInfo: (state) => state.user.userInfo,
                appConfig: (state) => state.appConfig,
			}),
			userImg() {
				return this.userInfo.img || ''
			}
		},
		components: {},
		methods: {
            uploadCard(el) {
                this.loading = true
                this.$uploadCard(el).then(res => {
                    let reader = res
                    uploadFile(reader.formData).then(subRes => {
                        modifyPhoto({imgUrl: subRes.data.url}).then(() => {
                            this.loading = false
                            this.$store.commit('SET_USER_IMG', subRes.data.url)
						}).catch(() => {
                            this.$toast({
                                message:'上传头像失败'
                            })
                            this.$store.commit('SET_USER_IMG', '')
                            this.loading = false
                        })
                    }).catch(() =>{
                        this.$toast({
                            message:'上传文件失败'
                        })
                        this.loading = false
                    })
                }).catch(err => {
                    this.loading = false
                })
            },
            openUploadCard() {
				this.$refs.fileIpt.click()
			},
            advertiserPath(){
                if(this.userInfo.bondstate == 1){
                    this.$toast({
                        message:'申请商户待审核'
                    })
                    return false
                }
                this.routerPath('/advertiser')
            },
            advertiser(){
                if(this.userInfo.bondstate == 0){
                    this.$toast({
                        message:'请先申请广告商'
                    })
                    return false
                }
                if(this.userInfo.bondstate != 2){
                    this.$toast({
                        message:'申请商户待审核'
                    })
                    return false
                }
                if(!this.userInfo.t_password){
                    return this.$dialog.confirm({
                        title: '温馨提示',
                        confirmButtonText:'去设置',
                        message: `需要设置资金密码后方可操作`,
                    })
                    .then(() => {
                        this.$router.push({ path: "/changeCapitalPassword" });
                    })
                    .catch(() => {
                        // on cancel
                    });
                }
                this.routerPath('/editReleaseAd')
            },
			logOut() {
				this.$store.commit("REMOVE_INFO");
			},
            identityCard(){
                if(this.userInfo.realnameStatus == 1 || this.userInfo.realnameStatus == 2){
                    this.$toast({
                        message:'待审核中...'
                    })
                    return false
                }
                if(this.userInfo.realnameStatus == 3){
                    this.$toast({
                        message:'已认证'
                    })
                    return false
                }
                this.routerPath('/identityCard')
            },
			routerPath(url) {
				this.$router.push(url)
			},
			changeEnv() {
				this.clickNum += 1
				if (this.clickNum === 5) {
					this.showChangeEnv = true
					this.clickNum = 0
				}
			},
			onSelect(item) {
				let ua = navigator.userAgent;
				let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
				let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
				if (isiOS) {
					try {
						window.webkit.messageHandlers.changeEnv.postMessage(item.url);
					} catch(error) {
						console.log("ios error");
					}
				}
				if (isAndroid) {
					try {                    
						window.android.changeEnv(item.url) 
					} catch(error) {
						console.log("Android error");
					}
				}
			}
		},
		mounted() {
            if(this.loginType){
                this.$store.dispatch('updateUserInfo')
            }
		},
	}
</script>

<style lang="scss" scoped>
	.personalCenter {
        height: 100%;
		.btm_body {
			padding: 70px 16px 38px 16px;
		}
		.personalCenter_ul {
			padding: 0 16px;

			li {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20px 0 17px 0;

				span {
					&:nth-child(1) {
						font-size: 16px;
					}

					&:nth-child(2) {
						color: $c-999;

						i {
							margin-left: 10px;
						}
					}
				}
				.level{
					color: $c-999;
					.num {
						font-size: 14px !important;
						color: #F4EA2A;
						font-weight: bold;
						padding-right: 10px;
					}
					img{
						width: 14px;
						height: 14px;
					}
				}
			}
		}

		.personalCenter_top {
			position: relative;

			.bj_top {
				height: 90px;
				background-color: $main-blue;
			}

			.bj_btm {
				height: 48px;
				background: #F9F9F9;
			}

			.user_detail {
				width: 92%;
				height: 92px;
				background: #FFFFFF;
				position: absolute;
				border-radius: 6px;
				top: 26px;
                margin-left: 4%;
				padding: 0 10px;
				.notlogin_box{
					font-size: 20px;
				}
				.advertisers {
					.color_b {
						line-height: 20px;
						margin-bottom: 13px;
					}

					.freeze {
						font-size: 12px;
					}
				}

				.user_detail_l {
					img {
						width: 52px;
						height: 52px;
						border-radius: 50%;
						margin-right: 10px;
					}

					.user_name {
						line-height: 20px;
						margin-bottom: 10px;
					}

					.user_id {
						line-height: 20px;
						font-size: 12px;
						background: #DEDEE6;
						border-radius: 11px;
						padding: 0 10px;
					}
				}

				.user_detail_r {
					line-height: 36px;
					padding: 0 22px;
					color: #FFFFFF;
					background: linear-gradient(270deg, $main-blue 0%, #94B4F8 100%);
					border-radius: 18px;
					font-size: 12px;
				}
			}
		}

	}
</style>
