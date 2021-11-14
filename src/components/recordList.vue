 <!--
   	author        MrYi
 	time          2021/03/11 
 	description   记录列表组件
  -->
<template>
	<div class="recordList">
		<div class="recordListli" v-for="(item,index) in list" :key="index" @click="routePath(item)">
			<div class="listName upper" v-if="typeName === 1">{{item.coin_name}}</div>
			<div class="listName upper" v-else-if="typeName === 2">
				<template v-if="item.act === 3 || item.act === 4">{{item.react == 4 ? '转出' :'转入'}}</template>
				<template v-else>{{$constant.actState[item.act]}}</template>
			</div>
			<div class="listContent flexC_S">
				<div class="listContent_l">
					<p class="nameText">数量</p>
					<p class="contentText">{{$fomatFloat(item.num,8)}}</p>
				</div>
				<div class="listContent_c">
					<p class="nameText">{{stateType ? '状态' :'类型'}}</p>
					<p class="contentText">{{item.stateText || '--'}}</p>
				</div>
				<div class="listContent_r flexC_S t_r">
					<div>
						<p class="nameText">时间</p>
						<p class="contentText">{{$formatDate(item.created_at,'/') || '--'}}</p>
					</div>
					<i class="iconfont iconliebiao-dian" v-if="isClick"></i>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "recordList",
		props: {
			list: {
				type: Array,
				default: function() {
					return []
				}
			},
            //名字字段
            typeName: {
				type: Number,
				default: 1
			},
            //是否可点击
            isClick: {
				type: Boolean,
				default: true
			},
            //状态类型
            stateType: {
				type: Boolean,
				default: true
			},
		},
		data() {
			return {
			};
		},
		methods:{
			routePath(item){
                if(!this.isClick){
                    return false
                }
				// 动账账户类型：1币币 2法币 3逐仓配资 4全仓配资 5期权
				if (item.type === 3 || item.type === 4) {
					this.$router.push(`/historyDetail?id=${item.id}&act=${item.type}`)
				} else {
					this.$router.push(`/historyDetail?oid=${item.oid}&act=${item.act}&type=${item.type}&react=${item.react}`)
				}
                // let query = this.$route.query
                // if(query.act == 5){
                //     this.$router.push(`/historyDetail?id=${item.id}&act=${item.type}`)
                // }else{
                //     this.$router.push(`/historyDetail?oid=${item.oid}&act=${item.act}&type=${item.type}&react=${item.react}`)
                // }
			}
		},
		created() {},
		mounted() {},
	};
</script>
<style lang="scss" scoped>
	.recordList {
		padding: 20px 16px 0;

		.recordListli {
			padding: 0px 0 16px 0;
			font-size: 12px;

			.listName {
				line-height: 20px;
				font-size: 14px;
			}

			.listContent {
				margin-top: 20px;
				padding-bottom: 15px;
				border-bottom: 1px solid #E6E6E6;
                .listContent_c{
                    padding: 0 10px;
                }
				.listContent_l,
				.listContent_c,
				.listContent_r {
                    flex: 1;
					.nameText {
						color: $c-999;
						line-height: 17px;
						margin-bottom: 10px;
					}
					.contentText{
						font-size: 14px;
						color: #000000;
					}
				}
                .listContent_r{
                    justify-content: flex-end;
                    min-width: 110px;
                    .iconfont{
                        margin-left: 10px;
                    }
                }
			}
		}
	}
</style>
