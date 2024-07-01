<template>
  <SearchForm @coSearch="handleSearch"></SearchForm>
  <div class="panel-border vhbox mt-10 table-wrap" v-loading="state.loading">
    <div class="cbox pt-sm mb-sm">
      <el-tooltip
        effect="light"
        content="请选择至少1个订单"
        placement="top"
        :disabled="!!state.selectedRowList.length"
      >
        <div>
          <el-button
            type="primary"
            @click="handleBatchPrint"
            :disabled="!state.selectedRowList.length"
            clstag="h|keycount|order_1697703959622|4"
            >打印电子面单</el-button
          >
        </div>
      </el-tooltip>

      <el-tooltip
        content="请选择至少1个订单"
        placement="top"
        effect="light"
        :disabled="!!state.selectedRowList.length"
      >
        <div class="top-middle-button">
            <el-button
              type="primary"
              plain
              :disabled="!state.selectedRowList.length"
              @click="handleExport"
              clstag="h|keycount|order_1697703959622|5"
              >导出</el-button
            >
        </div>
      </el-tooltip>
      <el-tooltip
        effect="light"
        content="请选择至少1条订单信息"
        placement="top"
        :disabled="!!state.selectedRowList.length"
      >
        <div>
          <el-button type="primary" plain class="mr-sm" :disabled="!state.selectedRowList.length" @click="handlePlaceOrder()"
          clstag="h|keycount|order_1697703959622|6"
            >批量下单</el-button
          >
        </div>
      </el-tooltip>
      <el-divider direction="vertical"></el-divider>
      <el-button type="primary" plain @click="handleEdit()" class="ml-sm"
      clstag="h|keycount|order_1697703959622|1"
        >单个录入</el-button
      >
      <upload-btn
        :beforeUpload="beforeUpload"
        accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        title="批量导入"
        tipContent="上传的文件大小不能超过5M, 仅支持EXCEL文件"
        uploadUrl="/api/shipper/order/upload/4/1"
        templateUrl="/api/oss/downloadTemplate/shipperOrder"
        class="ml-10 mr-sm"
        @updateTable="handleSearch(state.searchData)"
        clstagBtn="h|keycount|order_1697703959622|8"
        clstagDownLoad="h|keycount|order_1697703959622|13"
      >
        批量录入
      </upload-btn>
      <UploadHistory class="upload-btn" clstagBtn="h|keycount|order_1697703959622|20" clstagDownLoad="h|keycount|order_1697703959622|19"></UploadHistory>
    </div>
    <el-table
      :data="state.tableData"
      empty-text="暂无数据"
      :header-cell-style="{ background: '#f5f5f5' }"
      show-overflow-tooltip
      table-layout="fixed"
      class="mb flex"
      @selection-change="handleSelectedRowChange"
      row-key="ussOrderNo"
    >
      <el-table-column type="selection" width="37" />
      <el-table-column
        prop="channelOrderNo"
        label="平台订单号"
        min-width="134"
      />
      <el-table-column
        prop="customerOrderNo"
        label="自定义订单号"
        min-width="128"
      />
      <el-table-column prop="receiverName" label="收货人姓名" min-width="150">
        <template #default="scope">
          <Eyes
            :cipherText="scope.row.receiverName"
            :getPlainText="getPlainText(scope.row.ussOrderNo, 'receiverName')"
          ></Eyes>
        </template>
      </el-table-column>
      <el-table-column prop="receiverMobile" label="手机号" min-width="141">
        <template #default="scope">
          <Eyes
            :cipherText="scope.row.receiverMobile"
            :getPlainText="getPlainText(scope.row.ussOrderNo, 'receiverMobile')"
          ></Eyes>
        </template>
      </el-table-column>
      <el-table-column prop="receiverAddress" label="收货地址" min-width="400">
        <template #default="{ row }">
          <Eyes
            :cipherText="row.receiverAddress"
            :prifix="`${row.receiverProvinceName}${row.receiverCityName}${row.receiverCountyName}`"
            :getPlainText="
              getPlainText(row.ussOrderNo, 'receiverAddress')
            "
          ></Eyes>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="订单时间" min-width="204">
        <template #default="scope">
          {{
            scope.row.createTime
              ? dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')
              : '-'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="printStatusName"
        label="包裹打印状态"
        min-width="116"
      >
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="240">
        <template #default="scope">
          <!-- 未下运单 -->
          <template v-if="scope.row.orderStatus === 1">
            <el-button link type="primary" @click="handlePlaceOrder(scope.row)"
            clstag="h|keycount|order_1697703959622|21"
              >下单</el-button
            >
            <el-button link type="primary" @click="handleEdit(scope.row)"
            clstag="h|keycount|order_1697703959622|22"
              >修改</el-button
            >
            <del-btn style="margin-left:12px;margin-right:12px" :row="scope.row" :delFun="handleDelete" clstag="h|keycount|order_1697703959622|23">删除</del-btn>
          </template>
          <template v-else>
            <el-button
              v-if="scope.row.printStatusCode === 1"
              link
              type="primary"
              @click="handlePrint(scope.row)"
              clstag="h|keycount|order_1697703959622|24"
              >打印面单</el-button
            >
            <el-button
              v-else
              link
              type="primary"
              @click="handleRePrint(scope.row)"
              clstag="h|keycount|order_1697703959622|25"
              >重新打印</el-button
            >
          </template>
          <el-button link type="primary" @click="handleOpenDetail(scope.row)"
          clstag="h|keycount|order_1697703959622|26"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <PaginationIndex
      :total="state.total"
      @pageChange="coPageChange"
    ></PaginationIndex>
    <EditWaybillDialog
      ref="editWaybillDialogRef"
      @updateTable="handleSearch(state.searchData)"
    ></EditWaybillDialog>
    <PrintOrderDialog
      ref="printOrderDialogRef"
      :cancelPrinting="cancelPrinting"
      :confirmPrinting="confirmPrinting"
      @updateTable="handleSearch(state.searchData)"
    ></PrintOrderDialog>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref, nextTick } from 'vue'
import SearchForm from './components/SearchForm.vue'
import { DeliveryByOrder } from '@/interfaces/deliveryByOrder'
import deliveryByOrderApi from '@/api/deliveryByOrder/index'
import Eyes from '@/components/Eyes/ViewEye.vue'
import dayjs from 'dayjs'
import _ from 'lodash'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import UploadHistory from '@/components/Btn/HistoryRecordBtn.vue'
import PaginationIndex from '@/components/Pagination/PaginationIndex.vue'
import DelBtn from '@/components/Btn/DelBtn.vue'
import ExportBtn from '@/components/Btn/ExportBtn.vue'
import UploadBtn from '@/components/Btn/UploadBtn.vue'
import { useRoute, useRouter } from 'vue-router'
import EditWaybillDialog from './components/EditWaybillDialog.vue'
import PrintOrderDialog from './components/PrintOrder/PrintOrderDialog.vue'
import { downloadExcel } from '@/utils/common'
// import XLSX from 'xlsx'

const printOrderDialogRef = ref()
const editWaybillDialogRef = ref()
const cancelPrinting = ref('h|keycount|order_1697703959622|10')
const confirmPrinting = ref('h|keycount|order_1697703959622|9')
const router = useRouter()
const state = reactive({
  tableData: [] as DeliveryByOrder.IOrderListItem[],
  loading: false,
  pageInfo: {
    pageNo: 1,
    pageSize: 15,
  },
  total: 0,
  searchData: {} as DeliveryByOrder.ISearch,
  activeRow: {} as DeliveryByOrder.IOrderListItem,
  selectedRowList: [] as DeliveryByOrder.IOrderListItem[],
})
const handleSearch = async (searchData: DeliveryByOrder.ISearch) => {
  state.searchData = searchData
  const params = Object.assign({}, searchData, state.pageInfo)
  // console.log('searchData', params)
  try {
    state.loading = true
    const response = await deliveryByOrderApi.getOrderList(params)
    state.tableData = response.data.list || []
    state.total = response.data.total
    state.loading = false
  } catch (e) {
    state.loading = false
  }
}
const coPageChange = (newPageInfo: DeliveryByOrder.IPageInfo) => {
  state.pageInfo = newPageInfo
  handleSearch(state.searchData)
}
const handlePlaceOrder = async (row?: DeliveryByOrder.IOrderListItem) => {
  let ussOrderNos = [] as string[]
  const messageContent = ref('')
  if (!row) {
    // 批量下单
    ussOrderNos = state.selectedRowList.map((item) => {
      return item.ussOrderNo
    })
    messageContent.value = '批量下单成功'
    ElMessage({
      message: '批量下单中，请耐心等待',
      type: 'info',
    })
  } else {
    // 单个下单
    ussOrderNos = [row.ussOrderNo]
    messageContent.value = '下单成功'
    ElMessage({
      message: '下单中，请耐心等待',
      type: 'info',
    })
  }
  try {
    const response = await deliveryByOrderApi.submitExpressOrder({
      ussOrderNos,
    })
    if (+response.code === 1) {
      const submitExpressOrderResults = response.data.submitExpressOrderResults
      const flag = ref(false)
      // const noticeMessage = []
      for (let i = 0; i < submitExpressOrderResults.length; i++) {
        if (submitExpressOrderResults[i].code !== 1) {
          flag.value = true
          setTimeout(() => {
            ElNotification({
              title: '下单失败',
              message: `平台订单号【${submitExpressOrderResults[i].channelOrderNo}】自定义订单号【${submitExpressOrderResults[i].customerOrderNo}】${submitExpressOrderResults[i].message || ''}`,
              type: 'error',
            })
          }, 100)
          // const content = `平台订单号【${submitExpressOrderResults[i].channelOrderNo}】自定义订单号【${submitExpressOrderResults[i].customerOrderNo}】下单失败`
          // noticeMessage.push(content)
        }
      }
      if (!flag.value) {
        ElMessage({
          message: messageContent.value,
          type: 'success',
        })
      } else {
        // ElNotification({
        //   title: 'Error',
        //   dangerouslyUseHTMLString: true,
        //   message: noticeMessage.join(''),
        //   duration: 0,
        //   type: 'error'
        // })
      }
      handleSearch(state.searchData)
    } else {
      ElMessage({
        message: response.message,
        type: 'warning',
      })
    }
  } catch (err) {
    ElMessage({
      message: `${err}`,
      type: 'warning',
    })
  }
}
const handleEdit = (row?: DeliveryByOrder.IOrderListItem) => {
  editWaybillDialogRef.value.showDialog(row)
}
const handleDelete = async (row: DeliveryByOrder.IOrderListItem) => {
  console.log('row', row)
  try {
    const params = {
      ussrOrderNo: row.ussOrderNo,
    }
    const response = await deliveryByOrderApi.deleteOrder(params)
    if (+response.code !== 1) {
      ElMessage.error(response.message)
    } else {
      handleSearch(state.searchData)
      ElMessage.success('删除成功')
    }
    return response.data
  } catch (err) {
    return false
  }
}
const handleBatchPrint = async () => {
  const rows = []
  const datas: DeliveryByOrder.IOrderListItem[] = [] // 未下单数据
  const hasNoProviderData: DeliveryByOrder.IOrderListItem[] = [] // 已下单未返回服务商信息数据
  let hasSameProviderCode = true // 服务商是否都相同
  const firstSelectedRow = state.selectedRowList[0]
  _.forEach(
    state.selectedRowList,
    (element: DeliveryByOrder.IOrderListItem) => {
      if (element.orderStatus === 1) {
        datas.push(element)
      } else {
        if (!(element.providerCode && element.providerName)) {
          hasNoProviderData.push(element)
        }
      }
      if (element.providerCode !== firstSelectedRow.providerCode) {
        hasSameProviderCode = false
      }
    },
  )
  if (datas && datas.length > 0) {
    ElMessage({
      message: '请选择已下单的数据',
      type: 'warning',
    })
    return
  }
  if (hasNoProviderData && hasNoProviderData.length > 0) {
    ElMessage({
      message: '部分订单缺少服务商数据',
      type: 'warning',
    })
    return
  }
  if (!hasSameProviderCode) {
    try {
      await ElMessageBox.confirm(
        '模板尺寸不一致，可能影响面单打印完整性，是否继续？',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
    } catch (err) {
      if (err) return
    }
  }
  const d = { title: '批量打印面单', rows: state.selectedRowList }
  printOrderDialogRef.value.showDialog(d)
}
const handlePrint = (row: DeliveryByOrder.IOrderListItem) => {
  console.log('row', row)
  if (row.providerCode && row.providerName) {
    printOrderDialogRef.value.showDialog({ rows: [row] })
  } else {
    ElMessage({
      message: '此订单缺少服务商数据',
      type: 'warning',
    })
  }
}
const handleRePrint = (row: DeliveryByOrder.IOrderListItem) => {
  handlePrint(row)
}
const handleOpenDetail = (row: DeliveryByOrder.IOrderListItem) => {
  state.activeRow = row
  router.push({
    name: 'orderShipmentDetail',
    query: { ussOrderNo: row.ussOrderNo },
  })
}
const handleExport = async () => {
  try {
    const ussOrderNoList = state.selectedRowList.map((item) => item.ussOrderNo)
    const data = {
      orderNoList: ussOrderNoList,
    }
    const response = await deliveryByOrderApi.batchExport(data)
    const fileName = `订单导出列表${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
    downloadExcel(response, fileName, '')
  } catch (err) {
    console.log('err', err)
  }
}
const getPlainText = (
  ussOrderNo: string,
  type: keyof DeliveryByOrder.IAddressInfo,
) => {
  return async () => {
    const params = {
      ussOrderNo,
    }
    const response = await deliveryByOrderApi.getPlainText(params)
    const addressInfo = response.data
    return addressInfo[type]
  }
}
const handleSelectedRowChange = (
  selection: DeliveryByOrder.IOrderListItem[],
) => {
  state.selectedRowList = selection
}

function beforeUpload (file: { type: string; size: number }) {
  console.log(file, 'ff')
  const isJpgOrPng =
    file.type === 'xlsx' ||
    file.type === 'xls' ||
    file.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel'
  if (!isJpgOrPng) {
    ElMessage.error('只支持xlsx、xls文件')
  }
  const isLt2M = file.size / 1024 / 1024 < 5
  if (!isLt2M) {
    ElMessage.error('上传的文件大小不能超过5M')
  }
  return isJpgOrPng && isLt2M
}
</script>
<style lang="scss" scoped>
.table-wrap {
  height: calc(100% - 132px);
}
.search-wrap {
  padding-bottom: 0;
}
.search-button-wrap {
  align-self: flex-start;
}
.upload-btn {
  margin-left: auto;
}
.top-middle-button {
  margin: 0 12px 0 12px;
}
</style>
