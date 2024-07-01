<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    modal-class="print-order-dialog-comp"
    width="600"
    :close-on-click-modal="false"
    >
    <el-form
      ref="ruleFormRef"
      :model="formData"
      label-width="120px"
      class="demo-ruleForm"
      >
      <PrintTypeRadio @change="handlePrintChange" :localPrinting="localPrinting" :webPrinting="webPrinting"></PrintTypeRadio>
      <PrintTemplateSelect ref="printTemplateSelect" :data="providerData" :preview-clstag="preview"></PrintTemplateSelect>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel" :clstag="cancelPrinting">取消</el-button>
        <el-button type="primary" @click="handleOk" :loading="printLoading" :clstag="confirmPrinting">确认打印</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'
import printOrderApi from '@/api/deliveryByOrder/print'
import { PrintNamespace } from '@/interfaces/print'
import printJs from 'print-js'
import _ from 'lodash'
import { ElMessage, ElNotification } from 'element-plus'
import PrintTypeRadio from './components/PrintTypeRadio.vue'
import PrintTemplateSelect from './components/PrintTemplateSelect.vue'
import { Provider } from './provider'
import printInstance from './components/print'
const emit = defineEmits(['updateTable'])
const dialogVisible = ref(false)
const dialogTitle = ref()
const rules = ref([])
const ruleFormRef = ref()
const printTemplateSelect = ref()
const printLoading = ref(false)
const localPrinting = ref('h|keycount|order_1697703959622|11')
const webPrinting = ref('h|keycount|order_1697703959622|12')
const preview = ref<string>('h|keycount|order_1697703959622|7')
const props = defineProps({
  confirmPrinting: {
    type: String,
    default: () => '',
  },
  cancelPrinting: {
    type: String,
    default: () => '',
  },
})
const formData:Provider.FormData = reactive({
  printType: '',
  printName: '',
  // providerData: []
})
const currentRows = ref()
const providerData = ref<Provider.ProviderInfo[]>()

// 打开打印面单弹窗&初始化
const showDialog = ({ title, rows }: {title: string, rows: any}) => {
  currentRows.value = rows
  dialogTitle.value = title || '打印面单'
  providerData.value = rows
  dialogVisible.value = true
}

defineExpose({
  showDialog,
})

function handlePrintChange ({ printType, printName }: Provider.FormData) {
  console.log('print', printType, printName)
  formData.printType = printType
  formData.printName = printName
}
// 取消，关闭弹窗
function handleCancel () {
  dialogVisible.value = false
}
// 本地打印
async function localPrint (selectedTemplateData: PrintNamespace.PrintParams[], templateObj: Provider.TemplateObj) {
  try {
    if (!(formData && formData.printName)) {
      ElMessage({
        message: '请选择打印机',
        type: 'warning',
      })
      return false
    }
    // 获取打印密文数据
    const params: PrintNamespace.PrintEncryptAxios = {
      orderDataList: selectedTemplateData,
    }
    const { code, data } = await printOrderApi.getPrintEncryptData(params)
    if (code === '1') {
      // 组装打印数据
      const key = `print${Date.now()}`
      const printData = printInstance.formatPrintData(data, {
        id: key,
        templateObj, // 服务商模版
      })
      // console.log(formData.printName, printData, 'pppp')
      printInstance.startPrint(printData)
      localStorage.setItem(key, JSON.stringify(data))
      ElMessage({
        message: '开始打印数据',
        type: 'success',
      })
      return true
    }
    ElMessage({
      message: '获取打印数据失败，请稍后重试',
      type: 'error',
    })
    return false
  } catch (error) {
    return false
  }
}
async function webPrint (selectedTemplateData: PrintNamespace.PrintParams[]) {
  try {
    // 获取打印密文数据
    const params: PrintNamespace.PrintEncryptAxios = {
      orderDataList: selectedTemplateData,
    }
    const { code, data } = await printOrderApi.printWebData(params)
    if (code === '1') {
      // 组装打印数据
      const printData = data.url
      const isFirefox = navigator.userAgent.indexOf('Firefox') > -1 // 是否是火狐
      console.log(3333, printData)
      if (isFirefox) {
        window.open(printData, '_blank')
      } else {
        printJs(printData)
      }
      ElMessage({
        message: '获取打印数据成功',
        type: 'success',
      })
      return true
    }
    ElMessage({
      message: '获取打印数据失败，请稍后重试',
      type: 'error',
    })
    return false
  } catch (error) {
    return false
  }
}
// 确认打印
async function handleOk () {
  // ruleFormRef.value.validate((valid: boolean) => {
  //   console.log(valid, 'vv')
  // })
  // 获取选择模版的数据
  const { res: selectedTemplateData, templateObj } = await printTemplateSelect.value.getSelectedTemplate()
  if (selectedTemplateData && selectedTemplateData.length > 0) {
    printLoading.value = true
    let res = false
    if (formData.printType === 'local') {
      res = await localPrint(selectedTemplateData, templateObj)
    }
    if (formData.printType === 'web') {
      res = await webPrint(selectedTemplateData)
    }
    printLoading.value = false
    if (res) {
      dialogVisible.value = false
    }
  } else {
    ElMessage({
      message: '请选择服务商模版',
      type: 'warning',
    })
  }
}
let syncCount = 2
// 回传后端，更新数据状态
async function postPrintRes (params: PrintNamespace.PostPrintResAxios) {
  // console.log(params, 'print params')
  if (syncCount === 0) {
    ElMessage.error('更新订单打印状态失败')
    return
  }
  if (params && params.dataList && params.dataList.length) {
    syncCount--
    printOrderApi.postPrintRes(params).then(({ code, data }) => {
      if (code === '1') {
        ElMessage.success('更新数据成功')
        emit('updateTable')
      } else {
        setTimeout(() => {
          postPrintRes(params)
        }, 100)
      }
    }).catch(() => {
      setTimeout(() => {
        postPrintRes(params)
      }, 100)
    })
  }
}
interface PrintRes {
  status: string
  waybillCode: string
}
// 接收本地打印结果， 回传后端
const listenPrint = (message: string) => {
  console.log(message)
  try {
    const data = JSON.parse(message)
    const params = {
      dataList: [] as PrintRes[],
    }
    const printData = JSON.parse(localStorage.getItem(data.requestId) || '') || []
    console.log(printData, data, 'pp')
    // 全部打印成功
    if (data.code === '1000') {
      params.dataList = _.map(printData, item => ({
        status: 'success',
        waybillCode: item.billCodeValue,
      }))
      ElNotification({
        title: '打印成功',
        message: printData.length > 0 ? '全部打印成功' : '打印成功',
        duration: 0,
        type: 'success',
      })
    } else if (data.code === '1001') { // 部分成功
      // 打印失败数据
      const errData = _.get(data, 'detail.errors') || []
      console.log(errData, 'errData')
      params.dataList = _.map(printData, item => {
        // 判定当前数据是否在错误列表中
        const errStatus = _.find(errData, d => d.documentId === item.billCodeValue)
        return {
          status: errStatus ? 'failed' : 'success',
          waybillCode: item.billCodeValue,
        }
      })
      const noticeMessage = _.map(errData, d => {
        return `<p>运单号: ${d.documentId}<span class="ml">${d.message}</span></p>`
      })
      ElNotification({
        title: `打印结果 (打印${printData.length}条，失败${errData.length}条)`,
        dangerouslyUseHTMLString: true,
        message: noticeMessage.join(''),
        duration: 0,
        type: 'error',
      })
    } else {
      params.dataList = _.map(printData, item => ({
        status: 'failed',
        waybillCode: item.billCodeValue,
      }))
      ElNotification({
        title: '打印失败',
        message: data.message || '打印失败，请重启打印组件或电脑',
        duration: 0,
        type: 'error',
      })
    }
    postPrintRes(params)
  } catch (error) {
    console.log('打印回传数据出错：', error)
  }
}

onMounted(() => {
  printInstance.on('print-response', listenPrint)
})
onUnmounted(() => {
  printInstance.off('print-response', listenPrint)
})

</script>
<style lang="scss">
.print-order-dialog-comp {

}
</style>
