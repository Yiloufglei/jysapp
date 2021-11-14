<template>
    <input
        type="number"
        :value="value"
        @focus="$emit('focus')"
        @change="$emit('focus')"
        @blur="$emit('blur')"
        @input="inputHandle"
        v-bind="$attrs" />
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
        value: { type: [String, Number], default: "" },
        max: { type: [String, Number], default: 100000000 },//最大值
        min: { type: [String, Number], default: '' },//
        maxlength: { type: [String, Number], default: '' },//最大长度
        precision: { type: [String, Number], default: '' },//精度
        type: { type: [String, Number], default: '' },//类型
    },
    methods: {
        inputHandle (ev) {
            let val = ev.target.value
            if(this.maxlength && val.length > this.maxlength){
                ev.target.value  = this.historyVal
                return
            }
            if (ev.target.value.indexOf('.') !== -1) {
                let arr = ev.target.value.split('.')
                if (this.precision && arr[1].length > this.precision) {
                    ev.target.value  = this.historyVal
                    return
                }
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
                if(ev.target.value.indexOf('.') != -1){
                    var str_ = val.substr(ev.target.value.indexOf(".") + 1);
                    //限制只能输入一个小数点
                    if(str_.indexOf(".")!=-1){
                        ev.target.value = ev.target.value.substr(0,ev.target.value.indexOf(".") + str_.indexOf(".") + 1);
                    }
                    if(this.precision){
                        ev.target.value = ev.target.value.substr(0,ev.target.value.indexOf(".") + this.precision + 1)
                    }
                    // 去除数字前面的0
                    if (val.length > 1) ev.target.value = ev.target.value.replace(/^0+\./g,'0.')
                }
                // 去除数字前面的0
                if (ev.target.value.length > 1) {
                    if (ev.target.value.indexOf('.') !== -1) {
                        let arr = ev.target.value.split('.')
                        let num = arr[0].replace(/^[0]+/, "") ? arr[0].replace(/^[0]+/, "") : 0
                        ev.target.value = num+'.'+arr[1]
                    } else {
                        ev.target.value = ev.target.value.replace(/^[0]+/, "")
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
</style>