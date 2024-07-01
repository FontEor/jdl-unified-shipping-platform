// index.ts
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { logout, toLogin } from '@/utils/login'
import _ from 'lodash'

export type Result<T> = {
  code: number|string;
  message: string;
  data: T;
};

// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
  // axios 实例
  instance: AxiosInstance;
  // 基础配置，url和超时时间
  baseConfig: AxiosRequestConfig = {
    baseURL: process.env.VUE_APP_API_PREFIX,
    timeout: 30000, // request timeout
    withCredentials: true, // 跨域时需要带上cookie需要开启
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  };

  constructor (config: AxiosRequestConfig) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config))

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 直接返回res，当然你也可以只返回res.data
        // 系统如果有自定义code也可以在这里处理
        const res = response.data
        const responseUrl = response.config.url || ''
        if (responseUrl.indexOf('/api/index/logout') > -1) {
          logout()
          return Promise.resolve(res)
        }
        if (res.error && res.error === 'NotLogin') {
          console.log('res is NotLogin->login')
          toLogin()
        }
        if (res.errorcode && res.errorcode === 1) {
          // 后端鉴权拦截器未获取到用户信息
          console.log('errorcode is 1->login')
          toLogin()
          return Promise.reject(new Error(res.msg || 'Error'))
        }
        return res
      },
      async (error) => {
        console.log('response rejected', error)
        const status = _.get(error, 'response.status')
        if (status === 401) {
          toLogin()
          return Promise.reject(error)
        }
        return Promise.reject(error)
      },
    )
  }

  // 定义请求方法
  public request<T = any> (config: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.request(config)
  }

  public get<T = any> (
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<Result<T>> {
    return this.instance.get(url, config)
  }

  public post<T = any, U = any> (
    url: string,
    params?: U,
    config?: AxiosRequestConfig,
  ): Promise<Result<T>> {
    return this.instance.post(url, params, config)
  }
}

// 默认导出Request实例
export default new Request({})
