<!-- 
  	author        MrYi
	time          2021/03/17
	description   团队业绩
 -->
<template>
	<div class="myPerformance">
		<ul class="myPerformance_tab flexC_S">
			<li v-for="item in tabList" :key="item.id" :class="{active : tabIndex == item.id}" @click="tabIndexClick(item)">{{item.name}}</li>
		</ul>
		<div class="table_top flexC_S color_c">
			<p>ID</p>
			<p class="t_c">上级ID</p>
			<p class="t_c">团队人数</p>
			<p class="t_r">业绩(USTD)</p>
		</div>
		<div class="myPerformance_table">
			<van-list
				v-model="loading"
				:finished="finished"
				finished-text="没有更多了"
				:offset="10"
				@load="loadMore"
				v-if="tabData.length > 0"
			>
			<div class="table_content flexC_S border_b_c"  v-for="(item,index) in tabData" :key="index" >
				<p>{{item.uid}}</p>
				<p class="t_c">{{item.Invite_id}}</p>
				<p class="t_c">{{item.team_count}}</p>
				<p class="t_r">{{item.achievement}}</p>
			</div>
			</van-list>
			<div class="no-data" v-else-if="!loading && finished"></div>
		</div>
	</div>
</template>

<script>
	import { teamAchievement } from '@/api/invite'
	import { List } from 'vant'
	export default {
		name: 'teamPerformance',
		components: {
			[List.name]:List
		},
		data() {
			return {
				total: 0,
				loading: true,
				finished: false,
				tabData:[],
				tabIndex:1,
				tabList:[
					{name:'昨日业绩',id:1,date_type: '1-day', data_user: 'child'},
					{name:'日团队',id:2,date_type: '0-day', data_user: 'team'},
					{name:'周团队',id:3, date_type: '0-week', data_user: 'team'},
					{name:'周自营',id:4, date_type: '0-week', data_user: 'child'},
					{name:'日自营',id:5, date_type: '0-day', data_user: 'child'},
				],
				searchParams: {
					date_type: '1-day',
					data_user: 'child',
					page: 1,
					page_size: 10
				}
			}
		},
		methods: {
			loadMore() {
				this.searchParams.page += 1
				this.getDataList()
			},
			tabIndexClick(item){
				if (item.id === this.tabIndex) return
				this.tabIndex = item.id
				this.searchParams.date_type = item.date_type
				this.searchParams.data_user = item.data_user
				this.searchParams.page = 1
				this.finished = false
				this.tabData = []
				this.getDataList()
			},
			getDataList() {
				this.loading = true;
				teamAchievement(this.searchParams).then(res => {
					this.total = res.data.total || 0
					if (res.data.list) this.tabData = [...this.tabData,...res.data.list]
					this.loading = false;
					if (this.tabData.length >= this.total) this.finished = true
				})
			}
		},
		created() {
			this.getDataList()
		},
		mounted() {},
	}
</script>

<style lang="scss" scoped>
.myPerformance{
	padding: 0 16px;
	height: 100%;
	.table_top{
		padding: 10px 0 15px;
		height: 42px;
	}
	.myPerformance_table{
		height: calc(100% - 90px);
		overflow-y: auto;
		&::-webkit-scrollbar {
			display: none;
		}
	}
	.table_content{
		padding:  15px 0;
	}
	.table_top ,.table_content{
		font-size: 12px;
		p{
			flex: 1;
			line-height: 17px;
		}
	}
	.myPerformance_tab{
		padding-top: 18px;
		height: 48px;
		li{
			position: relative;
			height: 30px;
		}
		.active{
			color: $main-blue;
			&::after{
				content: '';
				width: 100%;
				height: 2px;
				background-color: $main-blue;
				position: absolute;
				bottom: 0;
				left: 0;
			}
		}
	}
}
</style>
