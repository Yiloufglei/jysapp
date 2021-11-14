<!--
   	author        MrYi
 	time          2021/03/11 
 	description   划转历史记录
  -->
<template>
	<div class="transferHistory overflowPatible_box">
		<van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :offset="10"
            @load="loadMore"
            v-if="tabData.length > 0"
        >
            <recordList :list="tabData" :isClick="false" :stateType="false"/>
        </van-list>
        <div class="no-data" v-else-if="!loading && finished"></div>
	</div>
</template>

<script>
    import { mapState } from 'vuex' 
	import recordList from '@/components/recordList'
    import {walletAssetsLog} from "@/api/assets"
    import { List } from 'vant'
	export default {
		name: 'transferHistory',
        components: {
			recordList,
            [List.name]:List
		},
		data() {
			return {
				tabData: [],
                total: 0,
                loading: true,
                finished: false,
                pageData:{
                    page:1,
                    page_size:10,
                    act:'34',
                    coin_name: ''
                },
			}
		},
		created() {},
        computed: {
			...mapState({
			}),
		},
        methods:{
            loadMore() {
				this.loading = true;
				this.pageData.page += 1
				setTimeout(() => {
					this.init()
				}, 1000)
			},
            init(){
                walletAssetsLog(this.pageData).then(res => {
                    let data = res.data
                    let list = data.list || []
                    list.forEach(v => {
                        v.stateText = (this.$constant.transferState[v.from] || '--') + '到' + (this.$constant.transferState[v.to] || '--')
                    });
                    this.total = data.total
                    this.tabData = this.pageData.page == 1 ? list : [...this.tabData,...list]
                    if (this.tabData.length >= data.total) this.finished = true
                    this.loading = false;
                })
            }
        },
		mounted() {
            this.pageData.coin_name = this.$route.query.coin_name
            this.init()
        },
	}
</script>
<style lang="scss" scoped>
</style>
