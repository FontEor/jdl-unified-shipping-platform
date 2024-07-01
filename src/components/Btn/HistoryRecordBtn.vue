<template>
  <div>
    <el-button @click="handleOpenHistoryList" :clstag="clstagBtn">上传历史</el-button>
    <el-dialog v-model="dialogTableVisible" class="history-record-comp" :title="props.title">
      <ul v-loading="loading" class="dialog-content f-size-xs">
        <li
          class="mb-20"
          v-for="item in uploadHistoryList"
          :key="item.sourceKey"
        >
          <p class="jcbox mb-xs">
            <span class="f-size title">{{ item.sourceFileName }}</span>
            <span>{{
              dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
            }}</span>
          </p>
          <p class="res-content">
            <span :class="['mr-14', getTaskObj(item.taskStatus).className]">{{getTaskObj(item.taskStatus).label}}</span>
            <span class="mr-sm"
              >成功{{ toThousand(item.resultSuccessCount) }}条，</span
            >
            <span class="mr-sm"
              >失败{{ toThousand(item.resultFailedCount) }}条</span
            >
            <a :href="downloadUrl+item.resultKey" download v-if="item.resultFailedCount" :clstag="clstagDownLoad">
              <i class="ux-icon-download1"></i>
              下载失败列表
            </a>
          </p>
        </li>
      </ul>
      <p v-if="!(uploadHistoryList && uploadHistoryList.length)" class="vbox cbox no-data-content">暂无上传历史</p>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, Ref, ref } from 'vue'
import deliveryByOrderApi from '@/api/deliveryByOrder/index'
import dayjs from 'dayjs'
import _ from 'lodash'
import { toThousand } from '@/utils/common'
import { DeliveryByOrder } from '@/interfaces/deliveryByOrder'

const props = defineProps({
  title: {
    type: String,
    default: '上传历史（最近10条）',
  },
  clstagBtn: String,
  clstagDownLoad: String,
})
const downloadUrl = process.env.VUE_APP_API_PREFIX + '/api/oss/downloadFile/'
const dialogTableVisible = ref(false)
const uploadHistoryList = ref<DeliveryByOrder.IUploadHistoryItem[]>()
const loading = ref(false)
const getUploadHistoryList = async () => {
  loading.value = true
  const data = { taskTypeCode: 1 }
  try {
    const response = await deliveryByOrderApi.getUploadHistoryList(data)
    uploadHistoryList.value = response.data
    loading.value = false
  } catch (err) {
    loading.value = false
  }
}
const handleOpenHistoryList = () => {
  dialogTableVisible.value = true
  getUploadHistoryList()
}

interface TaskObjData {
  label: string
  className: string
  status: string
}

const TASKDATA: TaskObjData[] = [
  { label: '解析中', className: 'c-primary', status: 'PROCESSING' },
  { label: '解析成功', className: 'c-success', status: 'SUCCESS' },
  { label: '待解析', className: 'c-info', status: 'CREATED' },
  { label: '解析失败', className: 'c-danger', status: 'FAILED' },
]
function getTaskObj (status: string):TaskObjData {
  const task = _.find(TASKDATA, item => item.status === status) || ({} as TaskObjData)
  return task
}
</script>
<style scoped lang="scss">
.history-record-comp {
  .title {
    color: var(--f-light-primary);
  }
  .dialog-content {
    color: var(--s-text-color-3);
  }
  .res-content {
    display: flex;
    align-items: center
  }
  .no-data-content {
    min-height: 200px;
  }
}
</style>
