<template>
    <div class="box flex wrap between">
        <dl class="item" v-for="(item, index) in multipleData"
            :key="item" @click="select(index)">
            <dd><span>{{ item }}倍</span>日利率{{ rate }}%</dd>
            <dd class="color_c">{{ (buyNum * item).toFixed(4) }} USDT</dd>
            <div v-show="current === index" class="absolute_box"></div>
        </dl>
    </div>
</template>
<script>
export default {
    props: {
        multipleData: { type: Array, default: () => [] },
        rate: { type: Number, default: 0 },
        buyNum: { type: [Number, String], default: 0 },
    },

    data () {
        return {
            current: 0,
        };
    },
    computed: {
        multiple () {
            return this.multipleData[this.current];
        },
    },
    methods: {
        select (index) {
            this.current = index;
            this.$emit("select", this.multiple);
        },
    },
    watch: {
        multipleData: {
            handler: function (newVal) {
                if (newVal.length) {
                    this.$emit("select", this.multiple);
                }
            },
            immediate: true,
        },
    },
};
</script>
<style lang="scss" scoped>
.box {
    width: 100%;
    margin-right: -10px;
    border-bottom: 1px solid #f5f5f5;
}
.item {
    width: 48%;
    word-break: break-all;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.11);
    border-radius: 6px;
    padding: 5px 10px 10px;
    margin-bottom: 12px;
    position: relative;
    dd {
        font-size: 12px;
        &:nth-child(1){
            margin-bottom: 10px;
            font-weight: 500;
            span{
                font-size: 16px;
                margin-right: 4px;
                line-height: 22px;
            }
        }
    }
}
.absolute_box{
    position: absolute;
    top:0;
    right:0;
    width: 100%;
    height: 100%;
    border: 1px solid $main-blue;
    border-radius: 6px;
    box-shadow: 0px 0px 6px rgba(78, 120, 243, 0.11);
     &::after {
        content: "";
        position: absolute;
        top: 8px;
        right: 8px;
        width: 14px;
        height: 14px;
        background: url("~@/assets/imgs/selected-icon.png") no-repeat;
        background-size: contain;
    }
}
</style>