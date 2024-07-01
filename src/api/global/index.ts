import request from '@/lib/axios'
import { User } from '@/interfaces/user'
import jsonp from 'jsonp'
import { logout } from '@/utils/login'

const globalApi = {
  logout: () => {
    // request.get('/api/index/logout')
    jsonp('//sso.jdl.com/exit', undefined, (err) => {
      if (err) {
        // console.error(err.message)
      } else {
        // console.log(data)
        jsonp('//sso.jd.com/exit', undefined, (err) => {
          if (err) {
            // console.error(err.message)
          } else {
            // console.log(data, 'dddd')
            logout()
          }
        })
      }
    })
  },
  // 获取用户信息/登录用户角色及权限
  getUserInfo: (params?: User.UserInfoParams) => request.get('/api/index/getLoginInfo', { params }),
  // 获取密文
  ciphertextApi: (url: string, params?: object) => request.get(url, { params }),
  // 获取地址信息
  getAddressCode: (params?: any) => request.get('/api/address/jg/children/list', { params }),
  // 获取省市区
  getQueryList: (params?: any) => request.get('/api/address/queryList', { params }),
  // 获取协议
  getAgreement: (data?: object) => request.post('/api/isv/shipping/agreement', data),
}
export default globalApi
