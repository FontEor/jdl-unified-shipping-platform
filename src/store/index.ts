// import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore } from 'vuex'
import globalApi from '@/api/global/index'
import { addRouteByMenu } from '@/router/nav.config'
import { IState } from './interfaces/state'
import { defaultMenu } from '@/router/default.menu'

// eslint-disable-next-line symbol-description
// export const key: InjectionKey<Store<IState>> = Symbol()

export const store = createStore<IState>({
  state: {
    isLogin: false,
    userInfo: {
      pin: '',
      customerId: '',
    },
    menuList: [],
    sysError: false,
  },
  getters: {
    getIsLogin (state) {
      return state.isLogin
    },
    getError (state) {
      return state.sysError
    },
    getMenus (state) {
      return state.menuList
    },
    username (state) {
      return state.userInfo.pin
    },
    userId (state) {
      return state.userInfo.customerId
    },
  },
  mutations: {
    updateState (state, data) {
      state.isLogin = true
      state.userInfo = data || { pin: '', id: '' }
      // state.menuList = addRouteByMenu(data.menuList || [])
      state.menuList = addRouteByMenu(defaultMenu || [])
    },
    setSysError (state, data) {
      state.sysError = data
    },
  },
  actions: {
    async login ({ commit }) {
      try {
        const { code, data } = await globalApi.getUserInfo()
        if (code === '1' && data) {
          commit('updateState', data)
        } else if (code === '-1') {
          commit('setSysError', true)
        }
      } catch (error) {
        commit('setSysError', true)
      }
    },
  },
})

export function useStore () {
  // return baseUseStore(key)
  return baseUseStore()
}
