import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import axios from 'axios'

axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(req=>{
  req.headers.Authorization=window.sessionStorage.getItem('token')
  return req
})
Vue.config.productionTip = false

Vue.prototype.$http=axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
