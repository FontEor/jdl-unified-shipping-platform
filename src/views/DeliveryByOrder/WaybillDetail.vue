<template>
  <div class="vhbox detail-content">
    <!-- <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ name: 'orderShipment' }"
        >打单发货</el-breadcrumb-item
      >
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class="cursor-pointer row-label" @click="handleBack">
      <i class="ux-icon-back"></i>
      <span class="ml-xs">返回</span>
    </div>
    <div class="waybill-detail-wrap flex mt f-size panel-border">
      <p class="item-title f-size-md mb">订单详情</p>
      <div class="fbox mb-md">
        <p class="flex fbox mr">
          <span class="row-label">平台订单号：</span
          ><span class="row-item-content">{{ detailInfo?.channelOrderNo }}</span>
        </p>
        <p class="flex fbox mr">
          <span class="row-label">自定义订单号：</span
          ><span class="row-item-content">{{ detailInfo?.customerOrderNo }}</span>
        </p>
        <p class="flex fbox">
          <span class="row-label">包裹打印状态：</span
          ><span class="row-item-content">{{ detailInfo?.printStatusValue }}</span>
        </p>
      </div>
      <div class="fbox mb-md">
        <p class="flex fbox mr">
          <span class="row-label">销售平台编码：</span
          ><span class="row-item-content">{{ detailInfo?.channelNo }}</span>
        </p>
      </div>
      <p class="item-title f-size-md mb">收发信息</p>
      <div class="fbox mb">
        <p class="flex fbox mr">
          <span class="row-label">收件人姓名：</span
          ><span class="row-item-content">
            <Eyes
            :cipherText="detailInfo?.addressInfo.receiverName"
            :getPlainText="getPlainText('receiverName')"
            :ellipsis="false"
          ></Eyes>
            </span>
        </p>
        <p class="flex fbox mr">
          <span class="row-label">收件人电话：</span
          ><span class="row-item-content">
            <Eyes
            :cipherText="detailInfo?.addressInfo.receiverMobile"
            :getPlainText="getPlainText('receiverMobile')"
            :ellipsis="false"
          ></Eyes>
          </span>
        </p>
        <p class="flex fbox">
          <span class="row-label">收货地址：</span
          ><span class="row-item-content">
            <Eyes
            v-if="detailInfo?.addressInfo"
            :prifix="`${detailInfo?.addressInfo.receiverProvinceName}${detailInfo?.addressInfo.receiverCityName}${detailInfo?.addressInfo.receiverCountyName}`"
            :cipherText="detailInfo?.addressInfo.receiverAddress"
            :getPlainText="getPlainText('receiverAddress')"
            :ellipsis="false"
          ></Eyes>
          </span>
        </p>
      </div>
      <div class="fbox mb-md">
        <p class="flex fbox mr">
          <span class="row-label">发货人姓名：</span
          ><span class="row-item-content">
            <Eyes
            :cipherText="detailInfo?.addressInfo.senderName"
            :getPlainText="getPlainText('senderName')"
            :ellipsis="false"
          ></Eyes>
          </span>
        </p>
        <p class="flex fbox mr">
          <span class="row-label">发货人电话：</span
          ><span class="row-item-content">
            <Eyes
            :cipherText="detailInfo?.addressInfo.senderMobile"
            :getPlainText="getPlainText('senderMobile')"
            :ellipsis="false"
          ></Eyes>
          </span>
        </p>
        <p class="flex fbox">
          <span class="row-label">发货地址：</span
          ><span class="row-item-content">
            <Eyes
            v-if="detailInfo?.addressInfo"
            :prifix="`${detailInfo?.addressInfo.senderProvinceName}${detailInfo?.addressInfo.senderCityName}${detailInfo?.addressInfo.senderCountyName}`"
            :cipherText="detailInfo?.addressInfo.senderAddress"
            :getPlainText="getPlainText('senderAddress')"
            :ellipsis="false"
          ></Eyes>
          </span>
        </p>
      </div>
      <p class="item-title f-size-md mb">运单包裹信息</p>
      <div class="fbox mb">
        <p class="flex fbox mr">
          <span class="row-label">托寄物名称：</span
          ><span class="row-item-content">{{ detailInfo?.cargoName }}</span>
        </p>
        <p class="flex fbox mr">
          <span class="row-label">托寄物个数：</span
          ><span class="row-item-content">{{ detailInfo?.cargoQuantityValue }}</span>
        </p>
        <p class="flex fbox">
          <span class="row-label">备注：</span
          ><span class="row-item-content">{{ detailInfo?.remark }}</span>
        </p>
      </div>
      <div class="fbox mb-md" v-for="(item, index) in detailInfo?.goodsList" :key="index">
        <p class="flex fbox mr">
          <span class="row-label">商品名称：</span>
          <span class="row-item-content">{{ item.goodsName }}</span>
        </p>
        <p class="flex fbox mr">
          <span class="row-label">商品个数：</span>
          <span class="row-item-content">{{ item.quantityValue }}</span>
        </p>
      </div>
      <div class="fbox mb-md">
        <p class="flex fbox mr">
          <span class="row-label">运单号：</span>
          <span class="row-item-content">{{ detailInfo?.waybillCodeList[0] }}</span>
        </p>
        <p class="flex fbox mr">
          <span class="row-label">承运商：</span>
          <span class="row-item-content">{{ detailInfo?.providerName }}</span>
        </p>
      </div>
      <p class="item-title f-size-md mb" v-if="traceList?.length">运单轨迹</p>
      <el-timeline>
        <el-timeline-item
          :timestamp="item.operationTime ? dayjs(item.operationTime).format('YYYY-MM-DD HH:mm'): '-'"
          placement="top"
          v-for="item in traceList"
          :key="item.categoryCode"
          type="primary"
          :hollow="true"
        >
          【{{item.categoryName}}】{{ item.operationRemark }}
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import deliveryByOrderApi from '@/api/deliveryByOrder/index'
import { DeliveryByOrder } from '@/interfaces/deliveryByOrder'
import dayjs from 'dayjs'
import { ArrowRight } from '@element-plus/icons-vue'
import Eyes from '@/components/Eyes/ViewEye.vue'

const route = useRoute()
const router = useRouter()
const detailInfo = ref<DeliveryByOrder.IWaybillDetail>()
const traceList = ref<DeliveryByOrder.ITraceInfo[]>()
const getDetail = async () => {
  const ussOrderNo = route.query?.ussOrderNo
  if (ussOrderNo) {
    const params = {
      ussOrderNo: String(ussOrderNo),
    }
    const response = await deliveryByOrderApi.getWaybillDetail(params)
    detailInfo.value = response.data
    if (detailInfo.value.waybillCodeList.length !== 0 && detailInfo.value.providerId !== '' && detailInfo.value.orderStatus === 2) {
      await getTrace()
    }
  }
}
const getTrace = async () => {
  const params = {
    channelOrderNo: detailInfo.value!.channelOrderNo, // 零售订单号,示例值(1231211)
    customerOrderNo: detailInfo.value!.customerOrderNo, // 服务单号,示例值(3232131)
    providerId: String(detailInfo.value!.providerId), // 承运商id,示例值(463)
    providerCode: String(detailInfo.value!.providerCode), // 承运商id,示例值(463)
    waybillCode: (detailInfo.value!.waybillCodeList || [])[0],
    ussOrderNo: String(detailInfo.value?.ussOrderNo) || '',
    channelNo: detailInfo.value?.channelNo,
  }
  const response = await deliveryByOrderApi.getQueryTrace(params)
  traceList.value = response.data || []
}
const getPlainText = (
  type: keyof DeliveryByOrder.IAddressInfo,
) => {
  return async () => {
    const params = {
      ussOrderNo: String(route.query.ussOrderNo),
    }
    const response = await deliveryByOrderApi.getPlainText(params)
    const addressInfo = response.data
    return addressInfo[type]
  }
}
const handleBack = () => {
  router.push({ name: 'orderShipment' })
}
watch(
  () => route.query.ussOrderNo,
  () => {
    getDetail()
  },
  {
    immediate: true,
  },
)
</script>
<style scoped lang="scss">
.detail-content {
  height: 100%;
}
.waybill-detail-wrap {
  color: var(--s-black-6);
  &:deep {
    .el-timeline-item {
      margin-left: 130px;
      color: var(--f-light-primary);
    }
    .el-timeline-item__node--primary {
      border-color: var(--s-blue-color-alpha);
    }
    .el-timeline-item__node.is-hollow {
      background: linear-gradient(
          rgba(60, 110, 240, 0.1),
          rgba(60, 110, 240, 0.1)
        ),
        linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 1));
    }
    .el-timeline-item__tail {
      border-left-width: 1px;
    }
    .el-timeline-item__timestamp {
      position: absolute;
      left: -130px;
    }
    .el-timeline-item__content {
      color: var(--s-black-6);
    }
  }
  .row-item-content {
    word-wrap: break-word;
    width: auto;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
  }
}
.item-title {
  font-weight: 500;
  margin-top: 6px;
}
.row-label {
  color: var(--f-light-primary);
  flex-shrink: 0;
}
</style>
