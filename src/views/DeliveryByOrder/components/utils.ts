export const EditRules = (state: {
  activeAddress: { code: any }[]
  selectedProviderItem: { providerType: string | number }
}) => {
  return {
    'addressInfo.receiverCityNo': [
      {
        required: true,
        validator: (rule: any, value: any, callback: (arg0?: Error | undefined) => any) => {
          if (!state.activeAddress[0] || !state.activeAddress[0].code) {
            return callback(new Error('请填写'))
          }
          return callback()
        },
        message: '请填写',
        trigger: 'change',
      },
    ],
    'addressInfo.receiverAddress': [
      {
        required: true,
        message: '请填写',
        trigger: 'change',
      },
    ],
    'addressInfo.receiverName': [
      {
        required: true,
        message: '请填写',
        trigger: 'change',
      },
    ],
    'addressInfo.receiverMobile': [
      {
        required: true,
        message: '请填写',
        trigger: 'change',
      },
    ],
    channelOrderNo: [{ required: true, message: '请填写', trigger: 'change' }],
    channelNo: [{ required: true, message: '请选择', trigger: 'change' }],
    providerCode: [
      {
        required: true,
        message: '请选择',
        trigger: 'change',
      },
    ],
    settlementCode: [
      {
        validator: (rule: any, value: any, callback: (arg0?: Error | undefined) => void) => {
          if (+state.selectedProviderItem.providerType === 1 && !value) {
            return callback(new Error('请选择'))
          }
          callback()
        },
        required: true,
        trigger: 'change',
      },
    ],
    branchCode: [
      {
        required: true,
        validator: (rule: any, value: any, callback: (arg0?: Error | undefined) => void) => {
          if (+state.selectedProviderItem.providerType === 2 && !value) {
            return callback(new Error('请选择'))
          }
          callback()
        },
        message: '请选择',
        trigger: 'change',
      },
    ],
    cargoName: [{ required: true, message: '请填写', trigger: 'change' }],
    cargoQuantityValue: [
      {
        required: true,
        validator: (rule: any, value: any, callback: (arg0?: Error | undefined) => any) => {
          if (Number(value) <= 0) {
            return callback(new Error('个数大于0'))
          }
          if (!value) {
            return callback(new Error('请填写'))
          }
          return callback()
        },
        trigger: 'change',
      },
    ],
  }
}
