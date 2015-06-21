var mongoose = require('mongoose');

var describe = require('mocha').describe;
var it = require('mocha').it;

var expect = require('chai').expect;

var Schema = mongoose.Schema;

var schema = new Schema({
  name: { type: String, required: true },
  artists: { type: [String], required: true, minLength: 1 }
});

var model = mongoose.model('Model', schema);

describe('Test schema validation', function () {
  it ('should get error for empty object', function (done) {
    var doc = new model({});
    doc.validate(function(err) {
      expect(err).not.to.be.null;
      console.log(err);
      done();
    });
  });
  it ('should get error for undefined array', function (done) {
    var doc = new model({ name: 'Name' });
    doc.validate(function(err) {
      expect(err).not.to.be.null;
      console.log(err);
      done();
    });
  });
  it ('should get error for empty array', function (done) {
    var doc = new model({ name: 'Name', artists: [] });
    doc.validate(function(err) {
      expect(err).not.to.be.null;
      console.log(err);
      done();
    });
  });
  it('should validata succesfully', function(done) {
    var doc = new model({ name: 'Name', artists: ['Artist'] });
    doc.validate(function(err) {
      expect(err).to.be.null;
      done();
    });  
  })
});