<template>
    <van-button class="code-btn"  :disabled="btnDisabled" @click="sendCode">{{ sendText }}</van-button>
</template>
<script>
import util from "@/utils/util";
import { sendCode } from "@/api/common";
import { mapState } from 'vuex';
export default {
    name: "SendCodeBtn",
    props: {
        phone: { type: [String, Number], default: "" },
        type: { type: String, default: "", required: true },
    },
    data () {
        return {
            sendText: "发送验证码",
            btnDisabled: false,
        };
    },
    computed:{
        ...mapState({
            userInfo: (state) => state.user.userInfo,
        })
    },
    mounted(){
        this.$nextTick(() => {
            if(this.phone){
                this.sendCode()
            }
        })
    },
    methods: {
        async sendCode () {
            if (!this.phone) return this.$toast({ message: "请输入手机号" });
            if (!util.validatePhone(this.phone)) return this.$toast({ message: "手机号有误" });
            if (this.type === 'modifyTpassword' && this.userInfo.phone != this.phone){
                return this.$toast({ message: "非注册手机号!" });
            }
            this.btnDisabled = true;
            let timer = null;
            let t = 60;
            this.sendText = "发送中...";
            try {
                let obj = {
                    phone: this.phone,
                    stype: this.type,
                }
                // this.$toast({ message: "发送成功" });
                timer = setInterval(() => {
                    t--;
                    this.sendText = t + "s";
                    if (t <= 0) {
                        clearInterval(timer);
                        this.btnDisabled = false;
                        this.sendText = "重新发送";
                    }
                }, 1000);
                sendCode(obj).then((res) => {
                    // 如果接口没有返回data.smscode 就不会弹出提示，后端关闭了就行
                    let {data} = res
                    if (data && data.smscode) this.$toast({ message: `debug: ${data.smscode}` });
                }).catch(() => {
                    clearInterval(timer);
                    this.btnDisabled = false;
                    this.sendText = "重新发送";
                })
            } catch (error) {
                clearInterval(timer);
                this.btnDisabled = false;
                this.sendText = "重新发送";
            }
            this.$once("hook:beforeDestroy", () => {
                clearInterval(timer);
                this.btnDisabled = false;
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.code-btn {
    padding: 0;
    color: $main-blue;
    font-size: 14px;
    border: none;
    outline: none;
    background: transparent;
    font-weight: 500;
    min-width: 70px;
}
</style>