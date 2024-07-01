<script setup lang="ts">
import { onMounted, ref, onUnmounted, reactive } from 'vue'
import TimeLine from '../Invoice/components/timeLine.vue'
import QRCodeImg from './components/QRCodeImg.vue'
import { AccreditParams } from './accreditPage'
import accredit from '@/api/accredit/index'
import { useRoute } from 'vue-router'
import _ from 'lodash'

const route = useRoute()

const requestParams = reactive<AccreditParams>({
  eid: '',
  fp: '',
  ...route.query,
})

onMounted(() => {
  getAccreditQRCode() // 获取二维码信息
  // getAccreditStatus() // 获取授权状态
})

const loading = ref(true)
const qrCode = ref('') // 二维码地址url
const isAccredit = ref(false) // 是否签约状态，判断展示扫码页还是完成授权
const qrCodeRef = ref()
const isWaring = ref(false)
const successTips = ref('您已成功开通「卓配发货」自动扣款服务')
const waringTips = ref('链接已失效，请重新授权')

const activities = [
  {
    content: '扫码账号将作为后续扣款账号',
    timestamp: '使用「京东APP」扫码进入开通页',
  },
  {
    content: '选择扣款账户，输入支付密码',
    timestamp: '开通自动扣款服务',
  },
  {
    content: '',
    timestamp: '开通成功',
  },
]

const getAccreditQRCode = async () => {
  const params = {
    ...requestParams,
  }
  try {
    const resData = await accredit.getUrlApi(params)
    if (resData.code === '1' && resData.data) {
      qrCode.value = resData.data.agreementUrl
      isAccredit.value = resData.data.agreementStatus
      const tips = _.get(resData, 'data.agreementTip')
      if (tips) {
        successTips.value = tips
      }
    } else if (resData.code === '20001') {
      qrCode.value = ''
      isAccredit.value = true
      isWaring.value = true
      // qrCodeRef.value.closeLoadingStatus()
    } else {
      pollingTimer && clearInterval(pollingTimer)
      qrCode.value = ''
      isAccredit.value = false
      isWaring.value = false
      // console.log(successTips.value, 'vv')
    }
    if (qrCodeRef.value) {
      qrCodeRef.value.closeLoadingStatus()
      qrCodeRef.value.propsValue(qrCode.value)
    }
    loading.value = false
  } catch (error) {
    loading.value = false
    if (qrCodeRef.value) {
      qrCodeRef.value.closeLoadingStatus()
    }
  }
}

const informRefresh = () => {
  // // 重新获取二维码，如果失败就一直获取
  getAccreditQRCode()
}

// 获取授权状态的接口
const getAccreditStatus = async () => {
  try {
    const params = {
      ...requestParams,
    }
    const resData = await accredit.checkStatusApi(params)
    if (resData.code === '1' && resData.data) {
      clearInterval(pollingTimer)
      isAccredit.value = true
    } else {
      isAccredit.value = false
    }
  } catch (error) {
    console.log('error===', error)
  }
}

const pollingTimer = setInterval(() => {
  // 如果不是授权状态继续轮询
  if (!isAccredit.value) {
    getAccreditStatus()
  }
}, 10000)

// 在组件卸载时清除定时器，以防止内存泄漏
onUnmounted(() => {
  clearInterval(pollingTimer)
})

</script>

<template>
  <div class="accredit-page" v-loading="loading">
    <div class="header-box">
      <img src="../../assets/images/server/jdLogo.png" alt="">
      <span>自动扣款服务</span>
    </div>
    <div class="accredit-content" v-if="!isAccredit">
      <div class="content-top">扫码开通「卓配发货」自动扣款服务</div>
      <div class="content-center">请使用登录<span>卓配发货平台账号</span>进行开通</div>
      <div class="content-bottom">
        <div class="bottom-box">
          <div class="QR-code-box">
            <QRCodeImg ref="qrCodeRef" :imageUrl="qrCode" class="QR-img" @informRefresh="informRefresh"></QRCodeImg>
            <span>请使用京东APP扫码</span>
          </div>
          <TimeLine :activities="activities"></TimeLine>
        </div>
      </div>
    </div>
    <div class="accredit-success-box" v-else-if="isWaring">
      <img src="../../assets/images/server/danger.png" alt="">
      <div class="prompt-message">{{waringTips}}</div>
    </div>
    <div class="accredit-success-box" v-else>
      <img src="../../assets/images/server/successIcon.png" alt="">
      <div class="success-status">签约成功</div>
      <div class="prompt-message">{{successTips}}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '../../assets/styles/element/light.scss';

.accredit-page {
  height: 100%;
  background: var(--s-tab-active-bg-color);
  justify-content: center;
  align-items: center;
  margin: 16px 16px 0 16px;

  .header-box {
    height: 64px;
    line-height: 64px;
    margin: 0 16px;
    border-bottom: 1px solid var(--s-divider-weak-color);
    img {
      width: 86px;
      height: 28px;
      margin-right: 12px;
      margin-top: 16px;
    }
    span {
      padding-left: 12px;
      border-left: 1px solid var(--s-divider-weak-color);
      font-size: 18px;
      font-family: JDLANGZHENGTI;
      font-weight: normal;
      color: var(--s-linear-black-d);
    }
  }
  .accredit-success-box {
    margin-top: 120px;
    text-align: center;
    img {
      width: 44px;
      height: 44px;
      margin-bottom: 22px;
    }
    .success-status {
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: 600;
      color: var(--s-linear-black-d);
      margin-bottom: 8px;
    }
    .prompt-message {
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: normal;
      color: #8c8c8c;
    }
  }
  .accredit-content {
    margin-top: 55px;
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
      margin-bottom: 50px;
      font-weight: normal;
      span {
        color: var(--s-red-color);
      }
    }
    .content-bottom {
      text-align: center;
      .bottom-box {
        display: flex;
        justify-content: center;
        .QR-code-box {
          display: flex;
          flex-direction: column;
          // margin-left: 10%;
          margin-right: 33px;
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
