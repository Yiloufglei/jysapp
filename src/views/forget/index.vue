<template>
    <div class="container">
        <div class="tips">
            {{ step === 1 ? "请输入您注册的手机号码" : "请输入您的新密码" }}
        </div>
        <div class="form">
            <div v-if="step === 1">
                <Input v-model="phone" placeholder="输入手机号" maxlength="11"></Input>
                <Input v-model="code" placeholder="输入验证码">
                <template v-slot:after>
                    <SendCodeBtn :phone="phone" type="findpwd" />
                </template>
                </Input>
            </div>
            <template v-else>
                <Input v-model="pwd1" :type="pwd1Show ? '' : 'password'" placeholder="请设置6-20位新的登录密码" maxlength="20">
                    <template v-slot:after>
                        <i class="iconfont" :class="{'iconxianshi':!pwd1Show,'iconicon-test':pwd1Show}" @click="pwd1Show = !pwd1Show"></i>
                    </template>
                </Input>
                <Input v-model="pwd2" :type="pwd2Show ? '' : 'password'" placeholder="请确认登录密码" maxlength="20">
                    <template v-slot:after>
                        <i class="iconfont" :class="{'iconxianshi':!pwd2Show,'iconicon-test':pwd2Show}" @click="pwd2Show = !pwd2Show"></i>
                    </template>
                </Input>
            </template>
            <van-button class="van-mybutton" type="info" :disabled="btnDisabled" block @click="btnHandle" style="margin-top: 20px">{{ step === 1 ? "下一步" : "提交" }}</van-button>
        </div>
    </div>
</template>
<script>
import SendCodeBtn from "@/components/sendCodeBtn";
import { forgetValid, resetPwd } from "@/api/forget";
import {validatePhone} from "@/utils/util";
export default {
    components: {  SendCodeBtn },
    data () {
        return {
            phone: "",
            code: "",
            pwd1: "",
            pwd1Show:false,
            pwd2: "",
            pwd2Show:false,
            step: 1,
            jumpFlag: "",
        };
    },
    computed: {
        btnDisabled () {
            if (this.step === 1) {
                return this.phone.length < 11 || !this.code;
            }
            return this.pwd1.length < 6 || this.pwd2.length < 6;
        },
    },
    methods: {
        async btnHandle () {
            if (this.step === 1) {
                if (!validatePhone(this.phone))
                    return this.$toast({ message: "手机号有误" });
                await this.forgetValid();
                this.step = 2;
            } else {
                this.resetPwd();
            }   
        },
        async forgetValid () {
            const { data } = await forgetValid({
                phone: this.phone,
                smsCode: this.code,
            });
            this.jumpFlag = data.jumpFlag;
        },
        async resetPwd () {
            try {
                if (this.pwd1 !== this.pwd2) {
                    return this.$toast({ message: "密码不一致，请重新输入" });
                }
                await resetPwd({
                    phone: this.phone,
                    pwd: this.$md5(this.pwd1),
                    surePwd: this.$md5(this.pwd2),
                    jumpToken: this.jumpFlag,
                });
                this.$toast({ message: "重置成功",  });
                setTimeout(() => {
                    this.$router.push("/login");
                }, 1500);
            } catch (error) {
                setTimeout(() => {
                    this.step = 1;
                    this.phone = "";
                    this.code = "";
                    this.pwd1 = "";
                    this.pwd2 = "";
                    this.jumpToken = "";
                }, 1500);
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.container {
    padding: 60px 38px 0;
}
.tips {
    font-size: 14px;
}
.form {
    margin-top: 32px;
}
.code-btn {
    padding: 0;
    color: $main-blue;
    font-size: 14px;
    border: none;
    outline: none;
    background: transparent;
    font-weight: 500;
}
</style>