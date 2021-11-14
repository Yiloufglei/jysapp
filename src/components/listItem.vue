<template>
    <div class="item between col-center" v-bind="$attrs" :class="{ border: border }">
        <dl class="color_c">{{ front }}</dl>
        <dl v-if="center" class="center-text">{{ center }}</dl>
        <dl class="end" v-if="end">{{ end }}</dl>
        <slot></slot>
    </div>
</template>
<script>
export default {
    props: {
        front: { type: String, default: "" },
        center: { type: String, default: "" },
        end: { type: String, default: "" },
        border: { type: Boolean, default: true },
    },
};
</script>
<style lang="scss" scoped>
.item {
    padding: 12px 0;
    .center-text {
        flex: 1;
        padding-left: 12px;
        font-size: 12px;
    }
}
.border {
    border-bottom: 1px solid #f5f5f5;
}
</style>