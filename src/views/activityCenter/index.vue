<template>
  <div class="activity-center">
      <div class="list" v-for="item in dataList" :key="item.id" @click="toDetail(item.id)">
          <div class="text">{{item.title}}</div>
          <van-image
            lazy-load
            :src="item.img"
            radius="5"
            />
          <div class="text btn">查看详情</div>
      </div>
  </div>
</template>

<script>
import { Image } from 'vant'
import { activityList } from '@/api/activity'
export default {
    name: 'ActivityCenter',
    components: {
        [Image.name]:Image
    },
    data() {
        return {
            dataList: []
        }
    },
    created() {
        activityList().then(res => {
            this.dataList = res.data.list
        })
    },
    methods: {
        toDetail(id) {
            this.$router.push('/activityDetail?id='+id)
        }
    }
}
</script>

<style lang="scss" scoped>
.activity-center{
    background: #F9F9F9;
    padding-top: 0.1px;
    padding-bottom: 10px;
}
.list{
    margin:  10px;
    padding: 0 10px;
    background: #FFFFFF;
    border: 1px solid #E6E6E6;
    border-radius: 5px;
    margin-top: 15px;
    .text{
        font-size: 16px;
        font-weight: 500;
        padding: 10px 0;
        color: #000;
        font-family: PingFang SC;
    }
    .btn{
        text-align: center;
        border-top: 1px solid #E6E6E6;
        margin-top: 5px;
    }
}
</style>