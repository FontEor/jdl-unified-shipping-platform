<script setup lang="ts">
import { ref, reactive } from 'vue'
import { FormData, AddressListData } from '../applyServer'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import serverExpressApi from '../../../api/serverExpress/index'
import { useRouter } from 'vue-router'
import setFocusApi from '@/api/setFocus/index'

const router = useRouter()

const ruleFormRef = ref<FormInstance>()
const checkType = ref(false)
const isDirectSales = ref('1')
const providerId = ref('')
const ruleForm = reactive<FormData>({
  customerName: '',
  senderAddressInfo: '',
  branchName: '',
  contactPersonName: '',
  contactPersonPhone: '',
  monthlyCode: '',
  providerLogoUrl: '',
  providerName: '',
  providerId: '',
  customerCode: '',
  branchCode: '',
  providerType: '',
  settlementCode: '',
  sendAddressId: 0,
})

const dialogData = reactive({
  datalist: {},
})

const addressOptions = reactive({
  list: [] as AddressListData[],
})

const branchOptions = reactive({
  list: [] as AddressListData[],
})

const rules = reactive<FormRules<FormData>>({
  providerId: [{ required: true, message: '', trigger: 'change' }],
  senderAddressInfo: [{ required: true, message: '请选择发货地', trigger: 'change' }],
  branchName: [{ required: true, message: '请选择网点', trigger: 'change' }],
  contactPersonName: [
    { required: true, message: '请输入联系人', trigger: 'change' },
    { max: 50, required: true, message: '最多输入50个字', trigger: 'change' },
  ],
  settlementCode: [
    { required: true, message: '请输入月结编码', trigger: 'change' },
  ],
  contactPersonPhone: [
    { required: true, message: '请输入手机号', trigger: 'change' },
    { pattern: /^[0-9]{11}$/, message: '请输入数字并且长度为11位', trigger: 'change' },
  ],
})

const centerDialogVisible = ref(false)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openDialog = (val: any) => {
  // 获取地址信息
  getSelectAddressInfo()
  isDirectSales.value = val.providerType
  centerDialogVisible.value = true
  dialogData.datalist = val
  // 赋值，提交接口会使用到的参数
  providerId.value = val.providerId
  ruleForm.providerId = val.providerId
  ruleForm.providerType = val.providerType
  ruleForm.providerLogoUrl = val.providerLogoUrl
  ruleForm.providerName = val.providerName
}

const emit = defineEmits(['submitCloseDialog'])

defineExpose({
  openDialog,
})

const submitData = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (!checkType.value) {
      ElMessage({
        showClose: false,
        message: '请阅读并勾选使用须知',
        type: 'warning',
      })
    } else {
      if (valid) {
        const params = {
          branchCode: ruleForm.branchCode, // 网点编码， providerType=2必传
          settlementCode: ruleForm.settlementCode, // 结算编码， providerType=1必传
          contactPersonName: ruleForm.contactPersonName, // 联系人姓名
          contactPersonPhone: ruleForm.contactPersonPhone, // 联系人电话
          providerId: ruleForm.providerId, // 服务商id
          providerType: isDirectSales.value, // 服务商经营类型：1 直营， 2 加盟
          sendAddressId: ruleForm.sendAddressId, // 唯一标识
        }
        // formEl.resetFields()
        const resData = await serverExpressApi.submitContractedApi(params)
        if (resData.code === '1') {
          ElMessage({
            showClose: false,
            message: '申请成功！',
            type: 'success',
          })
          emit('submitCloseDialog')
          centerDialogVisible.value = false
        } else {
          ElMessage({
            showClose: false,
            message: '申请失败！',
            type: 'error',
          })
        }
      } else {
        return false
      }
    }
  })
}

// 取消关闭弹框
const centerClick = () => {
  centerDialogVisible.value = false
}

const closeDialog = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  checkType.value = false
}

// 跳转管理我的发货地址页面
const gotoSetFocus = () => {
  router.push({ name: 'setFocus' })
}

// 跳转使用须知页面
const gotoNotice = () => {
  window.open(process.env.VUE_APP_APPLY_SERVER_NOTICE, '_blank')
}

// 选择发货地下拉获取选择网点接口
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const senderAddressChange = async (val: any) => {
  const addressArr = val.split('-')
  const activeAddressInfo = addressOptions.list.find(item => item.code === val) || ({} as AddressListData)
  ruleForm.contactPersonName = activeAddressInfo.senderName
  ruleForm.contactPersonPhone = activeAddressInfo.senderMobile

  // TODO----------------------------------------------测试数据------------------------------------
  // const aaa = '12-965-38364-1499'
  // const addressArr = aaa.split('-')

  // 赋值唯一标识id
  // ruleForm.sendAddressId = 13
  ruleForm.sendAddressId = addressArr[3]
  const params = {
    provinceId: Number(addressArr[0]), // 省id（京标）
    cityId: Number(addressArr[1]), // 市id（京标）
    countyId: Number(addressArr[2]), // 区县id（京标）
    townId: '', // 乡镇id（京标）
    providerId: Number(addressArr[4]), // 服务商id

    // TODO----------------------------------------------测试数据------------------------------------
    // providerId: 1499 // 服务商id
  }
  branchOptions.list = []
  const branchList = await serverExpressApi.queryBranchListApi(params)
  if (branchList.code === '1' && branchList.data) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, array-callback-return
    branchList.data.map((item: any) => {
      branchOptions.list.push({
        code: item.branchCode,
        name: item.branchName,
      })
    })
  }
}

// 选择网点下拉事件
// eslint-disable-next-line @typescript-eslint/no-explicit-any, array-callback-return
const chooseBranch = async (val: any) => {
  ruleForm.branchCode = val
}

// 获取选择发货地接口
const getSelectAddressInfo = async () => {
  addressOptions.list = []
  const params = {
    address: '',
    senderMobile: '',
    senderName: '',
  }
  const listData = await setFocusApi.querySenderSensitive(params)
  if (listData.code === '1' && listData?.data) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, array-callback-return
    listData?.data?.map((item: any) => {
      addressOptions.list.push({
        code: item.provinceId + '-' + item.cityId + '-' + item.countyId + '-' + item.id + '-' + providerId.value,
        name: `${item.provinceName}/${item.cityName}/${item.countyName}/${item.address}`,
        senderMobile: item.senderMobile,
        senderName: item.senderName,
      })
    })
  }
}
</script>

<script lang="ts">
export default {
  name: 'ApplyServerDialog',
}
</script>

<template>
  <div class="apply-server-provider">
    <el-dialog v-model="centerDialogVisible" title="开通服务商" width="800px" align-center class="dialog-content" @close="closeDialog(ruleFormRef)">
      <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" label-width="120px">
        <el-form-item label="服务商" prop="providerId">
          <img :src="ruleForm.providerLogoUrl" :alt="ruleForm.providerName" class="form-img">
        </el-form-item>
        <el-form-item label="选择发货地" prop="senderAddressInfo">
          <el-select v-model="ruleForm.senderAddressInfo" class="m-2" placeholder="请选择" style="width: 70%" @change="senderAddressChange">
            <el-option
              v-for="item in addressOptions.list"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
          <span class="span-senderAddressInfo" clstag="h|keycount|fahuo_1697704072400|9" @click="gotoSetFocus">管理我的发货地址</span>
        </el-form-item>
        <el-form-item label="选择网点" prop="branchName" v-if="isDirectSales === '2'">
          <el-select v-model="ruleForm.branchName" class="m-2" placeholder="请选择" style="width: 360px" @change="chooseBranch">
            <el-option
              v-for="item in branchOptions.list"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
          <span class="span-hint">提前联系网点，审批更快，发货更早</span>
        </el-form-item>
        <el-form-item label="月结编码" prop="settlementCode" v-else>
          <el-input v-model="ruleForm.settlementCode" style="width: 360px" placeholder="请输入" maxlength="50"/>
          <span class="span-hint">提前联系网点，审批更快，发货更早</span>
        </el-form-item>
        <el-form-item label="联系人" prop="contactPersonName">
          <el-input v-model.trim="ruleForm.contactPersonName" style="width: 30%" placeholder="请输入" maxlength="50"/>
          <span class="span-hint">请填写店铺的电子面单负责人</span>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPersonPhone">
          <el-input v-model="ruleForm.contactPersonPhone" style="width: 30%" placeholder="请输入" maxlength="11"/>
          <span class="span-hint">请务必准确填写，否则可能导致审核失败</span>
        </el-form-item>
      </el-form>
      <div label="" prop="checkType" class="checkbox-content">
        <el-checkbox v-model="checkType" />
        <span class="checkbox-span">我已阅读并同意<span class="span-click" @click="gotoNotice">
            使用须知</span> </span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerClick">取消</el-button>
          <el-button type="primary" clstag="h|keycount|fahuo_1697704072400|8" @click="submitData(ruleFormRef)">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>

.apply-server-provider {

  .dialog-content {
    .form-img {
      width: 122px;
      height: 44px;
      border: 1px solid var(--s-black-1);
    }
    .span-senderAddressInfo {
      color: var(--s-blue-6);
      margin-left: 8px;
      cursor: pointer;
      font-size: 12px;
    }

    .span-hint {
      color: #bbbfc9;
      margin-left: 8px;
      font-size: 12px;
    }

    .checkbox-span {
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: normal;
      color: var(--s-black-6);
      margin-left: 8px;

      .span-click {
        color: var(--s-blue-6);
        cursor: pointer;
        font-size: 14px;
      }
    }

    .checkbox-content {
      margin-left: 118px;
    }
  }

  :deep(.el-checkbox) {
    margin-right: 0px
  }

  :deep(.el-dialog.is-align-center) {
    border-radius: 10px;
  }
}
</style>
