<template>
    <div class="block_box" @touchstart="progressDown" @touchmove="progressMove">
        <div class="progress-bar">
            <div class="pro-bar" :style="{'width' : left +'px'}" :class="tradeMode === 1 ? 'bg-buy' : 'bg-sell'"></div>
            <div class="block" :style="{'left' : left +'px'}" :class="tradeMode === 1 ? 'buybg' : 'sellbg'"  @touchstart="ballMouseDown" @touchmove="ballMouseMove"></div>
            <ul class="ul_box">
                <li v-for="(item,index) in 6" :key="index" :class=" i >= index ? (tradeMode === 1 ? 'bg-buy' : 'bg-sell')  : ''"></li>
            </ul>
        </div>
    </div>
</template>
<script>
import {_throttle} from "@/utils/util";
export default {
    props: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        tradeMode: {
            type: Number,
            default: 1
        },
    },
    data () {
        return {
            i:0,
            startX: 0,
            left:0,
            moveBlock: null,
            moveMax: 0,
            startLeft: 0,
            progressLeft:0
        };
    },
    mounted () {
        this.moveBlock = document.querySelector('.block');
        let progressBar = document.querySelector('.progress-bar');
        this.progressLeft = progressBar.getBoundingClientRect().left
        this.moveMax = progressBar.offsetWidth - this.moveBlock.offsetWidth; // 背景条宽度减去滑块的宽度
    },
    computed: {
    },
    methods: {
        init(x){
            if (x <= 0) {
                x = 0
            }
            if (x >= this.moveMax) {
                x = this.moveMax
            }
            let y = parseInt(x / this.moveMax * 100)
            this.left = x
            this.i = y / 20
            this.$emit('setOpacityConfig',y)
        },
        buyNumberChange(val){
            let x = Number(val) * this.moveMax / 100
            this.left = x
            this.i = val / 20
        },
        progressMove (e) {
            let x = this.startLeft + (e.changedTouches[0].clientX - this.startX)
            this.init(x)
        },
        ballMouseMove (e) {
            let x = this.startLeft + (e.changedTouches[0].clientX - this.startX)
            this.init(x)
        },
        ballMouseDown (e) {
            this.startX = e.changedTouches[0].clientX;
            this.startLeft = this.left
        },
        progressDown(e){
            let x = e.changedTouches[0].clientX - this.progressLeft- (this.moveBlock.offsetWidth / 2);
            this.startX = e.changedTouches[0].clientX;
            this.startLeft = x
            this.init(x)
        },
    }
}
</script>
<style scoped lang="scss">
.block_box{
    height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
}
.progress-bar {
    position: relative;
    height: 5px;
    width: 100%;
    background: #ebeef5;
    border-radius: 10px;
    ul{
        position: absolute;
        display: flex;
        width: 100%;
        top: -5px;
        left: 0;
        justify-content: space-between;
        li{
            width: 4px;
            height: 16px;
            background: #ebeef5;
        }
    }
}
.progress-bar .pro-bar {
    position: absolute;
    left: 0;
    height: 5px;
}
.progress-bar .block {
    z-index: 1;
    position: absolute;
    height: 20px;
    width: 15px;
    top: -7.5px;
    border-radius: 2px;
}
.buybg{
    background: url(~@/assets/imgs/slider_buy.png) no-repeat;
    background-size: 100% 100%;
}
.sellbg{
    background: url(~@/assets/imgs/slider_sell.png) no-repeat;
    background-size: 100% 100%;
}
</style>