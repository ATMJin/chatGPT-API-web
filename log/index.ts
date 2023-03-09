var path = require("path");
import log4js from 'log4js';
log4js.configure({
  appenders: {
    cheese: {
      type: 'file',
      filename: 'nuxt.log',
      maxLogSize: 10, //文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
    }
  },
  categories: {
    default: {
      appenders: ['nuxt'],
      level: 'debug'
    }
  }
});

const logger = log4js.getLogger('nuxt');

module.exports = logger;