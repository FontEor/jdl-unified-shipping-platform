<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadRawFile, UploadFile } from 'element-plus'

const uploadRef = ref()
type beforeUpload = (rawFile: UploadRawFile) => boolean
const props = withDefaults(defineProps<{
  title?: string
  templateUrl: string,
  uploadUrl: string,
  beforeUpload: beforeUpload,
  accept?: string,
  tipContent?: string,
  clstagBtn: string,
  clstagDownLoad: string
}>(), {
  title: '批量上传',
  uploadUrl: '',
  templateUrl: '',
  beforeUpload: () => { return true },
  accept: '',
  tipContent: '',
  clstagBtn: '',
  clstagDownLoad: '',
})

const uploadUrl = process.env.VUE_APP_API_PREFIX + props.uploadUrl
const dialogVisible = ref(false)
const downloadTemplateUrl = process.env.VUE_APP_API_PREFIX + props.templateUrl
const emit = defineEmits(['updateTable'])

function handleSuccess (res: any, uploadFile: UploadFile) {
  console.log(res, uploadFile, 'success')
  if (res.code === '1') {
    dialogVisible.value = false
    ElMessage.success('导入成功，正在解析中，请稍后在【上传历史】中查看上传结果，刷新页面查看。')
    emit('updateTable')
  } else {
    ElMessage.error(res.message || '上传失败')
    uploadRef.value.clearFiles()
  }
}
function handleError () {
  ElMessage.error('上传失败，请稍后重试')
}
watch(() => dialogVisible.value, (newValue) => {
  if (newValue && uploadRef.value) {
    uploadRef.value.clearFiles()
  }
})
</script>

<template>
  <div class="batch-entry">
    <el-button type="primary" :clstag="clstagBtn" @click="() => { dialogVisible = true }"><slot>批量导入</slot></el-button>
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      :width="448"
    >
      <el-upload
        drag
        :accept="accept"
        :action="uploadUrl"
        :before-upload="beforeUpload"
        :limit="1"
        :on-success="handleSuccess"
        :on-error="handleError"
        ref="uploadRef"
        >
        <span class="ux-icon-upload-empty"></span>
        <div class="text-style tips-text">点击或者将文件拖拽到此处进行上传</div>
      </el-upload>
      <div class="text-style">{{tipContent}}</div>
      <div class="download-style">
        <span class="ux-icon-download1"></span>
        <a :clstag="clstagDownLoad" target="_blank" download :href="downloadTemplateUrl">下载模版</a>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.batch-entry {
  display: inline-block;
  .text-style {
    color: $black-light;
  }
  :deep(.el-upload-dragger) {
    background: $grey;
  }
  .ux-icon-upload-empty {
    font-size: $mw-xl;
    color: $primary-color;
  }
  .tips-text {
    font-size: $mw;
  }
  .download-style {
    padding-top: $mw;
    color: $primary-color;
    font-size: $font-size-default;
  }
}
</style>
