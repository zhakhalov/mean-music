// ----- node_modules
var _ = require('lodash');
var q = require('q');

// ----- config
var cfg = global.__require('./config/db-cfg.js').genres;

// ----- custom modules
var security = global.__require('./modules/security');
var rating = global.__require('./modules/rating');
var timestamp = global.__require('./modules/timestamp');
var storage = global.__require('./modules/storage');

// ----- models
var GenreModel = global.__require('./models/genre-model.js');

module.exports = function (router) {
  router
  .get('/genres/removeall', function (req, res, next) {
    if (!process.env.DEV) { return next(_.assign(new Error('DEV server only'), { status: 403 })); }
    GenreModel.remove().exec(function (err) {
      if (err) {
        next(err);
      } else {
        res.send('All genres succesfully removed.');
      }
    });
  })
  .get('/genres', function (req, res, next) {
    var query = _.defaults(req.query, cfg.defaultQuery);
    
    GenreModel.find(query.query)
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
  .post('/genres', security.ensureAuthenticated, function (req, res, next) {
    // validate model
    q.promise(function(resolve, reject) {
      var model = new GenreModel(_.assign(req.body, {
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
            var path = 'img/genres/' + _.kebabCase(req.body.name) + '-' + timestamp() + '.' + req.files.image.extension;
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
  .get('/genres/:genreId', function (req, res, next) {
    GenreModel.findById(req.params.genreId).lean().exec(function (err, doc) {
      if (err) {
        next(err);
      } else if (!doc) {
        next(_.assign(new Error('No genre found with Id: ' + req.params.genreId), { status: 404 }));
      } else {
        res.send(doc);
      }
    });
  })
  .put('/genres/:genreId', security.ensureAuthenticated, function (req, res, next) {
    GenreModel.findById(req.params.genreId, function(err, model) {
      // validate model
      q.promise(function(resolve, reject) {
        if (err) {
          reject(err);
        } else {
          model = model || new GenreModel(_.assign(req.body, {
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
            var path = 'img/genres/' + _.kebabCase(model.name) + '-' + timestamp() + '.' + req.files.image.extension;
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
          resolve();
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
  .delete('/genres/:genreId', security.ensureAuthenticated, security.ensureInRole('admin', 'owner'), function (req, res, next) {
    GenreModel.remove({ _id: req.params.genreId }, function (err) {
      if (err) {
        next(err);
      } else {
        res.send('genre succesfully removed.');
      }
    });
  })
  .post('/genres/:genreId/rate/:rate', security.ensureAuthenticated, function (req, res, next) {
    var rate = parseFloat(req.params.rate);
    if (isNaN(rate)) {
      next(_.assign(new Error('querystring.rate must be a number'), { status: 403 }));
    } else {
      GenreModel.findById(req.params.genreId)
      .exec(function (err, genre) {
        if (err) {
          next(err);
        } else if (!genre) {
          next(_.assign(new Error('No genre found with genreId: ' + req.params.genreId), { status: 404 }));
        } else {
          rating.rate(req.user.id, genre, rate);
          genre.save(function (err) {
            if (err) {
              next(err);
            } else {
              res.send({ rating: genre.rating });
            }
          });
        }
      });
    }
  })
};