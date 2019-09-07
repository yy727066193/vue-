<template>
  <list-router-page>
    <page-bread></page-bread>

    <search-form v-if="tableLabel.length !== 0" :formModules="tableLabel" ref="searchForm" label-width="95px">
      <el-button type="primary" round plain icon="el-icon-search" @click="handleSearchData">查询</el-button>
      <el-button type="danger" round plain icon="el-icon-delete" @click="handleClearSearchData">清空</el-button>
    </search-form>

    <div class="page-service-btn-wrapper">
      <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      <el-popover  placement="top" width="200" v-model="popoverVisible">
        <p>请选择你要批量商品状态</p>
        <div class="popover-wrapper">
          <el-radio-group v-model="popoverVal">
            <el-radio-button v-for="(item, index) in statusList" :key="index + ''" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="popover-wrapper-btn">
          <el-button @click="popoverVisible = false" type="text" size="mini">取消</el-button>
          <el-button type="primary" size="mini" @click="doUpdateAuditByIds">提交</el-button>
        </div>
      </el-popover>
      <el-button type="primary" @click="handleAllUpdateAudit">批量审核</el-button>
    </div>

    <div class="page-table-wrapper">
      <el-table :data="tableData" border @selection-change="selectChange" ref="table">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip
                         v-for="(item, index) in tableLabel" :key="index +''"
                         :label="item.label"
                         :prop="item.name"
                         :sortable="item.sortable" v-if="!item.visible">
          <template slot-scope="scope">
            <img v-if="item.name === 'thumb'" :src="scope.row[item.name]" @click="$parent.$parent.showImageDialog(scope.row[item.name])" />
            <!--<a target="_blank" :href="scope.row[item.name]" v-else-if="item.name === 'href'">{{ scope.row[item.name] }}</a>-->
            <span v-else>{{ scope.row[item.name] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!--<el-button type="primary" round plain size="mini" @click="linkTo(`qrCodeOrderDetail?id=${scope.row.id}`)">详情</el-button>-->
            <popover-item @click="handleUpdateAudit(scope.$index, scope.row)">
              <el-button type="primary" round :plain="!scope.row.audit" :icon="!scope.row.audit ? 'fa fa-thumbs-down' : 'fa fa-thumbs-up'"></el-button>
            </popover-item>
            <el-button type="warning" icon="el-icon-edit" size="mini" round plain @click="setRuleForm(scope.$index, scope.row)"></el-button>
            <popover-item @click="handleDeleteOne(scope.$index, scope.row)">
              <el-button type="danger" icon="el-icon-delete" size="mini" round plain disabled></el-button>
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
        <el-form-item label="商品序号" prop="sortId">
          <el-input v-model.trim="ruleForm.sortId" type="number"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model.trim="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="副标题" prop="subtitle">
          <el-input v-model.trim="ruleForm.subtitle"></el-input>
        </el-form-item>
        <!--<el-form-item label="价格" prop="shopPrice">-->
          <!--<el-input v-model.trim="ruleForm.shopPrice" type="number"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="库存" prop="stock">
          <el-input v-model.trim="ruleForm.stock" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="specifications">
          <el-input v-model.trim="ruleForm.specifications"></el-input>
        </el-form-item>
        <el-form-item label="商品产地" prop="producingArea">
          <el-input v-model.trim="ruleForm.producingArea"></el-input>
        </el-form-item>
        <el-form-item label="商品消费积分" prop="integral">
          <el-input v-model.trim="ruleForm.integral" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品返回积分" prop="returnIntegral">
          <el-input v-model.trim="ruleForm.returnIntegral" type="number"></el-input>
        </el-form-item>
        <!--<el-form-item label="商品类型" prop="shopType">-->
          <!--<el-cascader :options="shopTypeList" change-on-select filterable class="w100" v-model="ruleForm.shopType"></el-cascader>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="商品品牌" prop="shopBrand">-->
          <!--<el-input v-model.trim="ruleForm.shopBrand"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="健康币购买" prop="isHealthCoin">-->
          <!--<el-radio-group v-model="ruleForm.isHealthCoin">-->
            <!--<el-radio-button v-for="(item, index) in statusList" :key="index + ''" :label="item.value">{{ item.yesNoLabel }}</el-radio-button>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="健康币" prop="healthCoin" v-if="ruleForm.isHealthCoin">-->
          <!--<el-input v-model.trim="ruleForm.healthCoin" type="number"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="限时购" prop="isFixTime">-->
          <!--<el-radio-group v-model="ruleForm.isFixTime">-->
            <!--<el-radio-button v-for="(item, index) in statusList" :key="index + ''" :label="item.value">{{ item.startEndLabel }}</el-radio-button>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="限时购时间段" prop="fixTime" v-if="ruleForm.isFixTime">-->
          <!--<el-select v-model="ruleForm.fixTime" class="w100">-->
            <!--<el-option v-for="(item, index) in fixTimeList" :key="index + ''" :label="item.label" :value="item.value"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="限时购价格" prop="fixTimePrice" v-if="ruleForm.isFixTime">-->
          <!--<el-input v-model.trim="ruleForm.fixTimePrice" type="number"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="限时购健康币" prop="fixTimeHealthCoin" v-if="ruleForm.isFixTime">-->
          <!--<el-input v-model.trim="ruleForm.fixTimeHealthCoin" type="number"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="导航" prop="nav">-->
          <!--<el-select v-model="ruleForm.nav" class="w100" filterable>-->
            <!--<el-option v-for="(item, index) in navList" :key="index + ''" :label="item.label" :value="item.value"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="是否新品" prop="isNewShop">-->
          <!--<el-radio-group v-model="ruleForm.isNewShop">-->
            <!--<el-radio-button v-for="(item, index) in statusList" :key="index + ''" :label="item.value">{{ item.yesNoLabel }}</el-radio-button>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="是否拼团" prop="isGrid">-->
          <!--<el-radio-group v-model="ruleForm.isGrid">-->
            <!--<el-radio-button v-for="(item, index) in statusList" :key="index + ''" :label="item.value">{{ item.yesNoLabel }}</el-radio-button>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="拼团价格" prop="gridPrice" v-if="ruleForm.isGrid">-->
          <!--<el-input v-model.trim="ruleForm.gridPrice" type="number"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="拼团原价" prop="gridOriginal" v-if="ruleForm.isGrid">-->
          <!--<el-input v-model.trim="ruleForm.gridOriginal" type="number"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="拼团人数" prop="gridPersonCount" v-if="ruleForm.isGrid">-->
          <!--<el-input v-model.trim="ruleForm.gridPersonCount" type="number"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="拼团持续时间(分)" prop="gridTime" v-if="ruleForm.isGrid">-->
          <!--<el-input v-model.trim="ruleForm.gridTime" type="number"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="增值服务" prop="incrementService">-->
          <!--<el-select v-model="ruleForm.incrementService" filterable class="w100">-->
            <!--<el-option v-for="(item, index) in incrementServiceList" :key="index + ''" :label="item.label" :value="item.value"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="是否店长推荐" prop="isShopkeeperRecommend">-->
          <!--<el-radio-group v-model="ruleForm.isShopkeeperRecommend">-->
            <!--<el-radio-button v-for="(item, index) in statusList" :key="index + ''" :label="item.value">{{ item.yesNoLabel }}</el-radio-button>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <el-form-item label="封面" prop="thumb">
          <el-upload
            class="avatar-uploader"
            :action="upLoadApi"
            :name="upLoadKey"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="ruleForm.thumb" :src="ruleForm.thumb" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品图片轮播" prop="photoList">
          <el-upload
            :action="upLoadApi"
            :name="upLoadKey"
            :show-file-list="false"
            :on-success="handleShopBannerSuccess"
            :before-upload="beforeAvatarUpload">
            <el-button type="primary" plain>点击上传</el-button>
          </el-upload>
          <div class="upload-list-wrapper" v-if="ruleForm.photoList.length !== 0">
            <div class="upload-list-wrapper-item" v-for="(item, index) in ruleForm.photoList" :key="index + ''">
              <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i></label>
              <img :src="item" alt="轮播图片" />
              <div class="upload-list-wrapper-item-action">
                <i class="el-icon-zoom-in" @click="$parent.$parent.showImageDialog(item)"></i>
                <i class="el-icon-delete" @click="handleShopBannerRemove(index)"></i>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="商品状态" prop="audit">
          <el-radio-group v-model="ruleForm.audit">
            <el-radio-button v-for="(item, index) in statusList" :key="index + ''" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否使用积分消费" prop="allowIntegral">
          <el-radio-group v-model="ruleForm.allowIntegral">
            <el-radio-button v-for="(item, index) in statusList" :key="index + ''" :label="item.value">
              {{ item.yesNoLabel }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品视频" prop="video">
          <el-upload
            :action="upLoadApi"
            :name="upLoadKey"
            :limit="1"
            :before-remove="handleShopVideoRemove"
            :on-success="handleShopVideoSuccess"
            :before-upload="beforeAvatarVideoUpload"
            :file-list="fileList">
            <el-button type="primary" plain>点击上传</el-button>
          </el-upload>

          <div class="video-wrapper" v-if="this.ruleForm.video">
            <video controls v-if="this.ruleForm.video">
              <source :src="this.ruleForm.video" />
              您的浏览器不支持视频播放
            </video>
          </div>
        </el-form-item>
        <el-form-item label="商品详情图" prop="photo2">
          <el-upload
            :action="upLoadApi"
            :limit="1"
            :name="upLoadKey"
            :on-success="handleAvatarDetailSuccess"
            :before-upload="beforeAvatarUpload"
            :before-remove="handleImgDetailRemove"
            :file-list="fileList1">
            <el-button type="primary" plain>点击上传</el-button>
          </el-upload>
          <img v-show="ruleForm.photo2" :src="ruleForm.photo2" style="width: 100%;" ref="photo2">
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
  import helper from "../../utils/helper";
  import {clearObject, showConfirm, getNaturalImg, copyObject} from "../../utils/public";
  import enums from "../../utils/enums";
  import api from '../../utils/api'
  import service from "../../utils/service";

  const { shopTypeList, statusList, fixTimeList, navList, incrementServiceList, upLoadKey, shopList } = global.globalConfig;

  export default {
    computed: {
      shopTypeList() {
        return shopTypeList
      },
      statusList() {
        return statusList
      },
      fixTimeList() {
        return fixTimeList
      },
      navList() {
        return navList
      },
      incrementServiceList() {
        return incrementServiceList
      },
      upLoadApi() {
        return api.upload
      },
      upLoadKey() {
        return upLoadKey
      },
      tableLabel() {
        return shopList.tableLabel
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
        updateIndex: 0, // 被编辑的索引
        updateRow: {}, // 被编辑行数据
        submitType: false, // 编辑还是新增
        tableCheckBoxList: [], // 表格checkBoxList
        fileList: [],
        fileList1: [],
        popoverVisible: false,
        popoverVal: 0,
        ruleForm: {
          sortId: '',
          title: '',
          subtitle: '',
          stock: '',
          specifications: '',
          producingArea: '',
          integral: '',
          returnIntegral: '',
          thumb: '',
          photoList: [],
          photo: '',
          photo2: '',
          audit: 0,
          allowIntegral: 1,
          video: '',
          imgSize: ''
        },
        rules: {
          sortId: [{ required: true, message: '请输入商品序号，需要越小越靠前' }],
          title: [{ required: true, message: '请输入标题' }],
          subtitle: [{ required: true, message: '请输入副标题' }],
          stock: [{ required: true, message: '请输入商品库存' }],
          specifications: [{ required: true, message: '请输入商品规格' }],
          producingArea: [{ required: true, message: '请输入商品产地' }],
          integral: [{ required: true, message: '请输入商品消费积分' }],
          returnIntegral: [{ required: true, message: '请输入商品返回积分' }],
          thumb: [{ required: true, message: '请上传商品封面' }],
          photoList: [{ required: true, message: '请上传商品轮播图' }],
          photo2: [{ required: true, message: '请上传商品详情图' }],
          audit: [{ required: true, message: '请选择状态' }],
          allowIntegral: [{ required: true, message: '请选择是否使用积分' }],
          video: [{ required: false, message: '请上传商品视频' }],
        },
      }
    },
    mounted() {
      this.onReady();
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
      handleAllUpdateAudit() { // 批量审核
        if (this.tableCheckBoxList.length === 0) {
          helper.W('至少选择一个')
        } else {
          this.popoverVisible = true;
        }
      },
      doUpdateAuditByIds() {
        const idList = [];

        this.tableCheckBoxList.forEach((item) => {
          idList.push(item.id)
        });

        service.shopList.updateAllAuditByIds({
          params: { audit: this.popoverVal, ids: idList.join(',') },
          cb: () => {
            this.tableCheckBoxList.forEach((item) => {
              this.tableData.forEach((cItem) => {
                if (cItem.id === item.id) cItem.audit = this.popoverVal;
              })
            });
            helper.S();
          }
        })
      },
      handleUpdateAudit(index, row) { // 单个审核
        service.shopList.updateAllAuditByIds({
          params: {audit: row.audit === 0 ? 1 : 0, ids: row.id},
          cb: () => {
            this.tableData[index].audit = this.tableData[index].audit === 0 ? 1 : 0;
            helper.S();
          }
        })
      },
      setRuleForm(index, row) { // 编辑写入表单默认值
        this.updateIndex = index;
        this.updateRow = row;
        this.ruleForm = copyObject(this.ruleForm, row);
        this.ruleForm.photoList = this.ruleForm.photo.split(',');
        if (this.ruleForm.video) this.fileList.push({ name: '商品详情视频', url: this.ruleForm.video });
        if (this.ruleForm.photo2) this.fileList1.push({ name: '图片详情', url: this.ruleForm.photo2 });
        this.submitType = true;
        this.dialogVisible = true;
      },
      handleSubmit() { // 提交
        this.$refs.ruleForm.validate(valid => {
          if (valid) this.submitType ? this.handleUpdateOne() : this.handleAddOne()
        })
      },
      handleAddOne() { // 新增
        this.ruleForm.photo = this.ruleForm.photoList.join(',');
        service.shopList.addOne({
          params: this.ruleForm,
          cb: data => {
            this.tableData.unshift(data);
            helper.S();
            this.dialogVisible = false
          }
        });
      },
      handleUpdateOne() { // 编辑
        this.ruleForm.photo = this.ruleForm.photoList.join(',');
        service.shopList.updateOne({
          params: this.ruleForm,
          cb: data => {
            helper.S();
            this.dialogVisible = false;
            this.tableData[this.updateIndex] = copyObject(this.tableData[this.updateIndex], data);
          }
        })
      },
      handleDeleteOne(index, row) {
        service.shopList.deleteOne({
          params: { id: row.id },
          cb: () => {
            this.tableData.splice(index, 1);
            helper.S()
          }
        })
      },
      handleDialogClose() {
        this.$refs.ruleForm.resetFields();
        clearObject(this.ruleForm);
        this.fileList = [];
        this.fileList1 = [];
        this.ruleForm.audit = 0;
        this.ruleForm.allowIntegral = 1;
        this.submitType = false;
      },
      handleAvatarSuccess(res, file) {
        this.ruleForm.thumb = res.result
      },
      handleShopBannerSuccess(res, file) {
        this.ruleForm.photoList.push(res.result);
      },
      handleShopBannerRemove(index) {
        this.ruleForm.photoList.splice(index, 1)
      },
      handleShopVideoRemove() {
        this.ruleForm.video = '';
      },
      handleAvatarDetailSuccess(res, file) {
        this.ruleForm.photo2 = res.result;
        getNaturalImg(this.ruleForm.photo2, (width, height) => {
          this.ruleForm.imgSize = (height / width).toFixed(2);
        })
      },
      handleShopVideoSuccess(res, file) {
        this.ruleForm.video = res.result;
      },
      handleImgDetailRemove() {
        this.ruleForm.photo2 = '';
        this.ruleForm.imgSize = '';
      },
      beforeAvatarUpload(file) {
        const isMime = enums.UPLOAD_IMG_MIME.indexOf(file.type) !== -1;
        const is10MB = file.size / 1024 / 1024 <= enums.UPLOAD_SIZE;

        if (!isMime) helper.W(enums.UPLOAD_IMG_MIME_MSG);
        if (!is10MB) helper.W(enums.UPLOAD_SIZE_MSG);

        return isMime && is10MB
      },
      beforeAvatarVideoUpload(file) {
        const isMime = enums.UPLOAD_VIDEO_MIME.indexOf(file.type) !== -1;
        const is50MB = file.size / 1024 / 1024 <= enums.UPLOAD_VIDEO_SIZE;

        if (!isMime) helper.W(enums.UPLOAD_VIDEO_MIME_MSG);
        if (!is50MB) helper.W(enums.UPLOAD_VIDEO_SIZE_MSG);

        return isMime && is50MB
      },
      selectChange(val) {
        this.tableCheckBoxList = val;
      },
      setTableData(params={}) {
        service.shopList.list({
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            ...this.searchData
          },
          cb: ({ list, page }) => {
            this.tableData = list;
            this.pageNum = page.page;
            this.pageSize = page.pageSize;
            this.total = page.total;
          }
        })
      },
      setOption() {
        this.tableLabel.forEach((item, index) => {
          if (item.name === 'audit') {
            this.tableLabel[index].option = this.statusList;
          }
        })
      }
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../assets/style/pageItem.less";
</style>
