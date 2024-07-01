import { RouteRecordName, RouteRecordRaw } from 'vue-router'
import { AuthMenu } from './auth'
import Layout from '@/components/Layout/index.vue'
import Layout2 from '@/components/Layout2/Layout2Comp.vue'
import { MenuItem } from '@/interfaces/menu'
import _ from 'lodash'

// pass 无需登录
// auth 无需usf权限
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/notfound',
    name: 'notfound',
    component: Layout,
    children: [
      {
        path: '/404',
        name: '404',
        component: () => import('@/views/404.vue'),
        meta: { title: '找不到该页面', auth: 1 },
      },
    ],
  },
  {
    path: '/',
    component: Layout2,
    children: [
      {
        path: '/syspublish',
        name: 'syspublish',
        component: () => import('@/views/SysPublish.vue'),
        meta: { title: '系统维护', hideUser: true, pass: 1 },
      },
      {
        path: '/noAuth',
        name: 'noAuth',
        component: () => import('@/views/noAuth.vue'),
        meta: { title: '无权限', auth: 1 },
      },
      {
        path: '/accredit',
        name: 'accredit',
        component: () => import('@/views/accredit/accreditPage.vue'),
        meta: { title: '授权', auth: 1 },
      },
      {
        path: '/bills',
        name: 'billsIndex',
        component: () => import('@/views/bills/billsIndex.vue'),
        meta: { title: '支付账单', auth: 1 },
      },
    ],
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Register/IndexPage.vue'),
    meta: { title: '注册', pass: 1 },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/IndexPage.vue'),
    meta: { title: '登录', pass: 1 },
  },
  {
    path: '/agreement/:projectCode/:resourceCode',
    name: 'agreement',
    component: () => import('@/views/Agreement/agreementIndex.vue'),
    meta: { title: '协议', pass: 1 },
  },
  {
    path: '/settingFocus',
    name: 'settingFocus',
    component: Layout,
    children: [
      {
        path: '/setFocus',
        name: 'setFocus',
        component: () => import('@/views/SetFocus/setFocusIndex.vue'),
        meta: { title: '设置中心' },
      },
    ],
  },
  {
    path: '/electronicBill',
    name: 'electronicBill',
    component: Layout,
    children: [
      {
        path: '/serverExpressSheet',
        name: 'serverExpressSheet',
        component: () => import('@/views/serverExpressSheet/serverExpressSheet.vue'),
        meta: { title: '服务商' },
      },
      {
        path: '/serverExpressSheet/applyServerProvider',
        name: 'applyServerProvider',
        component: () => import('@/views/serverExpressSheet/applyServerProvider.vue'),
        meta: { title: '申请服务商', auth: 1, activePath: '/serverExpressSheet' },
      },
    ],
  },
  {
    path: '/orderShipment',
    name: 'orderShipment',
    component: Layout,
    children: [
      {
        path: '/orderShipment/index',
        name: 'orderShipmentIndex',
        component: () => import('@/views/DeliveryByOrder/IndexPage.vue'),
        // component: () => import('@/views/building.vue'),
        meta: { title: '打单发货', auth: 1 },
      },
      {
        path: '/orderShipment/detail',
        name: 'orderShipmentDetail',
        component: () => import('@/views/DeliveryByOrder/WaybillDetail.vue'),
        meta: { title: '打单发货', auth: 1, activePath: '/orderShipment/index' },
      },
    ],
  },
]

export const checkRouterRole = (checkRouter: RouteRecordName | null | undefined, routers: Array<RouteRecordRaw>) => {
  if (!checkRouter) {
    return false
  }
  let checkStatus = false
  function checkRouterStatus (_routers: Array<RouteRecordRaw>, checkRouter: RouteRecordName | null | undefined) {
    _routers.forEach((route: RouteRecordRaw) => {
      if (route.name === checkRouter) {
        checkStatus = true
        return checkStatus
      }
      return (
        route.children &&
        route.children.length &&
        checkRouterStatus(route.children, checkRouter)
      )
    })
    return checkStatus
  }
  return checkRouterStatus(routers, checkRouter)
}

function findFirstMenu (routers: Array<RouteRecordRaw>): any {
  if (routers && routers.length > 0) {
    const router = routers[0]
    if (router.children && router.children.length > 0) {
      return findFirstMenu(router.children)
    }
    return router.name
  }
  return null
}
// 根据权限返回默认页
export const defaultMenu = (routers: Array<RouteRecordRaw>) => {
  if (!(routers && routers.length > 0)) {
    return 'noAuth'
  }
  const defaultMenu = findFirstMenu(routers)
  return defaultMenu || '404'
}
/**
 * 解析路由和菜单
 * 只解析susf配置类型为菜单的资源
 * 路由解析到三级，菜单解析到二级
 * 三级路由解析时，url为一级url+三级url
 */

export function addRouteByMenu (susfMenus: Array<AuthMenu>) {
  function formatMenu (menu: Array<AuthMenu>) {
    if (!menu) {
      return []
    }
    return _.map(
      _.filter(menu, (item) => item.type === 0),
      (item) => {
        const obj: MenuItem = {
          id: item.id,
          icon: item.icon,
          code: item.code,
          level: item.level,
          path: item.ext1,
          name: item.ext2,
          meta: {
            title: item.ext3,
          },
          children: formatMenu(item.children),
        }
        return obj
      },
    )
  }
  return formatMenu(susfMenus)
}
