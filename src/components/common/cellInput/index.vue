<template>
    <div class="input-item">
        <div class="input-item-content" :class="{ flexC_S: type === 'radio' }">
            <div class="title fzboid">{{ title }}</div>
            <template v-if="type === 'input'">
                <Input fontSize="14" height="40px" :value="value" @input="inputHandle" :disabled="disabled"
                    :type="inputType" :placeholder="placeholder" :precision="precision" bmColor="#f9f9f9">
                <template v-slot:after v-if="unit">
                    <span class="color_c upper">{{ unit }}</span>
                </template>
                </Input>
            </template>
            <template v-if="type === 'select'">
                <div class="select-box" @click="clickSelect">
                    <span class="select-box-l upper fzboid"
                        :class="{ color_c: !value }">{{ value ? value : placeholder }}</span>
                    <i class="iconfont iconyou1 color_c fzboid"></i>
                </div>
            </template>
            <template v-if="type === 'radio'">
                <div class="radio-box">
                    <template v-if="!disabled">
                        <span class="fzboid" :class="{ active: value === item.value }" v-for="item in options"
                            :key="item.value" @click="clickRadio(item)">{{ item.label }}</span>
                    </template>
                    <template v-else>
                        <span class="fzboid active">{{ getLabel() }}</span>
                    </template>
                </div>
            </template>
        </div>
        <div class="desc color_c" v-if="desc">{{ desc }}</div>
    </div>
</template>
<script>
import _find from "lodash/find";
export default {
    name: "CellInput",
    props: {
        value: {
            type: [String, Number],
            default: "",
        },
        title: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            default: "input",
        },
        inputType: {
            type: String,
            default: "text",
        },
        placeholder: {
            type: String,
            default: "",
        },
        options: {
            type: Array,
            default () {
                return [];
            },
        },
        desc: {
            type: String,
            default: "",
        },
        unit: {
            type: String,
            default: "",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        precision: { type: [String, Number], default: '' },//精度
    },
    methods: {
        getLabel () {
            let obj = _find(this.options, { value: this.value });
            if (obj) return obj.label;
            return "";
        },
        inputHandle (val) {
            this.$emit("input", val);
        },
        clickRadio (item) {
            this.$emit("input", item.value);
        },
        clickSelect () {
            this.$emit("click");
        },
    },
};
</script>
<style lang="scss" scoped>
.input-item {
    margin-bottom: 20px;
    .input-item-content {
        min-height: 40px;
        .title {
            font-size: 12px;
            min-width: 70px;
        }
    }
    .radio-box {
        text-align: right;
        overflow-x: auto;
        white-space: nowrap;
        span {
            width: 92px;
            height: 28px;
            background: #f9f9f9;
            opacity: 1;
            border-radius: 15px;
            font-size: 14px;
            font-weight: 500;
            display: inline-block;
            text-align: center;
            line-height: 28px;
            color: #9c9ba5;
            &.active {
                background: #f8fbff;
                color: $main-blue;
            }
        }
        span ~ span {
            margin-left: 8px;
        }
    }
    .select-box {
        border-bottom: 1px solid #f9f9f9;
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
    }
    .desc {
        padding-top: 5px;
        font-size: 12px;
    }
}
</style>