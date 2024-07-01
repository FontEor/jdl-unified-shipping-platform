<script lang="ts" setup>
import NoDataComp from '@/components/NoData/NoDataComp.vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()
const sysError = store.getters.getError
if (!sysError) {
  router.push({ path: '/' })
}
</script>
<template>
  <div class="no-auth-page">
    <div class="panel-border">
      <NoDataComp>系统维护中，请稍后重试</NoDataComp>
    </div>
  </div>
</template>
<style lang="scss">
.no-auth-page {
  height: 100%;
  .panel-border {
    height: 100%;
    font-size: 16px;
    border-radius: 0;
    text-align: center;
    padding-top: 60px;
  }
}
</style>
