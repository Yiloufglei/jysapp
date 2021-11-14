<template>
    <div class="container">
        <router-link to="/register" class="register" replace>注册</router-link>
        <div class="logo"></div>
        <div class="form">
            <Input type="number" fontSize="18" v-model="phone" placeholder="请输入手机号" :maxlength="11" />
            <Input v-model="pwd" type="password" placeholder="请输入登录密码">
            <template v-slot:after>
                <router-link to="/forget" class="forget">忘记密码?</router-link>
            </template>
            </Input>
            <van-button class="van-mybutton" block type="info" style="margin-top: 20px" :disabled="btnDisabled" @click="isvisible = true">登录</van-button>
            <div class="protocol">
                登录即代表您已阅读并同意《<router-link to="/loginAgreement">用户隐私条款</router-link>》
            </div>
        </div>
        <sendSmsCode title="安全验证" :visible.sync="isvisible" @confirm="confirm" :phone="phone"/>
    </div>
</template>

<script>
import sendSmsCode from "@/components/sendSmsCode";
import { login } from "@/api/login";
import { whitePath } from "@/router";
export default {
    components: { sendSmsCode },
    data () {
        return {
            phone: "",
            pwd: "",
            code: "",
            isvisible: false,
            fromPath: "/",
        };
    },
    computed: {
        btnDisabled () {
            return this.phone.length < 11 || !this.pwd;
        },
        dialogBtnDisabled () {
            return !this.code;
        },
    },
    beforeRouteEnter (to, from, next) {
        next((vm) => {
            if (!whitePath.includes(from.path)) {
                vm.fromPath = from.fullPath;
            }
        });
    },
    methods: {
        async confirm (code) {
            const { data } = await login({
                phone: this.phone,
                pwd: this.$md5(this.pwd),
                smsCode: code,
            });
            const { token, ...userInfo } = data;
            this.$store.commit("SET_USER_INFO", userInfo);
            this.$store.commit("SET_TOKEN", token);
            this.$store.dispatch('updateUserInfo')
            this.$router.push({ path: this.fromPath });
        }
    },
};
</script>
<style lang="scss" scoped>
.container {
    padding: 44px 38px 0;
}
.logo {
    width: 200px;
    height: 55px;
    background: url("~@/assets/imgs/logo.png") no-repeat;
    background-size: contain;
    margin: 50px 0;
}
.register {
    color: $main-blue;
    font-size: 18px;
    font-weight: 500;
    float: right;
}
.form {
    .forget {
        font-size: 14px;
        color: $c-999;
    }
}
.protocol {
    color: $c-999;
    font-size: 12px;
    margin-top: 20px;
    text-align: center;
    font-weight: 500;
    a {
        color: $main-blue;
    }
}
.dialog-content {
    padding: 0 15px;
    .dialog-sub-tilte {
        color: #bdbdbd;
        text-align: center;
        margin: 17px 0;
    }
    .send-tips {
        color: #d9021c;
        font-size: 11px;
        margin: 7px 0 22px;
    }
}
// .register {
//   display: block;
//   font-size: 14px;
//   font-weight: 500;
//   line-height: 20px;
//   color: $main-blue;
//   margin-top: 93px;
//   text-align: center;
// }
</style>