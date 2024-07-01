<template>
  <div class="app-container">
    <router-view />
  </div>
</template>
<script lang="ts" setup>
import init from '@/lib/jaq/index'
init(null, 3)
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
}
</style>
