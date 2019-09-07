<template>
  <div class="login-container">
    <div class="login-bg-wrapper">
      <point-canvas lineColor="#409EFF" pointColor="#67C23A"></point-canvas>
    </div>
    <div class="login-main-wrapper">
      <div class="login-main-container">
        <div class="login">
          <div class="login-title"><h3>终端微商管理平台</h3></div>
          <div class="login-body">
            <el-form :model="ruleForm" :rules="rules" status-icon label-width="20px" label-position="right" ref="ruleForm">
              <el-form-item prop="uname">
                <i slot="label" class="fa fa-user-o"></i>
                <el-input v-model.trim="ruleForm.uname" placeholder="请输入账号" @keyup.enter.native="submit"></el-input>
              </el-form-item>
              <el-form-item prop="pwd">
                <i slot="label" class="fa fa-lock"></i>
                <el-input v-model.trim="ruleForm.pwd" type="password" placeholder="请输入密码" @keyup.enter.native="submit"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="login-footer">
            <el-button type="primary" class="w100" @click="submit">登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { PointCanvas } from '../components'
  import service from "../utils/service"
  import enums from "../utils/enums"
  import {clearSessionLoginInfo, formatRouter, getSessionLoginInfo, saveSessionLoginInfo} from "../utils/public"

  export default {
    components: {
      PointCanvas
    },
    data () {
      return {
        ruleForm: {
          uname: '',
          pwd: ''
        },
        rules: {
          uname: [
            { required: true, message: '请输入账号' }
          ],
          pwd: [
            { required: true, message: '请输入密码' }
          ]
        }
      }
    },
    mounted() {
      this.onReady()
    },
    methods: {
      onReady() {
        const { modules, userInfo } = getSessionLoginInfo();
        if (modules && userInfo) {
          this.$router.replace('/home')
        } else {
          clearSessionLoginInfo();
          this.$router.replace('/')
        }
      },
      submit () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) this.doLogin()
        })
      },
      async doLogin() {
        const { code, data } = await service.login(this.ruleForm);
        if (code === enums.SUCCESS_CODE) {
          const { modules, userInfo } = data;
          const formatModules = this.formatData(modules);
          const routes = formatRouter(formatModules);

          saveSessionLoginInfo({ modules: formatModules, userInfo });

          this.$router.addRoutes(routes);
          this.$router.replace('/home')
        }
      },
      formatData(data) {
        const modules = [];

        data.forEach((item) => {
          if (item.parentId === 0) modules.push(item);
          item.modules = []
        });

        for (let i = 0; i < modules.length; i++) {
          data.forEach((item) => {
            if (item.parentId === modules[i].id) {
              modules[i].modules.push(item)
            }
          })
        }

        return modules
      }
    }
  }
</script>

<style lang="less" type="text/less">
  .login-container{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .login-bg-wrapper,
  .login-main-wrapper{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    width: 100%;
    overflow: hidden;
  }
  .login-bg-wrapper{
    z-index: 10;
  }
  .login-main-wrapper{
    z-index: 20;
    .login-main-container{
      width: 100%;
      height: 100%;
      position: relative;
    }
  }
  .login{
    width: 320px;
    position: absolute;
    z-index: 30;
    left: 50%;
    margin-left: -160px;
    padding: 10px;
    top: 30%;
    .login-title{
      width: 100%;
      text-align: center;
      font-size: 20px;
      padding-bottom: 20px;
    }
    .login-body{
      .el-form-item__label{
        &:before {
          content: '';
          display: table;
        }
      }
      .el-form-item .el-input__inner{
        border-top: 0;
        border-right: 0;
        border-left: 0;
        border-radius: 0;
        padding: 0;
        background: transparent;
      }
    }
  }
</style>
