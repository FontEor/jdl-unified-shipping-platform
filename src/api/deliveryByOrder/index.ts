import request from '@/lib/axios'
import { DeliveryByOrder } from '@/interfaces/deliveryByOrder'
import { Contracted } from '@/interfaces/global'
const deliveryByOrderApi = {
  // 打单发货列表
  getOrderList: (params: DeliveryByOrder.ISearchRequest) => request.get<DeliveryByOrder.IOrderListResponse>('/api/shipper/order/query', { params }),
  // 获取明文
  getPlainText: (params: DeliveryByOrder.IPlainTextRequest) => request.get<DeliveryByOrder.IAddressInfo>('/api/shipper/order/getAddressSensitiveInfo', { params }),
  // 上传历史列表
  getUploadHistoryList: (data: any) => request.post<DeliveryByOrder.IUploadHistoryItem[]>('/api/task/query', data),
  // 打单发货详情
  getWaybillDetail: (params: DeliveryByOrder.IGetWaybillDetailRequest) => request.get<DeliveryByOrder.IWaybillDetail>('/api/shipper/order/get', { params }),
  // 运单轨迹
  getQueryTrace: (params: DeliveryByOrder.IGetTraceRequest) => request.post<DeliveryByOrder.ITraceInfo[]>('/api/shipper/order/queryTrace', { ...params }),
  // 保存单个录入
  saveEdit: (data: DeliveryByOrder.IEditDetail) => request.post('', data),
  // 获取服务商列表
  getContractedList: (params: DeliveryByOrder.IContractedListRequest) => request.get<Contracted.IContractedItem[]>('/api/provider/query/contracted/list', { params }),
  getAddressList: (params?: DeliveryByOrder.IGetAddressListRequest) => request.get<DeliveryByOrder.IAddressItem[]>('/api/address/jg/children/list', { params }),
  // 下快递单
  submitExpressOrder: (data: DeliveryByOrder.ISubmitExpressOrderRequest) => request.post<DeliveryByOrder.ISubmitExpressOrderResponse>('/api/shipper/order/submitExpressOrder', data),
  // 删除
  deleteOrder: (params: DeliveryByOrder.IDeleteOrderRequest) => request.request({ url: '/api/shipper/order/delete', method: 'delete', params }),
  // 导出
  batchExport: (data: DeliveryByOrder.IBatchExportRequest) => request.request({ url: '/api/shipper/order/export', method: 'post', data, responseType: 'arraybuffer' }),
  // 保存单个录入
  addOrder: (data: DeliveryByOrder.AddRequest) => request.post<DeliveryByOrder.IAddResponse>('/api/shipper/order/create/4/1', data),
  // 修改面单
  editOrder: (data: DeliveryByOrder.IEditRequest) => request.post<DeliveryByOrder.IAddResponse>('/api/shipper/order/modify', data),
  // 获取详情-不脱敏
  getDetailSensitiveInfo: (params: DeliveryByOrder.IGetWaybillDetailRequest) => request.get<DeliveryByOrder.IWaybillDetail>('/api/shipper/order/getDetailSensitiveInfo', { params }),
}
export default deliveryByOrderApi
