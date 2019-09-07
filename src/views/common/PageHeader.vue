<template>
  <section class="header-wrapper">
    <div class="header-wrapper-logo">
      <img src="http://hrlb-online.oss-cn-beijing.aliyuncs.com/images/hr_logo.jpg" />
    </div>
    <div class="header-wrapper-login">
      <div class="header-wrapper-login-info">
        <el-dropdown @command="handleCommand">
        <span class="header-wrapper-login-info-name">
          <i class="fa fa-user-o icon-user"></i>
          {{ userInfo.user.nickname }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="loginOut">登出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </section>
</template>

<script>
  import {clearSessionLoginInfo, getSessionLoginInfo} from "../../utils/public"; 

  export default {
    computed: {
      userInfo() {
        return getSessionLoginInfo().userInfo
      }
    },
    methods: {
      handleCommand(command) {
        if (command === 'loginOut') {
          clearSessionLoginInfo();
          this.$router.replace('/');
          location.reload(true)
        }
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  .header-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    padding: 5px 20px;
    &:after{
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      transform: scaleY(0.5);
      background-color: rgba(0, 0, 0, 0.4);
    }
    &-logo{
      width: 50px;
      float: left;
      img{
        width: 100%;
      }
    }
    &-login{
      float: right;
      width: 120px;
      height: 100%;
      position: relative;
      &-info{
        height: 22px;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -11px;
        &-name{
          text-align: center;
          cursor: pointer;
          color: #3a8ee6;
          font-size: 16px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
</style>
