var describe = require('mocha').describe;
var it = require('mocha').it;
var assert = require('assert');

var storage = require('..');

describe('Storage', function () {
  it('sould connect to MEGA', function (done) {
    storage({email: 'zhakhalov@gmail.com', password: '123456' }, function (err) {
      assert.equal(err, null);
      done();
    });  
  });
  it('sould check filename', function () {
    console.log(storage.storage.files);
    assert.equal(storage.storage.files['4tVUxLaC'].name, 'cryptex_-_ambient_sounds.mp3');
  });
  it('should download', function(done) {
    storage.storage.files['4tVUxLaC'].download(function (err, data) {
      assert.equal(err, null);
      done();
    });
  });
});