// ----- node_modules
var _ = require('lodash');

// ----- config
var cfg = global.__require('./config/db-cfg.js').users;

// ----- custom modules
var security = global.__require('./modules/security');

// ----- models
var UserModel = global.__require('./models/user-model.js');

module.exports = function (router) {
  router
 .get('/users/removeall', function (req, res, next) {
    if (!process.env.DEV) { return next(_.assign(new Error('DEV server only'), { status: 403 })); }
    UserModel.remove().exec(function (err) {
      if (err) {
        next(err);
      } else {
        res.send('All users succesfully removed.');
      }
    });
  })
  .get('/users', function (req, res, next) {
    if (!process.env.DEV) { return next(_.assign(new Error('DEV server only'), { status: 403 })); }
    UserModel.find(req.query).lean().exec(function (err, docs) {
      if (err) {
         next(err);
       } else {
         res.send(docs);
       }
    });
  })
  .get('/users/exists', function (req, res, next) {
     UserModel.findOne({ email: req.query.login }, function (err, doc) {
       if (err) {
         next(err);
       } else {
         res.send(null != doc);
       }
     });
  })
  .get('/users/:id', function (req, res, next) {
    UserModel.findById(req.params.id, cfg.public).lean().exec(function (err, doc) {
      if (err) {
         next(err);
      } else if (!doc) {
        next(_.assign(new Error('User not found'), { status: 404 }));
      } else {
       res.send(doc);
      }
    });
  })
  .delete('/users/:id', security.ensureAuthenticated, security.ensureInRole('admin'), function (req, res, next) {
    UserModel.findById(req.params.id).lean().exec(function (err, doc) {
      if (err) {
         next(err);
       } else {
         res.send('ok');
       }
    });
  })
  .get('/users/me', security.ensureAuthenticated, function (req, res, next) {
    UserModel.findById(req.user.id).lean().exec(function (err, doc) {
      if (err) {
         next(err);
       } else if (!doc){
         next(_.assign(new Error('User not found'), { status: 404 }));
       } else {
         res.send(doc);
       }
    });
  })
  .put('/users/me', security.ensureAuthenticated, function (req, res, next) {
    req.body = _.omit(req.body, cfg.preventUpdate);
    req.body.updateAt = new Date();
    
    UserModel.update({ id: req.user.id }, req.body, { upsert: true }, function (err) {
      if (err) {
        next(err);
      } else {
        res.send('ok');
      }
    });
  })
};