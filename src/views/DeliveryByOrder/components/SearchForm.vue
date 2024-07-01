<template>
  <el-form
    ref="ruleFormRef"
    :model="searchForm"
    :rules="rules"
    class="panel-border search-wrap"
    :inline="true"
    :hide-required-asterisk="true"
    label-width="120px"
  >
    <el-row>
      <el-col :span="8">
        <el-form-item prop="timeRang" label="订单时间" style="width: 100%">
          <el-date-picker
            :clearable="false"
            v-model="timeRang"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @calendar-change="handleCalendarChange"
            :disabled-date="handleSetDisableDate"
            @change="handleTimeChange"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否有备注" style="width: 100%">
          <el-select
            v-model="searchForm.hasRemark"
            placeholder="全部"
            style="width: 100%"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="平台订单号" style="width: 100%">
          <el-input
            v-model="searchForm.channelOrderNo"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="打印状态" style="width: 100%">
          <el-select
            v-model="searchForm.printStatusCode"
            placeholder="全部"
            style="width: 100%"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="未打印" :value="1"></el-option>
            <el-option label="已打印" :value="2"></el-option>
            <el-option label="打印失败" :value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="下单状态" style="width: 100%">
          <el-select
            v-model="searchForm.orderStatusCode"
            placeholder="全部"
            style="width: 100%"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="未下单" value="1"></el-option>
            <el-option label="已下单" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <div class="flex t-right search-button-wrap" style="width: 100%">
          <el-button @click="handleReset()" clstag="h|keycount|order_1697703959622|3">重置</el-button>
          <el-button type="primary" clstag="h|keycount|order_1697703959622|2" @click="handleSearch(ruleFormRef)"
            >查询</el-button
          >
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
import { Ref, onMounted, ref, reactive } from 'vue'
import Dayjs from 'dayjs'
// import { DEFAULT_FORMATS_DATE } from 'element-plus'
import { DeliveryByOrder } from '@/interfaces/deliveryByOrder'
import type { FormInstance, FormRules } from 'element-plus'
const validateTimeRang = (rule: any, value: any, callback: any) => {
  if (timeRang.value === null) {
    callback(new Error('请选择日期范围'))
  } else {
    callback()
  }
}
const emit = defineEmits(['coSearch'])
const defaultRange: [Date, Date] = [new Date(Dayjs().subtract(1, 'month').valueOf()), new Date()]
const ruleFormRef = ref<FormInstance>()
const rules = reactive({
  timeRang: [
    {
      validator: validateTimeRang,
      required: true,
      message: '请选择日期',
      trigger: 'change',
    },
  ],
})
const initSearchData = () => {
  return {
    hasRemark: '', // 是否有备注
    channelOrderNo: '', // 平台订单号（渠道订单号）
    endTime: '',
    printStatusCode: '', // 1：未打印，2：已打印，3：打印失败; // 打印状态
    startTime: '', // 开始时间
    orderStatusCode: '', // 运单状态, 10:下单，20:出库，30:揽收;
  }
}
const timeRang = ref<[Date, Date]>()
const searchForm = ref<DeliveryByOrder.ISearch>(initSearchData())
const handleSearch = async (formEl: FormInstance | undefined) => {
  if (timeRang.value) {
    const [startTime, endTime] = timeRang.value
    searchForm.value.startTime = formatDate(startTime)
    searchForm.value.endTime = formatDate(endTime)
  } else {
    searchForm.value.startTime = ''
    searchForm.value.endTime = ''
  }
  if (!formEl) return
  await formEl.validateField('timeRang', (valid, fields) => {
    if (valid) {
      emit('coSearch', searchForm.value)
    } else {
      console.log('error submit!', fields)
    }
  })
}
const formatDate = (dateStr: string| Date) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const formattedDate = `${year}-${month}-${day}`
  return formattedDate
}
const handleTimeChange = (timeRange: string[]) => {
  if (!timeRange) {
    return
  }
  const [startTime, endTime] = timeRange
  searchForm.value.startTime = formatDate(startTime)
  searchForm.value.endTime = formatDate(endTime)
}
const handleReset = () => {
  timeRang.value = defaultRange
  searchForm.value = initSearchData()
  handleSearch(ruleFormRef.value)
}
const cacendarList = ref<Array<Date | null>>([])
const handleCalendarChange = (value: Array<Date | null>) => {
  cacendarList.value = value
}
const handleSetDisableDate = (time: Date) => {
  const [start, end] = cacendarList.value
  if (start) {
    const startTime = Dayjs(start).subtract(1, 'month').valueOf()
    const endTime = Dayjs(start).add(1, 'month').valueOf()
    return (
      time.getTime() < new Date(startTime).getTime() ||
      time.getTime() > (new Date(endTime).getTime() > new Date().getTime() ? new Date().getTime() : new Date(endTime).getTime())
    )
  }
}
onMounted(() => {
  timeRang.value = defaultRange
  // console.log('searchForm-----search')
  handleSearch(ruleFormRef.value)
})
</script>
<style lang="scss" scoped>
.search-wrap {
  padding-bottom: 0;
  // padding-right: 5%;
}
.search-button-wrap {
  align-self: flex-start;
}
</style>
