<!-- 
  	author        MrYi
	time          2021/03/13
	description   买/卖家列表   
 -->
<template>
	<div class="buySellList_body publicBuySellList">
		<div class="buySellList border_b_c" v-for="(item,index) in dataList" :key="index">
			<div class="buySellList_t flexC_S">
				<div class="buySellList_t_l col-center">
					<div class="nameImg" @click="routerPath(`/businessDetail?poster_uid=${item.uid}`)">
						<img v-if="item.user_head" :src="item.user_head" />
						<img v-else src="@/assets/imgs/home-user.png" />
					</div>
					<div class="namedata">
						<p class="namedata_t fzboid">{{item.nick_name}}</p>
						<p class="namedata_b color_c">交易<span class="namedataVal">{{item.trans_count}}</span><span
								class="namedataIcon">|</span>百分比 {{(item.trans_rate || 0) + '%'}}</p>
					</div>
				</div>
				<div class="buySellList_t_r">
					<p class="fzboid color_b">{{item.coin_price + ' ' + item.trans_to_coin}}</p>
					<div class="color_c">单价</div>
				</div>
			</div>
			<div class="buySellList_b between">
				<div class="buySellList_b_l color_c">
					<p>限额 {{item.trans_min + ' - ' + item.trans_max}} CNY</p>
					<p class="buySellList_b_l_val">数量 {{$fomatFloat((item.over_num || 0),6)}} USDT</p>
				</div>
				<div class="buySellList_b_r">
					<i v-for="(items,index) in item.pay_types" :key="index" class="iconfont"  :class="$iconClassName(items)"></i>
                    <van-button class="van-mybutton" type="info" block @click="buySellClick(item)">{{type === 1 ? '购买' : '卖出'}}</van-button>
				</div>
			</div>
		</div>
		<BuySellDialog :type="type" :isShow="isShow" @cancel="cancel" :tradeItem="tradeItem"></BuySellDialog>
	</div>
</template>

<script>
	import BuySellDialog from './components/buySellDialog.vue'
    import { mapState } from 'vuex'
	export default {
		name: 'buySellList',
		props: {
			//1买  2卖
			type: {
				type: Number,
				default: 1
			},
			dataList: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
        computed:{
			...mapState({
				userInfo: (state) => state.user.userInfo,
                appConfig: (state) => state.appConfig,
			}),
		},
		data() {
			return {
				isShow: false,
				tradeItem: {}
			}
		},
		components: {
			BuySellDialog
        },
		methods: {
            routerPath(url){
               this.$router.push(url)
            },
			cancel(){
				this.isShow = false
				this.$emit('setShowState', this.isShow)
			},
			buySellClick(item) {
				if (!this.loginType) return this.$router.push('/login')
                if(this.userInfo.realnameStatus != 3 && this.appConfig.realNameSwitch === 1){
                    return this.$dialog.confirm({
                        title: '温馨提示',
                        confirmButtonText:'去设置',
                        message: `需要实名验证通过后方可操作`,
                    })
                    .then(() => {
                        this.$router.push({ path: "/identityCard" });
                    })
                    .catch(() => {
                        // on cancel
                    });
                }
                if(this.userInfo.userType == 2){
                    return this.$toast('广告商不能下单');
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
				if (this.$store.state.user.token) {
					this.tradeItem = item
					this.isShow = true
					this.$emit('setShowState', this.isShow)
				} else {
					this.$router.push('/login')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
