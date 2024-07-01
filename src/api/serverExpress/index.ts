import request from '@/lib/axios'

const serverExpressApi = {
  // 查询可签约的承运商列表
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryContractorListApi: (params: any) => request.get('/api/provider/query/allow/list', params),
  // 查询已签约的承运商列表
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryContractedListApi: (params: any) => request.get('/api/provider/query/contracted/list', params),
  // 厂家签约服务商
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitContractedApi: (params: any) => request.post('/api/sign/provider/submit', params),
  // 查询寄件人信息获取地址
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  querySenderApi: (params: any) => request.post('/api/sender/querySender', params),
  // 服务商网点信息查询
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryBranchListApi: (params: any) => request.post('/api/provider/query/branch/list', params),
}

export default serverExpressApi
