
<script setup lang="ts">

const props = defineProps({
  downloadUrl: {
    type: String,
    default: '#',
  },
})

</script>

<script lang="ts">
export default {
  name: 'ExportBtn',
}
</script>

<template>
  <a class="download-btn" target="_blank" :href="downloadUrl">
    <slot></slot>
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
