const baseUrl = process.env.NODE_ENV === 'development' ? 'https://hrys.hbhrlb.com:8085' : 'https://hrys.hbhrlb.com:8085';
const publicUrl = process.env.NODE_ENV === 'development' ? 'https://hrys.hbhrlb.com:8080' : 'https://hrys.hbhrlb.com:8080';

export default {
  login: baseUrl + '/freezeManager/login',
  upload: publicUrl + '/media/image/upload',
  cityList: publicUrl + '/media/my/area/query', // 城市列表
  // cityList: publicUrl + '/media/index?page=1&pageSize=10',
  // cityList: 'http://192.168.8.108:8080/media/order/create',
  // banner
  bannerSet: { // 轮播图设置
    list: baseUrl + '/freezeCirculate/findAll',
    addOne: baseUrl + '/freezeCirculate/addOne',
    updateOne: baseUrl + '/freezeCirculate/updateOne',
    deleteOne: baseUrl + '/freezeCirculate/deleteOne',
    updateAllStatusByIds: baseUrl + '/freezeCirculate/updateAllStatusByIds'
  },
  bannerType: { // 轮播图类型
    list: baseUrl + '/freezeBannerType/findAll'
  },
  storeList: { // 门店列表
    list: baseUrl + '/freezeStore/findAll',
    listAll: baseUrl + '/freezeStore/listAll',
    addOne: baseUrl + '/freezeStore/addOne',
    updateOne: baseUrl + '/freezeStore/updateOne',
    deleteOne: baseUrl + '/freezeStore/deleteOne'
  },
  shopList: { // 商品列表
    list: baseUrl + '/freezeProduct/findAll',
    listAll: baseUrl + '/freezeProduct/listAll',
    addOne: baseUrl + '/freezeProduct/addOne',
    updateOne: baseUrl + '/freezeProduct/updateOne',
    deleteOne: baseUrl + '/freezeProduct/deleteOne',
    updateAllAuditByIds: baseUrl + '/freezeProduct/updateAllAuditByIds'
  },
  integralSet: { // 积分设置
    list: baseUrl + '/freezeIntegralSet/findAll',
    addOne: baseUrl + '/freezeIntegralSet/addOne',
    updateOne: baseUrl + '/freezeIntegralSet/updateOne',
    deleteOne: baseUrl + '/freezeIntegralSet/deleteOne'
  },
  integralType: { // 积分设置类型
    list: baseUrl + '/freezeIntegralType/findAll'
  },
  orderList: { // 订单列表
    list: baseUrl + '/freezeOrder/findAll'
  },
  orderDetails: { // 订单详情
    findByOid: baseUrl + '/freezeOrderDetails/findByOid'
  },
  role: { // 角色管理
    list: baseUrl + '/freezeManagerGroup/findAll',
    listAll: baseUrl + '/freezeManagerGroup/listAll',
    addOne: baseUrl + '/freezeManagerGroup/addOne',
    updateOne: baseUrl + '/freezeManagerGroup/updateOne',
    deleteOne: baseUrl + '/freezeManagerGroup/deleteOne',
  },
  user: { // 账号管理
    list: baseUrl + '/freezeManager/findAll',
    addOne: baseUrl + '/freezeManager/addOne',
    updateOne: baseUrl + '/freezeManager/updateOne',
    deleteOne: baseUrl + '/freezeManager/deleteOne',
    updateAllStatusByIds: baseUrl + '/freezeManager/updateAllStatusByIds'
  },
  deviceManager: { // 设备管理
    list: baseUrl + '/freezeDevice/findAll',
    addOne: baseUrl + '/freezeDevice/addOne',
    updateOne: baseUrl + '/freezeDevice/updateOne',
    deleteOne: baseUrl + '/freezeDevice/deleteOne',
    updateAllStatusByIds: baseUrl + '/freezeDevice/updateAllStatusByIds'
  },
  deviceVersion: { // 设备版本管理
    list: baseUrl + '/freezeDeviceVersion/findAll',
    addOne: baseUrl + '/freezeDeviceVersion/addOne',
    updateAllIsUpgradeByIds: baseUrl + '/freezeDeviceVersion/updateAllIsUpgradeByIds'
  },
  intLogList: { // 积分记录列表
    list: baseUrl + '/freezeIntegralLog/findAll'
  },
  memberList: { // 会员列表
    list: baseUrl + '/freezeUser/findAll',
    findById: baseUrl + '/freezeUser/findById',
    updateOne: baseUrl + '/freezeUser/updateOne'
  },
  memberHealth: { // 会员健康
    list: baseUrl + '/freezeUserHealth/findAll',
    addOne: baseUrl + '/freezeUserHealth/addOne',
    updateOne: baseUrl + '/freezeUserHealth/updateOne',
    deleteOne: baseUrl + '/freezeUserHealth/deleteOne',
  },
  aboutMe: {
    list: baseUrl + '/freezeAboutMe/findAll',
    addOne: baseUrl + '/freezeAboutMe/addOne',
    updateOne: baseUrl + '/freezeAboutMe/updateOne',
    deleteOne: baseUrl + '/freezeAboutMe/deleteOne',
  },
  log: {
    list: baseUrl + '/freezeActionLog/findAll'
  },
  signOrCode: {  // 扫码签到和扫码核销
    register: publicUrl + '/media/code_scan/register',
    complete: publicUrl + '/internal/order/complete',
  },
}
