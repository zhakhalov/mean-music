// ----- node_modules
var _ = require('lodash');

// ----- config
var artistsCfg = global.__require('./config/db-cfg.js').artists;

// ----- custom modules
var security = global.__require('./modules/security');

// ----- models
var ArtistModel = global.__require('./models/artist-model.js');

module.exports = function (router) {
  router
  .get('/artists/removeall', function (req, res, next) {
    if (!process.env.DEV) { return next(_.assign(new Error('DEV server only'), { status: 403 })); }
    ArtistModel.remove().exec(function (err) {
      if (err) {
        next(err);
      } else {
        res.send('All users succesfully removed.');
      }
    });
  })
  .get('/artists', function (req, res, next) {
    ArtistModel.find(req.query).lean().exec(function (err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
  })
  .post('/artists', security.ensureAuthenticated, function (req, res, next) {
    var artist = new ArtistModel(req.body);
    artist.save(function (err, doc) {
      if (err) {
        next(err);
      } else {
        res.send(doc);
      }
    });
  })
  .get('/artists/:id', function (req, res, next) {
    ArtistModel.findById(req.params.id).lean().exec(function (err, doc) {
      if (err) {
        next(err);
      } else if (!doc) {
        res.send(doc);
      }
    });
  })
  .put('/artists/:id', security.ensureAuthenticated, function (req, res, next) {
    req.body = _.omit(req.body, artistsCfg.preventUpdate);
    req.body.updateAt = new Date();
    
    ArtistModel.findById(req.param.id, function (err, doc) {
      if (err) {
        next(err);
      } else if (!doc) {
        next(_.assign(new Error('No artist with id: ' + req.param.id), { status: 400 }));
      } else {
        _.assign(doc, req.body);
        doc.save(function (err) {
          if (err) {
            next(err);
          } else {
            res.send(doc.toObject());
          }
        });
      }
    });
  });
};