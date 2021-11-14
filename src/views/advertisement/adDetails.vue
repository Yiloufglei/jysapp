<!-- 
  	author        MrYi
	time          2021/03/17
	description   广告详情    上架  1   下架   2
 -->
<template>
	<div class="adDetails">
		<div class="adDetails_top flexC_S fzboid upper">
			<span :class="{'sell-color' : myposter.buy_or_sell == 2,'buy-color' : myposter.buy_or_sell == 1}">{{(myposter.buy_or_sell == 2 ? '出售' : '购买') + myposter.coin_name}}</span>
			<span class="color_b">{{myposter.state == 1 ? '进行中' : '已下架'}}</span>
		</div>
		<div class="interval_bj"></div>
		<div class="adDetails_content color_c">
			<div class="flexC_S"><span>固定价格</span><span>{{myposter.coin_price + ' ' + myposter.trans_to_coin}}</span></div>
			<div class="flexC_S"><span>单笔限额</span><span>{{myposter.trans_min + myposter.trans_to_coin + ' - ' + myposter.trans_max + myposter.trans_to_coin}}</span></div>
			<div class="flexC_S"><span>{{(myposter.buy_or_sell == 2 ? '出售' : '购买')}}数量</span><span>{{myposter.total_num}}</span></div>
		</div>
		<div class="interval_bj"></div>
		<div class="adDetails_content color_c">
			<div class="flexC_S"><span>交易方式</span>
            <span>
                <i v-for="(items,index) in myposter.pay_types" :key="index" class="iconfont"  :class="$iconClassName(items)"></i>
            </span>
        </div>
			<div class="flexC_S"><span>付款时限</span><span>{{trans_timeout / 60}}分钟</span></div>
		</div>
		<div class="interval_bj"></div>
		<div class="adDetails_content color_c" style="padding: 5px 16px 10px 16px;">
			<div class="flexC_S"><span>交易时间</span><span>{{myposter.opening_start + '-' + myposter.opening_end}}</span></div>
		</div>
		<div class="interval_bj"></div>
		<div class="operation fixed_content_btm">
			<div class="operation_btm flexC_S">
                <van-button class="van-mybutton left_cancel" type="default" block @click="edit">编辑</van-button>
                <van-button class="van-mybutton right_primary" block type="info" @click="posterState">{{myposter.state == 2 ? '上架' : '下架'}}</van-button>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
    import { posterInfoOtcPoster , posterStateOtcPoster } from "@/api/advertisement"
	export default {
		name: 'adDetails',
		data() {
			return {
                myposter:{},
                trans_timeout:''
			}
		},
		computed: {
			...mapState({}),
		},
		components: {},
		methods: {
            posterState(){
                this.$dialog.confirm({
                    title: '',
                    cancelButtonText:'暂不',
                    message: `您确定要${this.myposter.state == 2 ? '上' : '下'}架此广告？`,
                })
                .then(() => {
                    let query = this.$route.query
                    let state = this.myposter.state == 2 ? 1 : 2
                    let obj = {
                        uid:query.uid,
                        poster_id:query.poster_id,
                        state:state
                    }
                    posterStateOtcPoster(obj).then(res => {
                        this.$toast({
                            message:'操作成功'
                        })
                        this.$router.replace('/myAdvertisement')
                        this.$router.go(-1)
                    })
                })
                .catch(() => {
                    // on cancel
                });
            },
			edit(){
                this.$store.commit('SET_ADDETAILS',this.myposter)
				this.$router.push('/editReleaseAd?type=2')
			},
            init(){
                let query = this.$route.query
                let obj = {
                    uid:query.uid,
                    poster_id:query.poster_id,
                }
                posterInfoOtcPoster(obj).then(res => {
                    let data = res.data.myposter || {}
                    this.trans_timeout = res.data.trans_timeout
                    this.myposter = data
                })
            }
		},
		mounted() {
            this.init()
        },
	}
</script>

<style lang="scss" scoped>
.adDetails{
	.operation{
		padding: 20px 16px 0;
		.operation_btm{
			padding: 10px 0;
			.left_cancel{
				width: 110px;
				margin-right: 10px;
			}
			.right_primary{
				flex: 1;
			}
		}
	}
	.adDetails_top{
		font-size: 16px;
		padding: 40px 16px 20px;
		.sell-color{
			font-size: 18px;
		}
	}
	.adDetails_content{
		padding: 14px 16px;
		div{
			height: 40px;
			line-height: 40px;
			.iconfont{
				margin-left: 10px;
			}
		}
	}
}
</style>
