<template>
  <div class="container-404">
    <div class="pic-404">
      <div class="pic-404-bg" />
      <el-button type="primary" class="go-home" @click="routerback">
        返回
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page-404',
  methods: {
    routerback () {
      this.$router.back(-1)
    },
  },
}
</script>

<style lang="scss" scoped>
.container-404 {
  padding: 100px 0 0;
  .pic-404 {
    text-align: center;
  }
  .pic-404-bg {
    width: 660px;
    height: 397px;
    margin: 0 auto;
    background: url(@/assets/images/framework/404.png) no-repeat;
    background-size: 100% 100%;
  }
  .go-home {
    margin-top: 30px;
    text-align: center;
  }
}
</style>
