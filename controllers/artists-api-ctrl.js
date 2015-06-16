// ----- node_modules
var _ = require('lodash');

// ----- config
var cfg = global.__require('./config/db-cfg.js').artists;

// ----- custom modules
var security = global.__require('./modules/security');
var rating = global.__require('./modules/rating');

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
    var model = new ArtistModel(_.assign(req.body, {
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
    req.body.updatedAt = new Date();
    req.body.updatedBy = { name: req.user.name, userId: req.user.id };
    ArtistModel.findById(req.params.artistId, function(err, artist) {
      if (err) {
        next(err);
      } else if (!artist) {
        artist = new ArtistModel(req.body);
        artist.save(function (err) {
          if (err) {
            next(err);
          } else {
            res.status(201).send(artist.toObject());
          }
        });
      } else {
        artist = _.assign(artist, _.omit(req.body, cfg.preventUpdate));
        artist.save(function (err) {
          if (err) {
            next(err);
          } else {
            res.send(artist.toObject());
          }
        });
      }
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
      next(_.assign(new Error('querystring.rate must be a number'), { status: 403 }));
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