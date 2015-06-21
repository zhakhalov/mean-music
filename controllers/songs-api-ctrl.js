// ----- node_modules
var _ = require('lodash');
var q = require('q');

// ----- config
var cfg = global.__require('./config/db-cfg.js').songs;

// ----- custom modules
var security = global.__require('./modules/security');
var storage = global.__require('./modules/storage');
var rating = global.__require('./modules/rating');
var timestamp = global.__require('./modules/timestamp');

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
    // validate model
    q.promise(function(resolve, reject) {
      var model = new SongModel(_.assign(req.body, {
        createdBy: { name: req.user.name, userId: req.user.id },
        updatedBy: { name: req.user.name, userId: req.user.id },
        path: 'audio/'
      }));
      model.validate(function (err) {
        ((err == null) ? resolve : reject)((err == null) ? model : _.assign(err, { status: 400 }));
      });
    })
    // check file type and upload audio file
    .then(function(model) {
      return q.promise(function (resolve, reject) {
        if (req.files && req.files.audio && /^audio\/.*$/i.test(req.files.audio.mimetype)) {
          var path = 'audio/' + _.kebabCase(req.body.name) + '-' + timestamp() + '.' + req.files.audio.extension;
          storage.upload(path, req.files.audio.path, function (err, meta) {
            if (err) {
              reject(err);
            } else {
              resolve(_.assign(model, { path: meta.path }));
            }
          });
        } else {
          reject(_.assign(new Error('files.audio must be specified and audio.mimetype must be [audio/*]'), { status: 400 }));
        }
      });
    })
    // save model to DB
    .then(function (model) {
      return q.promise(function(resolve, reject) {
        model.save(function (err, doc) {
          ((err == null) ? resolve : reject)((err == null) ? doc : err);
        });
      });
    })
    // respond
    .then(function (doc) {
      res.send(doc.toObject());
    }, function (err) {
      next(err);
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
    SongModel.findById(req.params.songId, function(err, model) {
      // validate model
      q.promise(function(resolve, reject) {
        if (err) {
          reject(err);
        } else {
          model = model || new SongModel(_.assign(req.body, {
            createdBy: { name: req.user.name, userId: req.user.id },
            updatedBy: { name: req.user.name, userId: req.user.id }
          }));
          if (model.isNew) {
            model.validate(function (err) {
              ((err == null) ? resolve : reject)((err == null) ? model : err);
            });
          } else {
            model = _.assign(model, _.omit(req.body, cfg.preventUpdate), {
              updatedBy: { name: req.user.name, userId: req.user.id },
              updatedAt: new Date()
            });
            resolve(model);
          }
        }
      })
      // remove existing audio file
      .then(function(model) {
        return q.promise(function(resolve, reject) {
          if (model.path && req.files && req.files.audio) {
            storage.remove(model.path, function(err) {
              ((err == null) ? resolve : reject)((err == null) ? model : err);
            });
          } else {
            resolve(model);
          }
        });
      })
      // check file type and upload audio file
      .then(function(model) {
        return q.promise(function(resolve, reject) {
          if (req.files && req.files.audio) {
            if(/^audio\/.*$/i.test(req.files.audio.mimetype)) {
              var path = 'audio/' + _.kebabCase(model.name) + '-' + timestamp() + '.' + req.files.audio.extension;
              storage.upload(path, req.files.audio.path, function (err, meta) {
                if (err) {
                  reject(err);
                } else {
                  resolve(_.assign(model, { path: meta.path }));
                }
              });
            } else {
              reject(_.assign(new Error('files.audio.mimetype must be audio/*'), { status: 400 }));
            }
          } else {
            resolve(model);
          }
        });
      })
      // save model to DB
      .then(function(model) {
        return q.promise(function(resolve, reject) {
          model.save(function (err, doc) {
            ((err == null) ? resolve : reject)((err == null) ? doc : err);
          });
        });
      })
      // respond
      .then(function (model) {
        res.status(model.isNew ? 201 : 200).send(model.toObject());
      }, function (err) {
        next(err);
      });
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