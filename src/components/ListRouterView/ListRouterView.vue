<template>
  <transition name="list-router-page">
    <router-view class="list-router-page-wrapper"></router-view>
  </transition>
</template>

<script>
  export default {
    name: 'ListRouterView'
  }
</script>

<style lang="less" type="text/less">
  .list-router-page-wrapper{
  }
  .list-router-page-enter,
  .list-router-page-leave-active{
  }
  .list-router-page-enter-active,
  .list-router-page-leave-active{
  }
</style>
