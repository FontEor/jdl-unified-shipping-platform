<script setup lang="ts">
import { computed } from 'vue'
import { loginPageUrl } from '@/utils/login'
const loginUrl = computed(() => loginPageUrl())
</script>

<template>
  <div class="login-page">
    <img src="@/assets/images/login/logo.png" class="logo" />
    <div class="login-container">
      <p className="login-title">账户登录</p>
      <!-- <div class="tips text-color-lighter mt-md">*请使用账号名和密码登录</div> -->
      <iframe title="登录" :src="loginUrl" class="iframe-content"></iframe>
      <div class="desc-content">
        <router-link class="to-register" :to="{ name: 'register'}">
          <span class="ux-icon-arrow-cycle-right-solid"><span class="path1"></span><span class="path2"></span></span>
          立即注册
        </router-link>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .login-page {
  height: 100%;
  position: relative;
  background: url(@/assets/images/login/bg.png) no-repeat;
  background-size: cover;
  .logo {
    position: absolute;
    z-index: 1;
    top: 40px;
    left: 40px;
    height: 40px;
  }
  .login-container {
    width: 376px;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    right: 80px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow:  0 8px 24px 0 rgba(26,26,26,0.04);
  }
  .login-title {
    padding: 15px 34px 19px;
    box-shadow: inset 0 -1px 0 0 rgba(241,242,244,1);
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: $font-color;
  }
  .iframe-content {
    margin: 0px auto 0px;
    width: 100%;
    height: 265px;
    border: none;
  }
  .desc-content {
    background: #fcfcfc;
    height: 50px;
    line-height: 50px;
    box-shadow: inset 0 1px 0 0 rgba(241,242,244,1);
    font-size: $font-size-default;
    padding-right: 34px;
    a {
      color: $red;
    }
    .to-register {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
