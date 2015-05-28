var mega = require('mega');

module.exports = function(credentials, cb) {
  module.exports.storage = mega(credentials, function (err) {
    cb(err);
  });
};