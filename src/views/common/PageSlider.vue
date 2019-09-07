<template>
  <section class="page-slider-wrapper">
    <div class="page-slider-wrapper-toggle" @click="$emit('handleToggleClick')">
      <i :class="isCollapse ? 'fa fa-arrows toggle-active' : 'fa fa-arrows-alt'" aria-hidden="true"></i>
      <span v-show="!isCollapse">收起</span>
    </div>
    <el-menu class="page-slider-wrapper-main"
             :collapse="isCollapse"
             router
             :default-active="defaultRoute">
      <el-menu-item index="home">
        <i class="fa fa-square-o" aria-hidden="true"></i>
        <span>{{ '控制台' }}</span>
      </el-menu-item>
      <el-menu-item v-for="(item, index) in modules" :key="index + ''" :index="item.path" v-if="item.path || !item.modules">
        <i class="fa fa-square-o" aria-hidden="true"></i>
        <span>{{ item.title }}</span>
      </el-menu-item>
      <el-submenu v-else :index="index + ''" :key="index + ''">
        <template slot="title">
          <i class="fa fa-square" aria-hidden="true"></i>
          <span slot="title">{{ item.title }}</span>
        </template>
        <el-menu-item v-for="(cItem, cIndex) in item.modules" :key="cIndex + ''" :index="cItem.path">
          <i class="fa fa-circle-o" aria-hidden="true"></i>
          <span slot="title">{{ cItem.title }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </section>
</template>

<script>
  export default {
    props: {
      modules: {
        type: Array,
        default: () => {
          return []
        }
      },
      isCollapse: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      defaultRoute () {
        return this.$route.path.replace('/', '')
      },
    }
  }
</script>

<style lang="less" type="text/less">
  .page-slider-wrapper{
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    &-toggle{
      height: 56px;
      width: 100%;
      padding: 0 20px;
      cursor: pointer;
      font-size: 14px;
      line-height: 56px;
      &:hover{
        background-color: #ecf5ff;
      }
    }
    .toggle-active{
      color: #409EFF;
    }
    &-main{
      border-right: 0;
    }
  }
</style>
