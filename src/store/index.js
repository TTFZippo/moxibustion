import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    createNewScheme: false
  },
  mutations: {
    createNewScheme(state, bool) {
      state.createNewScheme = bool;
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    isCreateNewScheme(state) {
      return state.createNewScheme;
    }
  }
})
