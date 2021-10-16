import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueSweetalert2 from 'vue-sweetalert2'
import VueSession from 'vue-session'
import {settings} from './config.js'
import 'sweetalert2/dist/sweetalert2.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(VueSweetalert2)
Vue.use(axios)
Vue.use(VueSession)

Vue.use(vuetify, {
  iconfont: 'md'
})

Vue.config.productionTip = false
Vue.prototype.$urlApi = settings.urlApi

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
