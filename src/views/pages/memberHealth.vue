<template>
  <list-router-page>
    <page-bread></page-bread>

    <!--<search-form v-if="isReady" :formModules="tableLabel" ref="searchForm" label-width="120px">-->
      <!--<el-button type="primary" round plain icon="el-icon-search" @click="handleSearchData">查询</el-button>-->
      <!--<el-button type="danger" round plain icon="el-icon-delete" @click="handleClearSearchData">清空</el-button>-->
    <!--</search-form>-->

    <div class="page-service-btn-wrapper">
      <!--<el-popover  placement="top" width="200" v-model="popoverVisible">-->
        <!--<p>请选择你要批量商品状态</p>-->
        <!--<div class="popover-wrapper">-->
          <!--<el-radio-group v-model="popoverVal">-->
            <!--<el-radio-button v-for="(item, index) in statusList" :key="index + ''" :label="item.value">-->
              <!--{{ item.startEndLabel }}-->
            <!--</el-radio-button>-->
          <!--</el-radio-group>-->
        <!--</div>-->
        <!--<div class="popover-wrapper-btn">-->
          <!--<el-button @click="popoverVisible = false" type="text" size="mini">取消</el-button>-->
          <!--<el-button type="primary" size="mini" @click="doUpdateStatusByIds">提交</el-button>-->
        <!--</div>-->
      <!--</el-popover>-->
      <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      <!--<el-button type="primary" @click="handleAllUpdateAudit">批量审核</el-button>-->
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
            <span v-if="item.name === 'createTime'">{{ dateFormat(scope.row[item.name] * 1 * 1000, 'yyyy-mm-dd HH:MM:ss') }}</span>
            <span v-else>{{ scope.row[item.name] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <!--<el-button type="primary" round plain size="mini" @click="linkTo(`qrCodeOrderDetail?id=${scope.row.id}`)">详情</el-button>-->
            <!--<popover-item @click="handleUpdateAudit(scope.$index, scope.row)">-->
              <!--<el-button type="primary" round :plain="!scope.row.status" :icon="!scope.row.status ? 'fa fa-thumbs-down' : 'fa fa-thumbs-up'"></el-button>-->
            <!--</popover-item>-->
            <el-button type="warning" icon="el-icon-edit" size="mini" round plain @click="setRuleForm(scope.$index, scope.row)"></el-button>
            <popover-item @click="handleDeleteOne(scope.$index, scope.row)">
              <el-button type="danger" icon="el-icon-delete" size="mini" round plain></el-button>
            </popover-item>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--<div class="page-page-wrapper">-->
      <!--<el-pagination-->
        <!--background-->
        <!--@size-change="handleSizeChange"-->
        <!--@current-change="handleCurrentChange"-->
        <!--layout="total, prev, pager, next, jumper, sizes"-->
        <!--:page-size="pageSize"-->
        <!--:total="total">-->
      <!--</el-pagination>-->
    <!--</div>-->

    <el-dialog title="填写信息" :visible.sync="dialogVisible" @close="handleDialogClose">
      <el-form :model="ruleForm" :rules="rules" status-icon label-width="160px" ref="ruleForm" label-position="right">
        <el-form-item label="健康名称" prop="name">
          <el-input v-model.trim="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序(数值越小越靠前)" prop="sortId">
          <el-input v-model.trim="ruleForm.sortId" type="number"></el-input>
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
  import helper from '../../utils/helper'
  import {clearObject, copyObject} from "../../utils/public";
  import dateFormat from 'dateformat'

  const { memberHealth } = global.globalConfig;

  export default {
    computed: {
      tableLabel() {
        return memberHealth.tableLabel
      },
      dateFormat() {
        return dateFormat
      }
    },
    data() {
      return {
        searchData: {},
        tableData: [],
        dialogVisible: false,
        // pageNum: 1,
        // pageSize: 10,
        // total: 0,
        updateIndex: 0, // 被编辑的索引
        updateRow: {}, // 被编辑行数据
        submitType: false, // 编辑还是新增
        ruleForm: {
          name: '',
          sortId: ''
        },
        rules: {
          name: [{required: true, message: '请输入健康名称'}],
          sortId: [{required: true, message: '请输入排序序号，数值越小越靠前'}]
        },
      }
    },
    mounted () {
      this.onReady()
    },
    methods: {
      onReady() {
        this.setTableData();
      },
      setRuleForm(index, row) { // 编辑写入表单默认值
        this.updateIndex = index;
        this.updateRow = row;
        this.ruleForm = JSON.parse(JSON.stringify(row));
        this.submitType = true;
        this.dialogVisible = true;
      },
      handleSubmit() { // 提交
        this.$refs.ruleForm.validate(valid => {
          if (valid) this.submitType ? this.handleUpdateOne() : this.handleAddOne()
        })
      },
      handleAddOne() { // 新增
        service.memberHealth.addOne({
          params: this.ruleForm,
          cb: data => {
            this.setTableData();
            this.dialogVisible = false;
            helper.S();
          }
        });
      },
      handleUpdateOne() { // 编辑
        service.memberHealth.updateOne({
          params: this.ruleForm,
          cb: data => {
            this.setTableData();
            this.dialogVisible = false;
            helper.S();
          }
        })
      },
      handleDeleteOne(index, row) { // 删除
        service.memberHealth.deleteOne({
          params: {id: row.id},
          cb: () => {
            this.tableData.splice(index, 1);
            helper.S()
          }
        });
      },
      handleDialogClose() {
        this.$refs.ruleForm.resetFields();
        clearObject(this.ruleForm);
        this.submitType = false;
      },
      setTableData() {
        service.memberHealth.list({
          cb: (list) => {
            this.tableData = list;
          }
        })
      }
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../assets/style/pageItem.less";
</style>
