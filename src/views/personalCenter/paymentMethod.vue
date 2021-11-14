<!-- 
  	author        MrYi
	time          2021/03/17
	description   收款方式
 -->
<template>
    <div class="paymentMethod">
        <ul class="leftSlipList">
            <van-swipe-cell  v-for="(item) in list" :key="item.id">
                <li class="eftSlip_li">
                    <p class="title col-center color_b"><i class="iconfont" :class="$iconClassName(item.account_type)"></i>{{$constant.paymentType[item.account_type]}}</p>
                    <p class="color_c">{{item.real_name}}</p>
                    <p class="flexC_S">
                        <span>{{item.account}}</span>
                        <img v-show="item.img" :src="item.img" />
                    </p>
                    <img class="posabImg" src="@/assets/imgs/activation.png" />
                </li>
                <template #right>
                    <van-button square type="danger" text="删除"  @click="openDel(item)"/>
                </template>
            </van-swipe-cell>
        </ul>
        <div class="fixed_content_btm">
            <van-button class="van-mybutton" type="info" block @click="submit">添加</van-button>
        </div>
        <van-action-sheet
            v-model="visible"
            :actions="setList"
            cancel-text="取消"
            close-on-click-action
            @select="itemClick"
            @cancel="visible = false"
            close-on-popstate
            description='添加收款方式'
            safe-area-inset-bottom
        />
        <fundPasswordModal @confirm="submitNotice" :visible.sync="isvisible"/>
    </div>
</template>

<script>
import fundPasswordModal from "@/components/fundPasswordModal";
import { paymentList, paymentDel } from '@/api/securityCenter'
import { mapState } from 'vuex'
export default {
    name: 'paymentMethod',
    data () {
        return {
            visible: false,
            isvisible:false,
            slidelist: [
                { name: '银行卡', id: 1, type: 'unionpay' },
                { name: '微信', id: 2, type: 'wechat' },
                { name: '支付宝', id: 3, type: 'alipay' },
            ],
            list: [],
            delItem: {},
            t_password: '',
            clientNum: {}, // 记录开始滑动（x1）,结束滑动（x2）的鼠标指针的位置
            candelete: {}, // 滑动的item
        }
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.user.userInfo,
        }),
        setList () {
            let arr = []
            this.slidelist.forEach(item => {
                let data = this.list.find((val) => val.account_type == item.type)
                if(!data){
                    arr.push(item)
                }
                return arr
            });
            return arr
        }
    },
    components: {
        fundPasswordModal
    },
    methods: {
        openDel (item) {
            this.delItem = item
            this.isvisible = true
        },
        submitNotice (val) {
            this.t_password = val
            this.deleteItem()
        },
        deleteItem () {
            let obj = {
                uid: this.userInfo.uid,
                p_type: this.delItem.account_type,
                t_password: this.t_password
            }
            paymentDel(obj).then(res => {
                this.$toast({
                    message:'删除成功'
                })
                this.init()
                this.isvisible = false
            })
        },
        submit () {
            if(!this.setList.length){
                this.$toast({ message: '已无法添加更多类型' })
                return false
            }
            this.visible = true
        },
        routePath (url) {
            this.$router.push(url)
        },
        itemClick (item) {
            this.visible = false
            switch (item.id) {
                case 1:
                    this.routePath('/bankCard')
                    break;
                case 2:
                    this.routePath('/weChat')
                    break;
                case 3:
                    this.routePath('/alipay')
                    break;
                default:
                    break;
            }
        },
        init(){
            let obj = {
                uid: this.userInfo.uid
            }
            paymentList(obj).then(res => {
                this.list = res.data.list || []
            })
        }
    },
    mounted () {
        this.init()
        if(!this.userInfo.t_password){
            return this.$dialog.confirm({
                title: '温馨提示',
                confirmButtonText:'去设置',
                message: `需要设置资金密码后方可操作`,
            })
            .then(() => {
                this.$router.replace({ path: "/changeCapitalPassword" });
            })
            .catch(() => {
                this.$router.go(-1)
            });
        }
    },
}
</script>

<style lang="scss" scoped>
.paymentMethod {
    background: #f9f9f9;
    height: 100%;
    padding: 15px 10px;
    ul {
        height: calc(100% - 80px);
        overflow-y: auto;
        .eftSlip_li {
            background-color: #ffffff;
            margin-bottom: 15px;
            padding: 15px;
            .title {
                font-size: 14px;
                line-height: 20px;
                margin-bottom: 16px;
                .iconfont {
                    font-size: 20px;
                    margin-right: 5px;
                }
            }
            .color_c {
                font-size: 14px;
                line-height: 20px;
            }
            .flexC_S {
                img {
                    width: 28px;
                    height: 28px;
                }
            }
            .posabImg {
                width: 56px;
                height: 21px;
                position: absolute;
                top: 0;
                right: 0;
            }
        }
    }
}
</style>
