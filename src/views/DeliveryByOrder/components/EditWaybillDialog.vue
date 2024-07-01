<template>
  <el-dialog
    v-model="visible"
    :title="title"
    @close="handleClose"
    class="edit-waybill-dialog"
    width="846px"
  >
    <el-form
      ref="editWaybillForm"
      :model="formData"
      :rules="formRules"
      label-width="108px"
      class="form-content"
    >
      <div>
        <p class="item-title mb f-size">收发货信息</p>
        <div class="fbox row-wrap">
          <el-form-item
            label="收货地址"
            prop="addressInfo.receiverCityNo"
            class="flex row-first-item"
          >
            <AddressCascader
              class="row-form-item"
              v-model:activeAddress="state.activeAddress"
            ></AddressCascader>
          </el-form-item>
          <el-form-item
            label="详细地址"
            prop="addressInfo.receiverAddress"
            class="flex"
          >
            <el-input
              class="row-form-item"
              v-model="formData.addressInfo.receiverAddress"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </div>
        <div class="fbox row-wrap">
          <el-form-item
            label="姓名"
            prop="addressInfo.receiverName"
            class="flex row-first-item"
          >
            <el-input
              class="row-form-item"
              v-model="formData.addressInfo.receiverName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系方式"
            prop="addressInfo.receiverMobile"
            class="flex"
          >
            <el-input
              class="row-form-item"
              v-model="formData.addressInfo.receiverMobile"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </div>
        <el-divider border-style="dashed" class="divider-native" />
        <NamePhoneAddress
          v-model:selectedItem="state.deliverAddressItem"
          :addressInfo="formData.addressInfo"
          :isEdit="isEdit"
        ></NamePhoneAddress>
      </div>
      <div>
        <p class="item-title mb f-size">订单信息</p>
        <div class="fbox row-wrap">
          <el-form-item
            label="平台订单号"
            prop="channelOrderNo"
            class="flex row-first-item"
          >
            <el-input
              class="row-form-item"
              :disabled="isEdit"
              v-model="formData.channelOrderNo"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="商家订单号" prop="customerOrderNo" class="flex">
            <el-input
              class="row-form-item"
              :disabled="isEdit"
              v-model="formData.customerOrderNo"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </div>
        <div class="fbox row-wrap">
          <el-form-item
            label="销售平台"
            prop="channelNo"
            class="row-first-item"
          >
            <el-select
              v-model="formData.channelNo"
              placeholder="请选择"
              :disabled="isEdit"
              class="row-form-item"
            >
              <el-option label="京东平台" value="0010001"></el-option>
              <el-option label="其他平台" value="0030001"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="row-wrap">
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="formData.remark"
            placeholder="请输入"
            class="mr-12"
          ></el-input>
        </el-form-item>
        </div>
      </div>
      <div>
        <p class="item-title mb f-size">服务商信息</p>
        <div class="fbox row-wrap">
          <el-form-item
            label="服务商"
            prop="providerCode"
            class="flex row-first-item"
          >
            <el-select
              v-model="formData.providerCode"
              placeholder="请选择"
              @change="handleProviderChange"
              class="row-form-item"
            >
              <el-option
                v-for="item in state.providerList"
                :key="item.providerCode"
                :label="item.providerName"
                :value="item.providerCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="+state.selectedProviderItem.providerType === 1"
            label="商家月结编码"
            prop="settlementCode"
            class="flex"
          >
            <el-select
              v-model="formData.settlementCode"
              placeholder="请选择"
              class="row-form-item"
            >
              <el-option
                v-for="settlementItem in state.selectedProviderItem
                  .settlementInfoVOS"
                :key="settlementItem.settlementCode"
                :value="settlementItem.settlementCode"
                :label="settlementItem.settlementCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="+state.selectedProviderItem.providerType === 2"
            label="发货网点"
            prop="branchCode"
            class="flex"
          >
            <el-select
              v-model="formData.branchCode"
              value-key="branchCode"
              placeholder="请选择"
              class="row-form-item"
            >
              <el-option
                v-for="branchItem in state.selectedProviderItem.branchInfoVOS"
                :label="branchItem.branchName"
                :value="branchItem.branchCode"
                :key="branchItem.branchCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div>
        <p class="item-title mb f-size">包裹信息</p>
        <div class="fbox row-wrap">
          <el-form-item
            class="row-first-item flex"
            prop="cargoName"
            label="托寄物名称"
          >
            <el-input
              v-model="formData.cargoName"
              placeholder="请填写"
              class="row-form-item"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="flex"
            prop="cargoQuantityValue"
            label="托寄物个数"
          >
            <el-input-number
              v-model="formData.cargoQuantityValue"
              :min="1"
              :precision="0"
              style="width: 200px"
              placeholder="请填写"
              class="row-form-item__number"
            ></el-input-number>
          </el-form-item>
        </div>
        <div
          class="fbox row-wrap"
          v-for="goodsItem in formData.goodsInfoList"
          :key="goodsItem.goodsName"
        >
          <el-form-item class="row-first-item goods-item flex" label="商品名称">
            <el-input
              v-model="goodsItem.goodsName"
              placeholder="请填写"
              class="goods-item-input mr-12"
            ></el-input>
            <i class="ux-icon-dLuiete cursor-pointer" @click="handleDeleteGoods(goodsItem)"></i>
          </el-form-item>
          <el-form-item class="flex" label=" 商品个数">
            <el-input-number
              v-model="goodsItem.quantityValue"
              :min="1"
              style="width: 200px"
              :precision="0"
              placeholder="请填写"
              class="row-form-item__number"
            ></el-input-number>
          </el-form-item>
        </div>
        <el-button
          @click="handleAddGoods"
          type="primary"
          plain
          class="add-goods-button"
          clstag="h|keycount|order_1697703959622|27"
          >添加商品</el-button
        >
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose" clstag="h|keycount|order_1697703959622|28">取消</el-button>
        <el-button type="primary" @click="handleSave" clstag="h|keycount|order_1697703959622|29">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { DeliveryByOrder } from '@/interfaces/deliveryByOrder'
import { computed, onMounted, PropType, reactive, ref, watch } from 'vue'
import deliveryByOrderApi from '@/api/deliveryByOrder/index'
import { FormRules } from 'element-plus/es/components/form/src/types'
import { Contracted } from '@/interfaces/global'
import AddressCascader from '@/components/AddressCascader/AddressCascader.vue'
import { ElMessage } from 'element-plus'
import NamePhoneAddress from './NamePhoneAddress.vue'
import { FormInstance } from 'element-plus/es/components/form'
import { EditRules } from './utils'

const emit = defineEmits(['updateTable'])
const isEdit = ref(false)
const visible = ref(false)
const rowInfo = ref()
const title = computed(() => {
  return isEdit.value ? '修改面单' : '录入面单'
})

const state = reactive({
  providerList: [] as Contracted.IContractedItem[],
  selectedProviderItem: {} as Contracted.IContractedItem,
  activeAddress: [] as DeliveryByOrder.IAddressCascaderItem[],
  deliverAddressItem: {} as DeliveryByOrder.ISender,
  selectedProviderCode: '',
})
const editWaybillForm = ref<FormInstance>()
const formData: DeliveryByOrder.IWaybillDetail = reactive({
  addressInfo: {} as DeliveryByOrder.IAddressInfo,
  cargoName: '', // 托寄物名称
  cargoQuantityValue: 1, // 托寄物数量
  channelNo: '', // 渠道编码（销售平台）
  channelOrderNo: '', // 平台订单号（渠道订单号）
  customerOrderNo: '', // 自定义订单号（销售平台客户订单号）
  printStatusCode: 1 as DeliveryByOrder.IPrintStatus, // 打印状态 1.未打印 2.已打印 3.打印失败
  providerCode: '', // 服务商编码
  remark: '', // 备注
  waybillCodeList: [] as string[], // 运单号
  settlementCode: '', // 商家月结编码
  branchCode: '', // 网点编码
  goodsInfoList: [] as DeliveryByOrder.IGoodsItem[], // 商品信息
})
const formRules = reactive<FormRules<DeliveryByOrder.IWaybillDetail>>(
  EditRules(state),
)
const initDeliverAddressItem = () => {
  try {
    const addressInfo = formData.addressInfo || {}
    const { senderName, senderMobile, senderAddressId } = addressInfo
    state.deliverAddressItem = {
      id: senderAddressId,
      senderName,
      senderMobile,
    } as DeliveryByOrder.ISender
  } catch (error) {
    console.log(error, 'initDeliverAddressItem')
  }
}
const initActiveAddress = () => {
  try {
    const addressInfo = formData.addressInfo || {}
    const {
      receiverProvinceNo,
      receiverProvinceName,
      receiverCityNo,
      receiverCityName,
      receiverCountyNo,
      receiverCountyName,
      receiverTownNo,
      receiverTownName,
    } = addressInfo
    state.activeAddress = [
      { code: receiverProvinceNo, name: receiverProvinceName },
      {
        code: receiverCityNo, name: receiverCityName,
      },
      {
        code: receiverCountyNo, name: receiverCountyName,
      },
      {
        code: receiverTownNo, name: receiverTownName,
      },
    ]
  } catch (error) {
    console.log(error, 'initActiveAddress')
  }
}
const initSelectedProviderItem = () => {
  try {
    const selectedItem = state.providerList.find(
      (item) => item.providerCode === formData.providerCode,
    )
    state.selectedProviderItem =
      selectedItem || ({} as Contracted.IContractedItem)
  } catch (error) {
    console.log(error, 'initSelectedProviderItem')
  }
}

const getEditDetail = async () => {
  try {
    const ussOrderNo = rowInfo.value?.ussOrderNo
    if (ussOrderNo) {
      const params = {
        ussOrderNo,
      }
      const { code, data } = await deliveryByOrderApi.getDetailSensitiveInfo(params)
      if (code === '1') {
        Object.assign(formData, data)
        if (formData.cargoQuantityValue) {
          formData.cargoQuantityValue = Number(formData.cargoQuantityValue)
        }
        formData.goodsInfoList = data.goodsList
        initSelectedProviderItem()
        initActiveAddress()
        initDeliverAddressItem()
      }
      return data
    }
  } catch (err) {
    // console.log('err', err)
  }
  return []
}
const getProviderList = async () => {
  try {
    const response = await deliveryByOrderApi.getContractedList({ contractStatus: 20 })
    state.providerList = response.data || []
  } catch (err) {
    console.log('err', err)
  }
  return []
}
const handleAddGoods = () => {
  const newGoodsItem = {
    quantityValue: 1,
    goodsName: '',
  } as DeliveryByOrder.IGoodsItem
  formData.goodsInfoList?.push(newGoodsItem)
}
const handleDeleteGoods = (goodsItem: DeliveryByOrder.IGoodsItem) => {
  const index = formData.goodsInfoList?.findIndex(item => item.goodsName === goodsItem.goodsName)
  formData.goodsInfoList?.splice(Number(index), 1)
}
const handleClose = () => {
  visible.value = false
  if (!editWaybillForm.value) return
  editWaybillForm.value.resetFields()
  state.activeAddress = []
  state.deliverAddressItem = {} as DeliveryByOrder.ISender
  state.selectedProviderItem = {} as Contracted.IContractedItem
  formData.goodsInfoList = []
}
const formateAddParams = () => {
  const provinceItem = state.activeAddress[0] || {}
  const cityItem = state.activeAddress[1] || {}
  const countyItem = state.activeAddress[2] || {}
  const params: DeliveryByOrder.AddRequest = Object.assign({}, formData, {
    receiverAddressInfo: {
      address: formData.addressInfo.receiverAddress,
      provinceNo: String(provinceItem.code), // 省编码
      provinceName: String(provinceItem.name),
      cityNo: String(cityItem.code), // 市编码
      cityName: String(cityItem.name),
      countyNo: String(countyItem.code), // 县编码
      countyName: String(countyItem.name),
    },
    senderAddressId: String(state.deliverAddressItem.id),
    providerCode: state.selectedProviderItem.providerCode,
    receiverMobile: formData.addressInfo.receiverMobile,
    receiverName: formData.addressInfo.receiverName,
    branchCode: String(formData.branchCode),
    settlementCode: String(formData.settlementCode),
    // addressInfo: {},
    // waybillCodeList: [],
  })
  delete params.addressInfo
  delete params.waybillCodeList
  return params
}
const formateEditParams = () => {
  const provinceItem = state.activeAddress[0] || {}
  const cityItem = state.activeAddress[1] || {}
  const countyItem = state.activeAddress[2] || {}
  const params: DeliveryByOrder.IEditRequest = Object.assign(
    {},
    formData,
    {
      receiverAddressInfo: {
        address: formData.addressInfo.receiverAddress,
        provinceNo: String(provinceItem.code), // 省编码
        provinceName: String(provinceItem.name),
        cityNo: String(cityItem.code), // 市编码
        cityName: String(cityItem.name),
        countyNo: String(countyItem.code), // 县编码
        countyName: String(countyItem.name),
      },
      senderAddressId: String(state.deliverAddressItem.id),
      providerCode: state.selectedProviderItem.providerCode,
      receiverMobile: formData.addressInfo.receiverMobile,
      receiverName: formData.addressInfo.receiverName,
      branchCode: String(formData.branchCode),
      settlementCode: String(formData.settlementCode),
      ussOrderNo: rowInfo.value?.ussOrderNo,
    },
  )
  delete params.addressInfo
  delete params.waybillCodeList
  delete params.channelNo
  delete params.channelOrderNo
  delete params.customerOrderNo
  if (params.goodsList) {
    delete params.goodsList
  }
  return params
}
const AddRequest = async () => {
  const params = formateAddParams()
  console.log('创建Param', params)
  const response = await deliveryByOrderApi.addOrder(params)
  console.log('创建保存结果', response)
  return response
}
const EditRequest = async () => {
  const params = formateEditParams()
  console.log('编辑Param', params)
  const response = await deliveryByOrderApi.editOrder(params)
  console.log('编辑保存结果', response)
  return response
}
const handleSave = () => {
  if (!editWaybillForm.value) return
  editWaybillForm.value.validate(async (valid) => {
    console.log('valid', valid)
    if (!valid) return
    let res: any = {}
    if (isEdit.value) {
      res = await EditRequest()
    } else {
      res = await AddRequest()
    }
    const { code, message } = res || {}
    if (code === '1' || (code === '10019' && !isEdit.value)) {
      handleClose()
      emit('updateTable')
      const msg = code === '10019' ? '重复录入' : '操作成功'
      ElMessage.success(msg)
    } else {
      console.log(code, message, 'dd')
      ElMessage.error(message || '操作失败')
    }
  })
}
const handleProviderChange = (providerCode: string) => {
  const selectedItem = (state.providerList.find(
    (item) => item.providerCode === providerCode,
  ) || {}) as Contracted.IContractedItem
  state.selectedProviderItem = selectedItem
}

const showDialog = async (row: PropType<DeliveryByOrder.IOrderListItem> | undefined) => {
  try {
    visible.value = true
    const list = await getProviderList()
    if (row) {
      console.log(row, 'rowInfo')
      rowInfo.value = row
      isEdit.value = true
      const res = await getEditDetail()
    } else {
      isEdit.value = false
    }
  } catch (error) {
    console.log(error)
  }
  return null
}

defineExpose({
  showDialog,
})
</script>
<style lang="scss" scoped>
.item-title {
  color: var(--s-black-6);
  font-weight: 500;
}
.row-wrap {
  margin-left: 28px;
}
.row-first-item,
:deep(.row-first-item) {
  margin-right: 57px;
}
.divider-native {
  margin-top: 0;
  margin-bottom: 16px;
}
.row-form-item,
:deep(.row-form-item) {
  width: 242px;
}
.row-form-item__number {
  width: 97px;
}
.form-content {
  height: 66vh;
  overflow-y: auto ;
}
.add-goods-button {
  margin: -4px 0 0 125px;
}
.goods-item {
  margin-right: 38px;
  &:deep(.el-form-item__content) {
    min-width: 268px;
  }
  .goods-item-input {
    width: 242px;
  }
}
</style>
<style lang="scss">
.edit-waybill-dialog {
  .el-dialog__header .el-dialog__title {
    padding-right: 0;
  }
}
</style>
