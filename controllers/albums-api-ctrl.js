// ----- node_modules
var _ = require('lodash');

// ----- config
var cfg = global.__require('./config/db-cfg.js').albums;

// ----- custom modules
var security = global.__require('./modules/security');

// ----- models
var AlbumModel = global.__require('./models/album-model.js');
var ArtistModel = global.__require('./models/artist-model.js');

module.exports = function (router) {
  router
  .get('/albums/removeall', function (req, res, next) {
    if (!process.env.DEV) { return next(_.assign(new Error('DEV server only'), { status: 403 })); }
    ArtistModel.remove().exec(function (err) {
      if (err) {
        next(err);
      } else {
        res.send('All users succesfully removed.');
      }
    });
  })
  .get('/albums/', function (req, res, next) {
    AlbumModel.find(req.query).lean().exec(function (err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
  })
  .get('/albums/:id', function (req, res, next) {
    AlbumModel.findById(req.params.id).lean().exec(function (err, doc) {
      if (err) {
        next(err);
      } else if (!doc) {
        res.send(doc);
      }
    });
  })
  .post('/albums/:id', security.ensureAuthenticated, function (req, res, next) {
    var album = new AlbumModel(req.body);
    album.save(function (err, doc) {
      if (err) {
        next(err);
      } else {
        res.send(doc);
      }
    });
  })
  .put('/albums/:id', security.ensureAuthenticated, function (req, res, next) {
    req.body = _.omit(req.body, cfg.preventUpdate);
    req.body.updateAt = new Date();
    
    AlbumModel.update({ id: req.param.id }, req.body, { upsert: true }, function (err) {
      if (err) {
        next(err);
      } else {
        res.send('ok');
      }
    });
  });
};