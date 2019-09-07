<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSessionLoginInfo, formatRouter, clearSessionLoginInfo} from "./utils/public";

  export default {
    name: 'App',
    mounted () {
      this.onReady()
    },
    methods: {
      onReady() {
        const { modules } = getSessionLoginInfo();

        if (modules) {
          const router = formatRouter(modules);

          this.$router.addRoutes(router)
        } else {
          clearSessionLoginInfo();

          this.$router.replace('/')
        }
      }
    }
  }
</script>

<style lang="less" type="text/less">
  @import "./assets/style/reset.less";
</style>
