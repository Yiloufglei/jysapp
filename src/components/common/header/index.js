import myHeader from './index.vue'

myHeader.install = function (Vue) {
  Vue.component(myHeader.name, myHeader)
}

export default myHeader
