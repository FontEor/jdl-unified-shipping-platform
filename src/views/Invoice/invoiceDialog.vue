<script setup lang="ts">
import { ref, nextTick } from 'vue'
import TimeLine from './components/timeLine.vue'
import QRCodeImg from '../accredit/components/QRCodeImg.vue'

const dialogVisible = ref(false)
const qrCode = ref('https://logistics-mrd.jd.com/invoice?targetPageType=h5&targetPageHref=https%3A%2F%2Flogistics-mrd.jd.com%2Finvoice%2Findex.html%3Fsource%3DmrdWeChatApp%26businessType%3D14%26t%3D1692081015865%23%2Fapplication') // 二维码地址url 固定的url
const qrCodeRef = ref()

const activities = [
  {
    content: '微信扫码进入「京东快递」小程序，进入「开具发票」页',
    timestamp: '微信扫码打开小程序',
  },
  {
    content: '业务类型选择：商城业务',
    timestamp: '选择业务类型',
  },
  {
    content: '选择对应订单，点击「申请开票」',
    timestamp: '申请开票',
  },
]

const informRefresh = () => {
  // // 重新获取二维码，如果失败就一直获取
  qrCode.value = 'https://logistics-mrd.jd.com/invoice?targetPageType=h5&targetPageHref=https%3A%2F%2Flogistics-mrd.jd.com%2Finvoice%2Findex.html%3Fsource%3DmrdWeChatApp%26businessType%3D14%26t%3D1692081015865%23%2Fapplication'
  qrCodeRef.value.closeLoadingStatus()
}

const openDialog = () => {
  dialogVisible.value = true
  nextTick(() => { // 要放在对响应式数据修改之后
    qrCodeRef.value.propsValue('https://logistics-mrd.jd.com/invoice?targetPageType=h5&targetPageHref=https%3A%2F%2Flogistics-mrd.jd.com%2Finvoice%2Findex.html%3Fsource%3DmrdWeChatApp%26businessType%3D14%26t%3D1692081015865%23%2Fapplication')
  })
}

const handleClose = () => {
  dialogVisible.value = false
}

const cancelDialog = () => {
  dialogVisible.value = false
}

</script>

<script lang="ts">
export default {
  name: 'InvoiceDialog',
}
</script>

<template>
  <div class="invoice-page">
    <el-button @click="openDialog" type="primary" clstag="h|keycount|isv_1697703741586|11">开发票</el-button>
    <el-dialog
      v-model="dialogVisible"
      width="800px"
      :before-close="handleClose"
      destroy-on-close
      style="border-radius: 10px;"
    >
      <template #header>
        <span class="dialog-header-title">开发票</span>
      </template>
      <div class="dialog-content">
        <div class="content-top">请扫描下方二维码开票</div>
        <div class="content-center">此单由京东物流提供开票服务</div>
        <div class="content-bottom">
          <div class="bottom-box">
            <div class="QR-code-box">
              <QRCodeImg ref="qrCodeRef" class="QR-img" @informRefresh="informRefresh"></QRCodeImg>
              <span>请使用微信扫码</span>
            </div>
            <TimeLine :activities="activities"></TimeLine>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDialog" type="primary">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
@import '../../assets/styles/element/light.scss';

.invoice-page {
  .dialog-header-title {
    font-size: 16px;
    font-weight: 600;
    font-family: PingFang SC;
    color: var(--s-linear-black-d);
  }
  .dialog-content {
    text-align: center;
    .content-top {
      font-size: 20px;
      font-weight: 600;
      color: var(--s-black-10);
      margin-bottom: 5px;
    }
    .content-center {
      font-size: 14px;
      color: var(--s-black-2);
      margin-bottom: 30px;
    }
    .content-bottom {
      text-align: center;
      .bottom-box {
        display: flex;
        justify-content: center;
        .QR-code-box {
          display: flex;
          flex-direction: column;
          margin-left: 5%;
          margin-right: 20px;
          .QR-img {
            width: 160px;
            height: 160px;
            margin-bottom: 4px;
          }
          span {
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: normal;
            color: var(--s-text-color-4);
          }
        }
      }
    }
  }
}
</style>
