<template>
  <list-router-page>
    <page-bread></page-bread>

    <div class="page-table-wrapper">
      <el-table :data="tableData" border ref="table">
        <el-table-column show-overflow-tooltip
                         v-for="(item, index) in tableLabel" :key="index +''"
                         :label="item.label"
                         :prop="item.name"
                         :sortable="item.sortable" v-if="!item.visible">
          <template slot-scope="scope">
            <span>{{ scope.row[item.name] }}</span>
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
  import service from "../../utils/service";

  const { log } = global.globalConfig;

  export default {
    computed: {
      tableLabel() {
        return log.tableLabel
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
      }
    },
    mounted() {
      this.onReady()
    },
    methods: {
      onReady() {
        this.setTableData();
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
      setTableData(params={}) {
        service.log.list({
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
      }
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../assets/style/pageItem.less";
</style>
