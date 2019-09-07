const SUCCESS_CODE = 200;
const UPLOAD_IMG_MIME = ['image/jpeg', 'image/png', 'image/gif'];
const UPLOAD_VIDEO_MIME = ['video/mp4'];
const APP_MIME = ['application/vnd.android.package-archive', 'application/octet-stream.ipa', 'application/xml'];
const UPLOAD_SIZE = 10;
const UPLOAD_VIDEO_SIZE = 500;   // 2018/10/31修改跟换光彩全球视频
const UPLOAD_IMG_MIME_MSG = '图片格式错误';
const UPLOAD_VIDEO_MIME_MSG = '视频格式错误';
const APP_MIME_MSG = '设备包上传文件格式错误';
const UPLOAD_SIZE_MSG = '图片大小不能超过10M';
const UPLOAD_VIDEO_SIZE_MSG = '视屏大小不能超过100M';
const SUPER_STORE_ID = 1;

export default {
  SUCCESS_CODE,
  UPLOAD_IMG_MIME,
  UPLOAD_SIZE,
  UPLOAD_IMG_MIME_MSG,
  UPLOAD_SIZE_MSG,
  SUPER_STORE_ID,
  UPLOAD_VIDEO_MIME,
  UPLOAD_VIDEO_SIZE,
  UPLOAD_VIDEO_SIZE_MSG,
  UPLOAD_VIDEO_MIME_MSG,
  APP_MIME,
  APP_MIME_MSG
}
