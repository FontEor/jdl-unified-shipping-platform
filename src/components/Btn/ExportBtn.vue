
<script setup lang="ts">
const props = defineProps({
  downloadUrl: {
    type: String,
  },
})

</script>

<template>
  <a class="download-btn" target="_blank" :href="downloadUrl">
    <slot>导出</slot>
  </a>
</template>

<style lang="scss" scoped>
.download-btn {
  width: 88px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  background: rgba(226,234,253,1);
  border-radius: 8px;
}
</style>
