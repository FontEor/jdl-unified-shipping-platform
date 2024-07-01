<template>
  <el-tooltip
    :effect="props.effect"
    :content="props.content"
    :placement="props.placment"
  >
    <slot>
      <i class="ux-icon-infocircle tip-icon"></i>
    </slot>
  </el-tooltip>
</template>
<script lang="ts" setup>
import { PropType } from 'vue'
enum IPlacment {
  'top-start' = '左上',
  'top' = '上',
  'top-end' = '上右',
  'right-start' = '右上',
  'right' = '右',
  'right-end' = '右下',
  'bottom-start' = '下左',
  'bottom' = '下',
  'bottom-end' = '下右',
  'left-start' = '左上',
  'left' = '左',
  'left-end' = '左下'
}
const props = defineProps({
  content: {
    type: String as PropType<string>,
    required: true,
  },
  effect: {
    type: String as PropType<'dard' | 'light'>,
    default: 'light',
  },
  placment: {
    type: String as PropType<keyof typeof IPlacment>,
    default: 'top',
  },
})
</script>
<style lang="scss" scoped>
.tip-icon {
  font-size: 14px;
}
</style>
