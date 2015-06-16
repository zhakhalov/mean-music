// ----- node_modules
var _ = require('lodash');

// ----- config
var cfg = global.__require('./config/db-cfg.js').tags;

// ----- custom modules
var security = global.__require('./modules/security');
var rating = global.__require('./modules/rating');

// ----- models
var GenreModel = global.__require('./models/genre-model.js');

module.exports = function (router) {
  router
  .get('/tags/removeall', function (req, res, next) {
    if (!process.env.DEV) { return next(_.assign(new Error('DEV server only'), { status: 403 })); }
    GenreModel.remove().exec(function (err) {
      if (err) {
        next(err);
      } else {
        res.send('All tags succesfully removed.');
      }
    });
  })
  .get('/tags', function (req, res, next) {
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
  .post('/tags', security.ensureAuthenticated, function (req, res, next) {
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
  .get('/tags/:tagId', function (req, res, next) {
    GenreModel.findById(req.params.tagId).lean().exec(function (err, doc) {
      if (err) {
        next(err);
      } else if (!doc) {
        next(_.assign(new Error('No genre found with Id: ' + req.params.tagId), { status: 404 }));
      } else {
        res.send(doc);
      }
    });
  })
  .delete('/tags/:tagId', security.ensureAuthenticated, security.ensureInRole('admin', 'owner'), function (req, res, next) {
    GenreModel.remove({ _id: req.params.tagId }, function (err) {
      if (err) {
        next(err);
      } else {
        res.send('genre succesfully removed.');
      }
    });
  })
};