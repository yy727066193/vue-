import enums from './enums'
import api from './api'
import Request from './request'

const successCode = enums.SUCCESS_CODE;
const request = new Request();

const { upLoadKey } = global.globalConfig;

const service = {
  login(params) {
    return request.apiPost(api.login, params)
  },
  async upLoadService({ file, cb }) {
    const { result } = await request.apiFile(api.upload, upLoadKey, file);
    cb(result)
  },
  async cityList({ type=1, id, cb }) {
    const { result } = await request.apiPost(api.cityList, { type, id }, false);
    cb(result)
  },

  bannerSet: { // 轮播图设置
    async list({ params, cb }) {
      const { code, data } = await request.apiGet(api.bannerSet.list, params);
      if (code === successCode) cb(data)
    },
    async addOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.bannerSet.addOne, params);
      if (code === successCode) cb(data);
    },
    async updateOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.bannerSet.updateOne, params);
      if (code === successCode) cb(data);
    },
    async deleteOne({ params, cb }) {
      const { code } = await request.apiGet(api.bannerSet.deleteOne, params);
      if (code === successCode) cb();
    },
    async updateAllStatusByIds({ params, cb }) {
      const { code } = await request.apiGet(api.bannerSet.updateAllStatusByIds, params);
      if (code === successCode) cb()
    }
  },

  bannerType: { // 轮播图类型
    async list({ params, cb }) {
      const { code, data } = await request.apiGet(api.bannerType.list, params);
      if (code === successCode) cb(data);
    }
  },

  storeList: { // 门店列表
    async list({ params, cb }) {
      const { code, data } = await request.apiGet(api.storeList.list, params);
      if (code === successCode) cb(data)
    },
    async listAll({ params, cb }) {
      const { code, data } = await request.apiGet(api.storeList.listAll, params);
      if (code === successCode) cb(data)
    },
    async addOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.storeList.addOne, params);
      if (code === successCode) cb(data);
    },
    async updateOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.storeList.updateOne, params);
      if (code === successCode) cb(data);
    },
    async deleteOne({ params, cb }) {
      const { code } = await request.apiGet(api.storeList.deleteOne, params);
      if (code === successCode) cb();
    }
  },

  shopList: { // 商品列表
    async list({ params, cb }) {
      const { code, data } = await request.apiGet(api.shopList.list, params);
      if (code === successCode) cb(data)
    },
    async listAll({ params, cb }) {
      const { code, data } = await request.apiGet(api.shopList.listAll, params);
      if (code === successCode) cb(data)
    },
    async addOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.shopList.addOne, params);
      if (code === successCode) cb(data);
    },
    async updateOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.shopList.updateOne, params);
      if (code === successCode) cb(data);
    },
    async deleteOne({ params, cb }) {
      const { code } = await request.apiGet(api.shopList.deleteOne, params);
      if (code === successCode) cb();
    },
    async updateAllAuditByIds({ params, cb }) {
      const { code } = await request.apiGet(api.shopList.updateAllAuditByIds, params);
      if (code === successCode) cb()
    }
  },

  integralSet: { // 积分设置
    async list({ params, cb }) {
      const { code, data } = await request.apiGet(api.integralSet.list, params);
      if (code === successCode) cb(data)
    },
    async addOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.integralSet.addOne, params);
      if (code === successCode) cb(data);
    },
    async updateOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.integralSet.updateOne, params);
      if (code === successCode) cb(data);
    },
    async deleteOne({ params, cb }) {
      const { code } = await request.apiGet(api.integralSet.deleteOne, params);
      if (code === successCode) cb();
    }
  },

  integralType: { // 积分设置类型
    async list({ params, cb }) {
      const { code, data } = await request.apiGet(api.integralType.list, params);
      if (code === successCode) cb(data);
    }
  },

  orderList: { // 订单列表
    async list({ params, cb }) {
      const { code, data } = await request.apiGet(api.orderList.list, params);
      if (code === successCode) cb(data);
    }
  },
  orderDetails: { // 订单详情
    async findByOid({ params, cb }) {
      const { code, data } = await request.apiGet(api.orderDetails.findByOid, params);
      if (code === successCode) cb(data);
    }
  },

  role: {
    async list({ params, cb }) {
      const { code, data } = await request.apiGet(api.role.list, params);
      if (code === successCode) cb(data)
    },
    async listAll({ params, cb }) {
      const { code, data } = await request.apiGet(api.role.listAll, params);
      if (code === successCode) cb(data)
    },
    async addOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.role.addOne, params);
      if (code === successCode) cb(data);
    },
    async updateOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.role.updateOne, params);
      if (code === successCode) cb(data);
    },
    async deleteOne({ params, cb }) {
      const { code } = await request.apiGet(api.role.deleteOne, params);
      if (code === successCode) cb();
    }
  },

  user: {
    async list({ params, cb }) {
      const { code, data } = await request.apiGet(api.user.list, params);
      if (code === successCode) cb(data)
    },
    async addOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.user.addOne, params);
      if (code === successCode) cb(data);
    },
    async updateOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.user.updateOne, params);
      if (code === successCode) cb(data);
    },
    async deleteOne({ params, cb }) {
      const { code } = await request.apiGet(api.user.deleteOne, params);
      if (code === successCode) cb();
    },
    async updateAllStatusByIds({ params, cb }) {
      const { code } = await request.apiGet(api.user.updateAllStatusByIds, params);
      if (code === successCode) cb();
    }
  },

  deviceManager: {
    async list({ params, cb }) {
      const { code, data } = await request.apiGet(api.deviceManager.list, params);
      if (code === successCode) cb(data)
    },
    async addOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.deviceManager.addOne, params);
      if (code === successCode) cb(data);
    },
    async updateOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.deviceManager.updateOne, params);
      if (code === successCode) cb(data);
    },
    async deleteOne({ params, cb }) {
      const { code } = await request.apiGet(api.deviceManager.deleteOne, params);
      if (code === successCode) cb();
    },
    async updateAllStatusByIds({ params, cb }) {
      const { code } = await request.apiGet(api.deviceManager.updateAllStatusByIds, params);
      if (code === successCode) cb();
    }
  },

  deviceVersion: { // 设备版本管理
    async list({ params, cb }) {
      const { code, data } = await request.apiGet(api.deviceVersion.list, params);
      if (code === successCode) cb(data)
    },
    async addOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.deviceVersion.addOne, params);
      if (code === successCode) cb(data)
    },
    async updateAllIsUpgradeByIds({ params, cb }) {
      const { code } = await request.apiGet(api.deviceVersion.updateAllIsUpgradeByIds, params);
      if (code === successCode) cb()
    }
  },

  intLogList: { // 积分记录列表
    async list({ params, cb }) {
      const { code, data } = await request.apiGet(api.intLogList.list, params);
      if (code === successCode) cb(data)
    },
  },

  memberList: { // 会员列表
    async list({ params, cb }) {
      const { code, data } = await request.apiGet(api.memberList.list, params);
      if (code === successCode) cb(data)
    },
    async findById({ params, cb }) {
      const { code, data } = await request.apiGet(api.memberList.findById, params);
      if (code === successCode) cb(data)
    },
    async updateOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.memberList.updateOne, params);
      if (code === successCode) cb(data);
    }
  },

  memberHealth: { // 会员健康
    async list({ params, cb }) {
      const { code, data } = await request.apiGet(api.memberHealth.list, params);
      if (code === successCode) cb(data)
    },
    async addOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.memberHealth.addOne, params);
      if (code === successCode) cb(data);
    },
    async updateOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.memberHealth.updateOne, params);
      if (code === successCode) cb(data);
    },
    async deleteOne({ params, cb }) {
      const { code } = await request.apiGet(api.memberHealth.deleteOne, params);
      if (code === successCode) cb();
    }
  },

  aboutMe: { // 关于我们
    async list({ params, cb }) {
      const { code, data } = await request.apiGet(api.aboutMe.list, params);
      if (code === successCode) cb(data)
    },
    async addOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.aboutMe.addOne, params);
      if (code === successCode) cb(data);
    },
    async updateOne({ params, cb }) {
      const { code, data } = await request.apiPost(api.aboutMe.updateOne, params);
      if (code === successCode) cb(data);
    },
    async deleteOne({ params, cb }) {
      const { code } = await request.apiGet(api.aboutMe.deleteOne, params);
      if (code === successCode) cb();
    }
  },

  log: { // 操作日志
    async list({ params, cb }) {
      const { code, data } = await request.apiGet(api.log.list, params);
      if (code === successCode) cb(data)
    }
  },

  signOrCode: { // 扫码签到和扫码核销
    async register({ params, cb }) {
      const { result } = await request.apiPost(api.signOrCode.register, params, false);
      cb(result);
    },
    async complete({ params, cb }) {
      const { msg,ret } = await request.apiPost(api.signOrCode.complete, params, false);
      cb({msg,ret});
    }
  },
};

export default service;
