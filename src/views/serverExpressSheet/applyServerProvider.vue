<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import ApplyServerDialog from './components/applyServerDialog.vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { CardListData } from './applyServer'
import serverExpressApi from '../../api/serverExpress/index'
import NoDataComp from '../../components/NoData/NoDataComp.vue'

import { useRouter } from 'vue-router'

const router = useRouter()

const branchInfoList = reactive({
  list: [] as CardListData[],
})

const settlementInfoList = reactive({
  list: [] as CardListData[],
})

// 用来做一个遍历循环展示出直营和加盟类型列表
const typeList = reactive({
  list: [
    { providerType: 2 },
    { providerType: 1 },
  ],
})

const applyServerDialog = ref()
const loading = ref(true)

onMounted(() => {
  getCardList()
})

// 获取卡片列表接口
const getCardList = async () => {
  settlementInfoList.list = []
  branchInfoList.list = []
  const listData = await serverExpressApi.queryContractorListApi({})
  if (listData.code === '1' && listData?.data) {
    // 过滤掉京东快递
    // listData?.data?.filter((item: any) => item.providerName !== '京东快递')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, array-callback-return
    listData?.data?.map((item: any) => {
      if (item.providerType === '1') {
        // 直营
        settlementInfoList.list.push(item)
      } else {
        // 加盟
        branchInfoList.list.push(item)
      }
    })
  } else {
    settlementInfoList.list = listData?.data
    branchInfoList.list = listData?.data
  }
  loading.value = false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const clickBtn = (val: any) => {
  applyServerDialog.value.openDialog(val)
}

const submitCloseDialog = () => {
  loading.value = true
  // 调回列表页
  router.push({ name: 'serverExpressSheet' })
}

</script>

<template>
  <div class="apply-server-provider" v-loading="loading">
    <div>
      <el-breadcrumb :separator-icon="ArrowRight">
        <!-- <el-breadcrumb-item :to="{ path: '/orderShipment/index' }">主页</el-breadcrumb-item> -->
        <el-breadcrumb-item :to="{ path: '/serverExpressSheet' }" clstag="h|keycount|fahuo_1697704072400|6" class="firstColor">服务商</el-breadcrumb-item>
        <el-breadcrumb-item class="twoColor">申请服务商</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-top">
      <div class="top-hint">
        <img src="../../assets/images/server/top-left.png" alt="" class="top-hint-img">
        <div class="hint-title">如何开通电子面单</div>
        <img src="../../assets/images/server/top-right.png" alt="" class="top-hint-img">
      </div>
      <div class="bottom-hint">
        <div class="title-card">
          <div class="card-num jd-value">01</div>
          <div class="card-img">
            <img src="../../assets/images/server/tp01.png" alt="">
            <div class="step-massage">
              <span>选择快递公司</span>
            </div>
          </div>
          <img src="../../assets/images/server/jiantou.png" alt="" class="flow-img">
        </div>
        <div class="title-card card2">
          <div class="card-num jd-value">02</div>
          <div class="card-img">
            <img src="../../assets/images/server/tp02.png" alt="">
            <div class="step-massage">
              <span>填写申请信息，等待快递审核</span>
              <span class="massage2">(直营型快递涉及结算财务编码请咨询快递客服)</span>
            </div>
          </div>
          <img src="../../assets/images/server/jiantou.png" alt="" class="flow-img">
        </div>
        <div class="title-card card2">
          <div class="card-num jd-value">03</div>
          <div class="card-img">
            <img src="../../assets/images/server/tp03.png" alt="">
            <div class="step-massage step-3">
              <span>加盟型快递：线下联系网点充值开通</span>
              <span>直营型快递：直接使用</span>
            </div>
          </div>
          <img src="../../assets/images/server/jiantou.png" alt="" class="flow-img">
        </div>
        <div class="title-card card2">
          <div class="card-num jd-value">04</div>
          <div class="card-img">
            <img src="../../assets/images/server/tp04.png" alt="">
            <div class="step-massage">
              <span>使用商家后台或其它打印软件操作运单打印</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-center" v-for="typeItem in typeList.list" :key="typeItem.providerType">
      <div class="title" :class="typeItem.providerType === 2 ? 'to-join-bj' : 'direct-sales'">
        <span class="title-left">{{ typeItem.providerType === 2 ? '加盟型' : '直营型' }}</span>
        <span class="title-right">{{ typeItem.providerType === 2 ? '开放式的网络组织，网点采用深度外包，加盟形式' : '封闭式的网络组织，网点自行建设' }}</span>
      </div>
      <div class="card-box" v-if="branchInfoList.list">
        <div class="card" v-for="item in typeItem.providerType === 2 ? branchInfoList.list : settlementInfoList.list" :key="item.providerId">
          <div class="card-top">
            <img :src="item.providerLogoUrl" :alt="item.providerName" class="card-top-img">
          </div>
          <div class="card-bottom">
            <el-button link type="primary" size="small" clstag="h|keycount|fahuo_1697704072400|7" @click="clickBtn(item)">申请开通</el-button>
          </div>
          <!-- <div class="corner-mark" v-if="item.id === '2' || item.id === '4'">已开通</div> -->
        </div>
      </div>
      <div v-else style="height: 270px;">
        <NoDataComp>
          <div class="noData-box">
            <div class="empty-title">暂无数据</div>
          </div>
        </NoDataComp>
      </div>
    </div>
    <ApplyServerDialog ref="applyServerDialog" @submitCloseDialog="submitCloseDialog"></ApplyServerDialog>
  </div>
</template>

<style lang="scss" scoped>
@import '../../assets/styles/common.scss';
@import '../../assets/styles/element/light.scss';

.apply-server-provider {

  //重写面包屑的字体颜色
  .firstColor :deep(.el-breadcrumb__inner) {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: normal;
    color: rgba(134,141,159,1);
  }
  .twoColor :deep(.el-breadcrumb__inner) {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: normal;
    color: rgba(82,87,101,1);
  }
  .content-top {
    width: 100%;
    height: 248px;
    border-radius: 12px;
    margin-top: 18px;
    background: linear-gradient(to bottom, #e2e9fd, #f5f8ff);
    .top-hint {
      width: 100%;
      height: 48px;
      text-align: center;
      .hint-title {
        width: 144px;
        height: 32px;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 600;
        color: var(--s-black-6);
        display: inline-block;
        margin: 16px 8px;
      }
      .top-hint-img {
        margin-top: 24px;
      }
    }
    .bottom-hint {
      display: flex;
      .title-card {
        width: 22%;
        height: 172px;
        position: relative;
        margin-left: 16px;
        .card-num {
          width: 45px;
          height: 40px;
          font-size: 40px;
          font-weight: 900;
          color: var(--s-brand-b-color);
          margin-left: 24px;
        }
        .card-img {
          position: absolute;
          top: 30px;
          width: 100%;
          height: 152px;
          background-image: url(../../assets/images/server/centerimg.png);
          border: 1px solid var(--s-text-color-white);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          img {
            width: 64px;
            height: 64px;
            margin: 12px auto 0px auto;
          }
          .step-massage {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: normal;
            color: var(--s-black-6);
            margin: 0 auto;
            text-align: center;
            display: flex;
            flex-direction: column;
            .massage2 {
              font-size: 12px;
              font-family: PingFang SC;
              font-weight: normal;
              color: var(--s-text-color-3);
            }
          }
          .step-3 {
            text-align: left;
          }
        }
        .flow-img {
          position: relative;
          width: 24px;
          height: 19px;
          left: 102%;
          top: 56px;
        }
      }
      .card2 {
        margin-left: 38px;
      }
    }
  }

  .content-center {
    width: 100%;
    min-height: 348px;
    background-color: var(--s-input-active-bg-color);
    border-radius: 12px;
    margin-top: 12px;

    .empty-title {
      font-size: 14px;
      font-weight: normal;
      color: #525765;
    }
    .to-join-bj {
      width: 400px;
      background-image: url(../../../src/assets/images/server/to-join-bj.png);
    }
    .direct-sales {
      width: 400px;
      background-image: url(../../../src/assets/images/server/direct-sales.png);
    }
    .title {
      height: 52px;
      line-height: 52px;

      .title-left {
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 600;
        color: var(--s-black-6);
        margin-left: 16px;
        margin-right: 16px;
      }

      .title-right {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: normal;
        color: var(--s-text-color-3);
      }
    }

    .card-box {
      width: 100%;
      margin-top: 17px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .card {
        width: 17%;
        height: 170px;
        border: 1px solid var(--s-divider-weak-color);
        border-radius: 12px;
        margin-left: 16px;
        margin-right: 12px;
        margin-bottom: 12px;
        position: relative;

        .card-top {
          height: 120px;
          padding-top:36px;
          border-bottom: 1px solid var(--s-divider-weak-color);

          .card-top-img {
            width: 135px;
            height: 48px;
            display: block;
            margin: 0 auto;
            border: 1px solid var(--s-black-1);
          }
        }

        .card-bottom {
          height: 48px;
          line-height: 48px;
          text-align: center;
          background-color: var(--s-bg-weak-color);
          border-radius: 0 0 16px 16px;
        }

        .corner-mark {
          position: absolute;
          right: 0;
          top: 0;
          width: 58px;
          height: 24px;
          background-color: var(--s-green-color);
          color: var(--s-text-color-white);
          border-radius: 0 8px 0 8px;
          font-size: 14px;
          text-align: center;
        }
      }
    }
  }
}
</style>
