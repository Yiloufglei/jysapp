<template>
    <div class="register">
        <router-link to="/login" class="login" replace>登录</router-link>
        <div class="title">注册</div>
        <div class="form">
            <Input type="number" v-model="phone" placeholder="输入手机号" :maxlength="11" />
            <Input type="number" v-model="code" placeholder="输入验证码"  :maxlength="6">
                <template v-slot:after>
                    <SendCodeBtn :phone="phone" type="regist" />
                </template>
            </Input>
            <Input :type="pwd1Show ? '' : 'password'" v-model="pwd1" placeholder="请设置6-20位登录密码" :maxlength="20">
                <template v-slot:after>
                    <i class="iconfont" :class="{'iconxianshi':!pwd1Show,'iconicon-test':pwd1Show}" @click="pwd1Show = !pwd1Show"></i>
                </template>
            </Input>
            <Input :type="pwd2Show ? '' : 'password'" v-model="pwd2" placeholder="请确认登录密码" :maxlength="20">
                <template v-slot:after>
                    <i class="iconfont" :class="{'iconxianshi':!pwd2Show,'iconicon-test':pwd2Show}" @click="pwd2Show = !pwd2Show"></i>
                </template>
            </Input>
            <Input :maxlength="6" v-model="inviteCode" placeholder="请输入邀请码(选填)" :disabled="codeDisabled"></Input>
            <van-button class="van-mybutton" type="info" block @click="registerFun" style="margin-top: 20px" :disabled="disabled">注册</van-button>
        </div>
        <div class="privacy">
            我已阅读并同意《<router-link to="/loginAgreement">用户隐私条款</router-link>》
        </div>
    </div>
</template>
<script>
import SendCodeBtn from "@/components/sendCodeBtn";
import {validatePhone} from "@/utils/util";
import { register } from "@/api/register";
import { mapState } from 'vuex'
export default {
    components: { SendCodeBtn },
    name:'register',
    data () {
        return {
            phone: "",
            code: "",
            pwd1: "",
            pwd1Show:false,
            pwd2: "",
            pwd2Show:false,
            inviteCode: "",
            codeDisabled : false,
            deviceName:'',
            udid:'',
            system: 1
        };
    },
    computed: {
        ...mapState({
            stateInviteCode: (state) => state.user.inviteCode,
        }),
        disabled () {
            return this.validateForm(true) !== '' 
        },
    },
    mounted(){
        let inviteCode = this.$route.query.code
        if(inviteCode){
            this.inviteCode = inviteCode
            this.codeDisabled = true
            this.$store.commit('SET_INVITE_CODE',inviteCode)
        }else{
            if(this.stateInviteCode){
                this.inviteCode = this.stateInviteCode
                this.codeDisabled = true
            }
        }
        window['receiveAndroidIosInfo'] = res => {
            this.receiveAndroidIosInfo(res)
        }
        this.getIosAndroidInfo()
    },
    methods: {
        receiveAndroidIosInfo(data){
            let obj = JSON.parse(data)
            this.udid = obj.udid
            this.deviceName = obj.deviceName
            this.system = obj.system === 'ios' ? 3 : 2
        },
        getIosAndroidInfo(){
            let ua = navigator.userAgent;
            let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
            let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if (isiOS) {
                try {
                    window.webkit.messageHandlers.registCalliOS.postMessage('ios调用');//ios调用
                } catch(error) {
                    console.log("ios error");
                }
                return
            }
            if (isAndroid) {
                try {
                    window.android.registCallAndroid('Android调用') //Android调用    
                } catch(error) {
                    console.log("Android error");
                }
                return
            }
        },
        validateForm (disable) {
            if (disable) {
                if (this.phone.length < 11) return "手机号有误";
            } else {
                if (!validatePhone(this.phone)) return "手机号有误";
            }
            if (!this.code) return "请输入验证码";
            if (this.pwd1.length < 6) return "密码必须大于6位数";
            if (disable) {
                if (this.pwd2.length < 6) return "密码必须大于6位数";
            } else {
                if (this.pwd1 !== this.pwd2) return "两次密码输入不一致";
            }
            return "";
        },
        registerFun () {
            let valid = this.validateForm();
            if (valid) return this.$toast({ message: valid });
            register({
                phone: this.phone,
                pwd: this.$md5(this.pwd1),
                surePwd: this.$md5(this.pwd2),
                smsCode: this.code,
                inviteCode: this.inviteCode,
                udid: this.udid,
                deviceName: this.deviceName,
                system: this.system
            }).then(() => {
                this.$toast({ message: "注册成功"});
                this.$store.commit('SET_INVITE_CODE','')
                setTimeout(() => {
                    this.$router.push({ path: "/login" });
                }, 500);
            })
        }
    },
};
</script>
<style lang="scss" scoped>
::v-deep input:disabled {
    background: #fff;
}
.register {
    padding: 44px 38px 0;
    height: 100%;
    .iconfont{
        font-size: 20px;
    }
}
.login {
    color: $main-blue;
    font-size: 18px;
    font-weight: 500;
    float: right;
}
.title {
    font-size: 28px;
    font-weight: 500;
    color: $main-font-c;
    margin-top: 50px;
}
.privacy {
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: $c-999;
    margin-top: 56px;
    a {
        color: $main-blue;
    }
}
</style>