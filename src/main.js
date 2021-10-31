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
import IdleVue from 'idle-vue'
import Vuex from 'vuex'
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import 'tiptap-vuetify/dist/main.css'
import 'vuetify/dist/vuetify.min.css'

const eventsHub = new Vue()
Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  idleTime: 900000
})

Vue.use(VueSweetalert2)
Vue.use(axios)
Vue.use(VueSession)
Vue.use(Vuex);

Vue.use(vuetify, {
  iconfont: 'md'
})

Vue.use(TiptapVuetifyPlugin, {
  vuetify, // same as "vuetify: vuetify"
  iconsGroup: 'md'
})

Vue.config.productionTip = false
Vue.prototype.$urlApi = settings.urlApi
Vue.prototype.$urlApiInvision = settings.urlApiInvision
Vue.prototype.$urlImage = settings.urlImage

new Vue({
  router,
  store,
  vuetify,
  onIdle() {
    sessionStorage.clear()
    this.$session.destroy()
    this.$router.push('/Login')
  },
  render: h => h(App)
}).$mount('#app')
