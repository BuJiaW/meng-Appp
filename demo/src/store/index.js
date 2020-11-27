import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    asideFlag:false
  },
  mutations: {
    changeAsideFlag(state,data){
      state.asideFlag = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
