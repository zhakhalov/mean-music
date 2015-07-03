/**
 * Perform require from project root.
 * @param {String} path Path to module. 
 */
global.__require = function (path) {
  return require(require('path').join(__dirname, path));
};
//-----------------------------------------------------------------
// node_modules
//-----------------------------------------------------------------
var http = require('http');
var express = require('express');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var multer = require('multer');

//-----------------------------------------------------------------
// modules
//-----------------------------------------------------------------

var logger = require('./modules/logger');
var storage = require('./modules/storage');

//-----------------------------------------------------------------
// configuration
//-----------------------------------------------------------------

var dbCfg = require('./config/db-cfg');

//-----------------------------------------------------------------
// controllers
//-----------------------------------------------------------------

var AuthApiCtrl = require('./controllers/auth-api-ctrl.js');
var UsersApiCtrl = require('./controllers/users-api-ctrl.js');
var AlbumsApiCtrl = require('./controllers/albums-api-ctrl.js');
var ArtistsApiCtrl = require('./controllers/artists-api-ctrl.js');
var SongsApiCtrl = require('./controllers/songs-api-ctrl.js');
var GenresApiCtrl = require('./controllers/genres-api-ctrl.js');
var ErrApiCtrl = require('./controllers/err-api-ctrl.js');

var IndexCtrl = require('./controllers/index-ctrl.js');

//-----------------------------------------------------------------
// bootstap app
//-----------------------------------------------------------------

// -----  express

var app = express();

var viewRouter = express.Router();
var apiRouter = express.Router();

app.use(multer({ dest: path.join(__dirname, '/tmp')}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, uploadDir: path.join(__dirname, '/tmp') }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api', apiRouter);
app.use(viewRouter);
app.use(express.static(path.join(__dirname, 'client')));
app.use(favicon(path.join(__dirname, 'assets/mean-music-logo.ico')));

var server = http.createServer(app);

// remove all uploaded files
apiRouter.all('*', function (req, res, next) {
  res.on('finish', function () {
    if (req.files) {
      for (var prop in req.files) {
        fs.unlink(req.files[prop].path);
      }
    }
  });
  next();
});

// -----  controllers

AuthApiCtrl(apiRouter);
UsersApiCtrl(apiRouter);
AlbumsApiCtrl(apiRouter);
ArtistsApiCtrl(apiRouter);
SongsApiCtrl(apiRouter);
GenresApiCtrl(apiRouter);
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
  storage.account(function (err, account) {
    if (err) {
      logger.error({ category:'storage', message: 'could not get account', err: err });
    } else {
      logger.info({ category:'storage', message: 'connected', account: account.email });
    }
  });
  
  // ----- server
  return server.listen(port, ip, function () {
    var addr = server.address();
    logger.info('server started at ' + addr.port);
  });  
};
