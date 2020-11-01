import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
// 创建仓库
const store = new Vuex.Store({
  // 严格模式
  strict: true,
  state: {
    userInfo: {},
  },
  // 获取数据
  getters: {
    getuserInfo(state) {
      return state.userInfo;
    },
  },
  // 设置和修改数据
  mutations: {
    setuserInfo(state, payload) {
      state.userInfo = payload;
    },
  },
});
export default store;
