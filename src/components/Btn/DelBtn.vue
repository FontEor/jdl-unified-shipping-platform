<template>
  <div class="del-btn-comp">
    <el-button type="primary" @click="handleDel" link
    :clstag="clstag"
      ><slot>删除</slot></el-button
    >
    <el-dialog
      v-model="dialogVisible"
      class="del-btn-dialog"
      width="450"
      :append-to-body="true"
    >
      <div class="content">
        <img
          class="content-img"
          src="@/assets/images/framework/warning.png"
          alt=""
        />
        <span>{{ content }}</span>
      </div>
      <div class="sub-content">
        {{ subContent }}
      </div>
      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button @click="handleCancel">取消</el-button> -->
          <el-button type="primary" @click="handleOk">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
type row = any
type delFun = (row: row) => boolean | Promise<boolean>

const props = withDefaults(
  defineProps<{
    delFun: delFun
    content?: string
    subContent?: string
    row: row,
    clstag: string
  }>(),
  {
    delFun: () => {
      return true
    },
    content: '是否确认删除？',
    subContent: '删除后将无法撤回',
    clstag: '',
  },
)

const dialogVisible = ref(false)

function handleCancel () {
  dialogVisible.value = false
}
async function handleOk () {
  try {
    const res = await props.delFun(props.row)
    console.log(res, 'rrr')
    if (res) {
      dialogVisible.value = false
    }
  } catch (error) {
    console.log(error)
  }
}

function handleDel () {
  dialogVisible.value = true
}
</script>
<style lang="scss">
.del-btn-comp {
  display: inline-block;
}
.del-btn-dialog {
  .el-dialog__header {
    border-bottom: none;
  }
  // .el-dialog__footer {
  //   border-top: none;
  // }
  .content {
    height: 20px;
    line-height: 20px;
    font-weight: 600;
    color: rgba(35, 37, 43, 1);
    .content-img {
      width: 18px;
      height: 18px;
    }
  }
  .sub-content {
    height: 20px;
    margin-top: 8px;
    padding-left: 18px;
    color: rgba(134, 141, 159, 1);
  }
}
</style>
