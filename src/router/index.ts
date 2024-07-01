import { NavigationGuardNext, RouteLocationNormalized, createRouter, createWebHashHistory } from 'vue-router'
import { useStore } from '@/store'
import { toLogin } from '@/utils/login'
import { routes, defaultMenu, checkRouterRole } from './nav.config'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 路由守卫
router.beforeEach(async (to: RouteLocationNormalized, from, next: NavigationGuardNext) => {
  if (to.meta && to.meta.pass === 1) {
    next()
    return
  }
  const store = useStore()
  // 用户信息未初始化
  if (!store.getters.getIsLogin) {
    await store.dispatch('login')
  }
  if (store.getters.getError) {
    next({ name: 'syspublish' })
    return
  }
  if (!store.getters.getIsLogin) {
    toLogin()
    return
  }
  // 校验菜单权限
  const routerWhiteList = ['/']
  const routers = store.getters.getMenus
  // console.log(s)
  if (to.name === 'noAuth' && routers && routers.length > 0) {
    next({ name: defaultMenu(routers) })
  } else if (
    checkRouterRole(to.name, routers) ||
    routerWhiteList.some((white) => white === to.name) ||
    (to.meta && to.meta.auth === 1)
  ) {
    next()
  } else {
    next({ name: defaultMenu(routers) })
  }
})

export default router
