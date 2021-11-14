<!-- 资金密码验证 -->
<template>
    <div class="sendSmsCode">
        <van-dialog v-model="visible" :showConfirmButton="false" closeOnClickOverlay :before-close="close">
            <div class="secondaryDialog_content">
                <div class="img_box">
                    <img class="holdJustTemplate" src="@/assets/imgs/security.png" />
                </div>
                <p class="title t_c fzboid">{{title}}</p>
                <Input autofocus v-model="sms" type="password" placeholder="请输入资金密码" maxlength="6" label="法币资金密码"></Input>
                <van-button :disabled= 'disabled' style="margin-top:20px" class="van-mybutton" block type="info" @click="confirm">提交</van-button>
            </div>
        </van-dialog>
    </div>
</template>
 
<script>
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
            default: '安全认证'
        },
    },
    computed:{
        disabled(){
            return !this.sms
        },
    },
    components:{

    },
    watch:{
        visible:function (params) {
            if(!params){
                this.sms = ""
            }
        }
    },
    data () {
        return {
            sms:'',
            isclose:this.visible
        }
    },
    created () {

    },
    mounted () {

    },
    methods: {
        close(action, done){
            this.$emit('update:visible', false)
        },
        confirm(){
            this.$emit('confirm',this.$md5(this.sms))
        }
    }
}
</script>
<style lang='scss' scoped>
.sendSmsCode {
    .secondaryDialog_content {
        // padding: 0 20px 20px;
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
    }
}
</style>