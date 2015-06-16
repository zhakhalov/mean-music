// ----- node_modules
var _ = require('lodash');

// ----- config
var cfg = global.__require('./config/db-cfg.js').genres;

// ----- custom modules
var security = global.__require('./modules/security');
var rating = global.__require('./modules/rating');

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
    var model = new GenreModel(_.assign(req.body, {
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
    req.body.updatedAt = new Date();
    req.body.updatedBy = { name: req.user.name, userId: req.user.id };
    GenreModel.findById(req.params.genreId, function(err, genre) {
      if (err) {
        next(err);
      } else if (!genre) {
        genre = new GenreModel(req.body);
        genre.save(function (err) {
          if (err) {
            next(err);
          } else {
            res.status(201).send(genre.toObject());
          }
        });
      } else {
        genre = _.assign(genre, _.omit(req.body, cfg.preventUpdate));
        genre.save(function (err) {
          if (err) {
            next(err);
          } else {
            res.send(genre.toObject());
          }
        });
      }
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