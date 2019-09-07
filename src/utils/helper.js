import { Message,Notification } from 'element-ui'

const S = (msg='成功') => Message.success(msg);
const W = (msg='警告') => Message.warning(msg);
const E = (msg='系统异常') => Message.error(msg);
const I = (msg='信息') => Message.info(msg);

const N_S = (msg) => Notification.success(msg);
const N_W = (msg) => Notification.warning(msg);
const N_E = (msg) => Notification.error(msg);

export default {
  S,
  W,
  E,
  I,
  N_S,
  N_W,
  N_E
}
