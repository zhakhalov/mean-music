module.exports = function (router) {
  router
  // handle all no static resource
  .get(/^[^.]+$/ig, function (req, res, next) {
      res.render('index');
  });
};