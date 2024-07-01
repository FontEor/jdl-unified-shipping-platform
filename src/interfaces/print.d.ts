// import { Result } from '@/lib/axios/index'

export namespace PrintNamespace {
  export interface ProviderInfo {
    providerCode: string,
    providerName: string
  }
  export type ProviderTemplateListAxios = ProviderInfo[]
  export interface TemplateInfo {
    code: string, // 模板编码
    des: string, // 模板描述
    dimension: string, // 模板尺寸
    extend1: string, // 扩展字段1
    extend2: string,
    extend3: string,
    extend4: string,
    extend5: string,
    extend6: string,
    extend7: string,
    extend8: string,
    firstCategoryCode: string, // 模板一级分类编码,枚举见：http://lcp.jdl.com/#/docSoftwareSystem/64/54665
    hasCustom: boolean, // 是否有自定义区(false：没有；true：有)
    height: number, // 模板高度
    name: string, // 模板名称
    previewUrl: string, // 预览图
    secondCategoryCode: string, // 模板二级分类编码,枚举见：http://lcp.jdl.com/#/docSoftwareSystem/64/54665
    tagNames: string[], // 标签名称
    type: 0, // 模板类型
    url: string, // 模板下载URL
    width: number // 模板宽度
  }
  export interface ProviderTemplateInfo {
    providerCode: string,
    providerName: string,
    waybillPrintTemplateVOList: TemplateInfo[]
  }
  // export type ProviderTemplateListResponse = Result<ProviderTemplateInfo>;

  export interface PrintParams {
    waybillCode: string;
    ussOrderNo: string;
    templateCode: string;
  }
  // 密文请求
  export interface PrintEncryptAxios {
    orderDataList: PrintParams[]
  }
  export interface PrintLocalResponseRePrintDataData {
    waybillCode: string;
    packageCode: string;
    encryptionData: string;
  }
  export interface PrintLocalResponseData {
    printDatas: PrintLocalResponseRePrintDataData[];
    billCodeValue: string;
    templateCode?: string;
    providerCode: string;
  }
  // export type PrintLocalResponse = Result<PrintLocalResponseData>;

  export interface PrintWebAxios {
    orderDataList: PrintParams[]
  }
  export type PrintWebResponse = {url: string};

  export interface PostPrintResAxios {
    dataList: {status: string, waybillCode: string}[]
  }
}
