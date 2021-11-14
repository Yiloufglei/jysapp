<!-- 
  	author        MrYi
	time          2021/03/17
	description   安全中心首页
 -->
<template>
	<div class="securityCenter">
		<ul>
			<!-- <li class="flexC_S border_b_c">
				<span class="left">手机绑定</span>
				<p class="col-center"><span class="color_b">已绑定</span><i class="iconfont iconyou1"></i></p>
			</li> -->
			<li class="flexC_S border_b_c"  @click="routerPath('/changeCapitalPassword')">
				<span class="left">法币资金密码</span>
				<p class="col-center"><span class="color_b">{{userInfo.t_password ? '修改' : '设置'}}</span><i class="iconfont iconyou1"></i></p>
			</li>
			<li class="flexC_S border_b_c"  @click="routerPath('/changeLoginPassword')">
				<span class="left">修改登录密码</span>
				<p class="col-center"><i class="iconfont iconyou1"></i></p>
			</li>
		</ul>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'securityCenter',
		data() {
			return {}
		},
		computed: {
			...mapState({
                userInfo: (state) => state.user.userInfo,
            }),
		},
		components: {},
		methods: {
			routerPath(url){
				this.$router.push(url)
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
.securityCenter{
	ul{
		padding: 10px 16px;
		li{
			padding: 20px 0;
			.left{
				font-size: 16px;
			}
			P{
				.iconfont{
					margin-left: 10px;
				}
			}
		}
	}
}
</style>
