<!-- 
  	author        MrYi
	time          2021/04/01
	description   公告中心
 -->
<template>
    <div class="noticeList">
        <ul>
            <li  class="border_b_c" v-for="item in list" :key="item.id" @click="noticeDetail(item)">
                <p>{{item.title}}</p>
                <p class="color_c">{{$formatDate(item.createdAt)}}</p>
            </li>
        </ul>
    </div>
</template>

<script>
import { getNoticeIndex } from '@/api/securityCenter'
export default {
    name: "noticeList",
    props: {

    },
    data () {
        return {
            list:[]
        }
    },
    created () {

    },
    mounted () {
        getNoticeIndex().then(res => {
            this.list = res.data.list || []
        })
    },
    methods: {
        noticeDetail(item){
            this.$router.push(`/noticeDetail?id=${item.id}`)
        }
    }
}
</script>
<style lang='scss' scoped>
.noticeList{
    padding: 20px 16px;
    ul{
        li{
            padding: 10px 0;
            p{
                line-height: 20px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .color_c{
                margin-top: 10px;
            }
        }
    }
}
</style>