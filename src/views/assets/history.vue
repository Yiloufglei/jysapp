<!--
   	author        MrYi
 	time          2021/03/11 
 	description   历史记录 1，充值   2，提现    3，划转
  -->
<template>
	<div class="history overflowPatible_box">
		<van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :offset="10"
            @load="loadMore"
            v-if="tabData.length > 0"
        >
            <recordList :list="tabData" />
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
		name: 'history',
		data() {
			return {
				tabData: [],
                total: 0,
                loading: true,
                finished: false,
                pageData:{
                    page:1,
                    page_size:10,
                    act:'',
                    coin_name: ''
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
                let type = this.pageData.act
                let constant = {}
                if(type == 1){
                    constant = this.$constant.rechargeState
                }else if(type == 2){
                    constant = this.$constant.withdrawState
                }
                walletAssetsLog(this.pageData).then(res => {
                    let data = res.data
                    let list = data.list || []
                    list.forEach(v => {
                        v.stateText = constant[v.state]
                    });
                    this.total = data.total
                    this.tabData = this.pageData.page == 1 ? list : [...this.tabData,...list]
                    if (this.tabData.length >= data.total) this.finished = true
                    this.loading = false;
                })
            }
        },
		mounted() {
            this.pageData.act = this.$route.query.type
            this.pageData.coin_name = this.$route.query.coin_name
            this.init()
        },
	}
</script>
<style lang="scss" scoped>
</style>
