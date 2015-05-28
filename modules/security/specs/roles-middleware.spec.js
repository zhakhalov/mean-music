global.__require = function (path) {
  return require(require('path').join(__dirname, '../../..', path));
};

var describe = require('mocha').describe;
var it = require('mocha').it;
var before = require('mocha').before;
var expect = require('chai').expect;

var security = require('..');

describe('Admin', function () {
  var self = this;
  
  before(function () {
    self.user = {
      roles: ['user', 'admin']
    };
  });
  
  it('should be in "user" role', function (done) {
    security.RolesMiddleware('user')({user: self.user}, null, function (err) {
      expect(err).to.be.undefined;
      done();
    });
  });
  it('should be in "admin" role', function (done) {
    security.RolesMiddleware('admin')({user: self.user}, null, function (err) {
      expect(err).to.be.undefined;
      done();
    });
  });
  it('should be in ["user", "admin"] roles as array', function (done) {
    security.RolesMiddleware(["user", "admin"])({user: self.user}, null, function (err) {
      expect(err).to.be.undefined;
      done();
    });
  });
  it('should be in ["user", "admin"] roles as params', function (done) {
    security.RolesMiddleware("user", "admin")({user: self.user}, null, function (err) {
      expect(err).to.be.undefined;
      done();
    });
  });
});

describe('User', function () {
  var self = this;
  
  before(function () {
    self.user = {
      roles: ['user']
    };
  });
  
  it('should be in "user" role', function (done) {
    security.RolesMiddleware("user")({user: self.user}, null, function (err) {
      expect(err).to.be.undefined;
      done();
    });
  });
  it('should not be in "admin" role', function (done) {
    security.RolesMiddleware("admin")({user: self.user}, null, function (err) {
      expect(err).to.be.instanceof(Error);
      done();
    });
  });
});