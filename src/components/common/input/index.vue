<template>
    <van-field 
        :input-align="inputAlign" 
        :label="label" 
        v-bind="$attrs"
        :colon="colon"
        :value="value"
        :maxlength="maxlength" 
        :style="{'font-size': fontSize + 'px',height:height,'border-bottom': '1px solid '+ bmColor, '--placeholderFontSize': placeholderFontSize + 'px'}" 
        class="van-myfield" 
        ref="inputs"
        clearable
        :disabled="disabled"
        center
        :label-width="labelWidth"
        :formatter="formatter" 
        :type="type" 
        :class="{'focus': focus && this.isFocus}" 
        :placeholder="placeholder" 
        @focus="focus = true" 
        @input="$emit('input', $event)"
        @blur="focus = false">
        <template #button>
            <slot name="after"></slot>
        </template>
    </van-field>
</template>
<script>
export default {
    inheritAttrs: false,
    name: "Input",
    data () {
        return {
            focus: false,
            historyVal:0,
            inputVal:''
        };
    },
    props: {
        disabled: { type: Boolean, default: false },//是否在 label 后面添加冒号
        colon: { type: Boolean, default: false },//是否在 label 后面添加冒号
        label: { type: String, default: '' },//左侧文本
        labelWidth: { type: [String, Number], default: '' },//左侧文本宽度，默认单位为px
        inputAlign: { type: String, default: 'left' },//輸入框文本对齐方式
        placeholder: { type: String, default: '' },//placeholder
        inputsFocus: { type: Boolean, default: false },//聚焦
        value: { type: [String, Number], default: "" },
        max: { type: [String, Number], default: 100000000000 },//最大值
        min: { type: [String, Number], default: '' },//
        maxlength: { type: [String, Number], default: 1000},//最大长度
        precision: { type: [String, Number], default: '' },//精度
        type: { type: [String, Number], default: 'text' },//类型
        isFocus: { type: Boolean, default: true },//是否显示光标动效
        fontSize: {type: String, default: '16'}, // input 字体大小
        height: {type: String, default: '55px'}, // 高度
        bmColor: {type: String, default: '#edeff3'},
        placeholderFontSize: {type: String, default: '16'}, // 提示字体大小
    },
    mounted(){
        this.$nextTick(()=>{
            if(this.inputsFocus){
                this.$refs.inputs.focus();
            }
        })
    },
    methods: {
        formatter(value) {
            let val = value
            val = val.replace(/\s+/g,'')
            // 过滤输入的数字
            if(this.type && this.type == 'number'){
                if(this.max && val > this.max){
                    val  = this.historyVal
                    return val
                }
                if(this.min && val < this.min){
                    val  = this.historyVal
                    return val
                }
                val = val.replace(/[^\d\.]/g,'')//去除除数字和小数点之外
                val = val.replace(/^\./g,"")//必须保证第一个为数字而不是.
                if(val.indexOf('.') != -1){
                    var str_ = val.substr(val.indexOf(".") + 1);
                    //限制只能输入一个小数点
                    if(str_.indexOf(".")!=-1){
                        val = val.substr(0,val.indexOf(".") + str_.indexOf(".") + 1);
                    }
                    if(this.precision === 0){
                        val = val.substr(0,val.indexOf(".") + this.precision)
                    }
                    if(this.precision){
                        val = val.substr(0,val.indexOf(".") + this.precision + 1)
                    }
                }
            }
            this.historyVal = val
            return val
        },
    },
};
</script>
<style lang="scss" scoped>
.van-field {
    padding: 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #edeff3;
    position: relative;
    &::after {
        content: "";
        display: block;
        width: 0;
        height: 1px;
        position: absolute;
        left: 50%;
        bottom: 0;
        background: $main-blue;
        transition: all 0.3s;
    }
    input::-webkit-input-placeholder {
        /* placeholder字体大小 */
        font-size: var(--placeholderFontSize)
    }
    input:-webkit-autofill {
        box-shadow: 0 0 0 50px white inset !important;
    }
}
.focus {
    &::after {
        width: 100%;
        left: 0;
    }
}
</style>