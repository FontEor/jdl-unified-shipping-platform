<script lang="ts" setup>
import { ref } from 'vue'
import { RefreshRight } from '@element-plus/icons-vue'
import QRCode from 'qrcode'

const qrcodeContainer = ref(null)

const showRefreshIcon = ref(false)
const imgUrlQRCode = ref('')
const qrCodeData = ref('')
const loading = ref(false)
const emit = defineEmits(['informRefresh'])

// 图片加载失败设置展示重试图标
const handleImageError = () => {
  showRefreshIcon.value = true
}

// 重新刷新获取图片
const refreshImage = () => {
  loading.value = true
  // 通知父组件重新调取获取二维码
  emit('informRefresh')
}

const closeLoadingStatus = () => {
  showRefreshIcon.value = false
  loading.value = false
}

const propsValue = (val: string) => {
  qrCodeData.value = val // 替换为你的二维码数据
  getQRCodeUrl(qrCodeData.value)
}

const getQRCodeUrl = (value: string) => {
  if (value) {
    QRCode.toDataURL(value)
      .then((url: string) => {
        imgUrlQRCode.value = url
        showRefreshIcon.value = false
      })
      .catch((error: string) => {
        console.log(error)
      })
  }
}

defineExpose({
  handleImageError,
  refreshImage,
  closeLoadingStatus,
  propsValue,
})
</script>

<script lang="ts">
export default {
  name: 'qrCodeImg',
}
</script>

<template>
  <div class="qr-code-box">
    <img v-show="imgUrlQRCode" :src="imgUrlQRCode" @error="handleImageError" alt="QR Code" />
    <div
      v-if="showRefreshIcon || !imgUrlQRCode"
      class="refresh-icon"
      name="el-icon-refresh"
      @click="refreshImage"
      clstag="h|keycount|isv_1697703741586|10"
    >
      <el-button link v-loading="loading" class="refresh-btn">
        <el-icon class="retry-icon"><RefreshRight /></el-icon>
        <span>二维码获取失败请点击重试</span>
      </el-button>
    </div>
  </div>
</template>

<style lang="scss"  scoped>
@import '../../../assets/styles/element/light.scss';
.qr-code-box {
  position: relative;
  img {
    width: 160px;
    height: 160px;
  }
  .refresh-icon {
    position: absolute;
    width: 160px;
    height: 160px;
    line-height: 160px;
    background: rgba(235, 235, 235, 0.3);
    top: 0;
    font-size: 20px;
    cursor: pointer;
    .retry-icon {
      font-size: 21px;
    }
    .refresh-btn {
      width: 160px;
      height: 160px;
      color: $font-color-lighter;
      span {
        width: 100px;
        white-space: normal
      }
    }
  }
}
</style>
