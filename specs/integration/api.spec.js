var describe = require('mocha').describe;
var it = require('mocha').it;
var before = require('mocha').before;
var after = require('mocha').after;
var superagent = require('superagent');
var expect = require('chai').expect;

var server = require('../server.js');

describe('/api', function () {
  var app;
  var API_ROUTE = 'http://localhost:1337/api/';
  var token;
  
  before(function () {
    app = server(1337, 'localhost');
  });
  after(function () {
    superagent
    .get(API_ROUTE + 'users/removeall')
    .end(function () { });
    superagent
    .get(API_ROUTE + 'artists/removeall')
    .end(function () { });
  });
  after(function () {
    app.close();
  });
  
  it('should remove all users', function (done) {
    superagent
    .get(API_ROUTE + 'users/removeall')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).equal(200);
      done();
    });
  });
  it('should remove all artists', function (done) {
    superagent
    .get(API_ROUTE + 'artists/removeall')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).equal(200);
      done();
    });
  });
  describe('/auth', function() {
    it('should sign up succefully', function(done) {
      superagent
      .post(API_ROUTE + 'auth/signup')
      .send({ name: 'monolith', email: 'user@email.com',  password: '123456' })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        expect(err).equal(null);
        expect(res.status).to.equal(200);
        expect(res.body.user).to.be.not.undefined;
        expect(res.body.token).to.be.not.undefined;
        expect(res.body.user.name).to.be.equal('monolith');
        expect(res.body.user.email).to.be.equal('user@email.com');
        done();
      });
    });  
    it('should sign in succefully', function(done) {
      superagent
      .post(API_ROUTE + 'auth/signin')
      .send({ login: 'user@email.com',  password: '123456' })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.body.user).to.be.not.undefined;
        expect(res.body.token).to.be.not.undefined;
        expect(res.body.user.name).to.be.equal('monolith');
        expect(res.body.user.email).to.be.equal('user@email.com');
        token = res.body.token; 
        done();
      });
    });  
  });
  describe('/artist', function() {
    it('should not add Apex Rise with authorization error', function(done) {
      //4oMlASpQ apex-rise_-_cherry-blossom-trees.mp3
      superagent
      .post(API_ROUTE + 'artists')
      .send({ name: 'Apex Rise' })
      .end(function (err, res) {
        expect(err).not.equal(null);
        expect(res.status).equal(401);
        done();
      });
    });
    it('should add Apex Rise succesfully', function(done) {
      //4oMlASpQ apex-rise_-_cherry-blossom-trees.mp3
      superagent
      .post(API_ROUTE + 'artists')
      .send({ name: 'Apex Rise' })
      .set('Authorization', 'Bearer ' + token)
      .end(function (err, res) {
        expect(err).equal(null);
        expect(res.status).equal(200);
        done();
      });
    });
  });
});