<template placement="top">
  <el-popover  :placement="placement"
               :width="width"
               v-model="visible">
    <p>{{ msg }}</p>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="text" @click="visible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="handleOk">确定</el-button>
    </div>
    <slot slot="reference">
    </slot>
  </el-popover>
</template>

<script>
  export default {
    name: 'PopoverItem',
    props: {
      placement: {
        type: String,
        default: 'top'
      },
      width: {
        type: [String, Number],
        default: 16
      },
      msg: {
        type: [String, Number],
        default: '确认执行吗?'
      }
    },
    data() {
      return {
        visible: false
      }
    },
    methods: {
      handleOk() {
        this.visible = false;
        this.$emit('click')
      }
    }
  }
</script>
