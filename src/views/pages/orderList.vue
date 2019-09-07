<template>
  <list-router-page>
    <page-bread></page-bread>


    <search-form :formModules="tableLabel" ref="searchForm" label-width="95px" v-if="isReady">
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
                         :sortable="item.sortable" v-if="!item.visible">
          <!--<template slot-scope="scope">
            <span v-if="item.name === 'orderStatus'">{{ setOrderStatusName(scope.row[item.name]) }}</span>
            <span v-else-if="item.name === 'storeId'">{{ setStoreName(scope.row[item.name]) }}</span>
            <span v-else-if="item.name === 'createTime'">{{ dateFormat(scope.row[item.name] * 1 * 1000, 'yyyy-mm-dd HH:MM:ss') }}</span>
            <span v-else-if="item.name === 'payTime'">{{ dateFormat(scope.row[item.name] * 1 * 1000, 'yyyy-mm-dd HH:MM:ss') }}</span>
            <span v-else-if="item.name === 'doneTime'">{{ dateFormat(scope.row[item.name] * 1 * 1000, 'yyyy-mm-dd HH:MM:ss') }}</span>
            <span v-else>{{ scope.row[item.name] }}</span>
          </template>-->
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <!--<el-button type="primary" round plain size="mini" @click="linkTo(`qrCodeOrderDetail?id=${scope.row.id}`)">详情</el-button>-->
            <!--<el-button type="primary" round :plain="!scope.row.audit" :icon="!scope.row.audit ? 'fa fa-thumbs-down' : 'fa fa-thumbs-up'" @click="handleUpdateAudit(scope.$index, scope.row)"></el-button>-->
            <!--<popover-item>-->
              <!--<el-button type="warning" icon="el-icon-edit" size="mini" round plain></el-button>-->
            <!--</popover-item>-->
            <el-popover placement="left" trigger="click" v-model="scope.row.popoverVisible" width="800">
              <el-table :data="popoverTableData" border>
                <el-table-column show-overflow-tooltip
                                 v-for="(item, index) in detailTableLabel" :key="index +''"
                                 :label="item.label"
                                 :prop="item.name"
                                 :sortable="item.sortable">
                  <template slot-scope="popScope">
                    <img v-if="item.name === 'pphoto'" :src="popScope.row[item.name]" @click="$parent.$parent.showImageDialog(popScope.row[item.name])" />
                    <span v-else-if="item.name === 'createTime'">{{ dateFormat(scope.row[item.name] * 1 * 1000, 'yyyy-mm-dd HH:MM:ss') }}</span>
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

  import {clearObject, getTimeStr} from "../../utils/public";
  import service from "../../utils/service";
  import dateFormat from 'dateformat'

  const { orderList, orderStatusList, orderDetails } = global.globalConfig;

  export default {
    computed: {
      tableLabel() {
        return orderList.tableLabel
      },
      orderStatusList() {
        return orderStatusList
      },
      dateFormat() {
        return dateFormat
      },
      detailTableLabel() {
        return orderDetails.tableLabel;
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
        popoverTableData: [],
        storeOption: []
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

        if (this.searchData.startEndTime && Array.isArray(this.searchData.startEndTime)) {
          if (this.searchData.startEndTime.length === 2) {
            this.searchData.startTime = getTimeStr(this.searchData.startEndTime[0]);
            this.searchData.endTime = getTimeStr(this.searchData.startEndTime[1])
          }
        }

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
        service.orderDetails.findByOid({
          params: { oid: row.id },
          cb: data => {
            this.tableData[index].popoverVisible = true;
            this.popoverTableData = data;
          }
        })
      },
      setTableData(params={}) {
        service.orderList.list({
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
      setOption() {
        service.storeList.listAll({
          cb: data => {
            this.storeOption = data;
            this.tableLabel.forEach((item, i) => {
              if (item.name === 'orderStatus') {
                this.tableLabel[i].option = this.orderStatusList;
              } else if (item.name === 'storeId') {
                this.tableLabel[i].option = this.storeOption;
                this.tableLabel[i].defaultProps = {
                  label: 'title', value: 'id'
                };
              }
            });
            this.isReady = true;
          }
        })
      },
      setOrderStatusName(id) {
        const findArr = this.orderStatusList.filter(item => item.value === id);

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
