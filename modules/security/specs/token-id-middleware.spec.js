global.__require = function (path) {
  return require(require('path').join(__dirname, '../../..', path));
};

var mocha = require('mocha');
var describe = require('mocha').describe;
var it = require('mocha').it;
var before = require('mocha').before;
var assert = require('assert');

var security = require('..');

describe('Test TokenIdMiddleware', function () {
  var self = this;
  
  before(function () {
    self.user = {
      id: '123456',
      roles: ['user', 'admin']
    };
  });
  
  it('should pass', function (done) {
    security.TokenIdMiddleware({params: {id: '123456'}, user: self.user}, null, function (err) {
      if (err) {
        throw err;
      }
      done();
    });
  });
  it('should not pass', function (done) {
    security.TokenIdMiddleware({params: {id: '123457'}, user: self.user}, null, function (err) {
      assert.throws(err);
      done();
    });
  });
});