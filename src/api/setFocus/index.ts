import request from '@/lib/axios'
import { params } from '@/interfaces/setfocus'
const setFocusApi = {
  // 查询寄件人信息
  getQuerySender: (data: object) => request.post('/api/sender/querySender', data),
  // 查询寄件人信息不脱敏
  querySenderSensitive: (data: object) => request.post('/api/sender/querySenderSensitive', data),
  // 设置默认寄件人
  getDefaultSender: (params: object) => request.get('/api/sender/modifyDefaultSender', { params }),
  // 新增寄件人信息
  getCreateSender: (data: params) => request.post('/api/sender/createSender', data),
  // 删除寄件人信息
  getDeleteSender: (params: object) => request.get('/api/sender/deleteSender', { params }),
  // 修改寄件人信息
  getModifySender: (data: object) => request.post('/api/sender/modifySender', data),
  // 查询寄件人详情信息
  getSenderInfo: (params: object) => request.get('/api/sender/getSenderInfo', { params }),
  // 获取省市区
  getJgList: (params: object) => request.get('/api/address/jg/children/list', { params }),
}

export default setFocusApi
