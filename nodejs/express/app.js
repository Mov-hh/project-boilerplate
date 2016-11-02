// require
// -----------------------------------------------------------------------------
var express            = require('express');
var path               = require('path');
var favicon            = require('serve-favicon');
var cookieParser       = require('cookie-parser');
var bodyParser         = require('body-parser');

var util               = require('./lib/util');
var log4js             = require('./lib/log4js');

var app                = express();
var logger             = log4js.getLogger('/app');

// view engine setup
// -----------------------------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('etag', false);
// app.set('view cache', util.getConfig('ejs')['view cache']);
app.use(favicon(path.join(__dirname, 'favicon.ico')));

// static resource
// -----------------------------------------------------------------------------
app.use(express.static('public'));

// livereload
// ------------------------------------------------------------------
if (__livereload) {
  var watchDir = path.resolve(process.cwd(), 'views');

  // 自动刷新配置
  var livereload = require('express-livereload');  // 自动刷新

  logger.info('livereload is watching on: ', watchDir);

  livereload(app, {
    watchDir: watchDir,
    exts: ['js', 'css', 'ejs', 'img', 'png', 'gif']
  });
}

// common use() of app
// -----------------------------------------------------------------------------
// 访问日志
app.use(log4js.connectLogger(log4js.getLogger("http"), {
    level: 'auto',
    format: ':req[X-Forwarded-For] - -' +
        ':req[Cookie] - -' +
        ' ":method :url HTTP/:http-version"' +
        ' :status :content-length :response-time ":referrer"' +
        ' ":user-agent"'
  }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// 设置响应头 && 是否开启js debug [注]开启debug后直接输出的js都是未压缩版本
// -----------------------------------------------------------------------------
var defaultExpires4Request = new Date('1970-01-01').toUTCString();

app.use('/*', function(req, res, next) {
  res.set('Content-Type', 'text/html;charset=UTF-8');
  res.set('Cache-Control', 'no-cache');
  res.set('Pragma', 'no-cache');
  res.set('Expires', defaultExpires4Request);

  next();
});


// biz routers
// -----------------------------------------------------------------------------
var testRoute  = require('./routes/test-route');

app.use('/', testRoute);

// request not found, route to err handler
// -----------------------------------------------------------------------------
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// -----------------------------------------------------------------------------
app.use(function(err, req, res, next) {
  res.send("Error:" + err);
});

module.exports = app;

