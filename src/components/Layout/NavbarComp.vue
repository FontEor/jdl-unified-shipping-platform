<!-- filename: IndexComp.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
// import { MenuItem } from '@/interfaces/menu'
import _ from 'lodash'

const route = useRoute()
const store = useStore()

const isCollapse = ref(false)

const menuList = store.getters.getMenus
const defaultActive = computed(
  () => (_.get(route, 'meta.activePath', '') as string) || route.path,
)
</script>
<template>
  <div :class="['navbar-comp', !isCollapse ? '' : 'navbar-comp-collapse']">
    <el-menu
      :default-active="defaultActive"
      :collapse="isCollapse"
      mode="vertical"
      class="navbar-menu"
      router
    >
      <template v-for="item in menuList">
        <el-sub-menu
          v-if="item.children && item.children.length"
          :key="item.path"
          :index="item.path"
        >
          <template #title>
            <i :class="item.icon"></i>
            <span class="ml-sm">{{ item.meta.title }}</span>
          </template>
          <el-menu-item
            :index="twoItem.path"
            v-for="twoItem in item.children"
            :key="twoItem.id"
            >{{ twoItem.meta.title }}</el-menu-item
          >
        </el-sub-menu>
        <el-menu-item v-else :key="item.path + 'else'" :index="item.path">
          <i :class="item.icon"></i>
          <span class="ml-sm">{{ item.meta.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
    <div class="navbar-retract" @click="isCollapse = !isCollapse">
      <span class="navbar-retract-top"></span>
      <img src="@/assets/images/server/navbar.png" class="sidebar-logo" />
    </div>
  </div>
</template>
<style lang="scss">
.navbar-comp {
  height: 100%;
  .navbar-menu {
    position: relative;
    // flex: 0 0 190px;
    width: 190px;
    transition: width 0s ease;
    padding: 0 8px;
    padding-top: $mw;
    height: 100%;
    overflow: auto;
    --el-menu-item-height: 40px;
    --el-menu-sub-item-height: 40px;
    .el-menu {
      border-right: none;
    }
    .el-menu-item {
      padding-left: 18px;
      padding-right: 6px;
      border-radius: 8px;
      &:hover {
        background-color: $grey;
      }
      &.is-active {
        background-color: var(--s-blue-1);
      }
    }
    .el-sub-menu {
      .el-sub-menu__icon-arrow {
        right: 8px;
      }
    }
    .el-sub-menu__title:hover {
      border-radius: 8px;
      background-color: $grey;
    }
  }
  .navbar-retract {
    position: absolute;
    left: 190px;
    transition: left 0s ease;
    top: 50%;
    cursor: pointer;
    .navbar-retract-top::before {
      content: '<';
      position: absolute;
      bottom: 18px;
      color: $font-color-light;
    }
  }
}
.navbar-comp-collapse {
  .navbar-menu {
    width: 64px;
  }
  .navbar-retract {
    left: 63px;
  }
}
</style>
