<script setup lang="ts">
import { ref } from 'vue'
import billsApi from '@/api/bills/billIndex'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'

// const emit = defineEmits(['refreshList'])
const route = useRoute()

const isShowDialog = ref(false)
const isWarning = ref(false)
const isDanger = ref(false)
const isCommit = ref(false)
const isWill = ref(true)
const moneyTotal = ref<number>(0)
const payData = ref([])
const wayCode = ref('')
const total = ref(0)

const showDialog = (data: [], money: number, row: any, length: number) => {
  console.log(row, 'row')
  console.log(length, 'length')
  if (!Object.keys(row).length) {
    isWill.value = false
  } else {
    isWill.value = true
  }
  isShowDialog.value = true
  isWarning.value = true
  moneyTotal.value = money
  payData.value = data
  wayCode.value = row ? row.waybillCode : undefined
  if (length) total.value = length
}

const closeDialog = () => {
  isShowDialog.value = false
  isWarning.value = false
  isDanger.value = false
  isCommit.value = false
  isWill.value = true
}

const commitPay = () => {
  isCommit.value = true
  const data = {
    channelNo: route.query.channelNo as string,
    customerId: route.query.customerId as string,
    platformBusinessSource: route.query.platformBusinessSource as string,
    orderInfoDTOList: payData.value,
    shipperId: route.query.shipperId as string,
  }
  billsApi.billPay(data).then(res => {
    if (res.code === '1') {
      ElMessage.success('扣款中，请稍后刷新页面查看扣款结果')
    }
    closeDialog()
    // emit('refreshList')
  })
}

defineExpose({
  showDialog,
})

</script>

<script lang="ts">
export default {
  name: 'PayDialog',
}
</script>

<template>
  <div class="pay-dialog">
    <el-dialog
      :align-center="true"
      width="560px"
      v-model="isShowDialog"
    >
      <div class="tips-icon">
        <img v-show="isWarning" src="@/assets/images/server/warning.png" width="32" height="32" alt="">
        <img v-show="isDanger" src="@/assets/images/server/danger.png" width="32" height="32" alt="">
        <div class="pay-num" v-if="isWill">运单金额<span class="money"> {{ moneyTotal }}元</span>，确定支付？</div>
        <div class="pay-num" v-else>运单金额共计<span class="money"> {{ moneyTotal }}元</span>，确定支付？</div>
        <div class="order-num" v-if="isWill">运单号：{{wayCode}}</div>
        <div class="order-num" v-else>支付运单总数：{{total}} 单</div>
      </div>
      <template #footer>
        <el-button type="primary" :loading="isCommit" clstag="h|keycount|isv_1697703741586|7" @click="commitPay">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.pay-dialog {
  :deep() {
    .el-dialog .el-dialog__header {
      border: none
    }
    .el-dialog .el-dialog__body {
      padding:20px 24px 32px 24px;
    }
  }
  .tips-icon {
    text-align: center;
    img {
      margin: 0 auto;
      display: block;
    }
    .pay-num {
      font-size: 16px;
      font-weight: 600;
      color: #23252B;
      padding: 10px 0;
      .money {
        color: #FF7700;
      }
    }
    .order-num {
      color: #868D9F;
    }
  }
}
</style>
