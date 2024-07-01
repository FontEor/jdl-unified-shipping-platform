<!-- filename: IndexComp.vue -->
<script setup lang="ts" >
import { ArrowDown } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import globalApi from '@/api/global/index'
import { useStore } from '@/store'
import LogoComp from './LogoComp.vue'
import useClipboard from 'vue-clipboard3'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  hideUser?: boolean
}>()
const isShow = ref(false)
const store = useStore()
const name = store.getters.username
const userId = store.getters.userId
const showUser = computed(() => !props.hideUser)
const { toClipboard } = useClipboard()
function handleClick () {
  globalApi.logout()
}
const handleIsShow = () => {
  isShow.value = !isShow.value
}
const copy = async (message:string) => {
  try {
    await toClipboard(message)
    ElMessage({
      message: '复制成功！',
      type: 'success',
    })
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="header-comp">
    <logo-comp></logo-comp>
    <div class="side-right">
      <div class="right-menu" v-if="showUser">
        <div class="avatar-container">
          <div class="avatar-wrapper" @click="handleIsShow">
            <img src="@/assets/images/header/avatar.png" class="user-avatar" />
            <span class="user-name">{{ name || "用户名" }}</span>
            <el-icon class="el-icon--right">
              <arrow-down style="color:#3C6EF0" />
            </el-icon>
          </div>
        </div>
        <el-card v-if="isShow" class="avatar-card">
          <div class="card-username">
            登录账号：{{ name }}
            <span class="ux-icon-document-copy" style="color:rgba(82,87,101,1)" v-if="name" @click="copy(name)"></span>
          </div>
          <div class="card-userId">
            用户ID：{{ userId }} <span class="ux-icon-document-copy" style="color:rgba(82,87,101,1)" v-if="userId" @click="copy(userId)"></span>
          </div>
          <el-divider style="margin:0" />
          <div class="card-logout"><el-button type="text" plain  @click="handleClick">退出登录</el-button></div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-comp {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  box-shadow:  0 0 12px 0 rgba(65,81,125,0.1);
}
.side-right {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  .right-menu {
    display: flex;
    align-items: center;
    float: right;
    height: 100%;
    .avatar-container {
      padding: 0 18px;
      .avatar-wrapper {
        cursor: pointer;
        display: flex;
        align-items: center;
        .user-avatar {
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          vertical-align: middle;
        }
        .user-name {
          display: inline-block;
          // color: #525765;
          color:#3C6EF0;
          padding-left: 10px;
          font-size: 16px;
        }
      }
    }
    .avatar-card {
      position: absolute;
      top:64px;
      right:14px;
      min-width: 285px;
      background: rgba(255,255,255,1);
      border-radius: 8px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 600;
      color: rgba(82,87,101,1);
      .card-username{
        height: 35px;
        line-height: 35px;
        padding-left: 24px;
        margin-top: 12px;
      }
      .card-userId{
        height: 35px;
        line-height: 35px;
        padding-left: 24px;
        margin-bottom: 16px;
      }
      .card-logout{
        text-align: center;
        margin: 12px 0;
      }
    }
    ::v-deep .el-card__body{
      padding:0;
    }
  }
}
</style>
