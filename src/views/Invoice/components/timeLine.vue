<script setup lang="ts">
import { defineProps } from 'vue'
import { TimeLineArr } from './timeLine'

interface Props {
  activities?: TimeLineArr[]
}

const props = defineProps<Props>()

defineExpose({})
</script>

<script lang="ts">
export default {
  name: 'TimeLine',
}
</script>

<template>
  <div class="timeline-page">
    <el-timeline>
      <el-timeline-item v-for="(activity, index) in props.activities" :key="index">
      <div>
        <div class="steps-title">{{ activity.timestamp }}</div>
        <div class="steps-content">{{ activity.content }}</div>
      </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<style lang="scss" scoped>
@import '../../../assets/styles/element/light.scss';

.timeline-page {
  height: 100%;
  .steps-title {
    font-weight: 600;
    color: var(--s-black-10);
    margin-bottom: 4px;
    font-size: 16px;
    font-family: PingFang SC;
  }
  .steps-content {
    font-size: 14px;
    color: var(--s-black-2);
    font-family: PingFang SC;
    font-weight: normal;
  }
}
:deep(.el-timeline-item__wrapper) {
  height: 48px;
  text-align: left;
}
:deep(.el-timeline-item__tail) {
  height: 50px;
  top: 18%;
  background: var(--s-brand-b-color);
  border-left: 2px solid var(--s-brand-b-color);
}
:deep(.el-timeline-item__node--normal) {
  background: var(--s-brand-b-color);
  width: 8px;
  height: 8px;
  left: 1px;
}
:deep(.el-timeline-item__content .steps-title) {
  margin-bottom: 0px;
}
</style>
