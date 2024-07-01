import type { LocationQueryValue } from 'vue-router'
export interface queryPay {
  pageNo?: number
  pageSize?: number
  customerId?: string
  customerPin?: string
  paymentStatus?: number
  platformBusinessSource?: string
  waybillCode?: string
  channelNo?: string | LocationQueryValue
  startTime?: string
  endTime?: string
  datePicker?: string,
  businessSource?: string,
  shipperId?: string
}

export interface billPay {
  channelNo?: string
  customerId?: string
  customerPin?: string
  orderInfoDTOList: object[],
  platformBusinessSource?: string,
  shipperId: string
}

export interface payData {
  logisticsOrderNo: string
  waybillCode: string
}

export interface payRowInfo {
  channelInfoVO: {
    channelName: string
    channelNo: string
    systemCaller: string
    systemSubCaller: string
  }
  customOrderNo: string
  logisticsOrderNo: string
  orderCreationTime: string
  paymentVO: {
    amount: string
    paymentStatus: number
    paymentStatusValue: string
    paymentTime: string
    paymentType: string
    paymentTypeValue: string
    remark: string
    remarkCode: string
    remarkType: string
  }
  platformBusinessInfoVO: {
    platformBusinessId: string
    platformBusinessPin: string
    platformBusinessSource: string
    platformBusinessSourceValue: string
  }
  providerInfoVO: {
    branchInfoVOS: string
    providerId: string
    providerLogoUrl: string
    providerName: string
    providerType: string
    settlementInfoVOS: string
  }
  receiverAddressVO: {
    address: string
    cityName: string
    cityNo: string
    countyName: string
    countyNo: string
    provinceName: string
    provinceNo: string
    townName: string
    townNo: string
  }
  senderAddressVO: {
    address: string
    cityName: string
    cityNo: string
    countyName: string
    countyNo: string
    provinceName: string
    provinceNo: string
    townName: string
    townNo: string
  }
  waybillCode: string
  weightInfoVO: {
    unit: string
    value: string
  }
}
