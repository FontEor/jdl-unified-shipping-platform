<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import MyPagination from '@/components/Pagination/PaginationIndex.vue'
import PayDialog from './components/payDialog.vue'
import type { TabsPaneContext } from 'element-plus'
import billsApi from '@/api/bills/billIndex'
import { queryPay, payData, payRowInfo } from '@/interfaces/bills'
import { formatUri } from '@/utils/common'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import _ from 'lodash'
import InvoiceDialog from '@/views/Invoice/invoiceDialog.vue'
import CustomerDialog from './components/customerDialog.vue'
import ExportBtn from './components/downButton.vue'

function get (data: any, path: string) {
  return _.get(data, path)
}

const route = useRoute()
const urlQuery = route.query

const activeName = ref<string>('bepaid') // 当前tab
const bePaidNum = ref<number>(0) // 待支持条数
const bePaidTableData = ref([]) // 待支持表格数据
const paidNum = ref<number>(0) // 已支付条数
const paidTableData = ref([]) // 已支付表格数据
const isLoading = ref<boolean>(false)
const datePickerValue = ref()
const page = ref<number>(1)
const pageSize = ref<number>(10)
const selectAllBills = ref([])
const payDialog = ref()
const customerDia = ref()
const total = computed(() => {
  if (activeName.value === 'bepaid') {
    return bePaidNum.value
  }
  if (activeName.value === 'paid') {
    return paidNum.value
  }
  return 0
})
const tableData = computed(() => {
  if (activeName.value === 'bepaid') {
    return bePaidTableData.value
  }
  if (activeName.value === 'paid') {
    return paidTableData.value
  }
  return []
})
const payStatus = reactive({
  bepaid: 2, // 待支付
  paid: 3, // 已支付
})

const queryForm = reactive<queryPay>({
  channelNo: '',
  platformBusinessSource: '',
  waybillCode: '',
  customerId: '',
  shipperId: '',
})

// 日期组件禁用时间区间
const disabledDateFun = (time: any) => {
  const years = dayjs().subtract(1, 'year').format('YYYY-MM-DD') // 一年前的今天
  return time.getTime() > new Date().getTime() || time.getTime() < new Date(years).getTime()
}

// 设置默认时间
const setDefaultTime = () => {
  const startTime = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
  const endTime = dayjs().subtract(0, 'day').format('YYYY-MM-DD')
  datePickerValue.value = [startTime, endTime]
  selectDatePicker()
}

// 选择时间
const selectDatePicker = () => {
  queryForm.startTime = datePickerValue.value[0]
  queryForm.endTime = datePickerValue.value[1]
}

// 重置
const resetSearch = () => {
  setDefaultTime()
  queryForm.waybillCode = ''
}

// 导出
const exportBills = () => {
  const params = {
    paymentStatus: '', // 待定
    startTime: queryForm.startTime,
    endTime: queryForm.endTime,
    businessSource: '',
    ...queryForm,
  }
  return formatUri('/fe/api/order/export', { ...params })
}

// 切换选项卡
const changeTabs = async (tab: TabsPaneContext) => {
  page.value = 1
  setTableData()
}

// 获取列表数据
const getTableData = (status: number) => {
  const params = {
    pageNo: page.value,
    pageSize: pageSize.value,
    paymentStatus: status,
    startTime: queryForm.startTime,
    endTime: queryForm.endTime,
    ...queryForm,
  }
  return billsApi.billList(params)
}

// 查询
const searchList = () => {
  page.value = 1
  setTableData('auto')
}

// 批量选择
const selectBills = (value: []) => {
  selectAllBills.value = value
}

// 批量支付
const payBatch = () => {
  if (!selectAllBills.value.length) {
    ElMessage.warning('请勾选待支付订单')
    return
  }
  const arr = reactive({
    list: [] as payData[],
  })
  const total = ref<number>(0)
  const selectLength = selectAllBills.value.length
  selectAllBills.value.forEach((item: payRowInfo) => {
    const resJson = {
      logisticsOrderNo: item.logisticsOrderNo,
      waybillCode: item.waybillCode,
    }
    total.value += Number(item.paymentVO.amount)
    arr.list.push(resJson)
  })
  total.value = Number(total.value.toFixed(2))
  payDialog.value.showDialog(arr.list, total.value, {}, selectLength)
}

// 重新支付
const payAgain = (row: payRowInfo) => {
  const data = ref([
    {
      logisticsOrderNo: row.logisticsOrderNo,
      waybillCode: row.waybillCode,
    },
  ])
  payDialog.value.showDialog(data.value, Number(row.paymentVO.amount), row)
}

// 联系客服
const showCustomerDia = () => {
  customerDia.value.showDialog()
}

// 切换页码
const pageChange = (pageInfo: { pageNo: number; pageSize: number }): void => {
  page.value = pageInfo.pageNo
  pageSize.value = pageInfo.pageSize
  console.log(page, pageSize, 'pppp')
  setTableData()
}

// 表格数据 type: auto 自动跳转到有数据tab
const setTableData = (type?: string) => {
  isLoading.value = true
  Promise.all([getTableData(2), getTableData(3)]).then((res) => {
    const { code: bePaidCode, data: bePaidData }: any = res[0] || {}
    const { code: paidCode, data: paidData }: any = res[1] || {}
    console.log(res, bePaidCode, bePaidData, paidCode, paidData)
    if (bePaidCode === '1' && bePaidData) {
      bePaidTableData.value = bePaidData.list
      bePaidNum.value = bePaidData.total
    } else {
      bePaidTableData.value = []
      bePaidNum.value = 0
    }
    if (paidCode === '1' && paidData) {
      paidTableData.value = paidData.list
      paidNum.value = paidData.total
    } else {
      paidTableData.value = []
      paidNum.value = 0
    }
    if (type === 'auto') {
      // 待支付是否有数据
      if (!(activeName.value === 'bepaid' && bePaidNum.value)) {
        if (paidNum.value) {
          activeName.value = 'paid'
        }
      }
      // 已支付是否有数据
      if (!(activeName.value === 'paid' && paidNum.value)) {
        if (bePaidNum.value) {
          activeName.value = 'bepaid'
        }
      }
    }
    isLoading.value = false
  }).catch(error => {
    console.log(error)
    isLoading.value = false
    bePaidTableData.value = []
    bePaidNum.value = 0
    paidTableData.value = []
    paidNum.value = 0
  })
}

// url参数设置
const setQueryForm = () => {
  activeName.value = (urlQuery.keycode || 'bepaid') as string
  queryForm.channelNo = urlQuery.channelNo as string
  queryForm.platformBusinessSource = urlQuery.platformBusinessSource as string
  queryForm.customerId = urlQuery.customerId as string
  queryForm.shipperId = urlQuery.shipperId as string
}
const checkSelect = (row: any) => {
  let isChecked = true
  if (_.get(row, 'paymentVO.remarkCode') === '003114') { // 判断里面是否存在某个参数
  // remarkCode=== '003114' 时 该行复选框不可勾选
    isChecked = false
  } else {
    isChecked = true
  }
  return isChecked
}
onMounted(() => {
  setQueryForm()
  setDefaultTime()
  setTableData()
})

</script>

<template>
  <div class="bills-wraper">
    <div class="bills-tips">【温馨提示】如您对卓配发货有任何疑问，请拨打<span class="bills-tips-number">950616</span>与专属客服沟通</div>
    <div class="panel-border-8 mb-sm head-search">
      <el-row justify="space-between">
        <el-col :span="11">
          <span class="form-label">运单号</span>
          <el-input v-model="queryForm.waybillCode" placeholder="请输入运单号"></el-input>
        </el-col>
        <el-col :span="11">
          <span class="form-label">下单时间</span>
          <el-date-picker
            type="daterange"
            range-separator="至"
            start-placeholder="起始日期"
            end-placeholder="终止日期"
            value-format="YYYY-MM-DD"
            v-model="datePickerValue"
            @change="selectDatePicker"
            :disabledDate="disabledDateFun"
            :clearable="false"
          ></el-date-picker>
        </el-col>
      </el-row>
      <div>
        <el-button style="border: none; background-color: #f5f5f6;" @click="resetSearch">重置</el-button>
        <el-button type="primary" @click="searchList" clstag="h|keycount|isv_1697703741586|1">查询</el-button>
      </div>
    </div>
    <div class="panel-border-8" style="min-height:calc(100% - 154px)" v-loading="isLoading">
      <div class="export-wraper">
        <div class="export-icon">
          <img src="@/assets/images/server/book.png" width="16" height="16" class="pay-icon" />
          <span class="pay-text">支付账单</span>
        </div>
        <ExportBtn :downloadUrl="exportBills()" clstag="h|keycount|isv_1697703741586|9">导出账单</ExportBtn>
      </div>
      <el-tabs v-model="activeName" @tab-click="changeTabs">
        <el-tab-pane :label="`待支付（${bePaidNum}）`" name="bepaid" clstag="h|keycount|isv_1697703741586|2"></el-tab-pane>
        <el-tab-pane :label="`已支付（${paidNum}）`" name="paid" clstag="h|keycount|isv_1697703741586|3"></el-tab-pane>
      </el-tabs>
      <el-button type="primary" class="mb" v-if="activeName === 'bepaid'"  clstag="h|keycount|isv_1697703741586|4" @click="payBatch">批量支付</el-button>
      <!-- 开发票 -->
      <InvoiceDialog ref="invoiceDialog" class="invoice-btn" v-else></InvoiceDialog>
      <el-table
        :data="tableData"
        :header-cell-style="{'background': '#f5f5f5'}"
        empty-text="暂无数据"
        @selection-change="selectBills"
      >
        <el-table-column type="selection" :selectable="checkSelect" min-width="50" v-if="activeName === 'bepaid'"></el-table-column>
        <el-table-column label="运单号" property="waybillCode" fixed="left" min-width="150"></el-table-column>
        <el-table-column label="物流公司" property="providerInfoVO.providerName" min-width="110"></el-table-column>
        <el-table-column label="商家订单号" property="channelInfoVO.channelOrderNo" min-width="150"></el-table-column>
        <el-table-column label="物流订单号" property="logisticsOrderNo" min-width="170"></el-table-column>
        <el-table-column label="寄件地址" property="" min-width="180">
          <template #default="scoped">
            <span>{{ scoped.row.senderAddressVO.provinceName }}</span>
            <span v-show="scoped.row.senderAddressVO.cityName !== ''">{{ scoped.row.senderAddressVO.cityName }}</span>
            <span v-show="scoped.row.senderAddressVO.countyName !== ''">{{ scoped.row.senderAddressVO.countyName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收件地址" property="" min-width="180">
          <template #default="scoped">
            <span>{{ scoped.row.receiverAddressVO.provinceName }}</span>
            <span v-show="scoped.row.receiverAddressVO.cityName !== ''">{{ scoped.row.receiverAddressVO.cityName }}</span>
            <span v-show="scoped.row.receiverAddressVO.countyName !== ''">{{ scoped.row.receiverAddressVO.countyName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单渠道" property="platformBusinessInfoVO.platformBusinessSourceValue" min-width="110"></el-table-column>
        <el-table-column label="下单时间" property="orderCreationTime" min-width="200"></el-table-column>
        <el-table-column label="重量（kg）" property="weightInfoVO.value" min-width="110"></el-table-column>
        <el-table-column label="金额（元）" property="paymentVO.amount" min-width="110"></el-table-column>
        <el-table-column label="支付状态" property="paymentVO.paymentStatusValue" min-width="110">
          <template #default="scoped">
            <span class="pay-btn" :class="scoped.row.paymentVO.paymentStatus === 3 ? 'paid' : 'be-pay'"
            >{{ scoped.row.paymentVO.paymentStatus === 3 ? '已支付' : '待支付' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" property="paymentVO.paymentTypeValue" min-width="110"></el-table-column>
        <el-table-column label="扣款失败原因" property="paymentVO.remark" min-width="280" v-if="activeName === 'bepaid'">
          <template #default="scoped">
            <div v-if="scoped.row.paymentVO.remarkType === 'sign'">
              <span>自动扣款服务已关闭，请取消运单后重新下单</span>
              <!-- 一期不做重新签约 -->
              <!-- <el-button type="primary" link>重新签约</el-button> -->
            </div>
            <div v-if="scoped.row.paymentVO.remarkType === 'customer'">
              <span>{{get(scoped.row, 'paymentVO.remark')}}</span>
              <el-button type="primary" link @click="showCustomerDia" clstag="h|keycount|isv_1697703741586|5">联系客服</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="支付时间" property="paymentVO.paymentTime" min-width="180" v-else></el-table-column>
        <el-table-column label="操作" property="" fixed="right" min-width="100" v-if="activeName === 'bepaid'">
          <template #default="scoped">
            <el-button type="primary" :disabled="scoped.row.paymentVO.remarkCode === '003114'" clstag="h|keycount|isv_1697703741586|6" link @click="payAgain(scoped.row)">重新支付</el-button>
          </template>
        </el-table-column>
      </el-table>
    <!-- 分页 -->
    <MyPagination
      @pageChange="pageChange"
      :total="total"
      style="margin-top: 16px"
      :pageSize="10"
      :page-sizes="[10,25,50,100]"
    />
    </div>
    <!-- 支付弹窗 -->
    <PayDialog ref="payDialog" @refreshList="resetSearch()" />
    <!-- 联系客服 -->
    <CustomerDialog ref="customerDia" />
  </div>
</template>

<style lang="scss" scoped>
.bills-wraper {
  font-family: PingFang SC;
  height: 100%;
  .bills-tips {
    height: 40px;
    line-height: 40px;
    padding-left: 16px;
    margin-bottom: 16px;
    background: rgba(255,247,230,1);
    box-shadow:  0 1px 0 0 rgba(0,0,0,0.04);
    .bills-tips-number {
      color: #FF7700;
    }
  }
  .head-search {
    display: flex;
    justify-content: space-between;
  }
  .el-col-11 {
    display: flex;
    align-items: center;
    .form-label {
      width: 80px;
      text-align: right;
      padding-right: 8px;
    }
  }
  .panel-border-8 {
    margin:16px;
    :deep() {
      .el-tabs__active-bar .is-top {
        width: 24px !important
      }
      .el-tabs__item {
        font-size: 16px;
      }
      .el-tabs--top .el-tabs__item.is-top:nth-child(2){
        padding:0 15px 0 0
      }
      .el-tabs--top .el-tabs__item.is-top:last-child {
        padding:0 0 0 15px
      }
    }
  }
  .export-wraper {
    display: flex;
    justify-content: space-between;
    .pay-text {
      font-size: 16px;
      color: #23252B;
      font-weight: 600;
    }
    .export-icon {
      display: flex;
      align-items: center;
      img {
        margin-right: 10px;
      }
    }
  }
  .pay-btn {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 8px;
  }
  .be-pay {
    background: #FFF1E6;
    color: #FF7700;
  }
  .paid {
    background-color: #E7F7EF;
    color: #12B35D;
  }
  .invoice-btn {
    margin-bottom: 15px;
  }
}
</style>
