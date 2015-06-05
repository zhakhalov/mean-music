// ----- node_modules
var _ = require('lodash');

// ----- config
var cfg = global.__require('./config/db-cfg.js').songs;

// ----- custom modules
var security = global.__require('./modules/security');

// ----- models
var SongModel = global.__require('./models/song-model.js');

module.exports = function (router) {
  router
  .get('/songs/removeall', function (req, res, next) {
    if (!process.env.DEV) { return next(_.assign(new Error('DEV server only'), { status: 403 })); }
    SongModel.remove().exec(function (err) {
      if (err) {
        next(err);
      } else {
        res.send('All users succesfully removed.');
      }
    });
  })
  .get('/songs', function (req, res, next) {
    SongModel.find(req.query).lean().exec(function (err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
  })
  .post('/songs', security.ensureAuthenticated, function (req, res, next) {
    var model = new SongModel(req.body);
    model.save(function (err, doc) {
      if (err) {
        next(err);
      } else {
        res.send(doc);
      }
    });
  })
  .get('/songs/:id', function (req, res, next) {
    SongModel.findById(req.params.id).lean().exec(function (err, doc) {
      if (err) {
        next(err);
      } else if (!doc) {
        res.send(doc);
      }
    });
  })
  .put('/songs/:id', security.ensureAuthenticated, function (req, res, next) {
    req.body = _.omit(req.body, cfg.preventUpdate);
    req.body.updateAt = new Date();
    
    SongModel.update({ _id: req.params.id }, req.body, function (err, numAffected) {
      if (err) {
        next(err);
      } else if (!numAffected) {
        next(_.assign(new Error('No song found with id: ' + req.params.id), { status: 400 }));
      } else {
        res.send(req.params.id);
      }
    });
  });
};