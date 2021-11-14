<!-- 登录注册协议 -->
<template>
    <div class="loginAgreement overflowPatible_box">
        <div v-html="appConfig.loginAgreement"></div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: "loginAgreement",
    props: {

    },
    data () {
        return {

        }
    },
    computed:{
        ...mapState({
            appConfig: (state) => state.appConfig,
        }),
    },
    created () {

    },
    mounted () {

    },
    methods: {

    }
}
</script>
<style lang='scss' scoped>
.loginAgreement{
    padding: 20px 16px;
}
</style>