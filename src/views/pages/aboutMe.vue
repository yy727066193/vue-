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
            <img v-if="item.name === 'iconUrl'" :src="scope.row[item.name]" @click="$parent.$parent.showImageDialog(scope.row[item.name])" />
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
              <el-button type="danger" icon="el-icon-delete" size="mini" round plain disabled></el-button>
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

    <el-dialog title="填写信息" :visible.sync="dialogVisible" @close="handleDialogClose" fullscreen>
      <el-form :model="ruleForm" :rules="rules" status-icon label-width="100px" ref="ruleForm" label-position="right">
        <el-form-item label="tab名称" prop="tabName">
          <el-input v-model.trim="ruleForm.tabName"></el-input>
        </el-form-item>
        <el-form-item label="icon" prop="iconUrl">
          <el-upload
            class="avatar-uploader"
            :action="upLoadApi"
            :name="upLoadKey"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeUpload">
            <img v-if="ruleForm.iconUrl" :src="ruleForm.iconUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="一体机图片" prop="imgUrl">
          <el-upload
            :action="upLoadApi"
            :name="upLoadKey"
            :show-file-list="false"
            :on-success="handleImgSuccess"
            :before-upload="beforeUpload">
            <el-button type="primary" plain>点击上传</el-button>
          </el-upload>
          <img v-show="ruleForm.imgUrl" :src="ruleForm.imgUrl" style="max-width: 100%">
        </el-form-item>
        <el-form-item label="h5内容图" prop="content">
          <el-upload
            :action="upLoadApi"
            :name="upLoadKey"
            :show-file-list="false"
            :on-success="handleH5Success"
            :before-upload="beforeUpload">
            <el-button type="primary" plain>点击上传</el-button>
          </el-upload>
          <img v-show="ruleForm.content" :src="ruleForm.content" style="max-width: 100%">
        </el-form-item>
        <el-form-item label="排序" prop="sortId">
          <el-input type="number" v-model.trim="ruleForm.sortId"></el-input>
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
  import {clearObject, copyObject, getNaturalImg} from "../../utils/public";
  import { VueEditor } from 'vue2-editor'

  const { aboutMe, upLoadKey } = global.globalConfig;

  export default {
    components: {
      VueEditor
    },
    computed: {
      tableLabel() {
        return aboutMe.tableLabel
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
        E: null,
        editor: null,
        editorOption: {},
        searchData: {},
        tableData: [],
        dialogVisible: false,
        updateIndex: 0, // 被编辑的索引
        updateRow: {}, // 被编辑行数据
        submitType: false, // 编辑还是新增
        tableCheckBoxList: [], // 表格checkBoxList
        ruleForm: {
          tabName: '',
          iconUrl: '',
          content: '',
          imgUrl: '',
          sortId: '',
        },
        rules: {
          tabName: [{ required: true, message: '请输tab标签名称' }],
          iconUrl: [{ required: true, message: '请上传tab标签icon' }],
          imgUrl: [{ required: true, message: '请上传一体机图片' }],
          content: [{ required: true, message: '请上传h5图片' }],
          sortId: [{ required: true, message: '请输入tab排序，数值越小越靠前' }]
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
        service.aboutMe.addOne({
          params: this.ruleForm,
          cb: data => {
            this.tableData.unshift(data);
            helper.S();
            this.dialogVisible = false
          }
        });
      },
      handleUpdateOne() { // 编辑
        service.aboutMe.updateOne({
          params: this.ruleForm,
          cb: data => {
            helper.S();
            this.tableData[this.updateIndex] = copyObject(this.tableData[this.updateIndex], data);
            this.dialogVisible = false
          }
        })
      },
      handleDeleteOne(index, row) { // 删除
        service.aboutMe.deleteOne({
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
        if (this.E) this.editor.txt.clear();
        this.submitType = false;
      },
      handleAvatarSuccess(res, file) {
        this.ruleForm.iconUrl = res.result
      },
      handleImgSuccess(res, file) {
        this.ruleForm.imgUrl = res.result;
        getNaturalImg(this.ruleForm.imgUrl, (width, height) => {
          this.ruleForm.imgSize = (height / width).toFixed(2);
        })
      },
      handleH5Success(res, file) {
        this.ruleForm.content = res.result;
      },
      beforeUpload(file) {
        const isMime = enums.UPLOAD_IMG_MIME.indexOf(file.type) !== -1;
        const is10M = file.size / 1024 / 1024 <= enums.UPLOAD_SIZE;

        if (!isMime) helper.W(enums.UPLOAD_IMG_MIME_MSG);
        if (!is10M) helper.W(enums.UPLOAD_SIZE_MSG);

        return isMime && is10M
      },
      setTableData(params={}) {
        service.aboutMe.list({
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
