// ----- node_modules
var _ = require('lodash');

// ----- config
var cfg = global.__require('./config/db-cfg.js').albums;

// ----- custom modules
var security = global.__require('./modules/security');
var rating = global.__require('./modules/rating');

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
        res.send('All albums succesfully removed.');
      }
    });
  })
  .get('/albums/tag/:tag', function (req, res, next) {
    var query = _.defaults(req.query, cfg.defaultQuery);
    var tag = req.params.tag.toLowerCase().replace(/\-/ig, ' ');
    
    AlbumModel.find({ tags: tag })
    .sort(query.sort)
    .skip(query.skip)
    .limit(query.limit)
    .select(query.select)
    .lean()
    .exec(function (err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
  })
  .get('/albums/genre', function (req, res, next) {
    var query = _.defaults(req.query, cfg.defaultQuery);
    var genre = req.params.genre.toLowerCase().replace(/\-/ig, ' ');
    
    AlbumModel.find({ genres: genre })
    .sort(query.sort)
    .skip(query.skip)
    .limit(query.limit)
    .select(query.select)
    .lean()
    .exec(function (err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
  })
  .get('/albums', function (req, res, next) {
    var query = _.defaults(req.query, cfg.defaultQuery);
    
    AlbumModel.find(query.query)
    .sort(query.sort)
    .skip(query.skip)
    .limit(query.limit)
    .select(query.select)
    .lean()
    .exec(function (err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
  })
  .post('/albums', security.ensureAuthenticated, function (req, res, next) {
    var model = new AlbumModel(_.assign(req.body, {
      createdBy: { name: req.user.name, userId: req.user.id },
      updatedBy: { name: req.user.name, userId: req.user.id }
    }));
    model.save(function (err, doc) {
      if (err) {
        next(err);
      } else {
        res.send(doc.toObject());
      }
    });
  })
  .get('/albums/:albumId', function (req, res, next) {
    AlbumModel.findById(req.params.albumId).lean().exec(function (err, doc) {
      if (err) {
        next(err);
      } else if (!doc) {
        next(_.assign(new Error('No album found with Id: ' + req.params.albumId), { status: 404 }));
      } else {
        res.send(doc);
      }
    });
  })
  .put('/albums/:albumId', security.ensureAuthenticated, function (req, res, next) {
    req.body.updatedAt = new Date();
    req.body.updatedBy = { name: req.user.name, userId: req.user.id };
    AlbumModel.findById(req.params.albumId, function(err, album) {
      if (err) {
        next(err);
      } else if (!album) {
        album = new AlbumModel(req.body);
        album.save(function (err) {
          if (err) {
            next(err);
          } else {
            res.status(201).send(album.toObject());
          }
        });
      } else {
        album = _.assign(album, _.omit(req.body, cfg.preventUpdate));
        album.save(function (err) {
          if (err) {
            next(err);
          } else {
            res.send(album.toObject());
          }
        });
      }
    });
  })
  .delete('/albums/:albumId', security.ensureAuthenticated, security.ensureInRole('admin', 'owner'), function (req, res, next) {
    AlbumModel.remove({ _id: req.params.albumId }, function (err) {
      if (err) {
        next(err);
      } else {
        res.send('album succesfully removed.');
      }
    });
  })
  .post('/albums/:albumId/rate/:rate', security.ensureAuthenticated, function (req, res, next) {
    var rate = parseFloat(req.params.rate);
    if (isNaN(rate)) {
      next(_.assign(new Error('querystring.rate must be a number'), { status: 403 }));
    } else {
      AlbumModel.findById(req.params.albumId)
      .exec(function (err, album) {
        if (err) {
          next(err);
        } else if (!album) {
          next(_.assign(new Error('No album found with albumId: ' + req.params.albumId), { status: 404 }));
        } else {
          rating.rate(req.user.id, album, rate);
          album.save(function (err) {
            if (err) {
              next(err);
            } else {
              res.send({ rating: album.rating });
            }
          });
        }
      });
    }
  })
};