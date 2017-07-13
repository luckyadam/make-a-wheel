'use strict';

module.exports = {
  app: 'make-a-wheel', // 项目英文名
  appId: '5446a920-617e-11e7-877f-a149c1f33279', // 项目ID
  description: '造个轮子',
  platform: 'mobile', // 平台 pc or mobile
  common: 'gb', // 公共模块名称
  moduleList: ['gb', 'lesson-1', 'lesson-2', 'lesson-3'],
  tmpId: '59145817dd47ad6e5b02bee0', // 选用模板
  shtml: {  //页面片配置
    use: false, //是否使用
    needCombo: false // 页面片中链接是否合并
  },
  comboConf: {
    mode: 'server',
    server: {
      flag: '??',
      onlineDomain: '//static.360buyimg.com/mtd/pc/',
      shortPath: 'make-a-wheel'
    }
  },
  deploy: { //项目部署配置，可自己增加另外的需要进行ftp上传的机器
    local: { // 本地预览配置
      fdPath: '/'
    }
  }
};
