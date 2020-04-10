import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/store'

// import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import toast from 'components/common/toast/index'
Vue.config.productionTip = false
//添加事件总线
Vue.prototype.$bus = new Vue()
//安装toast插件
Vue.use(toast)
//解决移动端的300毫秒延时
// FastClick.attach(document.body)
//使用懒加载的插件
Vue.use(VueLazyLoad, {
  loading: require('./assets/img/common/nvdi.jpg')
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
