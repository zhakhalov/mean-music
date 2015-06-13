var describe = require('mocha').describe;
var it = require('mocha').it;
var before = require('mocha').before;
var after = require('mocha').after;
var superagent = require('superagent');
var expect = require('chai').expect;

var server = require('../server.js');

describe('Create')