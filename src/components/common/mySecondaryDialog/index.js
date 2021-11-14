import secondaryDialog from './index.vue'
// 这里是重点
const MySecondaryDialog = {
    install: function(Vue){
        Vue.component('MySecondaryDialog',secondaryDialog)
    }
}

// 导出组件
export default MySecondaryDialog
