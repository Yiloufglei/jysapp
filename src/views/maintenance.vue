<template>
    <div class="maintenance">
        <div class="title">系统维护</div>
        <!-- <div class="time">维护时间：{{$formatDate(appConfig.updatedAt)}}</div> -->
        <div class="content">{{appConfig.notice}}</div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: 'maintenance',
    data () {
        return {

        }
    },
    computed:{
        ...mapState({
            appConfig: (state) => state.appConfig,
        }),
    },
}
</script>
<style lang="scss" scoped>
.maintenance {
    background: $main-blue;
    height: 100%;
    color: #fff;
    overflow-y: auto;
    font-weight: 500;
    font-family: PingFang SC;
    text-align: center;
    .title {
        font-size: 36px;
        padding: 25px 0;
    }
    .time {
        font-size: 16px;
    }
    .content {
        font-size: 14px;
        padding: 25px 20px;
        text-indent: 2em;
        text-align: left;
    }
}
</style>