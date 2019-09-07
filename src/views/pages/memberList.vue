<template>
  <list-router-page>
    <page-bread></page-bread>

    <search-form :formModules="tableLabel" ref="searchForm" label-width="120px" v-if="isReady">
      <el-button type="primary" round plain icon="el-icon-search" @click="handleSearchData">查询</el-button>
      <el-button type="danger" round plain icon="el-icon-delete" @click="handleClearSearchData">清空</el-button>
    </search-form>

    <!--<div class="page-service-btn-wrapper">-->
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
      <!--<el-button type="primary" @click="dialogVisible = true">新增</el-button>-->
      <!--<el-button type="primary" @click="handleAllUpdateAudit">批量审核</el-button>-->
    <!--</div>-->

    <div class="page-table-wrapper">
      <el-table :data="tableData" border @selection-change="selectChange" ref="table">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip
                         v-for="(item, index) in tableLabel" :key="index +''"
                         :label="item.label"
                         :prop="item.name"
                         :sortable="item.sortable" v-if="!item.visible">
          <template slot-scope="scope">
            <img v-if="item.name === 'photo'" :src="scope.row[item.name]" @click="$parent.$parent.showImageDialog(scope.row[item.name])" />
            <span v-else-if="item.name === 'createTime' || item.name === 'updateTime'">{{ dateFormat(scope.row[item.name] * 1 * 1000, 'yyyy-mm-dd HH:MM:ss') }}</span>
            <span v-else-if="item.name === 'userLevel'">{{ setUserLevelName(scope.row[item.name]) }}</span>
            <span v-else-if="item.name === 'store'">{{ setStoreName(scope.row[item.name]) }}</span>
            <span v-else>{{ scope.row[item.name] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <!--<el-button type="primary" round plain size="mini" @click="linkTo(`qrCodeOrderDetail?id=${scope.row.id}`)">详情</el-button>-->
            <!--<popover-item @click="handleUpdateAudit(scope.$index, scope.row)">-->
              <!--<el-button type="primary" round :plain="!scope.row.status" :icon="!scope.row.status ? 'fa fa-thumbs-down' : 'fa fa-thumbs-up'"></el-button>-->
            <!--</popover-item>-->
            <el-button type="warning" icon="el-icon-edit" size="mini" round plain @click="setRuleForm(scope.$index, scope.row)"></el-button>
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
        <el-form-item label="用户级别" prop="userLevel">
          <el-radio-group v-model="ruleForm.userLevel">
            <el-radio-button v-for="(item, index) in userLevelList" :key="index + ''" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
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
  import {clearObject, copyObject, getTimeStr} from "../../utils/public";
  import dateFormat from 'dateformat'
  import helper from "../../utils/helper";

  const { memberList, sexList, userLevelList } = global.globalConfig;

  export default {
    computed: {
      tableLabel() {
        return memberList.tableLabel
      },
      dateFormat() {
        return dateFormat
      },
      sexList() {
        return sexList
      },
      userLevelList() {
        return userLevelList
      }
    },
    data() {
      return {
        searchData: {},
        tableData: [],
        dialogVisible: false,
        isReady: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
        storeOption: [],
        updateIndex: 0,
        submitType: false,
        updateRow: {},
        ruleForm: {
          userLevel: '',
          store: '',
        },
        rules: {
          userLevel: [{required: true, message: '请选择用户级别'}],
          store: [{ required: true, message: '请选择用户所在的店面' }]
        }
      }
    },
    mounted () {
      this.onReady()
    },
    methods: {
      onReady() {
        this.setTableData();
        this.setOption();
      },
      handleSearchData() {
        this.searchData = this.$refs.searchForm.getFormData();

        if (this.searchData.startEndTime && Array.isArray(this.searchData.startEndTime)) {
          if (this.searchData.startEndTime.length === 2) {
            this.searchData.startTime = getTimeStr(this.searchData.startEndTime[0]);
            this.searchData.endTime = getTimeStr(this.searchData.startEndTime[1])
          }
        }

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
      setRuleForm(index, row) {
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
      handleAddOne() {
      },
      handleUpdateOne() {
        service.memberList.updateOne({
          params: this.ruleForm,
          cb: data => {
            helper.S();
            this.dialogVisible = false;
            this.tableData[this.updateIndex] = copyObject(this.tableData[this.updateIndex], data);
          }
        })
      },
      handleDialogClose() {
        this.$refs.ruleForm.resetFields();
        clearObject(this.ruleForm);
        this.submitType = false;
      },
      setTableData(params={}) {
        service.memberList.list({
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
        service.storeList.listAll({
          cb: data => {
            this.storeOption = data;
            this.tableLabel.forEach((item, index) => {
              if (item.name === 'sex') {
                this.tableLabel[index].option = this.sexList;
              } else if (item.name === 'userLevel') {
                this.tableLabel[index].option = this.userLevelList;
              } else if (item.name === 'store') {
                this.tableLabel[index].option = this.storeOption;
                this.tableLabel[index].defaultProps = {
                  label: 'title', value: 'id'
                };
              }
            });
            this.isReady = true
          }
        });
      },
      setUserLevelName(value) {
        const findArr = this.userLevelList.filter(item => item.value === value);

        return findArr.length === 1 ? findArr[0].label || '' : ''
      },
      setStoreName(id) {
        const findArr = this.storeOption.filter(item => item.id === id);

        return findArr.length === 1 ? findArr[0].title || '' : ''
      }
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../assets/style/pageItem.less";
</style>
