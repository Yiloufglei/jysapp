<template>
    <div class="my_vanSlider">
        <div class="my_vanSlider_box center">
            <van-slider
                v-model="sliderValue"
                :min="min"
                :max="max"
                bar-height="4px">
                <template #button>
                    <!-- <div class="custom-button">{{ testValue }}</div> -->
                    <div class="custom-button">
                        <div class="line"></div>
                        <div class="line"></div>
                    </div>
                </template>
            </van-slider>
            <div class="line-box">
                <div
                    class="item"
                    :class="{'active': sliderValue >= max/share*index, 'first': index === 0, 'last': index === share}"
                    v-for="(item, index) in share+1"
                    :key="item"
                    :style="{'left': getLen(index)}">
                </div>
            </div>
        </div>
        <div class="my_vanSlider_box center">
            <div class="num-box">
                <div
                    class="text"
                    :class="{'first': index === 0, 'last': index === share}"
                    v-for="(item, index) in share+1"
                    :key="item"
                    :style="{'left': getLen(index)}">
                    {{$fomatFloat(index === 0 ? min : max/share*index, 0)}}X
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Slider } from 'vant';
export default {
    components: {
        [Slider.name]: Slider,
    },
    name:'my_vanSlider',
    data() {
        return {
            sliderValue: 0,
        }
    },
    props:{
        value: [Number, String],
        max: {
            type: Number,
            default: 100
        },
        min: {
            type: Number,
            default: 0
        },
        share: {
            type: Number,
            default: 5
        }
    },
    created() {
        this.sliderValue = this.value
    },
    methods: {
        getLen(index) {
            return 100/(this.max-this.min)*(this.max/this.share*index - (index === 0 ? 0 : this.min)) + '%'
        }
    },
    watch: {
        sliderValue(val) {
            this.$emit('input', val)
        },
        value(val) {
            this.sliderValue = val
        }
    }
}
</script>

<style lang="scss" scoped>
.my_vanSlider{
    height: 34px;
    padding: 0px 8px;
    display: flex;
    flex-wrap: wrap;
    flex-flow: column;
    justify-content: space-between;
    .my_vanSlider_box{
        position: relative;
        width: 100%;
        height: 16px;
    }
    .van-slider{
        z-index: 2;
    }
}
.custom-button {
    width: 15px;
    height: 16px;
    background: #fff;
    border: 1px solid $main-blue;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .line{
        width: 2px;
        background: $main-blue;
        height: 10px;
    }
}

.line-box,.num-box{
    width: 100%;
    height: 16px;
    position: relative;
    .item{
        width: 5px;
        height: 16px;
        background: #ebedf0;
        position: absolute;
        transform: translateX(calc(-50% + 0.5px));
        &.first{
            transform: translateX(calc(0% - 2px));
        }
        &.last{
            transform: translateX(calc(-100% + 2px));
        }
        &.active{
            background: $main-blue;
        }
    }
    .text{
        font-size: 12px;
        height: 18px;
        line-height: 18px;
        position: absolute;
        top: 0;
        text-align: center;
        transform: translateX(calc(-50% + 0.5px));
        &.first{
            text-align: left;
            transform: translateX(calc(0% - 2px));
        }
        &.last{
            text-align: right;
            transform: translateX(calc(-100% + 2px));
        }
    }
}
.line-box{
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
}
::v-deep .van-slider__bar{
    transition: all 0s !important;
}
</style>