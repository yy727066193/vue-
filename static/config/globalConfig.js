window.globalConfig = {
  upLoadKey: 'file',
  statusList: [
    {
      label: '下架',
      yesNoLabel: '不是',
      startEndLabel: '禁用',
      useLabel: '不可用',
      value: 0
    },
    {
      label: '上架',
      yesNoLabel: '是',
      startEndLabel: '启用',
      useLabel: '在使用',
      value: 1
    }
  ],
  sexList: [
    {label: '男', value: '男'},
    {label: '女', value: '女'}
  ],
  userLevelList: [
    {label: '店长', value: 0},
    {label: '店员', value: 1},
    {label: '普通会员', value: 2}
  ],
  orderStatusList: [
    {label: '待付款', value: 1},
    {label: '待自提', value: 2},
    {label: '待评价', value: 3},
    {label: '已完成', value: 4}
  ],
  intTypeList: [
    {label: '签到', value: 1},
    {label: '新人邀请', value: 2},
    {label: '购买商品(购买赠送)', value: 3},
    {label: '购买商品(购买扣除)', value: 4}
  ],
  bannerSet: { // 轮播图设置
    tableLabel: [
      {label: '图片/视频', name: 'img'},
      {label: '轮播图类型', name: 'columms', formType: 'select', sortable: true},
      {label: '轮播图目标商品', name: 'goodsId', formType: 'select'},
      {label: '创建时间', name: 'createTime', sortable: true},
      {label: '更新时间', name: 'updateTime', sortable: true}
    ]
  },
  storeList: { // 门店列表
    tableLabel: [
      {label: '门店图片', name: 'photo'},
      {label: '门店名称', name: 'title', formType: 'input'},
      {label: '门店详细地址', name: 'addr', formType: 'input'},
      {label: '门店经纬度', name: 'lal'},
      {label: '推荐注册人数', name: 'invitePersonCount', sortable: true},
      {label: '门店联系方式', name: 'telephone', formType: 'input'},
      {label: '门店负责人', name: 'storeName', formType: 'input'},
      {label: '创建时间', name: 'createTime', sortable: true},
      {label: '更新时间', name: 'updateTime', sortable: true}
    ]
  },
  shopList: {
    tableLabel: [
      {label: '商品序号', name: 'sortId', sortable: true},
      {label: '商品名称', name: 'title', formType: 'input'},
      {label: '商品副标题', name: 'subtitle', formType: 'input'},
      {label: '商品封面', name: 'thumb'},
      {label: '商品库存', name: 'stock', sortable: true},
      {label: '商品消费积分', name: 'integral', sortable: true},
      {label: '商品返回积分', name: 'returnIntegral', sortable: true},
      {label: '商品兑换数', name: 'exchangeCount', sortable: true},
      {label: '商品规格', name: 'specifications', formType: 'input'},
      {label: '商品产地', name: 'producingArea', formType: 'input'},
      {label: '商品状态', name: 'audit', formType: 'select', visible: true},
      {label: '创建时间', name: 'createTime', sortable: true},
      {label: '更新时间', name: 'updateTime', sortable: true}
    ]
  },
  integralSet: { // 积分设置
    tableLabel: [
      {label: '签到类型', name: 'typeId'},
      {label: '积分', name: 'val', sortable: true},
      {label: '签到间隔(分钟)', name: 'minScope', sortable: true},
      {label: '创建时间', name: 'createTime', sortable: true},
      {label: '更新时间', name: 'updateTime', sortable: true}
    ]
  },
  orderList: { // 订单列表
    tableLabel: [
      {label: '提交订单', name: 'startEndTime', formType: 'datetimerange', visible: true},
      {label: '订单编号', name: 'orderId', formType: 'input'},
      {label: '用户id', name: 'uid', formType: 'input'},
      {label: '订单总价', name: 'price', sortable: true},
      {label: '应付积分', name: 'integral', sortable: true},
      {label: '结算门店', name: 'settlementStore', formType: 'input'},
      {label: '收货人姓名', name: 'name', formType: 'input'},
      {label: '手机号码', name: 'mobile'},
      {label: '门店名称', name: 'storeId', formType: 'select'},
      {label: '门店地址', name: 'addr', formType: 'input'},
      {label: '经纬度', name: 'lal'},
      {label: '订单返回积分', name: 'returnIntegral', sortable: true},
      {label: '订单状态', name: 'orderStatus', formType: 'select'},
      {label: '提交订单时间', name: 'createTime', sortable: true},
      {label: '支付时间', name: 'payTime', sortable: true},
      {label: '完成时间', name: 'doneTime', sortable: true},
    ]
  },
  orderDetails: { // 订单详情
    tableLabel: [
      {label: '商品名称', name: 'ptitle'},
      {label: '商品封面', name: 'pphoto'},
      {label: '商品数量', name: 'number'},
      {label: '商品价格', name: 'price'},
      {label: '应付积分', name: 'integral'},
      {label: '商品返回积分', name: 'returnIntegral'},
      {label: '订单提交时间', name: 'createTime'}
    ]
  },
  role: { // 角色管理
    tableLabel: [
      {label: '角色名称', name: 'title'},
      {label: '创建时间', name: 'createTime', sortable: true},
      {label: '更新时间', name: 'updateTime', sortable: true}
    ]
  },
  user: { // 账号管理
    tableLabel: [
      {label: '账号', name: 'uname', formType: 'input'},
      {label: '角色名称', name: 'gid'},
      {label: '姓名', name: 'nickname', formType: 'input'},
      {label: '电话', name: 'phone'},
      {label: '创建时间', name: 'createTime', sortable: true},
      {label: '更新时间', name: 'updateTime', sortable: true}
    ]
  },
  deviceManager: { // 设备管理
    tableLabel: [
      {label: '设备mac地址', name: 'deviceMac', formType: 'input'},
      {label: '门店名称', name: 'storeId', formType: 'select'},
      {label: '设备状态', name: 'status', formType: 'select', visible: true},
      {label: '备注', name: 'remark'},
      {label: '创建时间', name: 'createTime', sortable: true},
      {label: '更新时间', name: 'updateTime', sortable: true}
    ]
  },
  deviceVersion: { // 设备版本
    tableLabel: [
      {label: '版本号', name: 'version', formType: 'input'},
      {label: 'apk地址', name: 'apkUrl'},
      {label: '是否强制更新', name: 'isUpgrade', formType: 'select'},
      {label: '备注', name: 'remark'},
      {label: '创建时间', name: 'createTime', sortable: true}
    ]
  },
  intLogList: { // 积分记录列表
    tableLabel: [
      {label: '用户uid', name: 'uid', formType: 'input'},
      {label: '类型', name: 'type', formType: 'select'},
      {label: '备注', name: 'message', formType: 'input'},
      {label: '积分', name: 'integral'},
      {label: '创建时间', name: 'createTime'}
    ]
  },
  memberList: { // 会员列表
    tableLabel: [
      {label: '创建时间', name: 'startEndTime', formType: 'datetimerange', visible: true},
      {label: '用户id', name: 'id'},
      {label: '姓名', name: 'name', formType: 'input'},
      {label: '手机', name: 'mobile', formType: 'input'},
      {label: '身份证', name: 'idCode', formType: 'input'},
      {label: '微信openId', name: 'openID', formType: 'input'},
      {label: '昵称', name: 'nickname', formType: 'input'},
      {label: '剩余积分', name: 'integral'},
      {label: '头像', name: 'photo'},
      {label: '会员级别', name: 'userLevel', formType: 'select'},
      {label: '总积分', name: 'totalIntegral'},
      {label: '年龄', name: 'age'},
      {label: '所属门店', name: 'store', formType: 'select'},
      {label: '芯片卡号', name: 'magneticCard', formType: 'input'},
      {label: '健康状态', name: 'health', formType: 'input'},
      {label: '性别', name: 'sex', formType: 'select'},
      {label: '职业', name: 'profession', formType: 'input'},
      {label: '兴趣', name: 'interest', formType: 'input'},
      {label: '创建时间', name: 'createTime', sortable: true},
      {label: '更新时间', name: 'updateTime', sortable: true}
    ]
  },
  memberHealth: { // 会员健康列表
    tableLabel: [
      {label: '名称', name: 'name'},
      {label: '排序', name: 'sortId', sortable: true},
      {label: '创建时间', name: 'createTime'}
    ]
  },
  aboutMe: { // 关于我们
    tableLabel: [
      {label: 'tab名称', name: 'tabName'},
      {label: 'icon', name: 'iconUrl'},
      {label: '排序', name: 'sortId'},
      {label: '创建时间', name: 'createTime', sortable: true},
      {label: '更新时间', name: 'updateTime', sortable: true}
    ]
  },
  log: { // 操作日志
    tableLabel: [
      {label: 'ip', name: 'ip'},
      {label: '参数', name: 'params'},
      {label: '内容', name: 'content'},
      {label: '创建时间', name: 'createTime', sortable: true}
    ]
  }
};
