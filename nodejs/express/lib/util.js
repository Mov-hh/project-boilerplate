var path        = require('path');
var fs          = require('fs');

// 读取配置文件
var _configJSON = {};
(function() {
  if (typeof __configfile == 'undefined') {
    __configfile = 'config4dev.json';
  }

  var _file = path.resolve(__dirname, '..', __configfile)
  if (fs.existsSync(_file)) {
    var _data = fs.readFileSync(_file, 'utf8');
    _configJSON = JSON.parse(_data);
  } else {
    console.error('lib/util.js', 'can find configfile', _file);
  }
})();

/**
 * 获取系统配置项
 */
function getConfig(key) {
  return _configJSON[key];
}

module.exports = {
  getConfig                     : getConfig
};