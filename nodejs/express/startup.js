var program      = require('commander');
var path         = require('path');
var fs           = require('fs');

// 读取package.json内容
var _pkgFilePath = path.resolve(__dirname, 'package.json');
var _pkgString   = fs.readFileSync(_pkgFilePath, 'utf8');
var _pkgJSON     = JSON.parse(_pkgString);

// 解析字符串为boolean变量
var _parseBoolean = function(val) {
  return 't' == val || 'true' == val;
};

// 设置参数解析格式
program
  .version(_pkgJSON.version)
  .option('-p,  --port <port>', 'Port, default 3000', parseInt)
  .option('-t,  --tomcatPort <port>', 'Tomcat Process Port, default 8080', parseInt)
  .option('-c,  --configfile <configfile>', 'onfig file name, default config4dev.json')
  .option('-l,  --livereload <true|false>', 'Load livereload js. default \'false\'', _parseBoolean)
  .parse(process.argv);

// 打印命令参数帮助信息
program.outputHelp(); 

// 命令参数默认值及合法性校验
program.port = program.port || 3000;
program.tomcatPort = program.tomcatPort || 8080;
program.configfile = program.configfile || 'config4dev.json';
program.livereload = program.livereload || false;

// 校验配置文件是否存在
var _configFilePath = path.resolve(__dirname, program.configfile);
if (!fs.existsSync(_configFilePath)) {
  console.error('configfile not exists', _configFilePath);
  return;
};

// 将命令参数转为全局变量，以方便在其他文件中直接使用
global.__configfile = program.configfile;
global.__port       = program.port;
global.__tomcatPort = program.tomcatPort;
global.__livereload = program.livereload;

var app = require('./app');
var logger = require('./lib/log4js').getLogger('startup');

app.set('port', __port);

var server = app.listen(app.get('port'), function() {
  logger.info(_pkgJSON.name+'@'+_pkgJSON.version, 'start up on port', __port, "with pid", process.pid);
  logger.info('Configfile:', program.configfile);
  logger.info('Livereload:', __livereload);
});