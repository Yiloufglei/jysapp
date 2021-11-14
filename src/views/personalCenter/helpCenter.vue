<!-- 
  	author        MrYi
	time          2021/03/18
	description   帮助中心
 -->
<template>
	<div class="helpCenter">
		<div class="border_b_c" @click="routePath(item.id)" v-for="item in list" :key="item.id">{{item.sort}}、{{item.title}}</div>
		<div class="no-data" v-if="list.length === 0"></div>
	</div>
</template>

<script>
    import { userHelp } from "@/api/securityCenter";
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'helpCenter',
		data() {
			return {
                list : []
            }
		},
		computed: {
			...mapState({}),
		},
		components: {},
		methods: {
			routePath(id){
				this.$router.push(`/helpDetail/?id=${id}`)
			}
		},
		mounted() {
            userHelp().then(res => {
                this.list = res.data.list || []
            })
        },
	}
</script>

<style lang="scss" scoped>
.helpCenter{
	padding: 20px 16px;
	div{
		padding: 15px 0;
	}
}
</style>
