<template>
  <list-router-page>
    <page-bread></page-bread>

    <search-form v-if="tableLabel.length !== 0" :formModules="tableLabel" ref="searchForm" label-width="115px">
      <el-button type="primary" round plain icon="el-icon-search" @click="handleSearchData">查询</el-button>
      <el-button type="danger" round plain icon="el-icon-delete" @click="handleClearSearchData">清空</el-button>
    </search-form>

    <div class="page-service-btn-wrapper">
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
            <img v-if="item.name === 'photo'" :src="scope.row[item.name]" @click="$parent.$parent.showImageDialog(scope.row[item.name])" />
            <!--<a target="_blank" :href="scope.row[item.name]" v-else-if="item.name === 'href'">{{ scope.row[item.name] }}</a>-->
            <span v-else>{{ scope.row[item.name] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <!--<el-button type="primary" round plain size="mini" @click="linkTo(`qrCodeOrderDetail?id=${scope.row.id}`)">详情</el-button>-->
            <!--<el-button type="primary" round :plain="!scope.row.audit" :icon="!scope.row.audit ? 'fa fa-thumbs-down' : 'fa fa-thumbs-up'" @click="handleUpdateAudit(scope.$index, scope.row)"></el-button>-->
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
      <el-form :model="ruleForm" :rules="rules" label-width="100px" label-position="right" status-icon ref="ruleForm">
        <el-form-item label="店面名称" prop="title">
          <el-input v-model.trim="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="省" prop="provinces">
          <el-select v-model="ruleForm.provinces" @change="handleProvinceChange" filterable class="w100">
            <el-option v-for="(item, index) in provinceOption" :key="index + ''" :label="item.areaname" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市" prop="citys">
          <el-select v-model="ruleForm.citys" @change="handleCityChange" filterable class="w100">
            <el-option v-for="(item, index) in cityOption" :key="index + ''" :label="item.areaname" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区" prop="areas">
          <el-select v-model="ruleForm.areas" filterable clearable class="w100">
            <el-option v-for="(item, index) in areaOption" :key="index + ''" :label="item.areaname" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="addr">
          <el-input v-model.trim="ruleForm.addr"></el-input>
        </el-form-item>
        <el-form-item label="店面经纬度" prop="lal">
          <el-input v-model.trim="ruleForm.lal"></el-input>
          <el-tag type="danger"><a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank">点击获取百度经纬</a></el-tag>
        </el-form-item>
        <el-form-item label="门店联系方式" prop="telephone">
          <el-input v-model.trim="ruleForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="门店负责人" prop="storeName">
          <el-input v-model.trim="ruleForm.storeName"></el-input>
        </el-form-item>
        <el-form-item label="店面封面" prop="storeImageUrl">
          <el-upload
            class="avatar-uploader"
            :action="upLoadApi"
            :name="upLoadKey"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="ruleForm.photo" :src="ruleForm.photo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
  import {clearObject, copyObject, getSessionLoginInfo, showConfirm} from "../../utils/public";
  import helper from "../../utils/helper";
  import enums from "../../utils/enums";
  import api from "../../utils/api";
  import service from "../../utils/service";

  const { storeList } = global.globalConfig;

  export default {
    computed: {
      upLoadApi() {
        return api.upload
      },
      upLoadKey() {
        return global.globalConfig.upLoadKey
      },
      role() {
        const { role } = getSessionLoginInfo().userInfo;

        return role;
      },
      tableLabel() {
        return storeList.tableLabel
      }
    },
    data() {
      return {
        searchData: {
          provinces: '',
          citys: '',
          areas: ''
        },
        tableData: [],
        dialogVisible: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
        updateIndex: 0, // 被编辑的索引
        updateRow: {}, // 被编辑行数据
        submitType: false, // 编辑还是新增
        tableCheckBoxList: [], // 表格checkBoxList
        ruleForm: {
          title: '',
          provinces: '',
          citys: '',
          areas: '',
          addr: '',
          lal: '',
          telephone: '',
          storeName: '',
          photo: ''
        },
        rules: {
          title: [{ required: true, message: '请输入店面标题' }],
          provinces: [{ required: true, message: '请选择省' }],
          citys: [{ required: true, message: '请选择市' }],
          areas: [{ required: false, message: '请选择区' }],
          addr: [{ required: true, message: '请输入店面详细地址' }],
          lal: [{ required: true, message: '请输入店面经纬度' }],
          telephone: [{ required: false, message: '请输入店面经纬度' }],
          storeName: [{ required: false, message: '请输入店面经纬度' }],
          photo: [{ required: false, message: '请上传店面封面' }]
        },
        provinceOption: [],
        cityOption: [],
        areaOption: []
      }
    },
    mounted() {
      this.onReady();
    },
    methods: {
      onReady() {
        this.checkRole();
        this.setTableData();
        this.setCityOption();
      },
      checkRole() {
        if (this.role && this.role.store !== enums.SUPER_STORE_ID) {
          this.searchData.provinces = this.role.province || '';
          this.searchData.citys = this.role.city || '';
          this.searchData.areas = this.role.area || '';
        }
      },
      handleSearchData() {
        this.searchData = this.$refs.searchForm.getFormData();
        this.checkRole();
        this.setTableData()
      },
      handleClearSearchData() { // 清空搜索数据
        this.$refs.searchForm.clearFormData();
        clearObject(this.searchData);
        this.checkRole();
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
      handleAllUpdateAudit() { // 批量审核
        if (this.tableCheckBoxList.length === 0) {
          helper.W('至少选择一个')
        } else {
          showConfirm({
            cb: () => {
            },
            cancelCb: () => {
              this.$refs.table.clearSelection();
            }
          })
        }
      },
      handleUpdateAudit(index, row) { // 单个审核
        showConfirm({
          cb: () => {
            console.log(333)
          }
        })
      },
      setRuleForm(index, row) { // 编辑写入表单默认值
        this.setCityOption(2, row.provinces);
        this.setCityOption(3, row.citys);
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
        service.storeList.addOne({
          params: this.ruleForm,
          cb: data => {
            helper.S();
            this.tableData.unshift(data);
            this.dialogVisible = false
          }
        });
      },
      handleUpdateOne() { // 编辑
        service.storeList.updateOne({
          params: this.ruleForm,
          cb: data => {
            console.log(this.tableData);
            helper.S();
            this.tableData[this.updateIndex] = copyObject(this.tableData[this.updateIndex], data);
            this.dialogVisible = false;
          }
        });
      },
      handleDeleteOne(index, row) {
        service.storeList.deleteOne({
          params: { id: row.id },
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
      selectChange(val) {
        this.tableCheckBoxList = val;
      },
      handleAvatarSuccess(res, file) {
        this.ruleForm.photo = res.result
      },
      beforeAvatarUpload(file) {
        const isMime = enums.UPLOAD_IMG_MIME.indexOf(file.type) !== -1;
        const is10MB = file.size / 1024 / 1024 <= enums.UPLOAD_SIZE;

        if (!isMime) helper.W(enums.UPLOAD_IMG_MIME_MSG);
        if (!is10MB) helper.W(enums.UPLOAD_SIZE_MSG);

        return isMime && is10MB
      },
      setTableData(params={}) {
        service.storeList.list({
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            ...this.searchData,
            ...params,
          },
          cb: ({ list, page }) => {
            this.tableData = list;
            this.pageNum = page.pageNum;
            this.pageSize = page.pageSize;
            this.total = page.total;
          }
        })
      },
      setCityOption(type=1, id) {
        console.log(type, id);
        service.cityList({
          type, id,
          cb: data => {
            console.log(data);
            if (type === 1) this.provinceOption = data;
            else if (type === 2) this.cityOption = data;
            else if (type === 3) this.areaOption = data;
          }
        })
      },
      handleProvinceChange(val) { // 省变化
        this.ruleForm.citys = '';
        this.ruleForm.areas = '';

        this.setCityOption(2, this.ruleForm.provinces)
      },
      handleCityChange(val) { // 市变化
        this.ruleForm.areas = '';

        this.setCityOption(3, this.ruleForm.citys)
      },
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../assets/style/pageItem.less";
</style>
