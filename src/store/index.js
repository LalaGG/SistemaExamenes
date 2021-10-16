import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: {
        title: '',
        status: false,
        color: 'primary'
    },
    notification: {
        color: null,
        snackbar: false,
        message: null,
        time: null,
        icon: null,
    },
  },
  mutations: {
    showLoading(state, payload) {
		state.loading.title = payload.title,
		state.loading.color = payload.color,
		state.loading.status = true
	},
	hideLoading(state) {
		state.loading.status = false
	},
	showNotification(state, atributos) {
		state.notification.message = atributos.message
		state.notification.color = atributos.color
		state.notification.icon = atributos.icon
		state.notification.time = atributos.time
		state.notification.snackbar = true
	},
  },
  actions: {
  },
  modules: {
  }
})

