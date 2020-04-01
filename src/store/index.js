import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
      loading: false,
      user: {
         token: ""
      }
   },
   mutations: {
      setUser(state, { user }) {
         state.user = { ...state.user, ...user };
      },
      setLoading(state, loading) {
         state.loading = loading;
      }
   },
   actions: {},
   modules: {}
});
