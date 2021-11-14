<template>
    <div class="container">
        <router-view />
        <van-tabbar v-model="active" @change="routePath" fixed placeholder safe-area-inset-bottom active-color="#4e82f3" inactive-color="#9c9ba5" :before-change="beforeChange">
            <van-tabbar-item v-for="item in tabList" :key="item.key" :name="item.key">
                <span>{{item.name}}</span>
                <template #icon="props">
                    <img :src="active == item.key ? item.active : item.inactive" />
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
export default {
    name: "Index",
    data () {
        return {
            active:'/',
            tabList:[
                { name : '首页' ,key: '/',to :'/' ,inactive: require('@/assets/imgs/tabbar/home.png'),active:require('@/assets/imgs/tabbar/home-active.png')},
                { name : '行情' ,key: '/market',to : '/market' ,inactive: require('@/assets/imgs/tabbar/market.png'),active:require('@/assets/imgs/tabbar/market-active.png')},
                { name : '交易' ,key: '/trade',to : '/trade' ,inactive: require('@/assets/imgs/tabbar/trade.png'),active:require('@/assets/imgs/tabbar/trade-active.png')},
                // { name : '期权' ,key: '/optionTrade',to : '/optionTrade' ,inactive: require('@/assets/imgs/tabbar/financing.png'),active:require('@/assets/imgs/tabbar/financing-active.png')},
                { name : '合约' ,key: '/contractIndex',to : '/contractIndex' ,inactive: require('@/assets/imgs/tabbar/financing.png'),active:require('@/assets/imgs/tabbar/financing-active.png')},
                // { name : '期权' ,key: 'optionTrade',to : '/optionTrade' ,inactive: require('@/assets/imgs/tabbar/financing.png'),active:require('@/assets/imgs/tabbar/financing-active.png')},
                // { name : '配资' ,key: 'allocation',to : '/allocation' ,inactive: require('@/assets/imgs/tabbar/financing.png'),active:require('@/assets/imgs/tabbar/financing-active.png')},
                { name : '资产' ,key: '/assets',to : '/assets' ,inactive: require('@/assets/imgs/tabbar/assets.png'),active:require('@/assets/imgs/tabbar/assets-active.png')},
            ],
        }
    },
    created () {
        let path = this.$route.path
        this.active = path
    },
    watch: {
        '$route.path'(val) {
            this.active = val
        }
    },
    methods:{
        beforeChange(path){
            return true
            if(path === '/contractIndex'){
                this.$toast('将于8月份推出全新合约模式')
                return false
            }else{
                return true
            }
        },
        routePath(path){
            // if(path === '/contractIndex'){
            //     return
            // }
            this.$router.push(path)
        }
    }
};
</script>
<style lang="scss" scoped>
.container{
    height: 100%;
    overflow: auto;
    ::v-deep .van-tabbar{
        box-shadow: 0 -2px 5px #eeee;
    }
}
</style>
