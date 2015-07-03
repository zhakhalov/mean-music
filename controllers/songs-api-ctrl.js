// ----- node_modules
var _ = require('lodash');
var q = require('q');

// ----- config

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
        res.send('All songs succesfully removed.');
      }
    });
  })
  .get('/songs', function (req, res, next) {
    q.promise(function(resolve, reject) {
      SongModel.find(req.query)
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
  .post('/songs', security.ensureAuthenticated, function (req, res, next) {
    // create new model instance and validate
    q.promise(function(resolve, reject) {
      var model = new SongModel(req.body.song);
      model.validate(function (err) {
        ((null == err) ? resolve : reject)((null == err) ? model : _.assign(err, { status: 400 }));
      });
    })
    // check file mimetype
    .then(function(model) { return q.promise(function (resolve, reject) {
      if (req.files && req.files.audio && /^audio\/.*$/.test(req.files.audio.mimetype)) {
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
    // set albums
    .then(function(model) { return q.promise(function (resolve, reject) {
      if (!req.body.albums || (0 === req.body.albums.length)) {
        return resolve(model);
      }
      model.setAlbums(req.body.albums, function (err) {
        ((null == err) ? resolve : reject)((null == err) ? model : err);
      });
    })})
    // save audio 
    .then(function(model) { return q.promise(function (resolve, reject) {
      model.setAudio(req.files.audio, function (err) {
        ((null == err) ? resolve : reject)((null == err) ? model : err);
      });
    })})
    // respond
    .then(function(model) {
      res.send(model.toObject());
    }, function(err) {
      next(err);
    });
  })
  .get('/songs/:id', function (req, res, next) {
    // fetch model from DB
    q.promise(function(resolve, reject) {
      SongModel.findById(req.params.id)
      .lean()
      .exec(function (err, doc) {
        ((null == err) ? resolve : reject)((null == err) ? doc : err);
      });
    })
    // respond
    .then(function(model) {
      if (!model) {
        next(_.assign(new Error('No song found with id: ' + req.params.id), { status: 404 }));
      } else {
        res.send(model);
      }
    },function(err) {
      next(err);
    });
  })
  .put('/songs/:id', security.ensureAuthenticated, function (req, res, next) {
    // fetch model from DB
    q.promise(function(resolve, reject) {
      SongModel.findById(req.params.id)
      .exec(function (err, doc) {
        ((null == err) ? resolve : reject)((null == err) ? (doc || new SongModel()) : err);
      });
    })
    // check file mimetype
    .then(function(model) { return q.promise(function (resolve, reject) {
      if (!req.files || !req.files.audio) {
        resolve(model);
      } else if (req.files && req.files.audio && /^audio\/.*$/.test(req.files.audio.mimetype)) {
        resolve(model);
      } else {
        reject(_.assign(new Error('Wrong mimetype'), { status: 400 }));
      }
    })})
    // update and save
    .then(function(model) { return q.promise(function (resolve, reject) {
      if (req.body.song) {
        _.assign(model, req.body.song);
        model.save(function (err) {
          ((null == err) ? resolve : reject)((null == err) ? model : err);
        });
      } else {
        resolve(model);
      }
    })})
    // set albums
    .then(function(model) { return q.promise(function (resolve, reject) {
      if (!req.body.albums || (0 === req.body.albums.length)) {
        return resolve(model);
      }
      model.setAlbums(req.body.albums, function (err) {
        ((null == err) ? resolve : reject)((null == err) ? model : err);
      });
    })})
    // save audio 
    .then(function(model) { return q.promise(function (resolve, reject) {
      if (req.files && req.files.audio) {
        model.setAudio(req.files.audio, function (err) {
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
  .delete('/songs/:id', security.ensureAuthenticated, function (req, res, next) {
    // remove model
    q.promise(function(resolve, reject) {
      SongModel.remove({ _id: req.params.id }, function (err) {
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
  .post('/songs/:id/rate/:rate', security.ensureAuthenticated, function (req, res, next) {
    var rate = parseFloat(req.params.rate);
    // validate rate
    if (isNaN(rate)) {
      return next(_.assign(new Error('rate must be a number'), { status: 400 }));
    } 
    
    // fetch model from db and check existence
    q.promise(function(resolve, reject) {
      SongModel.findById(req.params.id)
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
  .get('/songs/:id/listen', function (req, res, next) {
    // fetch model from db and check existence
    q.promise(function(resolve, reject) {
      SongModel.findById(req.params.id)
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
    // get media link
    .then(function(model) { return q.promise(function (resolve, reject) {
      model.getMedia(function (err, media) {
        ((null == err) ? resolve : reject)((null == err) ? media : err);
      });
    })})
    // respond
    .then(function(media) {
      res.send(media);
    }, function (err) {
      next(err);
    });
  })
};