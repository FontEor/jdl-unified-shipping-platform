<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ApplyServerDialog from './components/applyServerDialog.vue'
import NoDataComp from '../../components/NoData/NoDataComp.vue'
import serverExpressApi from '../../api/serverExpress/index'
import { SettlementInfoData } from './applyServer'

const tableData = ref(null)
const loading = ref(true)
const router = useRouter()
const applyServerDialog = ref()

const serverTableData = reactive({
  list: [],
})
const revisedTableData = reactive({
  list: [] as SettlementInfoData[],
})

onMounted(async () => {
  getServerExpressSheetList()
})

const getServerExpressSheetList = async () => {
  // 置空数组数据
  const listData = await serverExpressApi.queryContractedListApi({})
  if (listData.code === '1' && listData?.data) {
    serverTableData.list = listData.data
    revisedTableData.list = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, array-callback-return
    listData?.data?.map((item: any) => {
      if (item.providerType === '1') {
        // 直营
        revisedTableData.list.push({
          providerId: item.providerId,
          providerLogoUrl: item.providerLogoUrl,
          providerName: item.providerName,
          providerType: item.providerType,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          settlementInfoVOS: item.settlementInfoVOS.map((item1: any) => {
            return {
              providerName: item?.providerName,
              settlementCode: item1.settlementCode,
              senderName: item1.senderInfo.senderName,
              senderPhone: item1.senderInfo.senderPhone,
              senderInfoAddress: item1.senderInfo.address,
              contractStatus: item1.providerContractInfoVO.contractStatus,
              contractMessage: item1.providerContractInfoVO.contractMessage,
            }
          }),
        })
      } else {
        // 加盟
        revisedTableData.list.push({
          providerId: item.providerId,
          providerLogoUrl: item.providerLogoUrl,
          providerName: item.providerName,
          providerType: item.providerType,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          branchInfoVOS: item.branchInfoVOS.map((item1: any) => {
            return {
              providerName: item?.providerName,
              branchName: item1.branchAddressInfo.address,
              branchCode: item1.branchCode,
              senderName: item1.senderInfo.senderName,
              senderPhone: item1.senderInfo.senderPhone,
              senderAddressInfo: item1.senderInfo.address,
              contractStatus: item1.providerContractInfoVO.contractStatus,
              contractMessage: item1.providerContractInfoVO.contractMessage,
            }
          }),
        })
      }
    })
  } else {
    // 失败置空数组，显示空状态
    serverTableData.list = []
  }
  loading.value = false
}

const gotoApplyServer = () => {
  router.push({ name: 'applyServerProvider' })
}

// 添加class类
const contractStatusClass = (val: number) => {
  if (val === 10 || val === 40) {
    return 'primary'
  } else if (val === 20 || val === 50) {
    return 'success'
  } else {
    return 'danger'
  }
}

// 类型判断定义文案
const contractStatusText = (val: number) => {
  switch (val) {
    case 10:
      return '审核中'
    case 20:
      return '审核通过'
    case 30:
      return '审核失败'
    case 40:
      return '解约中'
    case 50:
      return '已解约'
    case 60:
      return '解约申请未通过'
    default:
      return ''
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addApplyServer = (val: any) => {
  applyServerDialog.value.openDialog(val)
}

const submitCloseDialog = () => {
  loading.value = true
  setTimeout(() => {
    // 刷新列表
    getServerExpressSheetList()
  }, 1000)
}
</script>

<template>
  <div :class="['server-express-sheet', serverTableData?.list?.length !== 0 ? '' : 'server-express-nodata']">
    <div class="table-class" v-if="serverTableData?.list?.length !== 0" v-loading="loading">
      <el-button type="primary" @click="gotoApplyServer" class="apply-btn">申请服务商</el-button>
      <div class="apply-table" v-for="item in revisedTableData.list" :key="item.providerId">
        <div class="top-content">
          <div class="content-left">
            <img :src="item.providerLogoUrl" alt="" class="img-server">
            <span
              class="tag-type"
              :class="item.providerType === '1' ? 'direct-sales' : 'to-join'"
            >{{ item.providerType === '1' ? '直营' : '加盟'}}
            </span>
          </div>
          <div class="content-right">
            <el-button type="primary" @click="addApplyServer(item)" class="add-btn">申请开通</el-button>
          </div>
        </div>
        <el-table v-if="item.providerType === '1'" :data="item.settlementInfoVOS" style="width: 100%" ref="tableData" class="table-content" max-height="350px" show-overflow-tooltip>
          <el-table-column prop="providerName" label="服务商名称" width="110" >
          </el-table-column>
          <el-table-column prop="settlementCode" label="月结编码" width="170" >
          </el-table-column>
          <el-table-column prop="senderName" label="发货联系人" width="120" >
          </el-table-column>
          <el-table-column prop="senderPhone" label="发货电话" width="150" >
          </el-table-column>
          <el-table-column prop="senderInfoAddress" label="发货地址">
          </el-table-column>
          <el-table-column prop="contractStatus" label="审核状态" width="120" >
            <template #default="{ row }">
              <div class="audit-content">
                <el-text class="mx-1" :type="contractStatusClass(row.contractStatus)">
                  {{ contractStatusText(row.contractStatus) }}
                </el-text>
                <el-tooltip
                  class="box-item"
                  effect="light"
                  v-if="row.contractMessage"
                  :content="row.contractMessage"
                  placement="top"
                  popper-class="text_tooltip"
                >
                <template #content>
                  <div class="fail-reason-title">失败原因</div>
                  <div class="fail-reason-content">{{ row.contractMessage }}</div>
                </template>
                 <span class="icon-img">
                  <img src="../../assets/images/server/Lui-icon-query.png" alt="">
                 </span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column fixed="right" label="操作" width="80">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleClick(scope.row.branchCode)">解绑</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <el-table v-else :data="item.branchInfoVOS" style="width: 100%" ref="tableData" class="table-content" max-height="350px" show-overflow-tooltip>
          <el-table-column prop="providerName" label="服务商名称" width="100" >
          </el-table-column>
          <el-table-column prop="branchName" label="网点地址">
          </el-table-column>
          <el-table-column prop="branchCode" label="网点编码" width="100" >
          </el-table-column>
          <el-table-column prop="senderName" label="发货联系人" width="100" >
          </el-table-column>
          <el-table-column prop="senderPhone" label="发货电话" width="120" >
          </el-table-column>
          <el-table-column prop="senderAddressInfo" label="发货地址">
          </el-table-column>
          <el-table-column prop="contractStatus" label="审核状态" width="120" >
            <template #default="{ row }">
              <div class="audit-content">
                <el-text class="mx-1" :type="contractStatusClass(row.contractStatus)">
                  {{ contractStatusText(row.contractStatus) }}
                </el-text>
                <el-tooltip
                  class="box-item"
                  effect="light"
                  v-if="row.contractMessage"
                  :content="row.contractMessage"
                  placement="top"
                  popper-class="text_tooltip"
                >
                <template #content>
                  <div class="fail-reason-title">失败原因</div>
                  <div class="fail-reason-content">{{ row.contractMessage }}</div>
                </template>
                 <span class="icon-img">
                  <img src="../../assets/images/server/Lui-icon-query.png" alt="">
                 </span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column fixed="right" label="操作" width="80">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleClick(scope.row.branchCode)">解绑</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
    <div class="empty-class" v-else>
      <NoDataComp>
        <div class="noData-box">
          <div class="empty-title">您还未添加任何服务商</div>
          <el-button type="primary" @click="gotoApplyServer" clstag="h|keycount|fahuo_1697704072400|5" class="empty-btn">申请服务商</el-button>
        </div>
      </NoDataComp>
    </div>
    <ApplyServerDialog ref="applyServerDialog" @submitCloseDialog="submitCloseDialog"></ApplyServerDialog>
  </div>
</template>

<style lang="scss" scoped>
@import '../../assets/styles/element/light.scss';
.server-express-sheet {
  width: 100%;
  min-height: 100%;
  background-color: var(--s-main-bg-color);
  border-radius: 8px;
  padding: 16px;

  .apply-btn {
    border-radius: 8px;
  }
  .apply-table {
    background: #e6ebf3;
    margin-top: 8px;
    .top-content {
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .content-left {
        display: flex;
        flex-direction: row;
        .img-server {
          width: 121px;
          height: 36px;
          margin: 8px 29px 0 16px;
          border: 1px solid var(--s-black-1);
        }
        .tag-type {
          margin-top: 14px;
          width: 44px;
          height: 24px;
          border-radius: 8px;
          text-align: center;
          opacity: 10;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: normal;
        }
        .direct-sales {
          background: #d4def2;
          color: var(--s-blue-color);
        }
        .to-join {
          background: var(--s-pink-1);
          color: var(--s-red-color);
        }
      }
      .content-right {
        .add-btn {
          margin-top: 10px;
          margin-right: 16px;
          background: #d4def2;
          color: var(--s-blue-color);
          border: 0px solid #d4def2;
          border-radius: 8px;
        }
      }
    }
    .table-content {
      .audit-content {
        display: flex;
        align-items: center;
        .icon-img {
          width: 14px;
          height: 14px;
          cursor: pointer;
          margin-left: 4px;
        }
      }
    }
  }
  &.server-express-nodata {
    height: 100%;
  }
  .empty-class {
    height: 100%;
    .empty-title {
      font-size: 18px;
      font-weight: normal;
      color: #525765;
      margin-bottom: 16px;
    }
    .empty-btn {
      margin-top: 16px;
    }
  }
}
</style>

<style>
.text_tooltip {
  width: 270px;
}
.fail-reason-title {
  font-size: 14px;
  font-weight: 600;
  color: #23252b;
}
.fail-reason-content {
  font-size: 12px;
  font-weight: normal;
  color: #23252b;
}
</style>
