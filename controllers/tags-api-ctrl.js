// ----- node_modules
var _ = require('lodash');
var q = require('q');

// ----- config
var cfg = global.__require('./config/db-cfg.js').tags;

// ----- custom modules
var security = global.__require('./modules/security');

// ----- models
var TagModel = global.__require('./models/genre-model.js');

module.exports = function (router) {
  router
  .get('/tags/removeall', function (req, res, next) {
    if (!process.env.DEV) { return next(_.assign(new Error('DEV server only'), { status: 403 })); }
    TagModel.remove().exec(function (err) {
      if (err) {
        next(err);
      } else {
        res.send('All tags succesfully removed.');
      }
    });
  })
  .get('/tags', function (req, res, next) {
    var query = _.defaults(req.query, cfg.defaultQuery);
    
    TagModel.find(query.query)
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
    // validate model
    q.promise(function(resolve, reject) {
      var model = new TagModel(_.assign(req.body, {
        createdBy: { name: req.user.name, userId: req.user.id },
        updatedBy: { name: req.user.name, userId: req.user.id }
      }));
      model.validate(function (err) {
        ((err == null) ? resolve : reject)((err == null) ? model : _.assign(err, { status: 400 }));
      });
    })
    // save model to DB
    .then(function (model) {
      return q.promise(function(resolve, reject) {
        model.save(function (err, doc) {
          if (err) {
            reject(err);
          } else {
            resolve(doc);
          }
        });  
      });
    })
    // respond
    .then(function (model) {
      res.send(model.toObject());
    }, function (err) {
      next(err);
    });
  })
  .get('/tags/:tagId', function (req, res, next) {
    TagModel.findById(req.params.tagId).lean().exec(function (err, doc) {
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
    TagModel.remove({ _id: req.params.tagId }, function (err) {
      if (err) {
        next(err);
      } else {
        res.send(req.params.tagId);
      }
    });
  });
};