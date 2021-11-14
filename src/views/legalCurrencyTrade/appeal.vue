<!-- 
  	author        MrYi
	time          2021/03/15
	description   申诉  买家1  卖家2
 -->
<template>
	<div class="appeal">
		<div class="title color_c">如果您对交易存在疑问，您可发起申诉，在此期间，数字币将继续托管保存直到纠纷结束</div>
		<div class="appeal_content">
			<h4>申诉类型</h4>
			<ul>
				<li @click="liClick(item)" v-for="(item) in appealList" :key="item.id" class="color_c flexC_S border_b_c">
					<span>{{item.ali_name}}</span>
					<i class="iconfont icondui color_b" v-if="item.id == seletItem.id"></i>
				</li>
			</ul>
			<h4 style="margin: 20px 0 10px;">申诉原因</h4>
			<textarea v-model="cause" class="border_c" :maxlength="50" placeholder="请具体描述申诉原因"></textarea>
		</div>
		<div class="fixed_content_btm">
            <van-button class="van-mybutton" type="info" block @click="submit" :disabled="isdisabled">提交</van-button>
		</div>
	</div>
</template>

<script>
    import { appealTypeOtcTrans , appealOtcTrans } from '@/api/legalCurrencyTrade'
	export default {
		name: 'appeal',
		data() {
			return {
				appealList:[],
				cause:'',
				seletItem: {},
			}
		},
        computed:{
            isdisabled(){
                if(this.cause){
                    return false
                }
                return true
            },
        },
		components: {},
		methods: {
			submit(){
                let trans_id = this.$route.query.orderID
                let obj = {
                    trans_id:trans_id,
                    atype:this.seletItem.id,
                    cause:this.cause
                }
                appealOtcTrans(obj).then(res => {
					// let aid = res.data.aid
					// 存储订单申述id
					this.$store.commit('SET_ORDER_AID', res.data.aid)
					// 更改当前订单状态state
					this.$store.commit('SET_ORDER_STATE', '8')
					this.$router.go(-1)
                })
			},
			liClick(item){
				this.seletItem = item
			}
		},
		mounted() {
            appealTypeOtcTrans({ali_role:1}).then(res =>{
                this.appealList = res.data.types || []
                this.seletItem = this.appealList[0] || {}
            })
        },
	}
</script>

<style lang="scss" scoped>
.appeal{
	height: 100%;
	.title{
		background: #F9F9F9;
		padding: 8px 16px;
		font-size: 12px;
		line-height: 17px;
	}
	.appeal_content{
		padding: 20px 16px;
		h4{
			line-height: 22px;
			font-size: 14px;
			font-weight: 500;
		}
		ul{
			li{
				line-height: 50px;
			}
		}
		textarea{
			width: calc(100% - 20px);
			height: 90px;
			padding: 10px;
			border-radius: 6px;
			&::-webkit-input-placeholder{
				color: $c-999;
			}
		}
	}
}
</style>
