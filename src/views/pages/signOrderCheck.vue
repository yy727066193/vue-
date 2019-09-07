<template>
  <list-router-page>
    <page-bread></page-bread>
    <el-radio-group v-model="radio" class="header-radio">
      <el-radio :label="1"> 扫码签到 </el-radio>
      <el-radio :label="2"> 扫码核销 </el-radio>
    </el-radio-group>
    <el-input
      type="password"
      placeholder="扫码输入,请勿手动输入！"
      v-model="inputVal"
      clearable @blur="setFource"
      @keyup.enter.native="submitVal"
      ref="codeSignRef">
    </el-input>
    <audio ref="0" src="../../../static/scanCodeMp3/signIn.mp3">
      您的浏览器不支持HTML5播放器呢！赶紧换一个最新的呗^_^.
    </audio>
    <audio ref="error" src="../../../static/scanCodeMp3/signInFailed.mp3">
      您的浏览器不支持HTML5播放器呢！赶紧换一个最新的呗^_^.
    </audio>
    <audio ref="-4" src="../../../static/scanCodeMp3/toSignIn.mp3">
      您的浏览器不支持HTML5播放器呢！赶紧换一个最新的呗^_^.
    </audio>
  </list-router-page>
</template>

<script type='text/ecmascript-6'>
  import helper from "../../utils/helper"
  import enums from "../../utils/enums"
  import api from "../../utils/api"
  import service from "../../utils/service"

  const { scanCodeList } = global.globalConfig;

  export default {
    data() {
      return {
        radio: 1,
        inputVal:"",
        retList: [0, -4]
      }
    },
    mounted() {
      this.setFource()
    },
    methods: {
      submitVal(){  //  通过回车键监听input框的值
        const usedInputVal = this.inputVal
        this.inputVal = ""
        this.radio === 1 ? this.scanCode(usedInputVal) : this.scanSign(usedInputVal);
      },
      setFource() {
        this.$refs.codeSignRef.focus();
      },
      scanCode(uid) { // 扫码签到
        if(uid)
        service.signOrCode.register({
          params: {uid},
          cb: ({ msg , ret}) => {
            !ret ? helper.N_S(msg) : helper.N_W(msg);
            this.setFource();
            this.retList.indexOf(ret) !== -1 ? this.$refs[ret + ''].play() : this.$refs.error.play()
          }
        });
      },
      scanSign(id) { // 扫码核销
        if(id)
        service.signOrCode.complete({
          params: {id},
          cb: ({ msg, ret }) => {
            !ret ? helper.N_S(msg) : helper.N_W(msg)
            this.setFource()
          }
        });
      }
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../assets/style/pageItem.less";
</style>
