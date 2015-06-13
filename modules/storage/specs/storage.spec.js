var describe = require('mocha').describe;
var it = require('mocha').it;
var before = require('mocha').before;
var after = require('mocha').after;
var superagent = require('superagent');
var expect = require('chai').expect;

global.__require = function (path) {
  return require(require('path').join(__dirname, '../../..', path));
};


var storage = require('..');

describe('Storage', function () {
  it('should get stream to file', function (done) {
    storage.get('./audio/apex-rise_-_cherry-blossom-trees.mp3', function (err, buffer) {
      expect(err).to.equal(null);
      done();
    });
  });
  it('should get media link to file', function (done) {
    storage.media('./audio/apex-rise_-_cherry-blossom-trees.mp3', function (err, url) {
      console.log(url);
      expect(err).to.equal(null);
      expect(url).not.equal(null);
      done();
    });
  });
  it('should get url to file', function (done) {
    storage.media('./img/avatar.jpg', function (err, url) {
      console.log(url);
      expect(err).to.equal(null);
      expect(url).not.equal(null);
      done();
    });
  });
});