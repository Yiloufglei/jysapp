<template>
	<div class="activity-detail">
        <div class="title">
           {{contentData.title}}
        </div>
        <div v-html="contentData.content" style="padding-top: 10px"></div>
    </div>
</template>

<script>
    import { activityDetail } from '@/api/activity'
	export default {
		name: 'ActivityDetail',
		data() {
			return {
                contentData:{}
            }
		},
		created() {
            let obj = {
                id: this.$route.query.id
            }
            activityDetail(obj).then(res => {
                this.contentData = res.data.data || {}
            })
        },
	}
</script>

<style lang="scss" scoped>
.activity-detail{
	padding: 10px;
    word-break: break-all;
    .title{
        font-weight: bold;
    }
    ::v-deep img, ::v-deep p, ::v-deep span {
        max-width: 100%;
    }
}
</style>
