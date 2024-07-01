<template>
  <div class="print-select-comp">
    <el-form-item label="打印类型" prop="printType">
      <el-radio-group v-model="printType" @change="handleChange" >
        <el-radio label="local" :disabled="!isWin" :clstag="localPrinting">本地打印</el-radio>
        <el-radio label="web" class="web-radio" :clstag="webPrinting">网页打印</el-radio>
        <IconAndTip content="无需下载打印插件，windows和mac都支持，可快速打印。"></IconAndTip>
      </el-radio-group>
      <span class="isWin-tooltip" v-if="!isWin">仅windows电脑可以本地打印</span>
      <div class="tips mt-10" v-if="localPrint">
        <template v-if="printAvailable">
          <span class="content mr">遇到打印问题，可查看<a class="ml" href="https://cloud.jdl.com/#/open-business-document/access-guide/157/53983" target="_blank">打印组件安装指南</a></span>
        </template>
        <template v-else>
          <span class="icon"></span>
          <span class="content mr" >
            本地打印需安装打印插件，您还未安装或未开启，请先去
            <a href="https://ydy-app-download.s3.cn-north-1.jdcloud-oss.com/3.0/prod/setup.exe" target="_blank">安装插件</a>或<a href="jdprint://" target="_blank">启动插件</a>
          </span>
          <a class="" href="https://cloud.jdl.com/#/open-business-document/access-guide/157/53983" target="_blank">打印组件安装指南</a>
          <a @click="onLink" class="ml">完成后点此刷新</a>
        </template>
      </div>
    </el-form-item>
      <el-form-item label="选择打印机" v-if="localPrint" prop="printer">
        <el-select v-model="printName" @change="onPrintChange" placeholder="请选择">
          <el-option
            v-for="item in printList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
  </div>
</template>
<script lang='ts' setup>
import { useAttrs, ref, computed, onMounted, onUnmounted } from 'vue'
import { getSysEnv } from '@/utils/common'
import printInstance from './print'
import IconAndTip from '@/components/Tip/IconAndTip.vue'

const props = defineProps({
  localPrinting: {
    type: String,
    default: () => '',
  },
  webPrinting: {
    type: String,
    default: () => '',
  },
})

const attrs = useAttrs()
const emit = defineEmits(['change'])

const sysEnv = getSysEnv()
// 是否是windows环境
const isWin = ref<boolean>(sysEnv === 'Windows')
// 打印类型
const printType = ref<string>(isWin.value ? 'local' : 'web')
const localPrint = computed<boolean>(() => printType.value === 'local')
// 打印机名称及列表
const printName = ref<string>('')
const printList = ref<string[]>([])

// 本地打印机是否可用
const printAvailable = ref(false)

// 打印类型或名称变更，通知父组件
const handleChange = () => {
  emit('change', { printType: printType.value, printName: printName.value })
}

// 重新链接打印机
const onLink = () => {
  printInstance.connect(process.env.VUE_APP_PRINT_SOCKET_URL)
}
const onPrintChange = () => {
  printInstance.setPrintName(printName.value)
  handleChange()
}
const setPrintName = (name: string) => {
  printName.value = name
  handleChange()
}
const listenPrintList = (list: string[]) => {
  printAvailable.value = true
  printList.value = list
}

onMounted(() => {
  // windows环境下链接打印机 ws:
  if (isWin.value) {
    onLink()
  }
  printInstance.on('print-list-res', listenPrintList)
  printInstance.on('set-print-name', setPrintName)
})
onUnmounted(() => {
  printInstance.off('print-list-res', listenPrintList)
  printInstance.off('set-print-name', setPrintName)
})

// 初始化抛出当前打印机类型
handleChange()
</script>
<style lang="scss" scoped>
.print-select-comp {
  .tips {
    color: $font-color-light;
    font-size: 12px;
    line-height: 17px;
  }
  .isWin-tooltip{
    padding-left: 8px;
    height: 17px;
    line-height: 17px;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: normal;
    color: rgba(134,141,159,1);
  }
}
.web-radio {
  margin-right: 10px;
}
</style>
