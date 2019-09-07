<template>
  <list-router-page>
    <page-bread></page-bread>

    <search-form :formModules="tableLabel" ref="searchForm" label-width="120px">
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
            <span v-if="item.name === 'isUpgrade'">{{ setIsUpgradeName(scope.row[item.name]) }}</span>
            <span v-else>{{ scope.row[item.name] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <!--<el-button type="primary" round plain size="mini" @click="linkTo(`qrCodeOrderDetail?id=${scope.row.id}`)">详情</el-button>-->
            <popover-item @click="handleUpdateIsUpgrade(scope.$index, scope.row)">
              <el-button type="primary" round :plain="!scope.row.isUpgrade" :icon="!scope.row.isUpgrade ? 'fa fa-thumbs-down' : 'fa fa-thumbs-up'"></el-button>
            </popover-item>
            <!--<el-button type="warning" icon="el-icon-edit" size="mini" round plain @click="setRuleForm(scope.$index, scope.row)"></el-button>-->
            <!--<popover-item @click="handleDeleteOne(scope.$index, scope.row)">-->
              <!--<el-button type="danger" icon="el-icon-delete" size="mini" round plain></el-button>-->
            <!--</popover-item>-->
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
      <el-form :model="ruleForm" :rules="rules" status-icon label-width="100px" ref="ruleForm" label-position="right">
        <el-form-item label="设备版本号" prop="version">
          <el-input v-model.trim="ruleForm.version"></el-input>
        </el-form-item>
        <el-form-item label="设备apk包" prop="apkUrl">
          <el-upload
            :action="upLoadApi"
            :name="upLoadKey"
            :limit="1"
            :before-remove="handleUploadRemove"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :file-list="fileList">
            <el-button type="primary" plain>点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="强制更新" prop="isUpgrade">
          <el-radio-group v-model="ruleForm.isUpgrade">
            <el-radio-button v-for="(item, index) in statusList" :key="index + ''" :label="item.value">
              {{ item.startEndLabel }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="ruleForm.remark"></el-input>
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

  import {clearObject} from "../../utils/public";
  import service from "../../utils/service";
  import api from "../../utils/api";
  import enums from "../../utils/enums";
  import helper from "../../utils/helper";

  const { upLoadKey, deviceVersion, statusList } = global.globalConfig;

  export default {
    computed: {
      tableLabel() {
        return deviceVersion.tableLabel
      },
      statusList() {
        return statusList
      },
      upLoadKey() {
        return upLoadKey
      },
      upLoadApi() {
        return api.upload
      }
    },
    data() {
      return {
        searchData: {},
        tableData: [],
        fileList: [],
        dialogVisible: false,
        updateIndex: 0, // 被编辑的索引
        updateRow: {}, // 被编辑行数据
        submitType: false, // 编辑还是新增
        pageNum: 1,
        pageSize: 10,
        total: 0,
        ruleForm: {
          version: '',
          apkUrl: '',
          isUpgrade: 1,
          remark: ''
        },
        rules: {
          version: [{required: true, message: '请输入设备版本号'}],
          apkUrl: [{required: true, message: '请上传设备apkUrl'}],
          isUpgrade: [{required: true, message: '请选择是否强制更新'}],
          remark: [{required: false, message: '请输入备注'}]
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
        this.setTableData();
      },
      handleClearSearchData() { // 清空搜索数据
        this.$refs.searchForm.clearFormData();
        clearObject(this.searchData);
      },
      handleCurrentChange(pageNum) { // 分页
        this.pageNum = pageNum;
        this.setTableData();
      },
      handleSizeChange(pageSize) { // 分页尺寸
        this.pageNum = 1;
        this.pageSize = pageSize;
        this.setTableData();
      },
      handleSubmit() { // 提交
        this.$refs.ruleForm.validate(valid => {
          if (valid) this.submitType ? this.handleUpdateOne() : this.handleAddOne()
        })
      },
      handleUpdateIsUpgrade(index, row) {
        service.deviceVersion.updateAllIsUpgradeByIds({
          params: {isUpgrade: row.isUpgrade === 0 ? 1 : 0, ids: row.id},
          cb: () => {
            this.tableData[index].isUpgrade = this.tableData[index].isUpgrade === 0 ? 1 : 0;
            helper.S();
          }
        })
      },
      handleAddOne() {
        service.deviceVersion.addOne({
          params: this.ruleForm,
          cb: data => {
            this.tableData.unshift(data);
            this.dialogVisible = false;
            helper.S();
          }
        })
      },
      handleUpdateOne() {
      },
      beforeUpload(file) {
        const isMime = enums.APP_MIME.indexOf(file.type) !== -1;

        if (!isMime) helper.W(enums.APP_MIME_MSG);

        return isMime
      },
      handleUploadSuccess(res, file) {
        this.ruleForm.apkUrl = res.result
      },
      handleUploadRemove() {
        this.ruleForm.apkUrl= ''
      },
      handleDialogClose() {
        this.$refs.ruleForm.resetFields();
        clearObject(this.ruleForm);
        this.fileList = [];
        this.ruleForm.isUpgrade = 1;
        this.submitType = false;
      },
      setTableData(params={}) {
        service.deviceVersion.list({
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
        this.tableLabel.forEach((item, index) => {
          if (item.name === 'isUpgrade') {
            this.tableLabel[index].option = this.statusList;
            this.tableLabel[index].defaultProps = {
              label: 'startEndLabel', value: 'value'
            }
          }
        })
      },
      setIsUpgradeName(value) {
        const findArr = this.statusList.filter(item => item.value === value);

        return findArr.length === 1 ? findArr[0].startEndLabel || '' : ''
      }
    }
  }
</script>

<style type="text/less" lang="less">
  @import "../../assets/style/pageItem.less";
</style>
