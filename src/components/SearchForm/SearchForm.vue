<template>
  <section class="search-form" :class="{ 'search-collapse-active': visible }">
    <el-form :label-width="labelWidth"
             :label-position="labelPosition"
             :size="size"
             :model="formData"
             :rules="rules"
             ref="ruleForm">
      <div class="search-form-list search-header" :style="{ paddingRight: `${headerPR + 88}px` }">
        <el-form-item :style="{ width: `${100/modulesHeaderList.length}%` }"
                      v-for="(item, index) in modulesHeaderList" :key="index"
                      :label="item.label + ':'" v-if="item.formType"
                      :prop="item.name">
          <async-form-item :formItem="item" v-model="formData[item.name]" ref="childrenForm"></async-form-item>
        </el-form-item>
        <div class="search-header-right">
          <div class="search-header-right-main">
            <slot></slot>
          </div>
        </div>
        <el-button class="search-header-right-toggle" round plain type="success" :icon="visible ? 'el-icon-arrow-up' : 'el-icon-arrow-right'" @click="toggle" v-if="formModules.length > (splitIndex + 1)">{{ visible ? '收起': '展开' }}</el-button>
      </div>

      <el-collapse-transition>
        <div class="search-form-list" v-show="visible">
          <el-form-item v-for="(item, index) in modulesBodyList" :key="index" :label="item.label + ':'" v-if="item.formType" :prop="item.name">
            <async-form-item :formItem="item" v-model="formData[item.name]" ref="childrenForm"></async-form-item>
          </el-form-item>
        </div>
      </el-collapse-transition>
    </el-form>
  </section>
</template>

<script>
  import AsyncFormItem from '../AsyncForm/AsyncFormItem'

  export default {
    name: 'SearchForm',
    components: {
      AsyncFormItem
    },
    props: {
      labelWidth: {
        type: String,
        default: '130px'
      },
      labelPosition: {
        type: String,
        default: 'right'
      },
      size: {
        type: String,
        default: 'small'
      },
      formModules: {
        type: Array,
        default: () => {
          return []
        }
      },
      splitIndex: {
        type: Number,
        default: 1
      },
      headerPR: {
        type: Number,
        default: 200
      }
    },
    computed: {
      rules () {
        const obj = {};

        this.formModules.forEach((item) => {
          obj[item.name] = [];
          obj[item.name].push({
            required: item.required ? item.required : false,
            message: item.message || '未配置提示信息'
          });
        });

        return obj
      }
    },
    data () {
      return {
        visible: false,
        formData: {},
        list: [],
        modulesHeaderList: [],
        modulesBodyList: []
      }
    },
    mounted () {
      this.formatModules(this.splitIndex)
    },
    methods: {
      toggle () {
        if (this.splitIndex + 1 === this.list.length) {
          return;
        }
        this.visible = !this.visible;
        this.$emit('handleClickCollapse', this.visible)
      },
      formatModules(index) { // 表单分组
        for (let i = 0; i < this.formModules.length; i++) {
          if (this.formModules[i].formType) {
            this.list.push(this.formModules[i])
          }
        }

        for (let j = 0; j < this.list.length; j++) {
          if (j <= index) this.modulesHeaderList.push(this.list[j]);
          else this.modulesBodyList.push(this.list[j])
        }
      },
      getFormData () { // 获取表单数据
        const childrenFormList = this.$refs.childrenForm;

        for (let i = 0; i < childrenFormList.length; i++) {
          const childrenForm = childrenFormList[i];
          const key = childrenForm.formItem.name;
          const data = childrenForm.data;

          if (data === 0) {
            this.formData[key] = 0
          } else {
            this.formData[key] = data ? data : undefined
          }
        }

        return this.formData
      },
      clearFormData () { // 清空表单数据
        for (const key in this.formData) {
          this.formData[key] = null
        }
        this.$refs.childrenForm.forEach((item) => {
          item.clearData()
        });
        this.$refs.ruleForm.resetFields()
      },
    }
  }
</script>

<style lang="less" type="text/less">
  .search-form{
    width: 100%;
    padding-top: 10px;
  }
  .search-form-list{
    width: 100%;
    .el-form-item{
      display: inline-block;
      width: 33.3333%;
    }
  }

  .search-header{
    position: relative;
    .search-header-right{
      position: absolute;
      top: 0;
      right: 88px;
    }
    .search-header-right-toggle{
      position: absolute;
      right: 0;
      top: 0;
    }
  }
</style>
