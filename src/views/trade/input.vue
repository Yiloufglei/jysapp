<template>
    <div class="input-content col-center">
        <input type="number" :value="value" @focus="$emit('focus')" @change="$emit('focus')" @input="inputHandle"
            v-bind="$attrs" />
        <div class="symbol upper">{{ coinName }}</div>
    </div>
</template>
<script>
export default {
    inheritAttrs: false,
    data () {
        return {
            focus: false,
            historyVal:0
        };
    },
    props: {
        coinName: { type: String, default: "" },
        value: { type: [String, Number], default: "" },
        max: { type: [String, Number], default: 100000000 },//最大值
        min: { type: [String, Number], default: '' },//
        maxlength: { type: [String, Number], default: '' },//最大长度
        precision: { type: [String, Number], default: '' },//精度
        type: { type: [String, Number], default: '' },//类型
        isFocus: { type: Boolean, default: true },//是否显示光标动效
    },
    methods: {
        inputHandle (ev) {
            let val = ev.target.value
            if(this.maxlength && val.length > this.maxlength){
                ev.target.value  = this.historyVal
                return
            }
            if(this.type && this.type == 'number'){
                if(this.max && val > this.max){
                    ev.target.value  = this.historyVal
                    return
                }
                if(this.min && val < this.min){
                    ev.target.value  = this.historyVal
                    return
                }
                ev.target.value = ev.target.value.replace(/[^\d\.]/g,'')//去除除数字和小数点之外
                ev.target.value = ev.target.value.replace(/^\./g,"")//必须保证第一个为数字而不是.
                if(val.indexOf('.') != -1){
                    var str_ = val.substr(ev.target.value.indexOf(".") + 1);
                    //限制只能输入一个小数点
                    if(str_.indexOf(".")!=-1){
                        ev.target.value = ev.target.value.substr(0,ev.target.value.indexOf(".") + str_.indexOf(".") + 1);
                    }
                    if(this.precision){
                        ev.target.value = ev.target.value.substr(0,ev.target.value.indexOf(".") + this.precision + 1)
                    }
                }
            }
            this.$emit("input", ev.target.value);
            this.historyVal = ev.target.value
        },
    },
};
</script>
<style lang="scss" scoped>
.input-content {
    width: 100%;
    height: 38px;
    border: 1px solid #c8cfd5;
    border-radius: 2px;
    padding: 0 14px;
    position: relative;
    display: flex;
    input {
        flex: 1;
        width: 100%;
        font-size: 16px;
        font-weight: 500;
        &::placeholder {
            color: #9b9b9b;
        }
    }
    .symbol {
        // flex-grow: 1;
        // position: absolute;
        font-size: 14px;
    }
}
</style>