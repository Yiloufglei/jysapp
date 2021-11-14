<template>
    <div>
        <ul class="flexC_S handicap" @click="setPrice(item)" :class="type" v-for="(item, index) in depthData" :key="item[0] + '' + item[1] + '' + index">
            <li class="ep-hd ep-hd_l">{{ item[0] }}</li>
            <li class="ep-hd">{{ item[1] }}</li>
            <li class="bj_li" :style="{width:item[2] + '%'}"></li>
        </ul>
    </div>
</template>
<script>
export default {
    data(){
        return {
            x : 0
        }
    },
    props: {
        type: { type: String, default: "" },
        depthData: { type: Array, default: () => [] },
    },
    methods:{
        setPrice(item){
            this.$emit('setPrice',item[0])
        }
    },
    computed: {
    },
    mounted(){
    }
};
</script>
<style lang="scss" scoped>
.dd-style {
    dd:last-child {
        color: $main-font-c;
        margin-right: 16px;
    }
}
.handicap{
    position: relative;
    .bj_li{
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        transition: all 0.1s;
    }
}
.buy {
    .ep-hd_l{
        color: $buy;
    }
    @extend .dd-style;
    .bj_li{
        background: rgba(16,180,121,.13)
    }
}
.sell {
    .ep-hd_l{
        color: $sell;
    }
    .bj_li{
        background: rgba(221,37,62,.13);
    };
    @extend .dd-style;
}

ul {
    height: 27px;
    line-height: 27px;
    li {
        font-size: 12px;
        overflow-x: hidden;
    }
}
</style>