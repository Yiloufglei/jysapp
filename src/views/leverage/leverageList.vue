<template>
    <div class="trade-content overflowPatible_box">
        <section class="tab flex">
            <dl :class="{ active: currentTab === 0 }" @click="setCurrentTab(0)">
                当前配资
            </dl>
            <dl :class="{ active: currentTab === 1 }" @click="setCurrentTab(1)">
                历史配资
            </dl>
        </section>
        <component :is="comp"></component>
    </div>
</template>
<script>
import Current from "./current";
import History from "./history";
import { mapState } from 'vuex'
export default {
    components: { Current, History },
    data () {
        return {
            currentTab: 0,
        };
    },
    computed: {
        ...mapState({
            tradeArea : (stata) => stata.user.tradeArea
        }),
        comp () {
            return this.currentTab === 0 ? Current : History;
        },
    },
    created(){
        if(this.tradeArea){
            this.currentTab = this.tradeArea
        }
    },
    methods:{
        setCurrentTab(val){
            this.currentTab = val
            this.$store.commit('SET_USER_BEHAVIOR',{key:'tradeArea',val:val})
        }
    }
};
</script>
<style lang="scss" scoped>
.trade-content {
    height: calc(100% - 58px);
}
.tab {
    justify-content: space-around;
    background: #F9F9F9;
    dl {
        padding: 5px 0 10px;
        font-size: 14px;
        height: 36px;
        font-weight: 500;
        color: #9c9ba5;
        &.active {
            color: $main-blue;
            border-bottom: 2px solid $main-blue;
        }
    }
}
</style>