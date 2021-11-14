<!-- 
  	author        MrYi
	time          2021/03/18
	description   帮助详情
 -->
<template>
	<div class="helpDetail overflowPatible_box">
        <div v-html="info.content"></div>
    </div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
    import { userHelpInfo } from "@/api/securityCenter";
	export default {
		name: 'helpDetail',
		data() {
			return {
                info:{}
            }
		},
		computed: {
			...mapState({}),
		},
		components: {},
		methods: {},
		mounted() {
            let obj = {
                id : this.$route.query.id
            }
            userHelpInfo(obj).then(res => {
                this.info = res.data.info || {}
            })
        },
	}
</script>

<style lang="scss" scoped>
.helpDetail{
	padding: 20px 16px;
}
</style>
