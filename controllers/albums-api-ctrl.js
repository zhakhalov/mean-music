// ----- node_modules
var _ = require('lodash');
var q = require('q');

// ----- config
var cfg = global.__require('./config/db-cfg.js').albums;

// ----- custom modules
var security = global.__require('./modules/security');
var rating = global.__require('./modules/rating');
var storage = global.__require('./modules/storage');
var timestamp = global.__require('./modules/timestamp');

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
    // validate model
    q.promise(function(resolve, reject) {
      var model = new AlbumModel(_.assign(req.body, {
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
            var path = 'img/albums/' + _.kebabCase(req.body.name) + '-' + timestamp() + '.' + req.files.image.extension;
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
    AlbumModel.findById(req.params.albumId, function(err, model) {
      // validate model
      q.promise(function(resolve, reject) {
        if (err) {
          reject(err);
        } else {
          model = model || new AlbumModel(_.assign(req.body, {
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
      //check file mimetype and upload image file
      .then(function(model) {
        return q.promise(function(resolve, reject) {
          if (req.files && req.files.image) {
            if(/^image\/.*$/i.test(req.files.image.mimetype)) {
              var path = 'img/albums/' + _.kebabCase(model.name) + '-' + timestamp() + '.' + req.files.image.extension;
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
      next(_.assign(new Error('querystring.rate must be a number'), { status: 400 }));
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