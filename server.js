global.__require = function (path) {
  return require(require('path').join(__dirname, path));
};
//-----------------------------------------------------------------
// npm modules
//-----------------------------------------------------------------
var http = require('http');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

//-----------------------------------------------------------------
// modules
//-----------------------------------------------------------------

var logger = require('./modules/logger');
var storage = require('./modules/storage');

//-----------------------------------------------------------------
// configuration
//-----------------------------------------------------------------

var dbCfg = require('./config/db-cfg');
var storageCfg = global.__require('./config/storage-cfg.js');

//-----------------------------------------------------------------
// controllers
//-----------------------------------------------------------------

var AuthApiCtrl = require('./controllers/auth-api-ctrl.js');
var UsersApiCtrl = require('./controllers/users-api-ctrl.js');
var AlbumsApiCtrl = require('./controllers/albums-api-ctrl.js');
var ArtistsApiCtrl = require('./controllers/artists-api-ctrl.js');
var SongsApiCtrl = require('./controllers/songs-api-ctrl.js');
var ErrApiCtrl = require('./controllers/err-api-ctrl.js');

var IndexCtrl = require('./controllers/index-ctrl.js');

//-----------------------------------------------------------------
// bootstap app
//-----------------------------------------------------------------

// -----  express

var app = express();

var viewRouter = express.Router();
var apiRouter = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api', apiRouter);
app.use(viewRouter);
app.use(express.static(path.join(__dirname, 'client')));
app.use(favicon(path.join(__dirname, 'assets/mean-music-logo.ico')));

var server = http.createServer(app);

// -----  controllers

AuthApiCtrl(apiRouter);
UsersApiCtrl(apiRouter);
AlbumsApiCtrl(apiRouter);
ArtistsApiCtrl(apiRouter);
SongsApiCtrl(apiRouter);
ErrApiCtrl(apiRouter);

IndexCtrl(viewRouter);

//-----------------------------------------------------------------
// start app
//-----------------------------------------------------------------

module.exports = function (port, ip) {
  // ----- database
  mongoose.connect(dbCfg.connectionString, function (err) {
    if (err) {
      logger.error({ category:'database', message: 'could not connect', err: err });
    } else {
      logger.info({ category:'database', message: 'connected' });
    }
  });
  
  // ----- storage
  storage(storageCfg.credentials, function (err) {
    if (err) {
      logger.error({ category: 'storage', message: 'login error', err: err });
    } else {
      logger.info({ category: 'storage', message: 'connected' });
    }
  });
  
  // ----- server
  return server.listen(port, ip, function () {
    var addr = server.address();
    logger.info('server started at ' + addr.port);
  });  
};
