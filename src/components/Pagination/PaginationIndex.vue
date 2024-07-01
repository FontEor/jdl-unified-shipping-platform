<template>
  <el-pagination
    v-model:current-page="pageInfo.pageNo"
    v-model:page-size="pageInfo.pageSize"
    :page-sizes="props.pageSizes"
    background
    layout="total, prev, pager, next, sizes, jumper"
    :total="props.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
<script setup lang="ts">
import { computed, PropType, reactive, ref } from 'vue'
const props = defineProps({
  total: Number,
  pageSizes: {
    type: Array as PropType<Array<number>>,
    default: () => [15, 25, 50, 100],
  },
  pageSize: {
    type: Number as PropType<number>,
    default: 15,
  },
})
const pageInfo = reactive({
  pageNo: 1,
  pageSize: props.pageSize,
})

const emit = defineEmits(['pageChange'])
const handleSizeChange = (size: number) => {
  pageInfo.pageSize = size
  pageInfo.pageNo = 1
  emit('pageChange', pageInfo)
}
const handleCurrentChange = (page: number) => {
  pageInfo.pageNo = page
  emit('pageChange', pageInfo)
}
</script>
<style lang="scss" scoped>
</style>
