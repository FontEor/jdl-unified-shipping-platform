<script lang="ts" setup>
import NoDataComp from '@/components/NoData/NoDataComp.vue'
</script>
<script lang="ts">
export default {
  name: 'building-page',
}
</script>
<template>
  <div class="building-page">
      <NoDataComp class="panel-border">
        正在建设中，敬请期待
      </NoDataComp>
  </div>
</template>
<style lang="scss">
.building-page {
  height: 100%;
}
</style>
