<!-- 
  	author        MrYi
	time          2021/03/15
	description   链地址
 -->
<template>
	<div class="chainAddress">
		<ul class="leftSlipList">
            <van-swipe-cell  v-for="(item) in list" :key="item.id">
                <li class="eftSlip_li"  @click="switchAddress(item)">
                    <p class="title">{{item.coin_name}}</p>
                    <p class="color_c text_es">{{item.address}}</p>
                    <img v-show="item.dft == 1" src="@/assets/imgs/default.png" />
                </li>
                <template #right>
                    <van-button square type="danger" text="删除"  @click="openDel(item.id)"/>
                </template>
            </van-swipe-cell>
        </ul>
		<div class="fixed_content_btm">
            <van-button class="van-mybutton" type="info" block @click="submit">添加钱包地址</van-button>
		</div>
	</div>
</template>

<script>
import { getWalletAssetsLlist, setWithdrawAddressDel } from "@/api/assets"
	export default {
		name: 'chainAddress',
		data() {
			return {
				list:[],
				dialogVisible: false,
				clientNum: {}, // 记录开始滑动（x1）,结束滑动（x2）的鼠标指针的位置
            	candelete: {}, // 滑动的item
				code:'',
				delItem: null
			}
		},
		computed:{
			routePath(){
				return this.$route.query.route || ''
			},
		},
		components: {
		},
		methods: {
			openDel(id) {
				setWithdrawAddressDel({id}).then(res =>{
					if (res.code === 0) {
						this.$toast("删除成功！")
						this.getDataList()
					} else {
						this.$toast("删除失败！")
					}
				});
			},
			submit(){
				this.$router.push(`/addChainAddress?route=${this.routePath}&coin_name=${this.$route.query.coin_name}`)
			},
			switchAddress(item){
				if(this.routePath){
					this.$router.replace(`/${this.routePath}?address=${item.address}`)
				}
			},
			getDataList() {
				let obj = {
					coin_name:this.$route.query.coin_name
				}
				getWalletAssetsLlist(obj).then(res => {
					this.list = res.data.list || []
				})
			}
		},
		mounted() {
            this.getDataList()
        },
	}
</script>

<style lang="scss" scoped>
.chainAddress{
	background: #F9F9F9;
	height: 100%;
	padding: 15px 10px;
	ul{
		height: calc(100% - 80px);
		overflow-y: auto;
		&::-webkit-scrollbar {
			display: none;
		}
		li{
			height: 94px;
			background-color: #FFFFFF;
			margin-bottom: 15px;
			padding: 18px 0 0 10px;
			position: relative;
			.title{
				font-size: 18px;
				line-height: 25px;
				margin-bottom: 6px;
			}
			.color_c{
				font-size: 16px;
				line-height: 22px;
			}
			img{
				width: 40px;
				height: 40px;
				position: absolute;
				top: 0;
				right: 0;
			}
		}
	}
}
</style>
