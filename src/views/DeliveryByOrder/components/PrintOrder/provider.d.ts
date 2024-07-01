import { PrintNamespace } from '@/interfaces/print'
export namespace Provider {
  export interface ProviderInfo {
    providerName: string
    providerCode: string
    ussOrderNo: string
    waybillCode: string
  }
  export interface ProviderTemplate {
    providerName: string
    providerCode: string
    ussOrderNo?: string
    waybillCode?: string
    // 选中的模块
    templateSelectSize: string
    templateSelectInfo: PrintNamespace.TemplateInfo
    templateList: PrintNamespace.TemplateInfo[]
  }
  export type ProviderList = ProviderTemplate[]

  // 服务商模版数据，对象形式用于存取
  export interface TemplateObj {
    [key: string]: ProviderTemplate
  }
  export interface FormData {
    printType: string
    printName: string
    providerData?: ProviderList
  }
}
