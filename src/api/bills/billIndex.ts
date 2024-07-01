import request from '@/lib/axios'
import { queryPay, billPay } from '@/interfaces/bills'
import { downloadFile } from '@/utils/common'

const billsApi = {
  // 支付账单列表
  billList: (data: queryPay) => request.post('/api/order/query', data),
  // 支付账单导出
  billExport: (params: any) => downloadFile('/fe/api/order/export', params),
  // 支付
  billPay: (data: billPay) => request.post('/api/order/pay', data),
}

export default billsApi
