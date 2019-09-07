<template>
  <el-form :label-width="labelWidth"
           :label-position="labelPosition"
           :size="size"
           :model="formData"
           :rules="rules"
           ref="ruleForm">
    <el-form-item v-for="(item, index) in formModules" :key="index" :label="item.label + ':'" v-if="item.formType" :prop="item.name">
      <async-form-item :formItem="item" v-model="formData[item.name]" ref="childrenForm"></async-form-item>
    </el-form-item>
  </el-form>
</template>

<script>
  import AsyncFormItem from './AsyncFormItem'

  export default {
    name: 'AsyncForm',
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
      }
    },

    computed: {
      rules () {
        const obj = {};

        const getMsg = (item) => {
          const { formType, label } = item;
          if (formType === 'input' || formType === 'textarea' || formType === 'inputNumber' || formType === 'inputPassword') {
            return `请输入${label}`
          } else if (formType === 'select' || formType === 'cascader' || formType === 'date' || formType === 'datetime' || formType === 'datetimerange') {
            return `请选择${label}`
          } else {
            return `未知错误提示`
          }
        };

        this.formModules.forEach((item) => {
          obj[item.name] = [];

          obj[item.name].push({
            required: item.required ? item.required : false,
            message: getMsg(item)
          })
        });

        return obj
      }
    },
    data() {
      return {
        formData: {}
      }
    },
    methods: {
      getFormData () { // 获取表单数据
        const childrenFormList = this.$refs.childrenForm;

        for (let i = 0; i < childrenFormList.length; i++) {
          const childrenForm = childrenFormList[i];
          const key = childrenForm.formItem.name;
          const data = childrenForm.data;

          this.formData[key] = data ? data : undefined
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
