export interface FormData {
    customerName?: string
    senderAddressInfo?: string
    branchName?: string
    contactPersonName?: string
    contactPersonPhone?: string
    checkType?: boolean
    monthlyCode?: string
    providerLogoUrl?: string
    providerId?: string
    providerName: string
    customerCode?: string
    branchCode?: string
    providerType?: string
    settlementCode?: string
    sendAddressId?: number
}

export interface CardListData {
    providerId?: string
    providerLogoUrl?: string
    providerName?: string
    providerType?: string
    branchInfoVOS?: []
    settlementInfoVOS?: []
}

export interface AddressListData {
  code: string;
  name: string;
  senderName?: string;
  senderMobile?: string;
}

export interface SettlementInfoData {
    contractStatus?: string
    contractMessage?: string
    senderInfoAddress?: string
    senderName?: string
    senderPhone?: string
    settlementCode?: string
    providerName?: string
    providerId: string
    providerLogoUrl: string
    providerType: string
    settlementInfoVOS?: any
    branchInfoVOS?: any
}
