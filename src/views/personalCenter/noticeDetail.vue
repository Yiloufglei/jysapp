<!-- 
  	author        MrYi
	time          2021/04/01
	description   公告详情
 -->
<template>
	<div class="noticeDetail">
        <div class="title">
           {{contentData.title}}
        </div>
        <p class="color_c time_text">{{$formatDate(contentData.createAt)}}</p>
        <div  v-html="contentData.content"></div>
    </div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
    import { getNoticeDetail } from '@/api/securityCenter'
	export default {
		name: 'noticeDetail',
		data() {
			return {
                contentData:{}
            }
		},
		computed: {
			...mapState({}),
		},
		components: {},
		methods: {
		},
		mounted() {
            let obj = {
                id:this.$route.query.id
            }
            getNoticeDetail(obj).then(res => {
                this.contentData = res.data.data || {}
            })
        },
	}
</script>

<style lang="scss" scoped>
.noticeDetail{
	padding: 10px;
    overflow-y:auto;
    overflow-x:hidden;
    word-break: break-all;
    .title{
        font-weight: bold;
    }
    .time_text{
        line-height: 40px;
    }
    ::v-deep img, ::v-deep p, ::v-deep span {
        max-width: 100%;
    }
}
</style>
