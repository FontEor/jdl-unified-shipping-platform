<template>
  <div v-loading="state.loading" class="fbox eye-wrap">
    <span :class="{ ellipsis: 'text-content' }">{{prifix}}{{ state.showPlainText ? state.plaintext : props.cipherText }}</span>
    <template v-if="cipherText">
      <span
        class="ux-icon-view cursor-pointer eye ml-sm f-size"
        v-if="state.showPlainText"
        @click="state.showPlainText = false"
      ></span>
      <span
        class="ux-icon-view-close cursor-pointer eye ml-sm f-size"
        v-else
        @click="handleGetPlainText"
      ></span>
    </template>
  </div>
</template>
<script setup lang="ts">
import { PropType, reactive } from 'vue'

const props = defineProps({
  cipherText: {
    type: String,
    default: '',
  },
  getPlainText: {
    type: Function,
    required: true,
  },
  formatPlainResponse: {
    type: Function,
  },
  ellipsis: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  prifix: String,
})
const state = reactive({
  plaintext: '',
  showPlainText: false,
  loading: false,
})
const handleGetPlainText = async () => {
  state.loading = true
  try {
    const response = await props.getPlainText()
    if (props.formatPlainResponse) {
      state.plaintext = props.formatPlainResponse(response)
    } else {
      state.plaintext = response
    }
    state.showPlainText = true
    state.loading = false
  } catch (err) {
    state.loading = false
  }
}
</script>
<style lang="scss" scoped>
.eye {
  color: $view-eyes;
  flex-shrink: 0;
}
.eye-wrap {
  align-items: center;
}
.text-content {
  max-width: 80%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
}
</style>
