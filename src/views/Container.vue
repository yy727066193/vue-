<template>
  <div class="page-wrapper">
    <div class="page-wrapper-header">
      <page-header></page-header>
    </div>
    <div class="page-wrapper-container">
      <div class="page-wrapper-container-inner">
        <div class="page-wrapper-container-inner-slider" :style="{ width: isCollapse ? '64px': '200px' }">
          <page-slider :modules="modules" :isCollapse="isCollapse" @handleToggleClick="changeIsCollapse"></page-slider>
        </div>
        <div class="page-wrapper-container-inner-main" :style="{ left: isCollapse ? '64px' : '200px' }">
          <div class="page-wrapper-container-inner-main-content">
            <list-router-view></list-router-view>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="imageDialogVisible" title="大图">
      <div style="text-align: center; width: 100%">
        <img :src="dialogImageUrl" style="max-width: 100%; max-height: 100%;" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import PageHeader from './common/PageHeader'
  import PageSlider from './common/PageSlider'
  import {getSessionLoginInfo} from "../utils/public";

  export default {
    components: {
      PageHeader,
      PageSlider
    },
    computed: {
      modules() {
        return getSessionLoginInfo().modules
      },
      userInfo() {
        return getSessionLoginInfo().userInfo
      }
    },
    data() {
      return {
        isCollapse: false,
        imageDialogVisible: false,
        dialogImageUrl: ''
      }
    },
    methods: {
      changeIsCollapse() {
        this.isCollapse = !this.isCollapse
      },
      showImageDialog(dialogImageUrl='') {
        this.dialogImageUrl = dialogImageUrl;
        this.imageDialogVisible = true
      }
    }
  }
</script>

<style type="text/less" lang="less">
  .page-wrapper{
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    &-header{
      width: 100%;
      height: 60px;
    }
    &-container{
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
      right: 0;
      top: 60px;
      overflow: hidden;
      &-inner{
        width: 100%;
        height: 100%;
        position: relative;
        &-slider{
          height: 100%;
          transition: width 0.2s;
        }
        &-main{
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          overflow: hidden;
          transition: left 0.2s;
          &-content{
            width: 100%;
            height: 100%;
            padding: 10px 16px;
          }
        }
      }
    }
  }
</style>
