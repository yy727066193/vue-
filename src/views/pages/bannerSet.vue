<template>
  <list-router-page>
    <page-bread></page-bread>

    <search-form v-if="isReady" :formModules="tableLabel" ref="searchForm" label-width="120px">
      <el-button type="primary" round plain icon="el-icon-search" @click="handleSearchData">查询</el-button>
      <el-button type="danger" round plain icon="el-icon-delete" @click="handleClearSearchData">清空</el-button>
    </search-form>

    <div class="page-service-btn-wrapper">
      <el-popover  placement="top" width="200" v-model="popoverVisible">
        <p>请选择你要批量商品状态</p>
        <div class="popover-wrapper">
          <el-radio-group v-model="popoverVal">
            <el-radio-button v-for="(item, index) in statusList" :key="index + ''" :label="item.value">
              {{ item.startEndLabel }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="popover-wrapper-btn">
          <el-button @click="popoverVisible = false" type="text" size="mini">取消</el-button>
          <el-button type="primary" size="mini" @click="doUpdateStatusByIds">提交</el-button>
        </div>
      </el-popover>
      <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      <el-button type="primary" @click="handleAllUpdateAudit">批量审核</el-button>
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
            <a v-if="item.name === 'img'" target="_blank" :href="scope.row[item.name]">
              <el-button type="mini">查看</el-button>
            </a>
            <span v-else-if="item.name === 'columms'">{{ setColumnsName(scope.row[item.name]) }}</span>
            <span v-else-if="item.name === 'goodsId'">{{ setGoodsName(scope.row[item.name]) }}</span>
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
              <el-button type="danger" icon="el-icon-delete" size="mini" round plain></el-button>
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
      <el-form :model="ruleForm" :rules="rules" status-icon label-width="100px" ref="ruleForm" label-position="right">
        <el-form-item label="轮播图类型" prop="columms" filterable>
          <el-select v-model="ruleForm.columms" class="w100">
            <el-option v-for="(item, index) in bannerTypeOption" :key="index + ''" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标商品" prop="goodsId">
          <el-select v-model="ruleForm.goodsId" class="w100" filterable clearable>
            <el-option v-for="(item, index) in productOption" :key="index + ''" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片/视频" prop="img">
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

          <div class="video-wrapper" v-if="ruleForm.img">
            <a :href="ruleForm.img" target="_blank">
              <el-button>查看</el-button>
            </a>
          </div>
        </el-form-item>
        <el-form-item label="轮播图状态" prop="status">
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
  import api from '../../utils/api'
  import enums from '../../utils/enums'
  import helper from '../../utils/helper'
  import {clearObject, copyObject} from "../../utils/public";

  const { bannerSet, statusList, upLoadKey } = global.globalConfig;

  export default {
    computed: {
      path() {
        return this.$route.path.replace('/', '')
      },
      tableLabel() {
        return bannerSet.tableLabel
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
        isReady: false,
        tableData: [],
        fileList: [],
        dialogVisible: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
        updateIndex: 0, // 被编辑的索引
        updateRow: {}, // 被编辑行数据
        submitType: false, // 编辑还是新增
        tableCheckBoxList: [], // 表格checkBoxList
        bannerTypeOption: [],
        productOption: [],
        popoverVisible: false,
        popoverVal: 0,
        ruleForm: {
          columms: '',
          goodsId: '',
          img: '',
          status: 0,
        },
        rules: {
          columms: [{required: true, message: '请选择轮播图类型'}],
          goodsId: [{required: false, message: '请选择轮播图跳转到某一个商品详情'}],
          img: [{required: true, message: '请上传轮播图'}],
          status: [{required: true, message: '请选择轮播图状态'}]
        },
      }
    },
    mounted () {
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
      selectChange(val) { // 表格checkBox触发
        this.tableCheckBoxList = val;
      },
      handleAllUpdateAudit() { // 批量审核
        if (this.tableCheckBoxList.length === 0) {
          helper.W('至少选择一个')
        } else {
          this.popoverVisible = true;
        }
      },
      doUpdateStatusByIds() {
        const idList = [];

        this.tableCheckBoxList.forEach((item) => {
          idList.push(item.id)
        });

        service.bannerSet.updateAllStatusByIds({
          params: { status: this.popoverVal, ids: idList.join(',') },
          cb: () => {
            this.tableCheckBoxList.forEach((item) => {
              this.tableData.forEach((cItem) => {
                if (cItem.id === item.id) cItem.status = this.popoverVal;
              })
            });
            helper.S();
          }
        })
      },
      handleUpdateAudit(index, row) { // 单个审核
        service.bannerSet.updateAllStatusByIds({
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
        if (this.ruleForm.img) this.fileList.push({ name: '文件', url: this.ruleForm.img });
        this.submitType = true;
        this.dialogVisible = true;
      },
      handleSubmit() { // 提交
        this.$refs.ruleForm.validate(valid => {
          if (valid) this.submitType ? this.handleUpdateOne() : this.handleAddOne()
        })
      },
      handleAddOne() { // 新增
        service.bannerSet.addOne({
          params: this.ruleForm,
          cb: data => {
            this.tableData.unshift(data);
            helper.S();
            this.dialogVisible = false
          }
        });
      },
      handleUpdateOne() { // 编辑
        service.bannerSet.updateOne({
          params: this.ruleForm,
          cb: data => {
            helper.S();
            this.tableData[this.updateIndex] = copyObject(this.tableData[this.updateIndex], data);
            this.dialogVisible = false
          }
        })
      },
      handleDeleteOne(index, row) { // 删除
        service.bannerSet.deleteOne({
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
        this.fileList = [];
        this.ruleForm.status = 0;
        this.submitType = false;
      },
      handleUploadSuccess(res, file) {
        this.ruleForm.img = res.result
      },
      handleUploadRemove() {
        this.ruleForm.img = ''
      },
      beforeUpload(file) {
        const isMime = [...enums.UPLOAD_IMG_MIME, ...enums.UPLOAD_VIDEO_MIME].indexOf(file.type) !== -1;
        const is100MB = file.size / 1024 / 1024 <= enums.UPLOAD_VIDEO_SIZE;

        if (!isMime) helper.W('上传文件格式错误');
        if (!is100MB) helper.W(enums.UPLOAD_VIDEO_SIZE_MSG);

        return isMime && is100MB
      },
      setTableData(params={}) {
        service.bannerSet.list({
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
        service.bannerType.list({
          cb: data => {
            this.bannerTypeOption = data;
            this.tableLabel.map((item, index) => {
              if (item.name === 'columms') {
                this.tableLabel[index].option = data;
                this.tableLabel[index].defaultProps = {label: 'label', value: 'id'};
              }
            });
            service.shopList.listAll({
              cb: data => {
                this.productOption = data;
                this.tableLabel.map((item, index) => {
                  if (item.name === 'goodsId') {
                    this.tableLabel[index].option = data;
                    this.tableLabel[index].defaultProps = {label: 'title', value: 'id'};
                    this.isReady = true;
                  }
                })
              }
            });
          }
        });
      },
      setColumnsName(id) {
        const findArr = this.bannerTypeOption.filter(item => item.id === id);

        return findArr.length === 1 ? findArr[0].label || '' : '';
      },
      setGoodsName(id) {
        const findArr = this.productOption.filter(item => item.id === id);

        return findArr.length === 1 ? findArr[0].title || '' : '';
      }
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../assets/style/pageItem.less";
</style>
