<template>
  <el-cascader
    ref="cascaderRef"
    :model-value="activeAddress"
    :props="state.cascaderConfig"
    placeholder="请选择省市区"
    @change="handleSelectedChange"
    class="cascader-address"
  ></el-cascader>
</template>
<script setup lang="ts">
import { ref, reactive, PropType, computed } from 'vue'
import deliveryByOrderApi from '@/api/deliveryByOrder/index'
import { DeliveryByOrder } from '@/interfaces/deliveryByOrder'
import _ from 'lodash'
import { CascaderNode, CascaderValue, Resolve } from 'element-plus'
const props = defineProps({
  activeAddress: {
    type: Array as PropType<DeliveryByOrder.IAddressCascaderItem[]>,
    default: () => [],
  },
})
const emit = defineEmits(['update:activeAddress'])
const cascaderRef = ref()
const activeAddress = computed(() => {
  const result = [] as number[]
  props.activeAddress.forEach((item) => {
    if (Number(item.code) && item.code !== 'undefined' && item.code !== 'null') {
      result.push(Number(item.code))
    }
  })
  return result
})
const state = reactive({
  // activeAddress: [3, 51042, 55776],
  cascaderConfig: {
    lazy: true,
    lazyLoad: (node: CascaderNode, resolve: Resolve) => {
      try {
        const { level, value } = node
        const params = {} as DeliveryByOrder.IGetAddressListRequest
        if (level) {
          params.parentAddressCode = Number(value)
        }
        deliveryByOrderApi.getAddressList(params).then((response) => {
          const list = _.map(response.data, (item) => ({
            label: item.districtName,
            value: item.districtCode,
            leaf: level > 1,
          }))
          resolve(list)
        })
      } catch (err) {
        console.log('获取地址失败', err)
      }
    },
  },
})
const handleSelectedChange = (list: CascaderValue) => {
  if (cascaderRef.value) {
    const checkedNodes = cascaderRef.value.getCheckedNodes()[0] || {}
    const checkedPathNodes = checkedNodes.pathNodes
    const selectedNodeList = [] as DeliveryByOrder.IAddressCascaderItem[]
    checkedPathNodes.forEach(
      (nodeItem: { label: string; value: number | string }) => {
        const { label, value } = nodeItem
        selectedNodeList.push({
          code: value,
          name: label,
        })
      },
    )
    emit('update:activeAddress', selectedNodeList)
  }
}
</script>
<style lang="scss" scoped>
.cascader-address {
  width: 100%;
}
</style>
