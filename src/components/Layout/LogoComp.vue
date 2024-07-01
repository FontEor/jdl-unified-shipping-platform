<!-- filename: LogoComp.vue -->
<script setup lang="ts" >
</script>

<template>
  <router-link class="navbar-logo-container navbar-logo-link" to="/">
    <img src="@/assets/images/header/logo.png" class="sidebar-logo" />
  </router-link>
</template>

<style lang="scss" scoped>

.navbar-logo-container {
  margin: 0 24px;
  .sidebar-logo {
    height: 22px;
  }
}
</style>
