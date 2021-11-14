<!-- 《广告商服务协议》 -->
<template>
  <div class="agreement overflowPatible_box" v-html="advertiserData.agreement"></div>
</template>

<script>
import { mapState } from 'vuex'
import { bondGetOtcPoster} from "@/api/advertisement"
export default {
    name:"agreement",
    props: {

    },
    data() {
        return {
            advertiserData:{}
        }
    },
    computed:{
        ...mapState({
            userInfo: (state) => state.user.userInfo,
        }),
    },
    created() {

    },
    mounted() {
        let obj = {
            uid:this.userInfo.uid
        }
        bondGetOtcPoster(obj).then(res => {
            this.advertiserData = res.data
        })
    },
    methods: {

    }
}
</script>
<style lang='scss' scoped>
.agreement{
    padding: 20px 16px;
}
</style>