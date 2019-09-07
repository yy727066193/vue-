<template>
  <list-router-page>
    <page-bread></page-bread>


    <search-form v-if="tableLabel.length !== 0" :formModules="tableLabel" ref="searchForm" label-width="95px">
      <el-button type="primary" round plain icon="el-icon-search" @click="handleSearchData">查询</el-button>
      <el-button type="danger" round plain icon="el-icon-delete" @click="handleClearSearchData">清空</el-button>
    </search-form>

    <!--<div class="page-service-btn-wrapper">-->
    <!--<el-button type="primary" @click="dialogVisible = true">新增</el-button>-->
    <!--<el-button type="primary" @click="handleAllUpdateAudit">批量审核</el-button>-->
    <!--</div>-->

    <div class="page-table-wrapper">
      <el-table :data="tableData" border ref="table">
        <el-table-column show-overflow-tooltip
                         v-for="(item, index) in tableLabel" :key="index +''"
                         :label="item.label"
                         :prop="item.name"
                         :sortable="item.sortable">
          <template slot-scope="scope">
            <span v-if="item.name === 'createTime'">{{ dateFormat(scope.row[item.name] * 1 * 1000, 'yyyy-mm-dd HH:MM:ss') }}</span>
            <span v-else-if="item.name === 'type'">{{ setTypeName(scope.row[item.name]) }}</span>
            <span v-else-if="item.name === 'userLevel'">{{ setUserLevelName(scope.row[item.name]) }}</span>
            <span v-else>{{ scope.row[item.name] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-popover placement="left" trigger="click" v-model="scope.row.popoverVisible" width="800">
              <el-table :data="popoverTableData" border>
                <el-table-column show-overflow-tooltip
                                 v-for="(item, index) in detailTableLabel" :key="index +''"
                                 :label="item.label"
                                 :prop="item.name"
                                 :sortable="item.sortable">
                  <template slot-scope="popScope">
                    <span v-if="item.name === 'createTime' || item.name === 'updateTime'">{{ dateFormat(popScope.row[item.name] * 1 * 1000, 'yyyy-mm-dd HH:MM:ss') }}</span>
                    <img v-else-if="item.name === 'photo'" :src="popScope.row[item.name]" @click="$parent.$parent.showImageDialog(popScope.row[item.name])" />

                    <span v-else>{{ popScope.row[item.name] }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="warning" icon="el-icon-edit" size="mini" round plain @click="handleGetDetails(scope.$index, scope.row)" slot="reference"></el-button>
            </el-popover>
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
  </list-router-page>
</template>

<script>

  import {clearObject} from "../../utils/public";
  import service from "../../utils/service";
  import dateFormat from 'dateformat'

  const { intLogList, memberList, intTypeList, userLevelList } = global.globalConfig;

  export default {
    computed: {
      tableLabel() {
        return intLogList.tableLabel
      },
      dateFormat() {
        return dateFormat
      },
      detailTableLabel() {
        return memberList.tableLabel;
      },
      intTypeList() {
        return intTypeList
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
        pageNum: 1,
        pageSize: 10,
        total: 0,
        popoverTableData: []
      }
    },
    mounted() {
      this.onReady()
    },
    methods: {
      onReady() {
        this.setTableData();
        this.setTableLabelOption()
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
      handleGetDetails(index, row) {
        service.memberList.findById({
          params: { id: row.uid },
          cb: data => {
            this.tableData[index].popoverVisible = true;
            this.popoverTableData = [];
            this.popoverTableData.push(data)
          }
        })
      },
      setTableData(params={}) {
        service.intLogList.list({
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
            this.tableData.forEach((item, index) => {
              this.tableData[index].popoverVisible = false
            })
          }
        })
      },
      setTableLabelOption() {
        for (let i = 0, len = this.tableLabel.length; i < len; i++) {
          let item = this.tableLabel[i];
          if (item.name === 'type') {
            this.tableLabel[i].option = this.intTypeList;
          }
        }
      },
      setTypeName(id) {
        const findArr = this.intTypeList.filter(item => item.value === id);

        return findArr.length === 1 ? findArr[0].label || '' : ''
      },
      setUserLevelName(value) {
        const findArr = this.userLevelList.filter(item => item.value === value);

        return findArr.length === 1 ? findArr[0].label || '' : ''
      }
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../assets/style/pageItem.less";
</style>
