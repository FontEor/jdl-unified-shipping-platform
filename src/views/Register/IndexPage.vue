<script setup lang="ts">
import { ref } from 'vue'
import { registerPageUrl } from '@/utils/login'
import HeaderComp from '@/components/Layout/HeaderComp.vue'
import Nodata from '@/components/NoData/NoDataComp.vue'

const showError = ref(false)
const url = registerPageUrl()

</script>

<template>

<div class="layout-comp">
  <header-comp hideUser class="header-container"></header-comp>
  <div class="main-container">
    <div class="register-page">
      <div class="register-container">
        <Nodata v-if="showError" text='邀请链接失效，请重新邀请'></Nodata>
        <template v-else>
          <div class="iframe-container">
            <iframe title="登录" :src=url class="iframe-content" />
          </div>
          <div class="desc-content">
            <router-link :to="{ name: 'login'}">已有账户去登录</router-link>
          </div>
        </template>
      </div>
    </div>
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
  background: url(@/assets/images/login/bg.png) no-repeat;
  background-size: cover;
}
.register-page {
  width: 100%;
  height: 100%;
  padding: 48px;
  .register-container {
    position: relative;
    margin: 0 auto;
    height: 100%;
    overflow: auto;
    background-color: #fff;
    box-shadow:  0 4px 16px 0 rgba(35,37,43,0.1);
    border-radius: 8px;
    &:after {
      content: ' ';
      position: absolute;
      height: 30px;
      top: 0;
      left: 20px;
      right: 20px;
      z-index: 1;
      background-color: #fff;
    }
  }
  .iframe-container {
    height: 100%;
    width: 100%;
    overflow: auto;
  }
  .iframe-content {
    width: 1210px;
    margin-left: 30px;
    height: 551px;
    border: none;
  }
  .desc-content {
    position: absolute;
    bottom: 32px;
    right: 32px;
    font-size: $font-size-xs;
  }
}
</style>
