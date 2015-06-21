// ----- node_modules
var _ = require('lodash');
var q = require('q');

// ----- config
var cfg = global.__require('./config/db-cfg.js').artists;

// ----- custom modules
var security = global.__require('./modules/security');
var rating = global.__require('./modules/rating');
var storage = global.__require('./modules/storage');
var timestamp = global.__require('./modules/timestamp');

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
        res.send('All artists succesfully removed.');
      }
    });
  })
  .get('/artists/tag/:tag', function (req, res, next) {
    var query = _.defaults(req.query, cfg.defaultQuery);
    var tag = req.params.tag.toLowerCase().replace(/\-/ig, ' ');
    
    ArtistModel.find({ tags: tag })
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
  .get('/artists/genre/:genre', function (req, res, next) {
    var query = _.defaults(req.query, cfg.defaultQuery);
    var genre = req.params.genre.toLowerCase().replace(/\-/ig, ' ');
    
    ArtistModel.find({ genres: genre })
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
  .get('/artists', function (req, res, next) {
    var query = _.defaults(req.query, cfg.defaultQuery);
    
    ArtistModel.find(query.query)
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
  .post('/artists', security.ensureAuthenticated, function (req, res, next) {
    // validate model
    q.promise(function(resolve, reject) {
      var model = new ArtistModel(_.assign(req.body, {
        createdBy: { name: req.user.name, userId: req.user.id },
        updatedBy: { name: req.user.name, userId: req.user.id }
      }));
      model.validate(function (err) {
        ((err == null) ? resolve : reject)((err == null) ? model : _.assign(err, { status: 400 }));
      });
    })
    // check file mimetype and upload image file
    .then(function(model) {
      return q.promise(function (resolve, reject) {
        if (req.files && req.files.image) {
          if(/^image\/.*$/i.test(req.files.image.mimetype)) {
            var path = 'img/artists/' + _.kebabCase(model.name) + '-' + timestamp() + '.' + req.files.image.extension;
            storage.upload(path, req.files.image.path, function (err, meta, url) {
              if (err) {
                reject(err);
              } else {
                resolve(_.assign(model, { img: url, imgPath: meta.path }));
              }
            }, { shareLink: true });
          } else {
            reject(_.assign(new Error('files.image.mimetype must be image/*'), { status: 400 }));
          }
        } else {
          resolve(model);
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
  .get('/artists/:artistId', function (req, res, next) {
    ArtistModel.findById(req.params.artistId).lean().exec(function (err, doc) {
      if (err) {
        next(err);
      } else if (!doc) {
        next(_.assign(new Error('No artist found with artistId: ' + req.params.artistId), { status: 404 }));
      } else {
        res.send(doc);
      }
    });
  })
  .put('/artists/:artistId', security.ensureAuthenticated, function (req, res, next) {
    ArtistModel.findById(req.params.artistId, function(err, model) {
      // validate model
      q.promise(function(resolve, reject) {
        if (err) {
          reject(err);
        } else {
          model = model || new ArtistModel(_.assign(req.body, {
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
      // remove existing image file
      .then(function(model) {
        return q.promise(function(resolve, reject) {
          if (model.imgPath && req.files && req.files.image) {
            storage.remove(model.imgPath, function(err) {
              ((err == null) ? resolve : reject)((err == null) ? model : err);
            });
          } else {
            resolve(model);
          }
        });
      })
      // check file mimetype and upload image file
      .then(function(model) {
        return q.promise(function(resolve, reject) {
          if (req.files && req.files.image) {
            if(/^image\/.*$/i.test(req.files.image.mimetype)) {
              var path = 'img/artists/' + _.kebabCase(model.name) + '-' + timestamp() + '.' + req.files.image.extension;
              storage.upload(path, req.files.image.path, function (err, meta, url) {
                if (err) {
                  reject(err);
                } else {
                  resolve(_.assign(model, { img: url, imgPath: meta.path }));
                }
              }, { shareLink: true });
            } else {
              reject(_.assign(new Error('files.image.mimetype must be image/*'), { status: 400 }));
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
  .delete('/artists/:artistId', security.ensureAuthenticated, security.ensureInRole('admin', 'owner'), function (req, res, next) {
    ArtistModel.remove({ _id: req.params.artistId }, function (err) {
      if (err) {
        next(err);
      } else {
        res.send(req.params.artistId);
      }
    });
  })
  .post('/artists/:artistId/rate/:rate', security.ensureAuthenticated, function (req, res, next) {
    var rate = parseFloat(req.params.rate);
    if (isNaN(rate)) {
      next(_.assign(new Error('rate must be a number'), { status: 403 }));
    } else {
      ArtistModel.findById(req.params.artistId)
      .exec(function (err, artist) {
        if (err) {
          next(err);
        } else if (!artist) {
          next(_.assign(new Error('No artist found with artistId: ' + req.params.artistId), { status: 404 }));
        } else {
          rating.rate(req.user.id, artist, rate);
          artist.save(function (err) {
            if (err) {
              next(err);
            } else {
              res.send({ rating: artist.rating });
            }
          });
        }
      });
    }
  })
};