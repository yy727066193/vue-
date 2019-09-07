<template>
  <!--input-->
  <el-input v-if="formItem.formType === 'input'"
            v-model.trim="data"
            :placeholder="`请输入${formItem.label}` || ''"
            :disabled="formItem.disabled || false"
            @change="handleChange">
  </el-input>

  <!--inputNumber-->
  <el-input v-else-if="formItem.formType === 'inputNumber'"
            type="number"
            v-model="data"
            :placeholder="`请输入${formItem.label}` || ''"
            :disabled="formItem.disabled || false">
  </el-input>

  <!--inputPassword-->
  <el-input v-else-if="formItem.formType === 'inputPassword'"
            type="password"
            v-model="data"
            :placeholder="`请输入${formItem.label}` || ''"
            :disabled="formItem.disabled || false">
  </el-input>

  <!--textarea-->
  <el-input v-else-if="formItem.formType === 'textarea'"
            v-model.trim="data"
            type="textarea"
            :placeholder="`请输入${formItem.label}` || ''"
            :disabled="formItem.disabled || false"
            :autosize="{ minRows: 3 }"
            @change="handleChange">
  </el-input>

  <!--select-->
  <el-select class="w100"
             v-else-if="formItem.formType === 'select'"
             v-model="data"
             :placeholder="`请选择${formItem.label}` || ''"
             :disabled="formItem.disabled || false"
             filterable
             @change="handleChange">
    <el-option v-for="(item, index) in formItem.option"
               :key="index" :label="item[selectProps.label]"
               :value="item[selectProps.value]"></el-option>
  </el-select>

  <!--cascader-->
  <el-cascader  class="w100"
                v-else-if="formItem.formType === 'cascader'"
                v-model="data"
                change-on-select
                :placeholder="`请选择${formItem.label}` || ''"
                :disabled="formItem.disabled || false"
                :options="formItem.option ? formItem.option : []"
                :props="cascaderProps"
                filterable
                @change="handleChange">
  </el-cascader>

  <!--date-->
  <el-date-picker
    class="w100"
    v-else-if="formItem.formType === 'date'"
    v-model="data"
    type="date"
    format="yyyy-MM-dd"
    value-format="yyyy-MM-dd"
    :clearable="false"
    @change="handleChange"
    :disabled="formItem.disabled || false"
    :placeholder="`请选择${formItem.label}` || ''">
  </el-date-picker>

  <!--datetime-->
  <el-date-picker
    class="w100"
    v-else-if="formItem.formType === 'datetime'"
    v-model="data"
    type="datetime"
    :clearable="false"
    format="yyyy-MM-dd HH:mm:ss"
    value-format="yyyy-MM-dd HH:mm:ss"
    @change="handleChange"
    :disabled="formItem.disabled || false"
    :placeholder="`请选择${formItem.label}` || ''">
  </el-date-picker>

  <!--datetimerange-->
  <el-date-picker
    class="w100"
    v-else-if="formItem.formType === 'datetimerange'"
    v-model="data"
    type="datetimerange"
    unlink-panels
    :clearable="false"
    format="yyyy-MM-dd HH:mm:ss"
    value-format="yyyy-MM-dd HH:mm:ss"
    range-separator="至"
    @change="handleChange"
    start-placeholder="开始日期"
    end-placeholder="结束日期">
  </el-date-picker>
</template>

<script>
  export default {
    name: 'AsyncFormItem',
    props: {
      formItem: {
        type: Object,
        default: () => {
          return {}
        }
      },
      value: {
        type: null,
        required: true
      }
    },
    computed: {
      cascaderProps () {
        if (this.formItem.defaultProps) {
          return this.formItem.defaultProps
        } else {
          return {
            label: 'label',
            children: 'children',
            value: 'value'
          }
        }
      },
      selectProps () {
        if (this.formItem.defaultProps) {
          return this.formItem.defaultProps
        } else {
          return {
            label: 'label',
            value: 'value'
          }
        }
      }
    },
    data () {
      return {
        data: this.formItem.formType === 'cascader' ? [] : null
      }
    },
    mounted () {
      this.onReady()
    },
    methods: {
      onReady () {
      },
      handleChange (val) {
        this.$emit('input', val)
      },
      clearData () {
        this.data = Array.isArray(this.data) ? [] : ''
      },
      setValue (val) {
        this.data = val
      }
    },
    watch: {
      data (val) {
        this.$emit('input', val)
      }
    }
  }
</script>
