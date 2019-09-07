<template>
  <div class="list-router-page-wrapper" :style="{ backgroundColor }">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'ListRouterPage',
    props: {
      backgroundColor: {
        type: String,
        default: '#fff'
      }
    }
  }
</script>

<style lang="less" type="text/less">
  .list-router-page-wrapper{
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
