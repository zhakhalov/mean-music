var security = global.__require('modules/security');

module.exports = function (router) {
  router
  .get('/auth/token', security.ensureAuthenticated, function (req, res, next) {
    res.send({ token: security.token(req.user) });
  })
  .post('/auth/signin', function (req, res, next) {
    security.signIn(req.body, function (err, data) {
      if (err) {
        next(err);
      } else {
        res.send(data);
      }
    });
  })
  .post('/auth/signup', function (req, res, next) {
    security.signUp(req.body, function (err, data) {
      if (err) {
        next(err);
      } else {
        res.send(data);
      }
    });
  });
};