import request from 'axios'
import qs from 'qs'
import enums from './enums'
import helper from './helper'
import { Loading } from 'element-ui'

let loadingInstance;
const FILE_HEADER = { 'Content-Type': 'multipart/form-data' };

const showLoading = () => {
  loadingInstance = Loading.service({
    lock: true,
    text: '玩命加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0)'
  })
};
const hideLoading = () => loadingInstance.close();

class Request {
  constructor() {
    // 公共请求参数
    request.defaults.params = {
    };

    request.interceptors.request.use(require('cors')());

    // 请求最大时间
    // request.defaults.timeout = 60 * 1000;

    // 请求之前
    request.interceptors.request.use(function (config) {
      showLoading();

      return config;
    }, function (error) {
      hideLoading();
      helper.E();

      return Promise.reject(error);
    });

    // 响应
    request.interceptors.response.use(function (response) {
      hideLoading();

      return response;
    }, function (error) {
      hideLoading();
      helper.E();

      return Promise.reject(error);
    });

    // http 返回的状态code
    request.defaults.validateStatus = status => {
      return status >= 200 && status < 300;
    };

    this.instance = request;
    this.roleId = undefined;
    this.userId = undefined;
  }

  apiGet(url='', params={}, valid = true) {
    this.setSessionStorage();

    return new Promise((resolve, reject) => {
      this.instance.get(url,
        {
          params: {
            roleId: this.roleId, userId: this.userId, ...params
          }
        }).then((res) => {
        resolve(res.data);
        if (valid) this.checkResData(res.data)
      })
    })
  }

  apiPost(url='', params={}, valid = true) {
    this.setSessionStorage();

    return new Promise((resolve, reject) => {
      this.instance.post(url, qs.stringify({ roleId: this.roleId, userId: this.userId, ...params })).then((res) => {
        resolve(res.data);
        if (valid) this.checkResData(res.data)
      })
    })
  }

  apiFile(url='', fileKey='file', file) {
    const formData = new FormData();
    formData.append(fileKey, file);

    return new Promise((resolve, reject) => {
      this.instance.post(url, formData, {headers: FILE_HEADER}).then((res) => {
        resolve(res.data)
      })
    })
  }

  checkResData({ code, msg }) {
    if (code !== enums.SUCCESS_CODE) {
      helper.E(msg);
    }
  }

  setSessionStorage() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (userInfo) {
      const { user, role } = userInfo;
      if (user) this.userId = user.id;
      if (role) this.roleId = role.id;
    }
  }
}

export default Request
