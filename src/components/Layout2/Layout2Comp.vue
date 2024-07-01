<script lang="ts" setup>
import { computed } from 'vue'
import HeaderComp from '../Layout/HeaderComp.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const hideUser = computed(() => Boolean(route.meta.hideUser))
</script>
<template>
  <div class="layout-comp">
    <header-comp :hideUser="hideUser" class="header-container"></header-comp>
    <div class="main-container">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-comp {
  height: 100%;
}
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  z-index: 100;
}
.main-container {
  padding-top: 64px;
  height: 100%;
}
</style>
