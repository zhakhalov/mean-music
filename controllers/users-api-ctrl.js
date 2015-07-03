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
  .get('/users/me', security.ensureAuthenticated, function (req, res, next) {
    UserModel.findById(req.user.userId).lean().exec(function (err, doc) {
      if (err) {
         next(err);
       } else if (!doc){
         next(_.assign(new Error('No user found with userId: ' + req.user.id), { status: 404 }));
       } else {
         res.send(doc);
       }
    });
  })
  .put('/users/me', security.ensureAuthenticated, function (req, res, next) {
    req.body = _.omit(req.body, cfg.preventUpdate);
    req.body.updateAt = new Date();
    UserModel.findById(req.user.id)
    .exec(function (err, doc) {
      if (err) {
        next(err);
      } else if (!doc) {
        next(_.assign(new Error('No user found with userId: ' + req.user.id), { status: 404 }));
      } else {
        doc = _.assign(req.body);
        doc.save(function (err) {
          if (err) {
            next(err);
          } else {
            res.send(doc.toObject());
          }
        });
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
  .get('/users/:userId', function (req, res, next) {
    UserModel.findById(req.params.userId, '_id name avatar')
    .lean()
    .exec(function (err, doc) {
      if (err) {
         next(err);
      } else if (!doc) {
        next(_.assign(new Error('No user found with userId: ' + req.params.userId), { status: 404 }));
      } else {
       res.send(doc);
      }
    });
  })
  .delete('/users/:userId', security.ensureAuthenticated, function (req, res, next) {
    UserModel.delete({ id: req.params.userId }, function (err) {
      if (err) {
         next(err);
       } else {
         res.send('User succesfully removed. Id: ' + req.params.userId);
       }
    });
  })
  .post('/users/:userId/roles', security.ensureAuthenticated, function (req, res, next) {
    UserModel.findById(req.params.userId, function (err, doc) {
      if (err) {
        next(err);
      } else if (!doc) {
        next(_.assign(new Error('No user found with userId: ' + req.params.userId), { status: 404 }));
      } else {
        doc.roles.push(req.body);
        doc.save(function (err) {
          if (err) {
            next(err);
          } else {
            res.send(doc.toObject().roles);
          }
        });
      }
    });
  })
  .delete('/users/:userId/roles', security.ensureAuthenticated, function (req, res, next) {
     UserModel.findById(req.params.userId, function (err, doc) {
      if (err) {
        next(err);
      } else if (!doc) {
        next(_.assign(new Error('No user found with userId: ' + req.params.userId), { status: 404 }));
      } else {
        doc.roles.pull(req.body);
        doc.save(function (err) {
          if (err) {
            next(err);
          } else {
            res.send(doc.toObject().roles);
          }
        });
      }
    });
  })
};