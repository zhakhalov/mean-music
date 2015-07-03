// ----- node_modules
var _ = require('lodash');
var q = require('q');

// ----- config

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
        res.send('All albums succesfully removed.');
      }
    });
  })
  .get('/albums', function (req, res, next) {
    q.promise(function(resolve, reject) {
      AlbumModel.find(req.query)
      .lean()
      .exec(function (err, docs) {
        ((null == err) ? resolve : reject)((null == err) ? docs : err);
      });
    })
    .then(function(models) {
      res.send(models);
    }, function(err) {
      next(err);
    });
  })
  .post('/albums', security.ensureAuthenticated, function (req, res, next) {
    // create new model instance and validate
    q.promise(function(resolve, reject) {
      var model = new AlbumModel(req.body.album);
      model.validate(function (err) {
        ((null == err) ? resolve : reject)((null == err) ? model : _.assign(err, { status: 400 }));
      });
    })
    // check file mimetype
    .then(function(model) { return q.promise(function (resolve, reject) {
      if (!req.files || !req.files.image) {
        resolve(model);
      } else if (req.files && req.files.image && /^image\/.*$/.test(req.files.image.mimetype)) {
        resolve(model);
      } else {
        reject(_.assign(new Error('Wrong mimetype'), { status: 400 }));
      }
    })})
    // save model
    .then(function(model) { return q.promise(function (resolve, reject) {
      model.save(function(err) {
        ((null == err) ? resolve : reject)((null == err) ? model : err);
      });
    })})
    // set artists
    .then(function(model) { return q.promise(function (resolve, reject) {
      if (!req.body.artists || !req.body.artists.length) {
        return resolve(model);
      }
      model.setArtists(req.body.artists, function (err) {
        ((null == err) ? resolve : reject)((null == err) ? model : err);
      });
    })})
    // set genres
    .then(function(model) { return q.promise(function (resolve, reject) {
      if (!req.body.genres || !req.body.genres.length) {
        return resolve(model);
      }
      model.setGenres(req.body.genres, function (err) {
        ((null == err) ? resolve : reject)((null == err) ? model : err);
      });
    })})
    // save image 
    .then(function(model) { return q.promise(function (resolve, reject) {
      if (req.files && req.files.image) {
        model.setImage(req.files.image, function (err) {
          ((null == err) ? resolve : reject)((null == err) ? model : err);
        });
      } else {
        resolve(model);
      }
    })})
    // respond
    .then(function(model) {
      res.send(model.toObject());
    }, function(err) {
      next(err);
    });
  })
  .get('/albums/:id', function (req, res, next) {
    // fetch model from DB
    q.promise(function(resolve, reject) {
      AlbumModel.findById(req.params.id)
      .lean()
      .exec(function (err, doc) {
        ((null == err) ? resolve : reject)((null == err) ? doc : err);
      });
    })
    // respond
    .then(function(model) {
      if (!model) {
        next(_.assign(new Error('No album found with id: ' + req.params.id), { status: 404 }));
      } else {
        res.send(model);
      }
    },function(err) {
      next(err);
    });
  })
  .put('/albums/:id', security.ensureAuthenticated, function (req, res, next) {
    // fetch model from DB or create new
    q.promise(function(resolve, reject) {
      AlbumModel.findById(req.params.id)
      .exec(function (err, doc) {
        ((null == err) ? resolve : reject)((null == err) ? (doc || new AlbumModel()) : err);
      });
    })
    // check file mimetype
    .then(function(model) { return q.promise(function (resolve, reject) {
      if (!req.files || !req.files.image) {
        resolve(model);
      } else if (req.files && req.files.image && /^image\/.*$/.test(req.files.image.mimetype)) {
        resolve(model);
      } else {
        reject(_.assign(new Error('Wrong mimetype'), { status: 400 }));
      }
    })})
    // update and save
    .then(function(model) { return q.promise(function (resolve, reject) {
      if (req.body.album) {
        _.assign(model, req.body.album);
        model.save(function (err) {
          ((null == err) ? resolve : reject)((null == err) ? model : err);
        });
      } else {
        resolve(model);
      }
    })})
    // set genres
    .then(function(model) { return q.promise(function (resolve, reject) {
      if (!req.body.genres || !req.body.genres.length) {
        return resolve(model);
      }
      model.setGenres(req.body.genres, function (err) {
        ((null == err) ? resolve : reject)((null == err) ? model : err);
      });
    })})
    // set artists
    .then(function(model) { return q.promise(function (resolve, reject) {
      if (!req.body.artists || !req.body.artists.length) {
        return resolve(model);
      }
      model.setArtists(req.body.artists, function (err) {
        ((null == err) ? resolve : reject)((null == err) ? model : err);
      });
    })})
    // save image 
    .then(function(model) { return q.promise(function (resolve, reject) {
      if (req.files && req.files.image) {
        model.setImage(req.files.image, function (err) {
          ((null == err) ? resolve : reject)((null == err) ? model : err);
        });
      } else {
        resolve(model);
      }
    })})
    // respond
    .then(function(model) {
      res.send(model.toObject());
    }, function(err) {
      next(err);
    });
  })
  .delete('/albums/:id', security.ensureAuthenticated, function (req, res, next) {
    // remove model
    q.promise(function(resolve, reject) {
      AlbumModel.remove({ _id: req.params.id }, function (err) {
        ((null == err) ? resolve : reject)((null == err) ? req.params.id : err);
      });
    })
    // respond
    .then(function(id) {
      res.send(id);
    }, function (err) {
      next(err);
    });
  })
  .post('/albums/:id/rate/:rate', security.ensureAuthenticated, function (req, res, next) {
    var rate = parseFloat(req.params.rate);
    // validate rate
    if (isNaN(rate)) {
      return next(_.assign(new Error('rate must be a number'), { status: 400 }));
    } 
    
    // fetch model from db and check existence
    q.promise(function(resolve, reject) {
      AlbumModel.findById(req.params.id)
      .exec(function (err, model) {
        if (err) {
          reject(err);
        } else if (!model) {
          reject(_.assign(new Error('Not found'), { status: 404 }));
        } else {
          resolve(model);
        }
      });
    })
    // rate model
    .then(function(model) { return q.promise(function (resolve, reject) {
      model.rate(req.user.id, rate, function (err) {
        ((null == err) ? resolve : reject)((null == err) ? model : err);
      });
    })})
    // respond
    .then(function(model) {
      res.send({ rate: model.rating });
    }, function (err) {
      next(err);
    });
  })
};