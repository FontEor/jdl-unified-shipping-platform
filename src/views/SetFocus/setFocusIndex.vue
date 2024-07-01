<script lang="ts" setup>
import { FormRules } from 'element-plus/es/components/form/src/types'
import { RuleForm, createparams, order, optiones, editparams } from './setFocusIndex'
import { ref, reactive, watchEffect, nextTick } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import setFocusApi from '@/api/setFocus/index'
import TableIndex from './tableIndex.vue'
import type { CascaderProps } from 'element-plus'

const addoredit = ref<string>('add')
const tableref = ref<any>()
const cascader = reactive({})
const formref = ref<FormInstance>()
const editid = ref<number>()
const options = reactive<optiones>({
  list: [],
})
const dialogFormVisible = ref<boolean>(false)
const form = reactive({
  senderName: '',
  address: ref<any>(),
  detailaddress: '',
  senderMobile: '',
  senderPhone: '',
})
const rules = reactive<FormRules<RuleForm>>({
  senderName: [
    { required: true, message: '请填写名字', trigger: 'blur' },
    { max: 50, message: '名字不得超过50字符', trigger: 'change' },
  ],
  senderMobile: [
    { required: true, message: '请填写手机号', trigger: 'blur' },
    { pattern: /^[0-9]{11}$/, message: '请输入数字并且长度为11位', trigger: 'change' },
  ],
  address: [
    { required: true, message: '请填写发货地址', trigger: 'blur' },
  ],
  detailaddress: [
    { required: true, message: '请填写详细地址', trigger: 'blur' },
    { max: 60, message: '详细地址不得超过60字符', trigger: 'blur' },
  ],
  senderPhone: [
    { max: 20, message: '固定电话最多20位', trigger: 'change' },
  ],
})

// 新增确认
const getAdd = (formref: FormInstance | undefined) => {
  formref?.validate((valid, fields) => {
    if (valid) {
      console.log(valid, form.address, 'form')
      const provinceId = Number(form.address['0'].split('-')[1])
      const provinceName = form.address['0'].split('-')[0]
      const cityId = Number(form.address['1'].split('-')[1])
      const cityName = form.address['1'].split('-')[0]
      const countyId = Number(form.address['2'].split('-')[1])
      const countyName = form.address['2'].split('-')[0]
      if (addoredit.value === 'add') {
      // 接口
        const createparams: createparams = {
          address: form.detailaddress,
          cityId,
          cityName,
          countyId,
          countyName,
          provinceId,
          provinceName,
          senderMobile: form.senderMobile,
          senderName: form.senderName,
          senderPhone: form.senderPhone,
        }
        setFocusApi.getCreateSender(createparams).then((res) => {
          if (res.code === '1') {
            ElMessage.success('新增成功')
            tableref.value.getData()
            dialogFormVisible.value = false
          } else {
            ElMessage.error(res.message)
          }
        })
      } else {
        const editparams: editparams = {
          address: form.detailaddress,
          cityName,
          cityId,
          countyName,
          countyId,
          provinceName,
          provinceId,
          senderMobile: form.senderMobile,
          senderName: form.senderName,
          senderPhone: form.senderPhone,
          senderIdEncrypt: editid.value,
        }
        setFocusApi.getModifySender(editparams).then((res) => {
          if (res.code === '1') {
            ElMessage.success('编辑成功')
            tableref.value.getData()
            dialogFormVisible.value = false
          } else {
            ElMessage.error(res.message)
          }
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

watchEffect(() => {
  if (!dialogFormVisible.value) {
    options.list = []
  }
})

const beforclose = (formref: FormInstance | undefined) => {
  if (!formref) return
  formref.resetFields()
}
const updateDialogFormVisible = (newStatus: boolean) => {
  dialogFormVisible.value = newStatus
}
const updateAddorEdit = (newStatus: string, id: number) => {
  addoredit.value = newStatus
  editid.value = id
}
// 点击编辑回显
const setForm = (data: order) => {
  form.address = data.address
  form.detailaddress = data.detailaddress
  form.senderMobile = data.senderMobile
  form.senderPhone = data.senderPhone
  form.senderName = data.senderName
}
// 选择省市区
const props: CascaderProps = {
  lazy: true,
  lazyLoad (node, resolve) {
    const { level } = node
    const valuecode = Number((node.value as string)?.split('-')[1])
    setFocusApi.getJgList({ parentAddressCode: (valuecode && valuecode) || 4744 }).then(res => {
      if (res.code === '1') {
        const arr: { label: string; value: string, leaf: boolean}[] = []
        res.data.map((item: { districtName: string; districtCode: string}) => {
          return arr.push({
            label: item?.districtName,
            value: item?.districtName + '-' + item?.districtCode,
            leaf: level >= 2,
          })
        })
        resolve(arr)
      }
    })
  },
}
</script>

<template>
  <div class='setfocus'>
    <div class="setfocus-content">
      <div class="content-style table-list">
      <TableIndex
        ref="tableref"
        :dialogFormVisible="dialogFormVisible"
        :addoredit="addoredit"
        :form="form"
        @updateStatus="updateDialogFormVisible"
        @updateAddorEdit="updateAddorEdit"
        @setForm="setForm"
      />
    </div>
    </div>
    <el-dialog v-model="dialogFormVisible"  :title="addoredit === 'add' ? '新增发货地址' : '编辑发货地址'" align-center style="width: 648px" @close="beforclose(formref)">
    <el-form :model="form" :rules="rules" label-width="120px" ref="formref">
      <el-form-item label="发货地址" prop="address">
        <el-cascader ref="cascader" placeholder="请选择" style="width:318px" v-model="form.address" :props="props"  :options="options.list" />
      </el-form-item>
      <el-form-item label="详细地址" prop="detailaddress">
        <el-input placeholder="请输入" style="width:452px" v-model="form.detailaddress" maxlength="60"/>
      </el-form-item>
      <el-form-item label="联系人姓名" prop="senderName">
        <el-input placeholder="请输入" style="width:242px" v-model="form.senderName" maxlength="50" />
      </el-form-item>
      <el-form-item label="手机号" prop="senderMobile" >
        <el-input placeholder="请输入" style="width:242px" v-model="form.senderMobile" maxlength="11" minlength="11"/>
      </el-form-item>
      <el-form-item label="固定电话" prop="senderPhone" >
        <el-input placeholder="请输入" style="width:242px" v-model="form.senderPhone" maxlength="20" minlength="20"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="getAdd(formref)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import './setFocusStyle';

.reset-button {
  margin-right: 12px;
}

</style>
