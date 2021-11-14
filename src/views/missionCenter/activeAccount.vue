<!--  -->
<template>
    <div class="activeAccount">
        <div class="activeAccount_top">
            <div class="activeAccount_top_overview">
                <div class="capital">
                    <div class="capital_t flexC_S">
                        <span>我的奖励金</span>
                        <i v-show="!isShow" class="iconfont iconicon-test" @click="isShow = true"></i>
                        <i v-show="isShow" class="iconfont iconxianshi" @click="isShow = false"></i>
                    </div>
                    <div class="capital_c">{{hideShow(`${myGold.total} USDT`)}}</div>
                    <div class="capital_b">{{hideShow(`≈ ${$fomatFloat(myGold.totalRMB, 2)} CNY`)}}</div>
                    <div class="poabs_btn center" @click="visible = true">划转</div>
                </div>
            </div>
        </div>
        <div class="taskList">
            <div class="title"><h3>划转记录</h3></div>
            <div class="list-box">
                <div class="list" v-for="(item,index) in recordDataList" :key="index">
                    <div class="listContent flexC_S" style="align-items: initial;">
                        <div class="listContent_l">
                            <p class="nameText">数量</p>
                            <p class="contentText">{{$fomatFloat(item.num,2)}}</p>
                        </div>
                        <div class="listContent_c">
                            <p class="nameText">类型</p>
                            <p class="contentText">{{item.stateText || '--'}}</p>
                        </div>
                        <div class="listContent_r t_r">
                            <p class="nameText">时间</p>
                            <p class="contentText">{{$formatDate(item.created_at,'/') || '--'}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!recordDataList.length" class="no-data"></div>
        </div>
        <van-dialog v-model="visible" title="" @confirm="clickTransfer" :show-confirm-button="false">
            <div class="transfer_account ">
                <span class="color_c">从</span>
                <span class="color_b">活动账户</span>
            </div>
            <div class="transfer_account">
                <span class="color_c">到</span>
                <span class="color_b">币币账户</span>
            </div>
            <div class="supplement-content">
                <div class="title_tab">划转数量</div>
                <Input :precision="4" type="number" v-model="supplementNum" placeholder="请输入划转数量">
                    <template v-slot:after>
                        <span class="upper color_c">USDT</span>
                        <i class="color_c" style="margin:0 8px">|</i>
                        <span @click="clickAll">全部</span>
                    </template>
                </Input>
                <p class="supplement-balance flexC_S upper color_c"><span>当前可用余额{{myGold.total}}USDT</span></p>
                <van-button class="van-mybutton" type="info" block @click="clickTransfer" style="margin:10px 0">划转</van-button>
                <van-button class="van-mybutton" type="default" block @click="visible = false" style="margin:10px 0">取消</van-button>
            </div>
        </van-dialog>
    </div>
</template>

<script>
import { taskMyGold, taskTransfer, taskTransferRecord } from '@/api/activity'
export default {
    name:"activeAccount",
    components: {
    },
    data() {
        return {
            isShow: true,
            recordDataList: [],
            visible: false,
            supplementNum: ""
        }
    },
    computed: {
        myGold() {
            return this.$store.state.activity.myGold
        }
    },
    created() {
        this.getTaskTransferRecord()
    },
    methods: {
        getTaskMyGold() {
            taskMyGold().then(res => {
                this.$store.commit('SET_MY_GOLD', res.data)
            })
        },
        clickTransfer() {
            taskTransfer({
                outAccount: '1', // 划出账户类型(1:活动账户)
                incomeAccount: '1', // 划入账户类型（1：币币账户,2:法币账户）
                nums: this.supplementNum
            }).then(res => {
                if (res.code === 0) {
                    this.visible = false
                    this.$toast({
                        message:'划转成功！'
                    })
                    this.getTaskMyGold()
                    this.getTaskTransferRecord()
                }
            })
        },
        clickAll() {
            this.supplementNum = this.myGold.total
        },
        getTaskTransferRecord() {
            taskTransferRecord().then(res => {
                res.data.list.map(item => {
                    item.created_at = item.createdAt
                    item.stateText = '活动账户到币币账户'
                    item.num = item.nums
                })
                this.recordDataList = res.data.list
            })
        },
        hideShow(val){
            if(this.isShow){
                return val
            }
            return '******'
        },
    }
}
</script>
<style lang='scss' scoped>
.activeAccount {
    padding:  0 10px;
    .transfer_account{
        line-height: 40px;
        border: 1px solid #E6E6E6;
        border-radius: 6px;
        margin-top: 20px;
        padding: 0 30px;
        .color_b{
            margin-left: 80px;
            font-weight: 500;
        }
    }
    .taskList{
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
    .activeAccount_top {
        padding: 10px 0;
        .activeAccount_top_overview {
            .capital {
                background: $main-blue;
                border-radius: 12px;
                padding: 20px 18px 15px;
                color: #fff;
                position: relative;
                .poabs_btn {
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
    .supplement-content {
        margin-top: 10px;
        .supplement-balance {
            font-size: 10px;
            margin-top: 10px;
        }
        .title_tab{
            font-size: 16px;
            height: 40px;
            line-height: 40px;
            span{
                line-height: 22px;
                display: inline-block;
                width: 100px;
                transition: all 0.1s;
            }
            .supplement_ative{
                font-size: 20px;
                line-height: 28px;
                color: $main-blue;
            }
        }
    }
    .list-box{
        padding: 0px 6px;
        .listContent {
            margin-top: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #E6E6E6;
            .listContent_l,
            .listContent_c,
            .listContent_r {
                flex: 1;
                .nameText {
                    color: $c-999;
                    line-height: 17px;
                    margin-bottom: 10px;
                }
                .contentText{
                    font-size: 12px;
                    color: #000000;
                }
            }
            .listContent_c{
                padding: 0 10px;
                flex: auto;
            }
            .listContent_r{
                justify-content: flex-end;
                width: 90px;
                .iconfont{
                    margin-left: 10px;
                }
            }
        }
    }
}
</style>