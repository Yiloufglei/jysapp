<!--
   	author        MrYi
 	time          2021/03/11 
 	description   配资历史记录
  -->
<template>
	<div class="allocationHistory overflowPatible_box">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :offset="10"
            @load="loadMore"
            v-if="tabData.length > 0"
        >
            <recordList :list="tabData" :stateType="false"/>
        </van-list>
        <div class="no-data" v-else-if="!loading && finished"></div>
	</div>
</template>

<script>
    import { mapState } from 'vuex' 
	import recordList from '@/components/recordList'
    import {getHistoryLever} from "@/api/leverage"
    import { List } from 'vant'
	export default {
		name: 'allocationHistory',
		data() {
			return {
				tabData: [],
                total: 0,
                loading: true,
                finished: false,
                pageData:{
                    curpage:1,
                    pageSize:10,
                },
			}
		},
		components: {
			recordList,
            [List.name]:List
		},
		created() {},
        computed: {
			...mapState({
			}),
             noMore() {
				return this.tabData.length >= this.total
			},
			disabled() {
				return this.loading || this.noMore
			}
		},
        methods:{
            loadMore() {
				this.loading = true;
				this.pageData.curpage += 1
				setTimeout(() => {
					this.init()
				}, 1000)
			},
            init(){
                getHistoryLever(this.pageData).then(res => {
                    let data = res.data
                    let list = data.data || []
                    list.forEach(v => {
                        v.num = v.bonds
                        v.created_at = v.begin_time
                        v.type = 5
                        v.coin_name = v.choose_coins_name
                        v.stateText = this.$constant.allocationType[v.type_flag]
                    });
                    this.total = data.totalRows
                    this.tabData = this.pageData.curpage == 1 ? list : [...this.tabData,...list]
                    if (this.tabData.length >= data.total) this.finished = true
                    this.loading = false;
                })
            }
        },
		mounted() {
            this.init()
        },
	}
</script>
<style lang="scss" scoped>
	.allocationHistory {
        height: 100%;
        overflow: auto;
    }
</style>
