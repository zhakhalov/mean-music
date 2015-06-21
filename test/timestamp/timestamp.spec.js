var path = require("path");
var timestamp = require(path.join(__dirname, '../../modules/timestamp'));

var describe = require('mocha').describe;
var it = require('mocha').it;

var expect = require('chai').expect;

describe('Test timestamp', function () {
  it('should get current timestamp correctry', function () {
    var date = new Date();
    var ts = date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear() + '-' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
    expect(timestamp()).to.equal(ts);
  });
});