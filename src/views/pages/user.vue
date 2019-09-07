<template>
  <list-router-page>
    <page-bread></page-bread>

    <search-form v-if="tableLabel.length !== 0" :formModules="tableLabel" ref="searchForm" label-width="115px">
      <el-button type="primary" round plain icon="el-icon-search" @click="handleSearchData">查询</el-button>
      <el-button type="danger" round plain icon="el-icon-delete" @click="handleClearSearchData">清空</el-button>
    </search-form>

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
            <span v-if="item.name === 'gid'">{{ setGidName(scope.row[item.name]) }}</span>
            <span v-else>{{ scope.row[item.name] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!--<el-button type="primary" round plain size="mini" @click="linkTo(`qrCodeOrderDetail?id=${scope.row.id}`)">详情</el-button>-->
            <popover-item @click="handleUpdateAudit(scope.$index, scope.row)">
              <el-button type="primary" round :plain="!scope.row.status" :icon="!scope.row.status ? 'fa fa-thumbs-down' : 'fa fa-thumbs-up'"></el-button>
            </popover-item>
            <el-button type="warning" icon="el-icon-edit" size="mini" round plain @click="setRuleForm(scope.$index, scope.row)"></el-button>
            <popover-item @click="handleDeleteOne(scope.$index, scope.row)">
              <el-button type="danger" icon="el-icon-delete" size="mini" round plain :disabled="scope.row.id === 1"></el-button>
            </popover-item>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="page-page-wrapper">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper, sizes"
        :page-size="pageSize"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog title="填写信息" :visible.sync="dialogVisible" @close="handleDialogClose">
      <el-form :model="ruleForm" :rules="rules" status-icon label-width="150px" ref="ruleForm" label-position="right">
        <el-form-item label="账号" prop="uname">
          <el-input v-model.trim="ruleForm.uname" :disabled="submitType"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model.trim="ruleForm.pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="gid">
          <el-select class="w100" v-model="ruleForm.gid" filterable>
            <el-option v-for="(item, index) in roleOption" :key="index + ''" :label="item.title" :value="item.id" :disabled="item.id === 1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="nickname">
          <el-input v-model.trim="ruleForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model.trim="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="账号状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio-button v-for="(item, index) in statusList" :key="index + ''" :label="item.value">
              {{ item.startEndLabel }}
            </el-radio-button>
          </el-radio-group>
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
  import {clearObject, copyObject} from "../../utils/public";
  import helper from "../../utils/helper";

  const { user, statusList } = global.globalConfig;

  export default {
    computed: {
      tableLabel() {
        return user.tableLabel;
      },
      statusList() {
        return statusList;
      }
    },
    data() {
      return {
        searchData: {},
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        updateIndex: 0, // 被编辑的索引
        updateRow: {}, // 被编辑行数据
        submitType: false, // 编辑还是新增
        dialogVisible: false,
        roleOption: [],
        ruleForm: {
          uname: '',
          pwd: '',
          gid: [],
          nickname: '',
          phone: '',
          status: 1
        },
        rules: {
          uname: [{ required: true, message: '请输入角色名称' }],
          pwd: [{ required: true, message: '请选择门店' }],
          gid: [{ required: true, message: '请选择角色' }],
          nickname: [{ required: true, message: '请输入姓名' }],
          phone: [{ required: false, message: '请输入联系方式' }],
          status: [{ required: true, message: '请选择账号状态' }]
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
      handleSearchData() {
        this.searchData = this.$refs.searchForm.getFormData();
        this.setTableData()
      },
      handleClearSearchData() { // 清空搜索数据
        this.$refs.searchForm.clearFormData();
        clearObject(this.searchData);
      },
      handleCurrentChange(pageNum) { // 分页
        this.pageNum = pageNum;
        this.setTableData()
      },
      handleSizeChange(pageSize) { // 分页尺寸
        this.pageNum = 1;
        this.pageSize = pageSize;
        this.setTableData()
      },
      handleUpdateAudit(index, row) { // 单个审核
        service.user.updateAllStatusByIds({
          params: {status: row.status === 0 ? 1 : 0, ids: row.id},
          cb: () => {
            this.tableData[index].status = this.tableData[index].status === 0 ? 1 : 0;
            helper.S();
          }
        })
      },
      setRuleForm(index, row) { // 编辑写入表单默认值
        this.updateIndex = index;
        this.updateRow = row;
        this.ruleForm = copyObject(this.ruleForm, row);
        this.submitType = true;
        this.dialogVisible = true;
      },
      handleSubmit() { // 提交
        this.$refs.ruleForm.validate(valid => {
          if (valid) this.submitType ? this.handleUpdateOne() : this.handleAddOne()
        })
      },
      handleAddOne() { // 新增
        service.user.addOne({
          params: this.ruleForm,
          cb: data => {
            this.tableData.unshift(data);
            this.dialogVisible = false;
            helper.S();
          }
        });
      },
      handleUpdateOne() { // 编辑
        service.user.updateOne({
          params: this.ruleForm,
          cb: data => {
            helper.S();
            this.dialogVisible = false;
            this.tableData[this.updateIndex] = copyObject(this.tableData[this.updateIndex], data);
          }
        })
      },
      handleDeleteOne(index, row) {
        service.user.deleteOne({
          params: { id: row.id },
          cb: () => {
            this.tableData.splice(index, 1);
            helper.S()
          }
        })
      },
      handleDialogClose() {
        this.$refs.ruleForm.resetFields();
        this.submitType = false;
        clearObject(this.ruleForm);
        this.ruleForm.status = 1
      },
      setTableData() {
        service.user.list({
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            ...this.searchData
          },
          cb: ({ list, page }) => {
            this.tableData = list;
            this.pageNum = page.pageNum;
            this.pageSize = page.pageSize;
            this.total = page.total;
          }
        })
      },
      setOption() {
        service.role.listAll({
          cb: data => {
            this.roleOption = data;
          }
        })
      },
      setGidName(id) {
        const findArr = this.roleOption.filter(item => item.id === id);

        return findArr.length === 1 ? findArr[0].title || '' : '';
      }
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../assets/style/pageItem.less";
</style>
