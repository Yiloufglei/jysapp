import Vue from 'vue'

// 权限指令
Vue.directive('auth', {
    bind: (el, binding, vnode) => {
        el.addEventListener("click", (ev) => {
            // 校验权限
            if (!vnode.context.$store.state.user.token) {
                vnode.context.$router.push({ path: '/login' })
            } else {
                if (typeof binding.value === 'function') {
                    binding.value()
                }
            }
        });
    },
    unbind: (el, binding, vnode) => {
        vnode.context.$off('click')
    }
})
const toggleLoading = (el, { value ,arg}) => {
    let div =  document.createElement('div');//盒子
    let loading_box =  document.createElement('div');//中间的中心盒子
    let text =  document.createElement('p');//文字
    let icon =  document.createElement('i');//图标
    el.appendChild(div);
    div.appendChild(loading_box);
    loading_box.appendChild(icon);
    loading_box.appendChild(text);
    if(arg == 'updata'){
        text.innerHTML = '上传中...'
    }else{
        text.innerHTML='加载中...';
    }
    el.classList.add('elrelative');
    el.style.overflow = 'hidden';
    div.setAttribute('class','divabsolute');
    loading_box.setAttribute('class','loading_box');
    icon.setAttribute('class','iconfont iconloading');
}
Vue.directive('loading',{
    bind(el,{ value ,arg}) {
        el.$value = value
        if(el.$value){
            toggleLoading(el, { value ,arg})
        }
    },
    // 当传进来的值更新的时候触发
    componentUpdated(el, { value,arg }) {
        let ds = document.getElementsByClassName('divabsolute')[0];
        if(value){
            if(ds){
                return false
            }
            toggleLoading(el, { value ,arg})
        }else{
            el.style.overflow =  'auto';
            if(ds){
                el.removeChild(ds);
            }
        }
    },
    unbind: function (el, binding) {
        el.instance && el.instance.$destroy()
    }
})