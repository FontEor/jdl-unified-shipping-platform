<template>
  <div class="print-template-select-comp">
    <el-form
      ref="formRef"
      label-width="120px"
      :model="formData"
      >
      <template v-for="(item, index) in formData.providerData" :key="item.providerCode">
        <el-form-item label="物流公司">
          {{item.providerName}}
        </el-form-item>
        <el-form-item
          label="模版尺寸"
          :prop="'providerData.' + index + '.templateSelectSize'"
          :rules="{
            required: true,
            message: '请选择模版尺寸',
            trigger: 'blur',
          }"
          >
          <el-select v-model="item.templateSelectSize" @change="((value: string)=>{handleChange(index, value)})" required placeholder="请选择">
            <el-option
              v-for="template in item.templateList"
              :key="template.code"
              :label="template.name"
              :value="template.code"
            />
          </el-select>
          <div class="image-content" @click="handlePreview(item.templateSelectInfo?.previewUrl)" v-if="item.templateSelectInfo?.previewUrl" :clstag="previewClstag">
            <el-image class="image-content-image" :src="item.templateSelectInfo?.previewUrl"></el-image>
            <span class="image-content-font">模版预览</span>
          </div>
        </el-form-item>
      </template>
    </el-form>
    <el-dialog v-model="dialogTableVisible">
      <el-image class="image-content-image-preview" :src="templateSelectInfoPreviewUrl"></el-image>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, watchEffect, reactive } from 'vue'
import printOrderApi from '@/api/deliveryByOrder/print'
import { PrintNamespace } from '@/interfaces/print'
import { ElMessage } from 'element-plus'
import { uniq } from '@/utils/common'
import _ from 'lodash'
import { Provider } from '../provider'

const formRef = ref()
const props = defineProps<{
  data?: Provider.ProviderInfo[],
  previewClstag: string
}>()

const dialogTableVisible = ref(false)
const templateSelectInfoPreviewUrl = ref()
const formData = reactive({
  providerData: [] as Provider.ProviderList,
})
watchEffect(async () => {
  const { data: providers } = props
  if (providers && providers.length) {
    const providersData = uniq(_.map(providers, item => ({
      providerCode: item.providerCode,
      providerName: item.providerName,
    })), 'providerCode')
    console.log(providersData, 'providersData')
    try {
      const params: PrintNamespace.ProviderTemplateListAxios = providersData
      const { code, data } = await printOrderApi.getTemplateList(params)
      if (code === '1') {
        const templateObj: any = {}
        _.forEach(data, element => {
          templateObj[element.providerCode] = element
        })
        const providerData:Provider.ProviderList = []
        providersData.forEach(provider => {
          const item = templateObj[provider.providerCode]
          providerData.push({
            providerCode: provider.providerCode,
            providerName: provider.providerName,
            templateList: item.waybillPrintTemplateVOList,
            templateSelectSize: _.get(item, 'waybillPrintTemplateVOList[0].code'),
            templateSelectInfo: _.get(item, 'waybillPrintTemplateVOList[0]'),
          })
        })
        formData.providerData = providerData
      }
    } catch (error) {
      formData.providerData = []
    }
  }
})

const handleChange = (index: number, value: string) => {
  const result = formData.providerData[index].templateList.find((obj) => {
    return obj.code === value
  })
  formData.providerData[index].templateSelectInfo = result as PrintNamespace.TemplateInfo
}

const handlePreview = (url: string) => {
  dialogTableVisible.value = true
  templateSelectInfoPreviewUrl.value = url
}
type GetSelectedTemplate = () => Promise<object | { res: PrintNamespace.PrintParams[], templateObj: Provider.TemplateObj}>
// 处理数据
const getSelectedTemplate: GetSelectedTemplate = async () => {
  try {
    const valid = await formRef.value.validate()
    if (!valid) {
      return {}
    }
    const templateObj: any = {}
    _.forEach(formData.providerData, element => {
      templateObj[element.providerCode] = element
    })
    const { data: providers } = props
    let flag = false
    const res = _.map(providers, provider => {
      const item = templateObj[provider.providerCode] || {}
      if (!item.templateSelectSize) {
        flag = true
      }
      return {
        ussOrderNo: provider.ussOrderNo,
        waybillCode: provider.waybillCode,
        templateCode: item.templateSelectSize,
      }
    })
    if (flag) {
      ElMessage({
        message: '服务商模版数据异常',
        type: 'error',
      })
      return {}
    }
    return { res, templateObj }
  } catch (error) {
    return {}
  }
}
defineExpose({
  getSelectedTemplate,
})

</script>
<style lang="scss" scoped>
.print-template-select-comp {
  .image-content{
    display: flex;
    align-items: center;
    width: 94px;
    height: 32px;
    line-height: 32px;
    margin-left: 2px;
    background: rgba(246,246,248,1);
    border-radius: 8px;
    .image-content-image{
      width: 24px;
      height: 24px;
      margin-left: 8px;
      background: rgba(255,255,255,1);
      border-radius: 2px;
      box-shadow:  0 0 2px 0 rgba(186,190,199,1);
    }
    .image-content-font{
      width: 70px;
      height: 20px;
      line-height: 20px;
      padding-left: 4px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: normal;
      color: rgba(60,110,240,1);
    }
    .image-content-image-preview{
      width: 450px;
      height: 388px;
    }
  }
  ::v-deep .el-dialog{
    width:450px;
  }
  ::v-deep .el-overlay{
    background: rgba(0,0,0,0.8);
  }
  ::v-deep .el-dialog__body{
    padding: 0;
    padding-bottom: 31px;
  }
  ::v-deep .el-dialog .el-dialog__header{
    padding: 5px 0 5px 24px;
    border: none;
  }
  ::v-deep .el-dialog__headerbtn{
    width:24px;
  }
}
</style>
