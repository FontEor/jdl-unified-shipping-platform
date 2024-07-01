
<script setup lang="ts">
import { ref } from 'vue'

const isShowDialog = ref(false)

const showDialog = () => {
  isShowDialog.value = true
}

defineExpose({
  showDialog,
})

</script>

<script lang="ts">
export default {
  name: 'CustomerDialog',
}
</script>

<template>
  <div class="phone-dialig">
    <el-dialog  v-model="isShowDialog" :align-center="true" width="440px">
    <div>请拨打京东物流客服电话：950616</div>
    <template #footer>
      <el-button type="primary" @click="isShowDialog = false" clstag="h|keycount|isv_1697703741586|8">确定</el-button>
    </template>
  </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.phone-dialig {
  :deep() {
    .el-dialog .el-dialog__header {
      border: none
    }
    .el-dialog .el-dialog__body {
      padding:20px 24px 32px 24px;
    }
  }
}
</style>
