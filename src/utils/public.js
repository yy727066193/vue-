/**
* 缓存登录信息
* @params modules  路由信息
* @params userInfo 账户信息
* */
export function saveSessionLoginInfo({ modules, userInfo }) {
  if (modules) {
    sessionStorage.setItem('modules', JSON.stringify(modules))
  }

  if (userInfo) {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
  }
}

/**
* 获取缓存的登录信息
* */
export function getSessionLoginInfo() {
  const modules = JSON.parse(sessionStorage.getItem('modules'));
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

  return {
    modules,
    userInfo
  }
}

/**
* 清空缓存的登录信息
* */
export function clearSessionLoginInfo() {
  sessionStorage.removeItem('modules');
  sessionStorage.removeItem('userInfo');
}

/**
* 格式化路由信息修正为vue-router需要的格式
* @params modules 路由信息
* */
export function formatRouter(modules) {
  if (!modules && !Array.isArray(modules)) {
    return [];
  }

  const routes = [
    {
      path: '/container',
      component: resolve => require([`../views/Container.vue`], resolve),
      children: [
        {
          path: '/home',
          component: resolve => require([`../views/pages/home.vue`], resolve)
        }
      ]
    }
  ];

  for (let i = 0, len = modules.length; i < len; i++) {
    let item = modules[i];
    let children = item.modules;

    if (item.path) {
      routes[0].children.push({
        path: `/${item.path}`,
        component: resolve => require([`../views/pages/${item.path}.vue`], resolve)
      })
    }

    if (children) {
      for (let j = 0, jLen = children.length; j < jLen; j++) {
        let cItem = children[j];

        if (cItem.path) {
          routes[0].children.push({
            path: `/${cItem.path}`,
            component: resolve => require([`../views/pages/${cItem.path}.vue`], resolve)
          })
        }
      }
    }
  }

  return routes
}

/**
* 清空对象值
* @params targetObj 被清空的对象
* @params val       清空的值
* */
export function clearObject (targetObj, val=undefined) {
  for (let key in targetObj) {
    if (Array.isArray(targetObj[key])) {
      targetObj[key] = []
    } else {
      targetObj[key] = val
    }
  }
}

/**
* 对象copy
* @params targetObject 需要copy的对象
* @params obj          被copy的对象
* */
export function copyObject (targetObject, obj) {
  for (let key in obj) {
    targetObject[key] = obj[key]
  }

  return targetObject
}

/**
* 二次确认
* @params msg                 警告文案
* @params title               警告标题文案
* @params confirmButtonText   警告确认按钮文案
* @params cancelButtonText    警告取消按钮文案
* @params type                警告方式
* @params cb                  点击确认回调
* @params cancelCb            点击取消回调
* */
import { MessageBox } from 'element-ui'
export function showConfirm({ msg='确认执行吗?',
                              title='提示',
                              confirmButtonText='确定',
                              cancelButtonText='取消',
                              type='warning',
                              cb=() => {},
                              cancelCb=() => {} }) {
  MessageBox.confirm(msg, title, {
    confirmButtonText,
    cancelButtonText,
    type
  }).then(() => {
    cb()
  }).catch(() => {
    cancelCb()
  })
}

/*
* 获取图片的原始尺寸返回图片尺寸
* @params imgUrl
* */
export function getNaturalImg(imgUrl, callback) {
  const image = new Image();

  image.src = imgUrl;
  image.onload = () => {
    callback(image.width, image.height)
  }
}

/*
* 时间字符串转时间戳
* @params dateStr
* */
export function getTimeStr(dateStr) {

  return new Date(Date.parse(dateStr.replace(/-/g, "/"))).getTime();
}
