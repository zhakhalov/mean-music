// ----- node_modules
var _ = require('lodash');

// ----- config
var cfg = global.__require('./config/db-cfg.js').songs;

// ----- custom modules
var security = global.__require('./modules/security');
var storage = global.__require('./modules/storage');
var rating = global.__require('./modules/rating');

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
        res.send('All songs succesfully removed.');
      }
    });
  })
  .get('/songs/tag/:tag', function (req, res, next) {
    var query = _.defaults(req.query, cfg.defaultQuery);
    var tag = req.params.tag.toLowerCase().replace(/\-/ig, ' ');
    
    SongModel.find({ tags: tag })
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
  .get('/songs/genre', function (req, res, next) {
    var query = _.defaults(req.query, cfg.defaultQuery);
    var genre = req.params.genre.toLowerCase().replace(/\-/ig, ' ');
    
    SongModel.find({ genres: genre })
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
  .get('/songs', function (req, res, next) {
    var query = _.defaults(req.query, cfg.defaultQuery);
    
    SongModel.find(query.query)
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
  .post('/songs', security.ensureAuthenticated, function (req, res, next) {
    var model = new SongModel(_.assign(req.body, {
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
  .get('/songs/:songId', function (req, res, next) {
    SongModel.findById(req.params.songId).lean().exec(function (err, doc) {
      if (err) {
        next(err);
      } else if (!doc) {
        next(_.assign(new Error('No song found with Id: ' + req.params.songId), { status: 404 }));
      } else {
        res.send(doc);
      }
    });
  })
  .put('/songs/:songId', security.ensureAuthenticated, function (req, res, next) {
    req.body.updatedAt = new Date();
    req.body.updatedBy = { name: req.user.name, userId: req.user.id };
    SongModel.findById(req.params.songId, function(err, song) {
      if (err) {
        next(err);
      } else if (!song) {
        song = new SongModel(req.body);
        song.save(function (err) {
          if (err) {
            next(err);
          } else {
            res.status(201).send(song.toObject());
          }
        });
      } else {
        song = _.assign(song, _.omit(req.body, cfg.preventUpdate));
        song.save(function (err) {
          if (err) {
            next(err);
          } else {
            res.send(song.toObject());
          }
        });
      }
    });
  })
  .delete('/songs/:songId', security.ensureAuthenticated, security.ensureInRole('admin', 'owner'), function (req, res, next) {
    SongModel.remove({ _id: req.params.songId }, function (err) {
      if (err) {
        next(err);
      } else {
        res.send('Song succesfully removed.');
      }
    });
  })
  .get('/songs/:songId/media', function (req, res, next) {
    SongModel.findById(req.params.songId).exec(function (err, doc) {
      if (err) {
        next(err);
      } else if (!doc) {
        next(_.assign(new Error('No song found with Id: ' + req.params.songId), { status: 404 }));
      } else {
        doc.listened += 1;
        storage.media(doc.path, function (err, url, expireAt) {
          if (err) {
            next (err);
          } else {
            res.send({ url: url, listened: doc.listened });
          }
        });
        doc.save();
      }
    });
  })
  .post('/songs/:songId/rate/:rate', security.ensureAuthenticated, function (req, res, next) {
    var rate = parseFloat(req.params.rate);
    if (isNaN(rate)) {
      next(_.assign(new Error('querystring.rate must be a number'), { status: 403 }));
    } else {
      SongModel.findById(req.params.songId)
      .exec(function (err, song) {
        if (err) {
          next(err);
        } else if (!song) {
          next(_.assign(new Error('No song found with songId: ' + req.params.songId), { status: 404 }));
        } else {
          rating.rate(req.user.id, song, rate);
          song.save(function (err) {
            if (err) {
              next(err);
            } else {
              res.send({ rating: song.rating });
            }
          });
        }
      });
    }
  })
};