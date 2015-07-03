// ----- node_modules
var _ = require('lodash');
var q = require('q');

// ----- config

// ----- custom modules
var security = global.__require('./modules/security');

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
    q.promise(function(resolve, reject) {
      GenreModel.find(req.query)
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
  .post('/genres', security.ensureAuthenticated, function (req, res, next) {
    // create new model instance and validate
    q.promise(function(resolve, reject) {
      var model = new GenreModel(req.body.genre);
      model.validate(function (err) {
        ((null == err) ? resolve : reject)((null == err) ? model : _.assign(err, { status: 400 }));
      });
    })
    // save model
    .then(function(model) { return q.promise(function (resolve, reject) {
      model.save(function(err) {
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
  .get('/genres/:id', function (req, res, next) {
    // fetch model from DB
    q.promise(function(resolve, reject) {
      GenreModel.findById(req.params.id)
      .lean()
      .exec(function (err, doc) {
        ((null == err) ? resolve : reject)((null == err) ? doc : err);
      });
    })
    // respond
    .then(function(model) {
      if (!model) {
        next(_.assign(new Error('No artist found with id: ' + req.params.id), { status: 404 }));
      } else {
        res.send(model);
      }
    },function(err) {
      next(err);
    });
  })
  .put('/genres/:id', security.ensureAuthenticated, function (req, res, next) {
    // fetch model from DB or create new
    q.promise(function(resolve, reject) {
      GenreModel.findById(req.params.id)
      .exec(function (err, doc) {
        ((null == err) ? resolve : reject)((null == err) ? (doc || new GenreModel()) : err);
      });
    })
    // update and save
    .then(function(model) { return q.promise(function (resolve, reject) {
      if (req.body.genre) {
        _.assign(model, req.body.genre);
        model.save(function (err) {
          ((null == err) ? resolve : reject)((null == err) ? model : err);
        });
      } else {
        resolve(model);
      }
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
  .delete('/genres/:id', security.ensureAuthenticated, function (req, res, next) {
    // remove model
    q.promise(function(resolve, reject) {
      GenreModel.remove({ _id: req.params.id }, function (err) {
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
  .post('/genres/:id/rate/:rate', security.ensureAuthenticated, function (req, res, next) {
    var rate = parseFloat(req.params.rate);
    // validate rate
    if (isNaN(rate)) {
      return next(_.assign(new Error('rate must be a number'), { status: 400 }));
    } 
    
    // fetch model from db and check existence
    q.promise(function(resolve, reject) {
      GenreModel.findById(req.params.id)
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