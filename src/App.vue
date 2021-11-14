<template>
    <div id="app">
        <myHeader v-if="isShow" :title="title" />
        <div :style="{ height: isShow ? 'calc(100% - 45px)' : '100%', minHeight: isShow ? 'calc(100% - 45px)' : '100%'}">
            <router-view v-if="isRouterAlive" />
        </div>
    </div>
</template>
<script>
import myHeader from '@/components/common/header'
export default {
    components: {
        myHeader
    },
    provide (){
        return {
            reload: this.reload
        }
    },
    data () {
        return {
            isShow: false,
            title: "",
            isRouterAlive: true
        };
    },
    watch: {
        $route (to, from) {
            this.title = to.meta ? to.meta.title || "交易所" : "交易所";
            if (to.meta.no_header_require) {
                this.isShow = false;
            } else {
                this.isShow = true;
            }
            this.$store.dispatch('getAppConfig').then(res => {
                // 维护
                if (res.appStatus !== 1 && to.path !== '/maintenance') {
                    this.$router.push('/maintenance')
                }
            })
        },
    },
    created () {
        this.$store.dispatch('getCoinConfig')
        if (this.loginType) {
            this.$store.dispatch('updateUserInfo')
            this.$store.dispatch('handleMySymbols', { type: 'get' })
        }
    },
    mounted () {
        // iphone 6\7plus 键盘弹出推起页面，收起键盘页面不收回问题
        document.body.addEventListener("focusout", () => {
            setTimeout(() => {
                const scrollHeight =
                    document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            }, 100);
        });
    },
    methods: {
        reload (){
            // 刷新路由
            this.isRouterAlive = false
            this.$nextTick(function(){
                this.isRouterAlive = true
            })
        }
    },
};
</script>

<style>
html,
body,
#app {
    height: 100%;
}
</style>
