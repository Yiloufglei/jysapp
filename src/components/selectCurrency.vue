<!-- 
  	author        MrYi
	time          2021/03/15
	description   选择币种
 -->
<template>
    <van-popup v-model="isShow">
        <div class="selectCurrency upper">
            <div class="search_body flexC_S">
                <van-field v-model="searchVal" left-icon="search" class="van-myfield" center clearable placeholder="请输入搜索关键词">
                </van-field>
                <div class="cancel t_r color_c" @click="$emit('update:isShow', !isShow)">取消</div>
            </div>
            <ul class="list_ul">
                <li class="border_b_c" v-for="(item,index) in searchList" :key="index" @click="select(item)">{{item.coin_name}}</li>
            </ul>
        </div>
    </van-popup>
</template>

<script>
	export default {
		name: 'selectCurrency',
        props:{
            isShow:{
                type:Boolean,
                default:false
            },
            list: {
				type: Array,
				default: function() {
					return []
				}
			},
        },
		data() {
			return {
				searchVal:'',
			}
		},
		computed:{
			routeQuery(){
				return this.$route.query.route
			},
			searchList(){
				let arr = []
				if(this.searchVal){
					this.list.forEach((item,index) => {
						let coin_name = item.coin_name.toLocaleLowerCase()
						if(coin_name.indexOf((this.searchVal.toLocaleLowerCase())) != -1){
							arr.push(item)
						}
					})
					return arr
				}
				return this.list
			}
		},
		components: {
		},
		methods: {
			select(item){
				this.$emit('select',item)
			}
		},
		mounted() {
			
		},
	}
</script>

<style lang="scss" scoped>
.van-popup{
    height: 100%;
    width: 100%;
	z-index: 99999 !important;
}
.selectCurrency{
	padding: 0 16px;
    background: #fff;
	.list_ul{
		height: calc(100% - 65px);
		overflow-y: auto;
		li{
			height: 50px;
			line-height: 50px;
		}
		&::-webkit-scrollbar {
			display: none;
		}
	}
	.search_body{
		height: 65px;
		.input-content{
			border-radius: 6px;
			flex: 1;
		}
		.searchIcon{
			width: 50px;
		}
		.cancel{
			width: 50px;
		}
        .van-myfield{
            border: 1px solid #edeff3;
            padding: 0 10px;
            height: 34px;
            align-items: center;
            display: flex;
            border-radius: 4px;
        }
	}
}
</style>
