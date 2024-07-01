<template>
  <div class="fbox row-wrap">
    <el-form-item
      label="发货地址"
      prop="senderAddress"
      class="flex row-first-item"
      :rules="deliveryAddressRule"
    >
      <el-select
        class="row-form-item"
        :model-value="nativeSelectedItem.id"
        @change="handleChangeSelectedItem"
      >
        <el-option
          v-for="item in addressList"
          :key="item.id"
          :label="`${item.provinceName}/${item.cityName}/${item.countyName}/${item.address}`"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="姓名" prop="deliveryName" class="flex">
      <el-input
        disabled
        placeholder="-"
        :value="nativeSelectedItem.senderName"
        class="row-form-item"
      ></el-input>
    </el-form-item>
  </div>
  <div class="fbox row-wrap">
    <el-form-item label="联系方式" prop="deliveryPhone" class="row-first-item">
      <el-input
        disabled
        placeholder="-"
        :value="nativeSelectedItem.senderMobile"
        class="row-form-item"
      ></el-input>
    </el-form-item>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, Prop, PropType, ref } from 'vue'
import setFocusApi from '@/api/setFocus/index'
import { DeliveryByOrder } from '@/interfaces/deliveryByOrder'
import type { FormRules } from 'element-plus'

const props = defineProps({
  selectedItem: {
    type: Object as PropType<DeliveryByOrder.ISender>,
    default: function () {
      return {}
    },
  },
  addressInfo: {
    type: Object as PropType<DeliveryByOrder.IAddressInfo>,
    default: function () {
      return {}
    },
  },
  isEdit: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})
const addressList = ref<DeliveryByOrder.ISender[]>([])
const nativeSelectedItem = computed(() => {
  const selectedAddressItem = addressList.value.find(item => item.id === props.selectedItem.id)
  if (selectedAddressItem) {
    return selectedAddressItem
  }
  const { senderProvinceName, senderCityName, senderCountyName } = props.addressInfo
  if (senderProvinceName && props.isEdit) {
    return Object.assign({}, props.selectedItem, {
      id: `${senderProvinceName}/${senderCityName}/${senderCountyName}`,
    })
  }
  return props.selectedItem
})
const emit = defineEmits(['update:selectedItem'])
const deliveryAddressRule = ref([
  {
    required: true,
    message: '请选择',
    trigger: 'change',
    validator: (rule: any, value: any, callback: (argv?: any) => void) => {
      if (!nativeSelectedItem.value.id) {
        return callback(new Error('请选择'))
      }
      return callback()
    },
  },
])
const getAddressList = async () => {
  const params = {
    address: '',
    senderMobile: '',
    senderName: '',
  }
  const response = await setFocusApi.querySenderSensitive(params)
  addressList.value = response.data || []
}
const handleChangeSelectedItem = (id: string) => {
  const selectedItem = addressList.value.find(
    (item: DeliveryByOrder.ISender) => item.id === id,
  )
  emit('update:selectedItem', selectedItem)
}
onMounted(() => {
  getAddressList()
})
</script>
<style scoped lang="scss">
.row-wrap {
  margin-left: 28px;
}
.row-first-item {
  margin-right: 90px;
}
</style>
