import request from '@/lib/axios'
import { PrintNamespace } from '@/interfaces/print'

const printOrderApi = {
  // 网页批量打印-返回url
  printWebData: (params: PrintNamespace.PrintWebAxios) => request.post<PrintNamespace.PrintWebResponse>('/api/waybill/print/batch/render', params),

  // 根据服务商获取模版
  getTemplateList: (params: PrintNamespace.ProviderTemplateListAxios) => request.post<PrintNamespace.ProviderTemplateInfo[]>('/api/waybill/print/query/template/list', params),

  // 获取打印密文数据
  getPrintEncryptData: (params: PrintNamespace.PrintEncryptAxios) => request.post<PrintNamespace.PrintLocalResponseData[]>('/api/waybill/print/batch/ciphertext', params),

  // 回传打印结果
  postPrintRes: (params: PrintNamespace.PostPrintResAxios) => request.post<PrintNamespace.PostPrintResAxios>('/api/waybill/print/result/log', params),

}
export default printOrderApi
