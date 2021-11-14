<!-- 
  	author        MrYi
	time          2021/03/17
	description   我的广告
 -->
<template>
    <div class="myAdvertisement">
        <myHeader title="我的广告"></myHeader>
        <div class="myAdvertisement_body">
            <div class="myAd_top flexC_S">
                <div :class="{'active_active' : tabIndex == 1}"><span @click="tabIndexClick(1)">进行中</span></div>
                <div :class="{'active_active' : tabIndex == 2}"><span @click="tabIndexClick(2)">已下架</span></div>
            </div>
            <div class="myAd_content overflowPatible">
                <div class="leftSlipList">
                    <div v-if="!list.length" class="no-data"></div>
                    <van-swipe-cell  v-for="(item) in list" :key="item.id">
                        <div class="myAd_content_li eftSlip_li"  @click="routerPath(item)">
                            <div class="content_li_t flexC_S">
                                <div class="content_li_t_l col-center">
                                    <div class="center upper" :style="{background : item.buy_or_sell == 2 ? '#fc0200' :'#138000'}">
                                        {{(item.buy_or_sell == 2 ? '出售' : '购买') + item.coin_name}}</div>
                                    <i v-for="(items,index) in item.pay_types" :key="index" class="iconfont" :class="$iconClassName(items)"></i>
                                </div>
                                <div class="content_li_t_r col-center">
                                    <span :class="{color_b :item.type == 1 ,color_g :item.type == 2}">{{$constant.advertiseState[item.type]}}</span>
                                    <i class="iconfont iconyou1"></i>
                                </div>
                            </div>
                            <div class="content_li_b flexC_S">
                                <span class="color_c">时间：{{$formatDate(item.created_at)}}</span>
                                <span class="content_li_b_r">单价：{{item.coin_price + item.trans_to_coin}}</span>
                            </div>
                        </div>
                        <template #right>
                            <van-button square type="danger" text="删除"  @click="deleteItem(item)"/>
                        </template>
                    </van-swipe-cell>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    mapState
} from 'vuex'
import myHeader from '@/components/common/header'
import { myPosterOtcPoster,posterDeleteOtcPoster } from "@/api/advertisement"
export default {
    name: 'myAdvertisement',
    data () {
        return {
            tabIndex: 1,
            list: [],
            delItem: {},
            clientNum: {}, // 记录开始滑动（x1）,结束滑动（x2）的鼠标指针的位置
            candelete: {}, // 滑动的item
        }
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.user.userInfo,
        }),
    },
    components: {
        myHeader
    },
    methods: {
        deleteItem (item) {
            let obj = {
                poster_id: item.id
            }
            posterDeleteOtcPoster(obj).then(res => {
                this.$toast({
                    message:'删除成功'
                })
                this.init()
            })
        },
        tabIndexClick(type){
            this.tabIndex = type
            this.init()
        },
        routerPath (item) {
            this.$router.push({path: `/adDetails?poster_id=${item.id}&uid=${this.userInfo.uid}`})
        },
        init () {
            let obj = {
                uid: this.userInfo.uid,
                state: this.tabIndex
            }
            myPosterOtcPoster(obj).then(res => {
                let data = res.data.list || []
                this.list = data

            })
        }
    },
    mounted () {
        this.init()
    },
}
</script>

<style lang="scss" scoped>
.myAdvertisement {
    background-color: #f9f9f9;
    height: 100%;
    .myAdvertisement_body{
        height: calc(100% - 45px);
    }
    .myAd_content {
        height: calc(100% - 60px);
        padding: 12px 21px 12px 11px;
        overflow-y: auto;
        .myAd_content_li {
            background-color: #ffffff;
            border-radius: 6px;
            padding: 12px 13px 27px 13px;
            margin-bottom: 15px;
            .content_li_t {
                margin-bottom: 20px;
                .content_li_t_l {
                    div {
                        width: 68px;
                        height: 21px;
                        border-radius: 2px;
                        color: #ffffff;
                        font-size: 12px;
                    }
                    .iconfont {
                        margin-left: 15px;
                    }
                }
                .content_li_t_r {
                    .iconfont {
                        margin-left: 5px;
                    }
                }
            }
            .content_li_b {
                line-height: 17px;
                font-size: 12px;
                padding-right: 20px;
                .content_li_b_r{
                    font-size: 14px;
                }
            }
        }
    }

    .myAd_top {
        padding: 10px 0;

        div {
            flex: 1;
            line-height: 40px;
            height: 40px;
            text-align: center;
            position: relative;
        }

        .active_active {
            color: $main-blue;

            &::after {
                content: "";
                height: 2px;
                width: 56px;
                position: absolute;
                background-color: $main-blue;
                bottom: 0;
                left: calc(50% - 28px);
            }
        }
    }
}
</style>
