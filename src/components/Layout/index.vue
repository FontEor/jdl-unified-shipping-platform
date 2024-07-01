<template>
  <div :class="['layout-comp']">
    <header-comp class="header-container"></header-comp>
    <div class="main-container">
      <navbar-comp class="left-navbar"></navbar-comp>
      <content-comp class="right-content"></content-comp>
    </div>
  </div>
</template>

<script>
import HeaderComp from './HeaderComp'
import ContentComp from './ContentComp'
import NavbarComp from './NavbarComp'

export default {
  name: 'layout-comp',
  components: {
    HeaderComp,
    NavbarComp,
    ContentComp,
  },
}
</script>

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
  display:flex;
  .left-navbar {
    // flex: 0 0 190px;
  }
  .right-content {
    width: 0px;
    flex: 1;
    height: 100%;
  }
}
</style>
