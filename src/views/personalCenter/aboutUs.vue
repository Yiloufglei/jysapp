<template>
	<div class="about-us">
        <div class="logo"><img src="@/assets/imgs/logo3.png" alt="" srcset=""></div>
        <div v-html="contentData.content"></div>
    </div>
</template>

<script>
    import { aboutDetail } from '@/api/activity'
	export default {
		name: 'ActivityDetail',
		data() {
			return {
                contentData:{}
            }
		},
		created() {
            aboutDetail().then(res => {
                this.contentData = res.data.data || {}
            })
        },
	}
</script>

<style lang="scss" scoped>
.about-us{
	padding: 0 15px;
    .logo{
        text-align: center;
        padding: 30px;
        img {
            width: 120px;
        }
    }
}
</style>
