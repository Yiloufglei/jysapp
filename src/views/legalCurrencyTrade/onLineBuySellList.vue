<!-- 
  	author        MrYi
	time          2021/03/13
	description   在线购买出售列表
 -->
<template>
	<div class="onLineBuySellList publicBuySellList">
		<div class="buySellList_body">
            <div class="no-data" v-if="!dataList.length"></div>
			<div class="buySellList border_b_c" v-for="(item) in dataList" :key="item.Id" style="padding: 15px 0;">
				<div class="buySellList_t flexC_S">
					<div class="buySellList_t_l col-center onlineName">
						<div class="nameImg" style="margin-right: 4px;">
							<i class="iconfont iconUSDT buy-color"></i>
						</div>
						<div class="namedata">
							<p class="namedata_t fzboid upper" style="margin-bottom: 0;">{{item.coin_name}}</p>
						</div>
					</div>
					<div class="buySellList_t_r">
						<p class="fzboid">{{item.coin_price + ' ' + item.trans_to_coin}}</p>
						<div class="color_c">单价</div>
					</div>
				</div>
				<div class="buySellList_b between">
					<div class="buySellList_b_l">
						<p>限额 {{item.trans_min + ' - ' + item.trans_max}} CNY</p>
						<p class="buySellList_b_l_val">数量 {{item.total_num}} USDT</p>
					</div>
					<div class="buySellList_b_r">
                        <i v-for="(items,index) in item.pay_types" :key="index" class="iconfont"  :class="$iconClassName(items)"></i>
                        <van-button class="van-myNbButton" type="info" block @click="buySellClick(item)">{{type === 1 ? '购买' : '出售'}}</van-button>
					</div>
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
		name: 'onLineBuySellList',
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
			cancel(){
				this.isShow = false
			},
			buySellClick(item) {
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
