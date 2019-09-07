<template>
  <list-router-page>
    <page-bread></page-bread>

    <div class="page-service-btn-wrapper">
      <el-button type="primary" @click="dialogVisible = true">新增</el-button>
    </div>

    <div class="page-table-wrapper">
      <el-table :data="tableData" border @selection-change="selectChange" ref="table">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip
                         v-for="(item, index) in tableLabel" :key="index +''"
                         :label="item.label"
                         :prop="item.name"
                         :sortable="item.sortable">
          <template slot-scope="scope">
            <span v-if="item.name === 'typeId'">{{ setTypeName(scope.row[item.name]) }}</span>
            <span v-else>{{ scope.row[item.name] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <!--<el-button type="primary" round plain size="mini" @click="linkTo(`qrCodeOrderDetail?id=${scope.row.id}`)">详情</el-button>-->
            <!--<el-button type="primary" round :plain="!scope.row.audit" :icon="!scope.row.audit ? 'fa fa-thumbs-down' : 'fa fa-thumbs-up'" @click="handleUpdateAudit(scope.$index, scope.row)"></el-button>-->
            <el-button type="warning" icon="el-icon-edit" size="mini" round plain @click="setRuleForm(scope.$index, scope.row)"></el-button>
            <popover-item @click="handleDeleteOne(scope.$index, scope.row)">
              <el-button type="danger" icon="el-icon-delete" size="mini" round plain disabled></el-button>
            </popover-item>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="填写信息" :visible.sync="dialogVisible" @close="handleDialogClose">
      <el-form :model="ruleForm" :rules="rules" status-icon label-width="150px" ref="ruleForm" label-position="right">
        <el-form-item label="设置类型" prop="typeId">
          <el-select v-model="ruleForm.typeId" class="w100">
            <el-option v-for="(item, index) in typeOption" :key="index + ''" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="积分(扣除输入负数)" prop="val">
          <el-input v-model.tirm="ruleForm.val" type="number"></el-input>
        </el-form-item>
        <el-form-item label="签到间隔设置(分钟)" prop="minScope">
          <el-input v-model.tirm="ruleForm.minScope" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div class="submit-dialog-btn">
        <popover-item @click="handleSubmit">
          <el-button type="primary">提交</el-button>
        </popover-item>
      </div>
    </el-dialog>
  </list-router-page>
</template>

<script>

  import service from "../../utils/service";
  import {clearObject, copyObject, showConfirm} from "../../utils/public";
  import helper from "../../utils/helper";

  const { integralSet } = global.globalConfig;

  export default {
    computed: {
      tableLabel() {
        return integralSet.tableLabel;
      }
    },
    data() {
      return {
        searchData: {},
        dialogVisible: false,
        tableData: [],
        typeOption: [],
        submitType: false,
        updateIndex: 0,
        updateRow: {},
        ruleForm: {
          typeId: '',
          val: '',
          minScope: ''
        },
        rules: {
          typeId: [{ required: true, message: '请选择设置类型' }],
          val: [{ required: true, message: '请输入积分(若是抽取请输入负数)' }],
          minScope: [{ required: false, message: '请输入签到签退时间间隔单位(分钟)' }]
        }
      }
    },
    mounted() {
      this.onReady()
    },
    methods: {
      onReady() {
        this.setTableData();
        this.setOption()
      },
      setRuleForm(index, row) { // 编辑写入表单默认值
        this.updateIndex = index;
        this.updateRow = row;
        this.ruleForm = JSON.parse(JSON.stringify(row));
        this.submitType = true;
        this.dialogVisible = true;
      },
      handleSubmit() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) this.submitType ? this.handleUpdateOne() : this.handleAddOne()
        })
      },
      handleAddOne() { // 新增
        service.integralSet.addOne({
          params: this.ruleForm,
          cb: data => {
            this.tableData.unshift(data);
            this.dialogVisible = false;
            helper.S();
          }
        })
      },
      handleUpdateOne() { // 编辑
        service.integralSet.updateOne({
          params: this.ruleForm,
          cb: data => {
            helper.S();
            this.dialogVisible = false;
            this.tableData[this.updateIndex] = copyObject(this.tableData[this.updateIndex], data);
          }
        })
      },
      handleDeleteOne(index, row) {
        service.integralSet.deleteOne({
          params: { id: row.id },
          cb: () => {
            this.tableData.splice(index, 1);
            helper.S()
          }
        })
      },
      handleDialogClose() {
        this.$refs.ruleForm.resetFields();
        clearObject(this.ruleForm);
        this.submitType = false;
      },
      setTableData() {
        service.integralSet.list({
          params: this.searchData,
          cb: data => {
            this.tableData = data;
          }
        })
      },
      setOption() {
        service.integralType.list({
          cb: data => {
            this.typeOption = data;
          }
        })
      },
      setTypeName(id) {
        const findArr = this.typeOption.filter(item => item.id === id);

        return findArr.length === 1 ? findArr[0].label || '' : ''
      }
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../assets/style/pageItem.less";
</style>
