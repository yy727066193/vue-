<template>
  <div class="page-bread-wrapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, index) in breadList" :key="index + ''">
        {{ item }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  import {getSessionLoginInfo} from "../../utils/public";

  export default {
    name: 'PageBread',
    computed: {
      path() {
        return this.$route.path.replace('/', '')
      },
      modules() {
        return getSessionLoginInfo().modules
      }
    },
    data() {
      return {
        breadList: []
      }
    },
    mounted() {
      this.onReady()
    },
    methods: {
      onReady() {
        this.setBreadList()
      },
      setBreadList() {
        if (this.path === 'home') {
          this.breadList.push('控制台');
        } else {
          for (let i = 0, len = this.modules.length; i < len; i++) {
            let item = this.modules[i];

            if (item.path && item.path === this.path) {
              this.breadList.push(item.title);

              break;
            } else if (item.modules && !item.path) {
              for (let j = 0, jLen = item.modules.length; j < jLen; j++) {
                let cItem = item.modules[j];

                if (cItem.path === this.path) {
                  let parentId = cItem.parentId;
                  let parentName = this.modules.filter(item => item.id === parentId)[0].title || '';
                  let childrenName = cItem.title;

                  this.breadList.push(parentName, childrenName)
                }
              }
            }
          }
        }
        if (this.breadList.length !== 0) {
          document.title = `${this.breadList.join('/')}`
        } else {
          document.title = '终端微商管理平台'
        }
      }
    }
  }
</script>

<style lang="less" type="text/less">
</style>
