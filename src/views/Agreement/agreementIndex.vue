<script lang="ts" setup>
import globalApi from '@/api/global'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import _ from 'lodash'
const route = useRoute()

onMounted(() => {
  const code = route.params.resourceCode
  const projectCode = route.params.projectCode
  globalApi.getAgreement({ contentType: 2, currentPageNo: 1, pageSize: 10, projectCode: projectCode || '', resourceCode: code || '' }).then(res => {
    if (res.code === '1') {
      console.log(res.data)
      const content = document.getElementById('agreement-content')
      if (res.data && res.data.length && content) {
        content.innerHTML = _.get(res.data[0], 'content', '暂无内容')
      }
    }
  }).catch(error => {
    ElMessage.error(error)
  })
})
</script>

<template>
  <div id="agreement-content">
  </div>
</template>

<style lang="scss">
#agreement-content {
  padding: 0 16px 16px;
  html, body, div,
  h1, h2, h3, h4, h5, h6,
  hr, p, blockquote,
  dl, dt, dd, ul, ol, li,
  pre, form, fieldset, object, code,
  legend, button, input, textarea, label,
  th, td, a, img {
    margin: revert;
    padding: revert;
  }
  body {
    font: initial
  }
}
</style>
