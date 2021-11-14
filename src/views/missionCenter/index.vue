<!-- 任务中心 -->
<template>
    <div class="missionCenter">
        <div class="missionCenter_top">
            <div class="missionCenter_top_overview">
                <div class="capital">
                    <div class="capital_t flexC_S">
                        <span>我的奖励金</span>
                        <i v-show="!isShow" class="iconfont iconicon-test" @click="isShow = true"></i>
                        <i v-show="isShow" class="iconfont iconxianshi" @click="isShow = false"></i>
                    </div>
                    <div class="capital_c">{{hideShow(`${myGold.total} USDT`)}}</div>
                    <div class="capital_b">待领取 {{hideShow(`${myGold.wait} USDT`)}}</div>
                    <div class="capital_b">已领取 {{hideShow(`${myGold.have} USDT`)}}</div>
                    <div class="poabs_btn center" @click="$router.push('/activeAccount')">去划转</div>
                </div>
            </div>
        </div>
        <!-- <div class="hotEvents">
            <div class="flexC_S title"><h3>热门活动</h3><span>更多</span></div>
        </div> -->
        <div class="taskList">
            <div class="title"><h3>任务列表</h3></div>
            <div class="liItem fzboid between" v-for="item in taskList" :key="item.Id">
                <div class="liItem_id">
                    <p>{{item.stype === 1 ? '新人' : '成长'}}</p>
                </div>
                <div class="liItem_l">
                    <div class="liItem_l_t">{{item.taskName}}</div>
                    <div class="liItem_l_c flexC_S">
                        <span>{{item.conType | conType}}</span>
                        <div class="progressbar">
                            <span :style="{width:`${item.finishProcess || 0 }%`}"></span>
                            <div v-if="item.conType !== 1 && item.conType !== 2" class="progress_text">{{item.tradeMoney || 0}}/{{item.con || 0}}</div>
                        </div>
                    </div>
                    <div class="liItem_l_b" v-if="item.conType !== 1">{{timeStr(item)}}</div>
                    <div class="liItem_l_b">任务详情：{{item.detail}}</div>
                </div>
                <div class="liItem_r flexC_S column">
                    <div class="liItem_l_t">{{item.priseNums}}</div>
                    <div class="liItem_l_c upper">{{item.priseCoin || 'USDT'}}</div>
                    <div
                        class="liItem_l_b center"
                        :class="{'bg_b': item.state === 2}"
                        @click="getReward(item)">{{item.state | state}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { taskMyGold, taskIndex, taskWinPrise } from '@/api/activity'
export default {
    name: "missionCenter",
    filters: {
        state(val) {
            // 0或1:待完成；2.待领取；3.已领取；4.已过期。
            if (val === 1 || val === 0) {
                return '待完成'
            } else if (val === 2) {
                return '待领取'
            } else if (val === 3) {
                return '已领取'
            } else {
                return '已过期'
            }
        },
        conType(val) {
            // (1.新人注册；2.实名认证；3.充值奖励；4.交易奖励；5.配资奖励)
            if (val === 1) {
                return '注册'
            } else if (val === 2) {
                return '认证'
            } else if (val === 3) {
                return '入金量'
            } else if (val === 4) {
                return '交易'
            } else {
                return '配资'
            }
        }
    },
    data () {
        return {
            isShow: true,
            taskList: [],
            regist_time: ''
        }
    },
    computed: {
        myGold() {
            return this.$store.state.activity.myGold
        }
    },
    created () {
        this.init()
    },
    methods: {
        init() {
            this.getTaskMyGold()
            this.getTaskIndex()
        },
        getReward(item) {
            if (item.state !== 2) return
            taskWinPrise({
                id: item.Id
            }).then(res => {
                if (res.code === 0) {
                    this.$toast({
                        message:'领取成功！'
                    })
                    this.init()
                }
            })
        },
        getTaskIndex() {
            taskIndex().then(res => {
                this.taskList = res.data.list
                this.regist_time = res.data.regist_time
            })
        },
        getTaskMyGold() {
            taskMyGold().then(res => {
                this.$store.commit('SET_MY_GOLD', res.data)
            })
        },
        hideShow(val){
            if(this.isShow){
                return val
            }
            return '******'
        },
        timeStr(item) {
            // 活动开始之前注册的用户 开始时间为活动创建时间，否则为用户注册时间
            let starTime = this.regist_time < item.createdAt ? item.createdAt : this.regist_time
            return this.$formatDate(starTime, 'yyyy.MM.dd') + ' - ' + this.$formatDate(starTime + item.days*24*3600, 'yyyy.MM.dd')
        }
    }
}
</script>
<style lang='scss' scoped>
.missionCenter{
    padding: 0 10px;
    .hotEvents,.taskList{
        .liItem{
            min-height: 126px;
            border: 1px solid #E6E6E6;
            border-radius: 5px;
            margin-bottom: 10px;
            .liItem_id{
                width: 70px;
                padding-top: 13px;
                p{
                    width: 50px;
                    font-size: 12px;
                    line-height: 22px;
                    text-align: center;
                    background: $main-blue;
                    border-radius: 0px 20px 20px 0px;
                    color: #fff;
                }
            }
            .liItem_l{
                padding-top: 13px;
                flex: 1;
                .progressbar{
                    width: 120px;
                    height: 10px;
                    border-radius: 25px;
                    background: #E6E6E6;
                    position: relative;
                    overflow: hidden;
                    span{
                        background: $main-blue;
                        height: 100%;
                        display: inline-block;
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                    .progress_text{
                        font-size: 12px;
                        position: absolute;
                        color: #9B9B9B;
                        line-height: 10px;
                        transform: scale(0.85);
                        right: 2px;
                    }
                }
                .liItem_l_t{
                    line-height: 22px;
                    font-size: 16px;
                }
                .liItem_l_c{
                    line-height: 20px;
                    margin: 10px 0;
                }
                .liItem_l_b{
                    line-height: 14px;
                    font-size: 10px;
                    word-break:break-all;
                    word-wrap:break-word;
                    padding-bottom: 10px;
                }
            }
            .liItem_r{
                width: 100px;
                margin-left: 10px;
                background: #071347;
                border-radius: 5px;
                color: #fff;
                padding: 10px 0 15px;
                .liItem_l_t{
                    font-size: 28px;
                }
                .liItem_l_c{
                    line-height: 18px;
                }
                .liItem_l_b{
                    font-size: 14px;
                    width: 81px;
                    height: 30px;
                    background: #4C4D5F;
                    border-radius: 6px;
                }
            }
        }
        .title{
            line-height: 26px;
            margin: 10px 0;
            h3{
                font-size: 18px;
            }
            span{
                font-weight: 500;
            }
        }
    }
    .missionCenter_top {
        padding: 10px 0;
        .missionCenter_top_overview {
            .capital {
                background: $main-blue;
                border-radius: 12px;
                padding: 20px 18px 15px;
                color: #fff;
                position: relative;
                .poabs_btn{
                    position: absolute;
                    right: 18px;
                    bottom: 20px;
                    background: #fff;
                    width: 80px;
                    height: 30px;
                    color: $main-blue;
                    border-radius: 6px;
                }
                .capital_t {
                    align-items: center;
                    height: 22px;
                    font-size: 16px;
                    margin-bottom: 10px;
                    .iconfont {
                        font-size: 22px;
                        color: #a6badf;
                        margin-left: 10px;
                    }
                }

                .capital_c {
                    font-size: 22px;
                    font-weight: 500;
                    line-height: 30px;
                    margin-bottom: 5px;
                }

                .capital_b {
                    line-height: 17px;
                    margin-bottom: 5px;
                }
            }
        }
    }
}
</style>