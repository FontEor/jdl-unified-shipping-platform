import request from '@/lib/axios'

const accreditApi = {
  // 获取代扣URL
  getUrlApi: (params: object) => request.get('/api/agreement/url', { params }),
  // 查看当前用户是否代扣
  checkStatusApi: (params: object) => request.get('/api/agreement/checkStatus', { params }),
}

export default accreditApi
