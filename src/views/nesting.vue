<!-- nesting -->
<template>
    <div class="nesting">
        <van-skeleton title  :row="5" :loading="loading" animate></van-skeleton>
        <div class="nesting_body" v-show="!loading">
            <iframe id="ifra" :src="iframeUrl" width="100%" height="100%" frameborder="0" scrolling="auto" name="iframename"></iframe>
        </div>
        <div class="go_back center" ref="floatButton" @click="myBack" :style="{ 'left': left + 'px', 'top': top + 'px'}"></div>
    </div>
</template>

<script>
import myHeader from '@/components/common/header'
import { Skeleton } from 'vant';
export default {
    name: "nesting",
    props: {
    },
    components: {
        myHeader,
        [Skeleton.name]: Skeleton
    },
    computed:{
        iframeUrl(){
            return this.$route.query.url || ''
        }
    },
    data () {
        return {
            left: document.body.clientWidth - 60,
            top: document.body.clientHeight - 140,
            loading:true
        }
    },
    created () {

    },
    mounted () {
        let _this = this
        const iframe = document.querySelector('#ifra')
        // 处理兼容行问题
        if(iframe){
            if (iframe.attachEvent) {
                iframe.attachEvent('onload', function () {
                    // iframe加载完毕以后执行操作
                    _this.loading = false
                })
            } else {
                iframe.onload = function () {
                    // iframe加载完毕以后执行操作
                    _this.loading = false
                }
            }
        }
        this.$nextTick(() => {
            const floatButton = this.$refs.floatButton
            floatButton.addEventListener("touchstart", () => {
                floatButton.style.transition = 'none'
            })
            // 在拖拽的过程中，组件应该跟随手指的移动而移动。
            floatButton.addEventListener("touchmove", (e) => {
                if (e.targetTouches.length === 1) {         // 一根手指
                    let touch = e.targetTouches[0]
                    this.left = touch.clientX - 20
                    this.top = touch.clientY - 20
                }
            })
			// 拖拽结束以后，重新调整组件的位置并重新设置过度动画。
            floatButton.addEventListener("touchend", () => {
                floatButton.style.transition = 'all 0.3s'
                if(this.left > document.documentElement.clientWidth / 2) {
                    this.left = document.documentElement.clientWidth - 60
                }else{
                    this.left = 20
                }
            })
        })
    },
    methods: {
        myBack(){
            this.$router.replace('/')
        },
        onload(){
            console.log(1)
        }
    }
}
</script>
<style lang='scss' scoped>
.nesting {
    height: 100%;
    .nesting_body{
        height: 100%;
        // height: calc(100% - 45px);
    }
    .van-skeleton .van-skeleton__content{
        margin-top: 20px;
        .van-skeleton__title,.van-skeleton__row{
            height: 20px;
        }
    }
    .go_back{
        width: 40px;
        height: 40px;
        background: url("~@/assets/imgs/gohome.png") no-repeat center center;
        background-size: cover;
        border-radius: 50%;
        position: fixed;
    }
}
</style>