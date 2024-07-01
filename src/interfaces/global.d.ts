// 承运商信息
export namespace Contracted {
  // 网点地址信息
  export interface IAddressInfoVO {
    address: string; // 详细地址
    addressType: number; // 地址类型 京标/国标
    cityName: string; // 市名称
    cityNo: string; // 市编码
    countyName: string; // 县名称
    countyNo: string; // 县编码
    provinceName: string; // 省名称
    provinceNo: string; // 省编码
    townName: string; // 镇名称
    townNo: string; // 镇编码
  }
  enum ContractStatusMap {
    10 = 签约中,
    20 = 已签约,
    30 = 签约申请未通过,
    40 = 解约中,
    50 = 已解约,
    60 = 解约申请未通过,
  }
  export type ContractStatus = keyof typeof ContractStatusMap;
  // 签约信息
  export interface IProviderContractInfoVO {
    contractMessage: string; // 审核不通过原因
    contractStatus: ContractStatus; // 签约状态
  }
  // 发货信息
  export interface ISenderInfoVO {
    address: string; // 寄件人详细地址
    cityId: number; // 市编码
    cityName: string; // 寄件人市名称
    countyId: number; // 区/县编码
    countyName: string; // 寄件人区县名称
    customerPin: string; // 客户pin
    defaultAddress: number; // 是否默认地址
    id: string; // 唯一性id
    provinceId: number; // 省编码
    provinceName: string; // 寄件人省名称
    senderMobile: string; // 寄件人手机号
    senderName: string; // 寄件人姓名
    senderPhone: string; // 寄件人电话号码
  }

  // 网点信息, 加盟型承运商字段
  export interface IBranchInfoVOS {
    branchAddressInfo: IAddressInfoVO; // 网点地址信息
    branchCode: string; // 网点编码
    branchName: string; // 网点名称
    providerContractInfoVO: ProviderContractInfoVO; // 签约信息
    senderInfo: ISenderInfoVO; // 发货信息
  }
  // 结算信息,直营型承运商字段
  export interface ISettlementInfoVOS {
    providerContractInfoVO: ContractStatus; // 签约信息
    senderInfo: ISenderInfoVO; // 发货信息 SenderInfoVO SenderInfoVO
    settlementCode: string;
  }
  // 承运商信息
  export interface IContractedItem {
    branchInfoVOS: Array<IBranchInfoVOS>;
    providerId: string; // 承运商id
    providerLogoUrl: string; // 承运商logo-url
    providerName: string; // 承运商名称
    providerType: 1 | 2; // 承运商类型,1:直营 2:加盟
    settlementInfoVOS: Array<ISettlementInfoVOS>;
    providerCode: string;
  }
}
