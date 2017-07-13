'use strict';

module.exports = {
  creator: 'luckyadam', // 模块创建者
  app: 'make-a-wheel', // 项目名称
  common: 'gb', // 公共模块名称
  module: 'lesson-1', // 当前模块名
  moduleId: '3996d980-67ad-11e7-80a0-61f44d44c082',
  description: '第一课', // 模块简要信息
  tmpId: '59145817dd47ad6e5b02bee0',
  support : {
    csslint: {
      enable: true
    },
    jslint: {
      enable: true
    },
    imagemin: { // 图片压缩的配置
      exclude: [] // 图片压缩排除的图片
    },
    autoprefixer: { // 自动前缀的配置
      pc: [
      	'last 3 versions',
      	'Explorer >= 8',
      	'Chrome >= 21',
        'Firefox >= 1',
        'Edge 13'
      ],
      mobile: [
      	'Android >= 4',
      	'iOS >= 6'
      ]
    },
    px2rem: {
      enable: false,
      root_value: 40,
      unit_precision: 5,
      prop_white_list: [],
      selector_black_list: [],
      replace: true,
      media_query: false
    },
    compress: {
      css: {
        mergeRules: false,
        mergeIdents: false,
        reduceIdents: false,
        discardUnused: false,
        minifySelectors: false
      },
      js: {
        mangle:{except : ['require', 'exports', 'seajs', 'module']}
      }
    },
    fontcompress : {
      enable: false
    },
    csssprite: {
      enable: true,
      retina: false,
      rootvalue: 0
    }
  }
};
