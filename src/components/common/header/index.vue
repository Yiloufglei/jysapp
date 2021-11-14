<!-- 公共头部 -->
<template>
    <van-nav-bar :left-text="leftText" fixed safe-area-inset-top placeholder @click-left="backPath" :title="title" :left-arrow="isLeft">
        <template #right>
            <slot name="right"/>
        </template>
    </van-nav-bar>
</template>

<script>
export default {
    name: "myHeader",
    props: {
        title:{
            type:String,
            default:''
        },
        leftText:{
            type:String,
            default:''
        },
        isLeft:{
            type:Boolean,
            default: true
        },
        back: { type: Function } // 返回方法
    },
    data () {
        return {

        }
    },
    created () {

    },
    mounted () {
    },
    methods: {
        backPath(){
            // 如果传入返回方法则使用传入的
            if (this.back) return this.back()
            if(this.$route.meta.backLink){
                this.$router.replace(this.$route.meta.backLink)
                return false
            }
            this.$router.go(-1)
        }
    }
}
</script>
<style lang='scss' scoped>
::v-deep .van-nav-bar__content{
    height: 45px;
}
</style>