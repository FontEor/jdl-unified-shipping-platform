<script setup lang="ts" >
import { computed } from 'vue'
import buildingImg from '@/assets/images/framework/building.png'
import noAuthImg from '@/assets/images/framework/no-auth.png'
import noDataImg from '@/assets/images/framework/no-data.png'
import noNetworkImg from '@/assets/images/framework/no-network.png'
import noResImg from '@/assets/images/framework/no-res.png'
import noTableDataImg from '@/assets/images/framework/no-table-data.png'
import _ from 'lodash'

const data = {
  building: buildingImg,
  noAuth: noAuthImg,
  noData: noDataImg,
  noNetwork: noNetworkImg,
  noRes: noResImg,
  noTableData: noTableDataImg,
}
const props = withDefaults(defineProps<{
  imgType?: string,
  content?: string
}>(), {
  imgType: 'noData',
  content: '暂无数据',
})

const imgSrc = computed(() => _.get(data, props.imgType))

</script>
<template>
<div class="nodata-page">
  <div class="nodata-content">
    <div class="img">
      <img :src="imgSrc" alt="" />
    </div>
    <div class="text"><slot>{{content}}</slot></div>
  </div>
</div>
</template>
<style lang="scss" scoped>
.nodata-page {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .nodata-content {
    text-align: center;
    .img {
      img {
        width: 138px;
      }
    }
    .text {
      text-align: center;
      font-size: 20px;
      color: $font-color;
      margin-top: 28px;
    }
  }
}
</style>
