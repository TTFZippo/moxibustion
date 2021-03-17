/*
 * @Author: your name
 * @Date: 2021-03-07 23:02:07
 * @LastEditTime: 2021-03-17 20:18:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \moxibustion\src\main-dev.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/global.css'

// 网络配置
import axios from 'axios'
// TODO:配置根路径
axios.defaults.baseURL  = 'https://www.dzkf.com/'
// axios拦截器，预处理，请求头加入token
axios.interceptors.request.use(config => {
  config.headers.token = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
