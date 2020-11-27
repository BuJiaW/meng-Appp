import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './plugins/wyz-echarts/wyz-echarts.js'

import axios from './utils/request'
Vue.prototype.$axios = axios
Vue.prototype.$store = store

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
