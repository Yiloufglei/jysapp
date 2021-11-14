<template>
    <div class="leverage">
        <div class="top-tab-container">
            <div class="top-tab between">
                <div class="top-btn center" :class="{ 'top-tab-active': tab.route === $route.path }" v-for="tab in topTab" :key="tab.route" @click="switchTopTab(tab)">
                    {{ tab.name }}
                </div>
            </div>
        </div>
        <div class="hold"></div>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    data () {
        return {
            topTab: [
                { name: "配资区", route: "/leverage" },
                { name: "交易区", route: "/leverage/leverageList" },
            ]
        };
    },
    methods: {
        switchTopTab (data) {
            if (this.$route.path === data.route) return
            if ( data.route === "/leverage/leverageList" && !this.$store.state.user.token ) {
                return this.$router.push({ path: "/login" });
            }
            this.$router.replace({ path: data.route });
        },
    },
};
</script>
<style lang="scss" scoped>
.leverage {
    height: 100%;
}
.hold {
    height: 58px;
}
.top-tab-container {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 10;
    background: #fff;
    padding: 10px 15px;
    height: 58px;
    .top-tab {
        height: 38px;
    }
    .top-btn {
        &:first-child {
            border-radius:6px 0 0 6px;
            &.top-tab-active {
                color: $main-blue;
                border:1px solid $main-blue;
            }
        }
        &:last-child {
            border-radius:0 6px 6px 0;
            &.top-tab-active {
                color: $main-blue;
                border:1px solid $main-blue;
            }
        }
        border: 1px solid #e6e6e6;
        height: 100%;
        font-size: 16px;
        font-weight: 500;
        color: #9c9ba5;
        flex: 1;
        
    }
}
</style>