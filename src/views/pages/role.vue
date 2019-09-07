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
            <span>{{ scope.row[item.name] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <!--<el-button type="primary" round plain size="mini" @click="linkTo(`qrCodeOrderDetail?id=${scope.row.id}`)">详情</el-button>-->
            <!--<popover-item @click="handleUpdateAudit(scope.$index, scope.row)">-->
              <!--<el-button type="primary" round :plain="!scope.row.audit" :icon="!scope.row.audit ? 'fa fa-thumbs-down' : 'fa fa-thumbs-up'"></el-button>-->
            <!--</popover-item>-->
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
        <el-form-item label="角色名称" prop="title">
          <el-input v-model.trim="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="所属门店" prop="store">
          <el-select v-model="ruleForm.store" class="w100" filterable>
            <el-option v-for="(item, index) in storeOption" :key="index + ''" :label="item.title" :value="item.id">
              <span style="float: left">{{ item.title }}</span>
              <span style="margin: 0 2px"></span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.addr }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配权限" prop="purviewList">
          <el-tree :data="modules"
                   :props="treeProps"
                   default-expand-all
                   node-key="id"
                   show-checkbox
                   check-strictly
                   ref="tree"
                   :default-checked-keys="defaultKeys">
          </el-tree>
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
  import {clearObject, copyObject, getSessionLoginInfo} from "../../utils/public";
  import helper from "../../utils/helper";

  const { role } = global.globalConfig;

  export default {
    computed: {
      modules() {
        return getSessionLoginInfo().modules
      },
      tableLabel() {
        return role.tableLabel
      }
    },
    data() {
      return {
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        updateIndex: 0, // 被编辑的索引
        updateRow: {}, // 被编辑行数据
        submitType: false, // 编辑还是新增
        dialogVisible: false,
        storeOption: [],
        defaultKeys: [],
        dialogFirst: true, // 弹窗是否是第一打开
        treeProps: {
          label: 'title',
          children: 'modules'
        },
        ruleForm: {
          title: '',
          store: '',
          purviewList: [],
          purview: ''
        },
        rules: {
          title: [{ required: true, message: '请输入角色名称' }],
          store: [{ required: true, message: '请选择门店' }],
          purviewList: [{ required: false, message: '请选择权限列表' }]
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
      handleCurrentChange(pageNum) { // 分页
        this.pageNum = pageNum;
        this.setTableData()
      },
      handleSizeChange(pageSize) { // 分页尺寸
        this.pageNum = 1;
        this.pageSize = pageSize;
        this.setTableData()
      },
      setRuleForm(index, row) { // 编辑写入表单默认值
        this.updateIndex = index;
        this.updateRow = row;
        this.ruleForm = copyObject(this.ruleForm, row);
        this.ruleForm.purviewList = this.ruleForm.purview ? this.ruleForm.purview.split(',') : [];
        this.submitType = true;
        this.dialogVisible = true;

        if (this.dialogFirst) {
          this.dialogFirst = false;
          this.defaultKeys = this.ruleForm.purviewList || []
        } else {
          this.$refs.tree.setCheckedKeys(this.ruleForm.purviewList || [])
        }
      },
      handleSubmit() { // 提交
        this.$refs.ruleForm.validate(valid => {
          if (valid) this.submitType ? this.handleUpdateOne() : this.handleAddOne()
          // this.submitType ? this.handleUpdateOne() : this.handleAddOne()
        })
      },
      handleAddOne() { // 新增
        this.ruleForm.purview = this.$refs.tree.getCheckedKeys().join(',');
        service.role.addOne({
          params: this.ruleForm,
          cb: data => {
            this.tableData.unshift(data);
            helper.S();
            this.dialogVisible = false;
            this.dialogFirst = false
          }
        });
      },
      handleUpdateOne() { // 编辑
        this.ruleForm.purview = this.$refs.tree.getCheckedKeys().join(',');
        service.role.updateOne({
          params: this.ruleForm,
          cb: data => {
            helper.S();
            this.dialogVisible = false;
            this.tableData[this.updateIndex] = copyObject(this.tableData[this.updateIndex], data);
          }
        })
      },
      handleDeleteOne(index, row) {
        service.role.deleteOne({
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
        this.$refs.tree.setCheckedKeys([]);
        clearObject(this.ruleForm);
      },
      setTableData() {
        service.role.list({
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
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
        service.storeList.listAll({
          cb: data => {
            this.storeOption = data;
            this.storeOption.unshift({id: 0, title: '全部门店', addr: '可以在门店列表查看所有门店'})
          }
        })
      }
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../assets/style/pageItem.less";
</style>
