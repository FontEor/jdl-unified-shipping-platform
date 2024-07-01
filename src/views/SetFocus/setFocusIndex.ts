export interface person {
  name: string,
  age: number
}
export interface order {
  provinceName: string;
  address: any;
  cityName: string;
  countyName: string
  id: number;
  customerPin: string;
  defaultAddress: string;
  fixedtelephone: string
  senderMobile: string;
  senderName: string;
  senderPhone: string;
  detailaddress: string
}
export interface RuleForm {
  senderName: string
  senderMobile: string
  address: string
  detailaddress: string
  senderPhone: string
}
export interface createparams {
  address: string
  cityId: number
  cityName: string
  countyId: number
  countyName: string
  provinceId: number
  provinceName: string
  senderMobile: string
  senderName: string
  senderPhone: string
}
export interface editparams {
  address: string,
  cityName: string
  cityId: number
  countyName: string
  countyId: number
  provinceName: string
  provinceId: number
  senderMobile: string
  senderName: string
  senderPhone: string
  senderIdEncrypt: number | string | undefined
}
export interface optiones {
 list: []
}
