import { Result } from '@/lib/axios/index'
export namespace DeliveryByOrder {
  export interface ISearch {
    hasRemark: string; // 是否有备注
    channelOrderNo: string; // 平台订单号（渠道订单号）
    endTime: string;
    printStatusCode: 1 | 2 | 3 | string; // 1：未打印，2：已打印，3：打印失败; // 打印状态
    startTime: string; // 开始时间
    orderStatusCode: 1| 2 | string; // 运单状态, 1:未下单，20:已下单
  }
  export interface IPageInfo {
    pageSize: number;
    pageNo: number;
  }
  export type ISearchRequest = ISearch & IPageInfo;
  export enum PrintStatus {
    1 = '未打印',
    2 = '已打印',
    3 = '打印失败',
  }
  export type IPrintStatus = keyof typeof PrintStatus;
  export interface IOrderListItem {
    channelOrderNo: string; // 渠道订单号(平台订单号)
    customerOrderNo: string; // 销售平台客户订单号
    createTime: string; // 创建时间（在下单时间列展示）
    orderStatus: 1 | 2; // USS下单状态：1.未下单 2.已下单 integer
    printStatusCode: IPrintStatus; // 打印状态，1：未打印，2：已打印，3：打印失败 integer
    printStatusName: string; // 打印状态，未打印，已打印，打印失败
    receiverAddress: string; // 收件人地址
    receiverMobile: string; // 收件人手机号
    receiverName: string; // 收件人姓名
    receiverPhone: string; // 收件人电话
    ussOrderNo: string; // Uss订单号(自定义订单号)
    waybillStatusCode: 10 | 20 | 30; // 运单状态, 10:下单，20:出库，30:揽收 integer
    waybillStatusName: string; // 运单状态, 下单，出库，揽收
    providerCode: string; // 服务商编码
    providerName: string;
  }
  export interface IOrderListResponse {
    list: Array<IOrderListItem>;
    pageNo: number;
    pageSize: number;
    total: number;
  }
  export type IPlainTextRequest = {
    ussOrderNo: string;
  };
  enum UploadStatus {
    CREATED = 待解析,
    PROCESSING = 解析中,
    SUCCESS = 解析成功,
    FAILED = 解析失败,
  }
  export type IUploadHistoryItem = {
    createTime: string;
    resultFailedContentPath: string | null;
    resultFailedCount: number;
    resultFileName: string;
    resultKey: string;
    resultSuccessCount: number;
    resultTotalCount: number;
    sourceFileName: string;
    sourceKey: string; // resourceId
    taskId: number;
    taskStatus: keyof typeof UploadStatus;
    updateTime: string;
  };
  export type IGetWaybillDetailRequest = {
    ussOrderNo: string;
  };
  export enum WaybillStatus {
    1 = '待发货',
    2 = '已发货',
    3 = '待揽收',
    4 = '已揽收',
    5 = '运输中',
    6 = '待签收',
    7 = '已签收',
  }
  export interface ITrackItem {
    id: number;
    time: string;
    address: string;
    status: keyof typeof WaybillStatus;
  }
  interface IWaybillItem {
    order: number;
    status: keyof typeof WaybillStatus;
    trackList: Array<ITrackItem>;
  }
  export interface IAddressInfo {
    receiverAddress: string; // 收货人地址（详细地址）
    receiverAddressType: number; // 收货人京标/国标
    receiverCityName: string; // 收货人市名称
    receiverCityNo: string; // 收货人市编码
    receiverCountyName: string; // 收货人区/县编码
    receiverCountyNo: string; // 收货人区/县编码
    receiverMobile: string; // 收货人手机
    receiverName: string; // 收货人姓名
    receiverPhone: string; // 收货人电话
    receiverProvinceName: string; // 收货人省编码
    receiverProvinceNo: string; // 收货人省编码
    receiverTownName: string; // 收货人乡/镇名称
    receiverTownNo: string; // 收货人乡/镇编码
    senderAddress: string; // 发货人地址
    senderAddressType: number; // 京标/国标
    senderCityName: string; // 发货人市名称
    senderCityNo: string; // 发货人市编码
    senderCountyName: string; // 发货人区/县编码
    senderCountyNo: string; // 发货人区/县编码
    senderMobile: string; // 发货人手机
    senderName: string; // 发货人姓名
    senderPhone: string; // 发货人电话
    senderProvinceName: string; // 发货人省编码
    senderProvinceNo: string; // 发货人省编码
    senderTownName: string; // 发货人乡/镇名称
    senderTownNo: string; // 乡/镇编码
    // TODO:待后台添加字段
    senderAddressId?: string; // 发货人id
  }
  export interface IGoodsItem {
    dimensionHeight?: string; // 商品体积高：使用字符串，避免精度丢失
    dimensionLength?: string; // 商品体积长：使用字符串，避免精度丢失
    dimensionUnit?: string; // 商品体积单位
    dimensionWidth?: string; // 商品体积宽：使用字符串，避免精度丢失
    goodsName: string; // 商品名称
    goodsType?: string; // 商品类型
    quantityUnit: string; // 商品数量单位
    quantityValue?: number; // 商品数量值：使用字符串，避免精度丢失
    weightUnit?: string; // 商品重量单位
    weightValue?: string; // 商品重量值：使用字符串，避免精度丢失
  }

  export interface IWaybillDetail {
    addressInfo: IAddressInfo;
    cargoName: string; // 托寄物名称
    cargoQuantityUnit?: string; // 托寄物数量单位
    cargoQuantityValue: number; // 托寄物数量
    channelNo: string; // 渠道编码(销售平台)
    channelOrderNo: string; // 平台订单号（渠道订单号）
    customerOrderNo: string; // 自定义订单号（销售平台客户订单号）
    printStatusCode: IPrintStatus; // 打印状态 1.未打印 2.已打印 3.打印失败
    printStatusValue?: string; // 打印状态描述
    providerCode: string; // 服务商编码
    providerId?: string; // 服务商ID
    providerName?: string; // 服务商名称
    remark: string; // 备注
    ussOrderNo?: string; // 平台订单号（渠道订单号）
    waybillCodeList: Array<string>; // 运单号
    settlementCode?: string; // 商家月结编码
    branchCode?: string; // 网点编码
    branchName?: string; // 网点名称
    goodsInfoList?: Array<IGoodsItem>; // 商品信息
    goodsList?: Array<IGoodsItem>; // 商品信息
    orderStatus?: number;
  }
  export interface IGetTraceRequest {
    channelOrderNo: string; // 零售订单号,示例值(1231211)
    customerOrderNo?: string; // 服务单号,示例值(3232131)
    providerId: string; // 承运商id,示例值(463)
    waybillCode: string; // 运单号,示例值(YT00001)
    ussOrderNo?: string;
  }
  export interface ITraceInfo {
    categoryCode: number; // 环节编码
    categoryName: string; // 环节名称
    operationRemark: string; // 轨迹信息
    operationTime: number; // 轨迹时间
    waybillCode: string; // 运单号
  }
  export enum SalesPlatform {
    '0010001' = '京东平台',
    '0030001' = '其他平台',
  }
  export interface IParcelItem {
    id: number;
    goodsName: string;
    goodsCount: number;
  }
  export interface IEditDetail {
    ussOrderNo: string;
  }
  export type IGetAddressListRequest = {
    parentAddressCode?: number;
  };
  export interface IAddressItem {
    districtCode: number; // 地址编码
    districtName: string; // 地址名称
  }
  export type ISubmitExpressOrderRequest = {
    ussOrderNos: string[];
  };
  type ISubmitExpressOrderResponseItem = {
    code: number;
    message: string;
    ussOrderNo: string;
    channelOrderNo: string;
    customerOrderNo: string;
  };
  export type ISubmitExpressOrderResponse = {
    submitExpressOrderResults: Array<ISubmitExpressOrderResponseItem>;
  };
  export type IDeleteOrderRequest = {
    ussrOrderNo: string;
  };
  export type IBatchExportRequest = {
    orderNoList: string[]; // ussOrderNo
  };
  export interface ISender {
    address: string;
    cityId: number;
    cityName: string;
    countyId: number;
    countyName: string;
    customerPin: null | string;
    defaultAddress: number;
    id: string;
    provinceId: number;
    provinceName: string;
    senderMobile: string;
    senderName: string;
    senderPhone: string;
  }
  export interface IAddressInfoVO {
    address: string; // 详细地址
    provinceNo: string; // 省编码
    provinceName: string;
    cityNo: string; // 市编码
    cityName: string;
    countyNo: string; // 县编码
    countyName: string;
    // townNo: string; // 镇编码
    // townName: string;
  }
  export interface AddRequest {
    branchCode: string; // 寄件网点编码
    cargoName: string; // 托寄物名称
    cargoQuantityValue: number; // 托寄物数量
    channelNo: string; // 渠道编码
    channelOrderNo: string; // 平台订单号（渠道订单号）
    customerCode?: string; // 客户编码
    customerId?: string; // 客户id
    customerOrderNo: string; // 自定义订单号（销售平台客户订单号）
    goodsInfoList?: Array<IGoodsItem>; // 商品信息
    providerCode: string; // 服务商编码
    receiverAddressInfo: IAddressInfoVO; // 收货人地址信息
    receiverMobile: string; // 收货人手机
    receiverName: string; // 收货人姓名
    remark: string; // 备注
    senderAddressId: string; // 发货人id
    settlementCode: string; // 商家月结编码
    [key: string]: any
  }
  export interface IEditRequest {
    ussOrderNo?: string; // 统一发货单号
    branchCode: string; // 寄件网点编码
    cargoName: string; // 托寄物名称
    cargoQuantityValue: number; // 托寄物数量
    customerCode?: string; // 客户编码
    customerId?: string; // 客户id
    providerCode: string; // 服务商编码
    goodsInfoList?: Array<IGoodsItem>; // 商品信息
    receiverMobile: string; // 收货人手机
    receiverName: string; // 收货人姓名
    receiverAddressInfo: IAddressInfoVO; // 收货人地址信息
    remark: string; // 备注
    senderAddressId: string; // 发货人id
    settlementCode: string; // 商家月结编码
    [key: string]: any
  }
  export type IAddressCascaderItem = {
    code: number | string;
    name: string
  }
  export type IAddResponse = {
    ussOrderNo: string
  };
  export type IContractedListRequest = {
    contractStatus: number; // 20签约成功
  };
}
