<!-- 发送短信 -->
<template>
    <div class="sendSmsCode">
        <van-dialog v-model="visible" :showConfirmButton="false">
            <div class="secondaryDialog_content">
                <div class="img_box">
                    <img class="holdJustTemplate" src="@/assets/imgs/security.png" />
                </div>
                <p class="title t_c fzboid">{{title}}</p>
                <p class="dialog-sub-tilte t_c color_c">{{tilteText}}</p>
                <van-field autofocus v-model="sms" center clearable placeholder="请输入短信验证码" :maxlength="6">
                    <template #button><sendCodeBtn v-if="visible" :phone="phone" :type="type" :send="true" ref="sendCodeBtn"/></template>
                </van-field>
                <p class="send-tips sell-color">验证码短信已发送至手机号{{phoneText}}</p>
                <van-button :disabled= 'disabled' class="van-mybutton" block type="info" @click="confirm">确认</van-button>
                <van-button class="van-mybutton no_border" block type="default" @click="cancel" v-if="isCancel">取消</van-button>
            </div>
        </van-dialog>
    </div>
</template>
 
<script>
import sendCodeBtn from "@/components/sendCodeBtn.vue"
export default {
    name: "sendSmsCode",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        //头部标题
        title: {
            type: String,
            default: '安全验证'
        },
        //头部标题说明
        tilteText: {
            type: String,
            default: '登陆时需要安全验证'
        },
        //短信类型
        type:{
            type: String,
            default: 'login'
        },
        //手机
        phone: {
            type: [String,Number],
            default: ''
        },
        //手机
        isCancel: {
            type: Boolean,
            default: true
        },
    },
    computed:{
        phoneText(){
            var reg=/(\d{3})\d{4}(\d{4})/;
            var tel1 = this.phone.replace(reg, "$1****$2")
            return tel1
        },
        disabled(){
            return !this.sms
        }
    },
    components:{
        sendCodeBtn
    },
    data () {
        return {
            sms:'',
        }
    },
    methods: {
        cancel() {
            this.$emit('update:visible', false)
        },
        confirm(){
            this.$emit('confirm',this.sms)
        }
    }
}
</script>
<style lang='scss' scoped>
.sendSmsCode {
    .secondaryDialog_content {
        padding: 0 20px 20px;
        .img_box {
            text-align: center;
            img {
                width: 104px;
                height: 80px;
            }
        }
        .title {
            font-size: 15px;
        }
        .send-tips{
            font-size: 12px;
            margin: 7px 0 22px;
        }
        .dialog-sub-tilte{
            font-size: 12px;
            margin: 17px 0;
        }
        .van-mybutton{
            margin-bottom: 10px;
        }
    }
}
</style>