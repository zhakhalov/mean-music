// ----- node_modules
var _ = require('lodash');

// ----- config
var cfg = global.__require('./config/db-cfg.js').albums;

// ----- custom modules
var security = global.__require('./modules/security');

// ----- models
var AlbumModel = global.__require('./models/album-model.js');

module.exports = function (router) {
  router
  .get('/albums/removeall', function (req, res, next) {
    if (!process.env.DEV) { return next(_.assign(new Error('DEV server only'), { status: 403 })); }
    AlbumModel.remove().exec(function (err) {
      if (err) {
        next(err);
      } else {
        res.send('All users succesfully removed.');
      }
    });
  })
  .get('/albums', function (req, res, next) {
    AlbumModel.find(req.query).lean().exec(function (err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
  })
  .post('/albums', security.ensureAuthenticated, function (req, res, next) {
    var model = new AlbumModel(req.body);
    model.save(function (err, doc) {
      if (err) {
        next(err);
      } else {
        res.send(doc);
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
  .put('/albums/:id', security.ensureAuthenticated, function (req, res, next) {
    req.body = _.omit(req.body, cfg.preventUpdate);
    req.body.updateAt = new Date();
    
    AlbumModel.update({ _id: req.param.id }, req.body, function (err, numAffected) {
      if (err) {
        next(err);
      } else if (!numAffected) {
        next(_.assign(new Error('No album found with id: ' + req.param.id), { status: 400 }));
      } else {
        res.send('ok');
      }
    });
  });
};