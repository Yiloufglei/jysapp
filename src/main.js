import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import store from './store'
import './directive'
import './utils/autoViewPort'
import globalFunction from './utils/globalFunction'
import './assets/css/base.scss'
import './assets/icon/iconfont.css'
import 'normalize.css'
import './utils/constant'
import Input from '@/components/common/input'
import MySecondaryDialog from '@/components/common/mySecondaryDialog'
import { Checkbox, CountDown,Circle,Col, Row,List,Collapse, CollapseItem,Stepper,PullRefresh, CheckboxGroup ,DropdownMenu,Popover ,DropdownItem ,NavBar ,Sticky ,Switch,SwipeCell ,ActionSheet  ,Toast,Popup ,Tab, Tabs,Swipe, SwipeItem,Lazyload,NoticeBar ,Tabbar, TabbarItem ,Dialog ,Field ,Button ,RadioGroup ,Radio ,Picker ,GridItem ,Grid} from 'vant';
Vue.config.productionTip = false
Vue.use(Checkbox).use(CheckboxGroup).use(Stepper).use(Col).use(Row).use(NavBar).use(DropdownMenu).use(Popover).use(DropdownItem).use(Sticky).use(ActionSheet).use(SwipeCell).use(Switch).use(Toast).use(Popup).use(Tab).use(Tabs).use(Swipe).use(SwipeItem).use(Lazyload).use(NoticeBar).use(Tabbar).use(Button).use(TabbarItem).use(Dialog).use(Field);
Vue.use(Input).use(MySecondaryDialog).use(CountDown).use(List).use(Collapse).use(CollapseItem).use(PullRefresh).use(Circle).use(Radio).use(RadioGroup).use(Picker).use(Grid).use(GridItem)
Vue.use(globalFunction)

Vue.config.errorHandler = function (err, vm, info) {
	console.log(err)
}
Vue.mixin({
	computed: {
		loginType: function () {
			return store.state.user.token
		}
	}
})
new Vue({
	router,
	store,
    mounted() {
        document.dispatchEvent(new Event('render-event'))
    },
	render: h => h(App)
}).$mount('#app')
