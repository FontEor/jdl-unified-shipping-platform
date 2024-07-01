<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { order } from './setFocusIndex'
import setFocusApi from '@/api/setFocus/index'
import ViewEyes from '@/components/Eyes/ViewEye.vue'
import { ElMessage } from 'element-plus'
import globalApi from '@/api/global'
import _ from 'lodash'

interface Props {
  addressInfo?: string,
  dialogFormVisible: boolean,
  addoredit: string,
  form: object
}
const loading = ref<boolean>(false)
const props = defineProps<Props>()
const emit = defineEmits(['updateStatus', 'updateAddorEdit', 'setForm'])

console.log(props.dialogFormVisible, 'props')
const tableData:any = reactive({
  list: [],
})

const key = ref()
const getData = () => {
  loading.value = true
  const params = {
    address: '',
    senderMobile: '',
    senderName: '',
  }
  setFocusApi.getQuerySender(params).then(({ code, data }) => {
    if (code === '1') {
      key.value++
      tableData.list = data
    }
  }).catch((error) => {
    ElMessage.error(error)
  }).finally(() => {
    loading.value = false
  })
}
const getPlainText = (id: number, type: string) => {
  return async () => {
    return await globalApi.ciphertextApi('/api/sender/getSensitiveInfo', { senderIdEncrypt: id, type })
  }
}
const formatPlainResponse = (type: string, record?: any) => {
  return (data: Record<string, string>) => {
    if (type === 'address') {
      const { provinceName, cityName, countyName } = record && record.row
      return provinceName + cityName + countyName + _.get(data, `data.${type}`)
    } else {
      return _.get(data, `data.${type}`)
    }
  }
}
onMounted(() => {
  getData()
})

// 删除
const getDelete = (record: {row: {id: string}}) => {
  console.log(record)
  loading.value = true
  setFocusApi.getDeleteSender({ senderIdEncrypt: record.row?.id }).then(res => {
    if (res.code === '1') {
      ElMessage.success('删除成功')
      getData()
    } else {
      ElMessage.error(res.message)
    }
  }).catch(error => {
    ElMessage.error(error)
  }).finally(() => {
    loading.value = false
  })
}
// 设为默认
const getSetDefault = (record: {row: {id: string}}) => {
  // console.log(record)
  loading.value = true
  setFocusApi.getDefaultSender({ senderIdEncrypt: record.row?.id }).then((res) => {
    if (res.code === '1') {
      ElMessage.success('设为默认地址成功')
      getData()
    } else {
      ElMessage.error(res.message)
    }
  }).catch(error => {
    ElMessage.error(error)
  }).finally(() => {
    loading.value = false
  })
}

// 新增or编辑
const getAddOrEdit = (record: {row: {id: string}}, type: string) => {
  emit('updateStatus', true)
  if (type === 'edit') {
    emit('updateAddorEdit', 'edit', record.row?.id)
    setFocusApi.getSenderInfo({ senderIdEncrypt: record.row?.id }).then(res => {
      if (res.code === '1') {
        const data = res.data
        const objes: any = [data.provinceName + '-' + data.provinceId, data.cityName + '-' + data.cityId, data.countyName + '-' + data.countyId]
        const obj = {
          address: objes,
          detailaddress: data.address,
          senderName: data.senderName,
          senderMobile: data.senderMobile,
          senderPhone: data.senderPhone,
        }
        emit('setForm', obj)
      } else {
        ElMessage.error(res.message)
      }
    })
  } else {
    emit('updateAddorEdit', 'add')
  }
}
defineExpose({
  getData,
})
</script>

<script lang="ts">

export default {
  name: 'TableIndex',
}
</script>

<template>
   <el-button type="primary" clstag="h|keycount|fahuo_1697704072400|1" style="margin-bottom: 8px;" @click="getAddOrEdit({row: {id: ''}},'add')">新增发货地址</el-button>
   <el-table
        :data="tableData.list"
        v-loading="loading"
        :header-cell-style="{'background': '#f5f5f5'}"
        show-overflow-tooltip
        empty-text="暂无数据"
        :key="key"
      >
        <el-table-column  label="发货人" property="senderName" min-width="120">
          <template #default="record">
            <ViewEyes
              :cipherText="record.row.senderName"
              :getPlainText="getPlainText(record.row.id, 'name')"
              :formatPlainResponse="formatPlainResponse('senderName', )"
            />
          </template>
        </el-table-column>
        <el-table-column  label="发货人手机号" property="senderMobile" min-width="100">
          <template #default="record">
            <ViewEyes
              :cipherText="record.row.senderMobile"
              :getPlainText="getPlainText(record.row.id, 'mobile')"
              :formatPlainResponse="formatPlainResponse('senderMobile')"
            />
          </template>
        </el-table-column>
        <el-table-column label="固定电话" property="senderPhone" min-width="100">
          <template #default="record">
            <ViewEyes
              :cipherText="record.row.senderPhone"
              :getPlainText="getPlainText(record.row.id, 'phone')"
              :formatPlainResponse="formatPlainResponse('senderPhone')"
            />
          </template>
        </el-table-column>
        <el-table-column label="发货地址" property="address" min-width="240">
          <template #default="record">
            <div style="display: flex;">
              <ViewEyes
                :cipherText="record.row?.provinceName + record.row?.cityName + record.row?.countyName + record.row?.address"
                :getPlainText="getPlainText(record.row.id, 'address')"
                :formatPlainResponse="formatPlainResponse('address', record)"
              />
              <span v-if="record.row.defaultAddress !== 0" class="default-address">默认发货地址</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" property="" fixed="right" width="290">
          <template #default="record">
            <el-button link type="primary" clstag="h|keycount|fahuo_1697704072400|2" size="small" @click="getAddOrEdit(record, 'edit')">编辑</el-button>
            <el-popconfirm title="你确定要删除吗？" width="192" @confirm="getDelete(record)">
              <template #reference>
                <el-button link type="primary" clstag="h|keycount|fahuo_1697704072400|3" size="small">删除</el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm title="你确定要修改吗？" width="192" @confirm="getSetDefault(record)">
              <template #reference>
                <el-button v-if="record.row.defaultAddress === 0"  clstag="h|keycount|fahuo_1697704072400|4" link type="primary" size="small" >设为默认发货地址</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
       <div class="total-style">共 {{ tableData?.list?.length}} 条记录</div>
</template>

<style scoped>
.default-address {
  display: inline-block;
  background-color: #fff1e5;
  color: #ff7d0c;
  border-radius: 20px;
  padding: 4px 8px
}
.total-style{
  margin-top: 20px;
  color: #868d9f
}
</style>
