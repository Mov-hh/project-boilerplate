var path          = require('path');
var log4js        = require('log4js');
var util          = require('./util');

// config log4js
var _log4jsConfig = util.getConfig('log4jsConfig');

for(var i = 0, len = _log4jsConfig.appenders.length; i < len; i++) {
  var _appender = _log4jsConfig.appenders[i];
  //XXX: 当使用其他写文件的日志类型时需增加判断条件
  if (_appender.type === 'dateFile' || _appender.type == 'file') {
    _appender.filename = _appender.filename.replace('{port}', __port);

    //TODO: 判断目录是否存在，不存在时创建之
  }
}

log4js.configure(util.getConfig('log4jsConfig'));

module.exports = log4js;
