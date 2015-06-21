var describe = require('mocha').describe;
var it = require('mocha').it;
var before = require('mocha').before;
var after = require('mocha').after;
var superagent = require('superagent');
var expect = require('chai').expect;

var server = require('../../server.js');

describe('/api', function () {
  var app;
  var API_ROUTE = 'http://localhost:1337/api/';
  var token;
  var genres = {};
  var artists = {};
  var albums = {};
  var songs = {};
  
  before(function () {
    app = server(1337, 'localhost');
  });
  
  after(function () {
    // superagent
    // .get(API_ROUTE + 'genres/removeall')
    // .end(function () { });
    // superagent
    // .get(API_ROUTE + 'tags/removeall')
    // .end(function () { });
    // superagent
    // .get(API_ROUTE + 'users/removeall')
    // .end(function () { });
    // superagent
    // .get(API_ROUTE + 'artists/removeall')
    // .end(function () { });
    // superagent
    // .get(API_ROUTE + 'albums/removeall')
    // .end(function () { });
    // superagent
    // .get(API_ROUTE + 'songs/removeall')
    // .end(function () { });
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
  
  it('should remove all genres', function (done) {
    superagent
    .get(API_ROUTE + 'genres/removeall')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).equal(200);
      done();
    });
  });
  
  it('should remove all tags', function (done) {
    superagent
    .get(API_ROUTE + 'tags/removeall')
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
  
  it('should remove all albums', function (done) {
    superagent
    .get(API_ROUTE + 'albums/removeall')
    .end(function (err, res) {
      expect(err).to.equal(null);
      expect(res.status).equal(200);
      done();
    });
  });
  
  it('should remove all songs', function (done) {
    superagent
    .get(API_ROUTE + 'songs/removeall')
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
      .send({ name: 'monolith', email: 'monolith@email.com',  password: '123456' })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        expect(err).equal(null);
        expect(res.status).to.equal(200);
        expect(res.body.user).to.be.not.undefined;
        expect(res.body.token).to.be.not.undefined;
        expect(res.body.user.name).to.be.equal('monolith');
        expect(res.body.user.email).to.be.equal('monolith@email.com');
        done();
      });
    });  
    
    it('should sign in succefully', function(done) {
      superagent
      .post(API_ROUTE + 'auth/signin')
      .send({ login: 'monolith@email.com',  password: '123456' })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.body.user).to.be.not.undefined;
        expect(res.body.token).to.be.not.undefined;
        expect(res.body.user.name).to.be.equal('monolith');
        expect(res.body.user.email).to.be.equal('monolith@email.com');
        token = res.body.token; 
        done();
      });
    });  
    
  }); // /auth
  
  describe('/genres', function() {
    
    describe('/genres POST', function() {
      
      it('should get authorization error while creating genre "EDM"', function(done) {
         superagent
        .post(API_ROUTE + 'genres')
        .send({ name: 'EDM' })
        .end(function(err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should get Bad Request while creating genre "EDM"', function(done) {
         superagent
        .post(API_ROUTE + 'genres')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).not.to.be.null;
          expect(res.status).to.equal(400);
          done();
        });
      });
      
      it('should create genre "EDM"', function(done) {
         superagent
        .post(API_ROUTE + 'genres')
        .field('name', 'EDM')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.body.name).equal('edm');
          genres['EDM'] = res.body;
          done();
        });
      });
      
      it('should create genre "Glitch Hop"', function(done) {
         superagent
        .post(API_ROUTE + 'genres')
        .field('name', 'Glitch Hop     ')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.body.name).equal('glitch hop');
          genres['Glitch Hop'] = res.body;
          done();
        });
      });
      
    }); // /genres POST
    
    describe('/genres/{genreId} PUT', function() {
      it('should get authorization error while updating genre EDM', function(done) {
        superagent
        .put(API_ROUTE + 'genres/' + genres['EDM']._id)
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should update EDM', function(done) {
        superagent
        .put(API_ROUTE + 'genres/' + genres['EDM']._id)
        .attach('image', './test/assets/edm.jpg')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).equal(genres['EDM']._id);
          expect(res.body.name).equal('edm');
          expect(res.body.imgPath).to.match(/^\/img\/genres\/edm.*$/);
          
          albums['Funkyard Single'] = res.body;
          
          done();
        });
      });
    }); // /genres/{genreId} PUT
    
  }); // /genres
  
  describe('/artists', function() {
    
    describe('/artists POST', function() {
      it('should got authorization error while creating artist Arrowhead ', function(done) {
        superagent
        .post(API_ROUTE + 'artists')
        .send({ name: 'Arrowhead', img: 'img/arrowhead.jpg' })
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should create Arrowhead', function(done) {
        superagent
        .post(API_ROUTE + 'artists')
        .field('name', 'Arrowhead')
        .field('genres[0][genreId]', genres['EDM']._id)
        .field('genres[0][name]', 'EDM')
        .field('genres[1][genreId]', genres['Glitch Hop']._id)
        .field('genres[1][name]', 'Glitch Hop')
        .attach('image', './test/assets/arrowhead.jpg')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).not.equal(null);
          expect(res.body.name).equal('Arrowhead');
          expect(res.body.img).not.null;
          expect(res.body.imgPath).to.match(/^\/img\/artists\/arrowhead.*$/);
          expect(res.body.createdBy.name).equal('monolith');
          
          artists['Arrowhead'] = res.body;
          
          done();
        });
      });
      
      it('should create Zenta', function(done) {
        superagent
        .post(API_ROUTE + 'artists')
        .send({ name: 'Zenta' })
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).not.equal(null);
          expect(res.body.name).equal('Zenta');
          expect(res.body.createdBy.name).equal('monolith');
          
          artists['Zenta'] = res.body;
          
          done();
        });
      });
      
    }); // /artists POST
    
    describe('/artists/{artistId} PUT', function() {
      it('should got authorization error while updating artist Arrowhead ', function(done) {
        superagent
        .put(API_ROUTE + 'artists/' + artists['Arrowhead']._id)
        .send({ name: 'Arrowhead', img: 'img/arrowhead.jpg' })
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should update Arrowhead succesfully', function(done) {
        superagent
        .put(API_ROUTE + 'artists/' + artists['Arrowhead']._id)
        .send({ name: 'Arrowhead', tags: [ 'glitch hop' ] })
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).not.equal(null);
          expect(res.body._id).equal(artists['Arrowhead']._id);
          expect(res.body.name).equal('Arrowhead');
          expect(res.body.imgPath).to.match(new RegExp('^/img/artists/arrowhead.*$'));
          
          artists['Arrowhead'] = res.body;
          
          done();
        });
      });
      
      it('should update Zenta succesfully', function(done) {
        superagent
        .put(API_ROUTE + 'artists/' + artists['Zenta']._id)
        .attach('image', './test/assets/zenta.jpg')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).not.equal(null);
          expect(res.body._id).equal(artists['Zenta']._id);
          expect(res.body.name).equal('Zenta');
          expect(res.body.imgPath).to.match(new RegExp('^/img/artists/zenta.*$'));
          
          artists['Zenta'] = res.body;
          
          done();
        });
      });
      
    }); // /artists/{artistId} PUT
    
    describe('/artists/{artistId} DELETE', function() {
      
      it('should got authorization error while deleting artist Arrowhead ', function(done) {
        superagent
        .del(API_ROUTE + 'artists/' + artists['Arrowhead']._id)
        .set('Authorization', 'Bearer ' + token)
        .end(function (err, res) {
          expect(err).not.equal(null);
          done();
        });
      });
      
    }); // /artists/{artistId} DELETE
    
    describe('/artists/{artistId}/rate', function() {
      
      it('should got authorization error while rating artist Arrowhead ', function(done) {
        superagent
        .post(API_ROUTE + 'artists/' + artists['Arrowhead']._id + '/rate/sadfsfg')
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should got Not Allowed while rate artist Arrowhead with wrong rate param', function(done) {
        superagent
        .post(API_ROUTE + 'artists/' + artists['Arrowhead']._id + '/rate/sadfsfg')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(403);
          done();
        });
      });
      
      it('should rate artist Arrowhead', function(done) {
        superagent
        .post(API_ROUTE + 'artists/' + artists['Arrowhead']._id + '/rate/5')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body.rating).equal(5);
          done();
        });
      });
      
      it('should rate artist Arrowhead secondary', function(done) {
        superagent
        .post(API_ROUTE + 'artists/' + artists['Arrowhead']._id + '/rate/7')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body.rating).equal(7);
          done();
        });
      });
      
    }); // /artists/{artistId}/rate
    
    describe('artists/genre/{genre}', function() {
      
    });
    
  }); // /artists
  
  describe('/albums', function() {
    
    describe('/albums POST', function() {
      
      it('should get authorization error while creating Funkyard Single', function(done) {
        superagent
        .post(API_ROUTE + 'albums')
        .field('name', 'Funkyard Single')
        .field('artists[]', artists['Arrowhead']._id)
        .attach('image', './test/assets/arrowhead-and-zenta_-_funkyard-single.jpg')
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should get bad request while creating Funkyard Single', function(done) {
        superagent
        .post(API_ROUTE + 'albums')
        .field('name', 'Funkyard Single')
        .attach('image', './test/assets/arrowhead-and-zenta_-_funkyard-single.jpg')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(400);
          
          done();
        });
      });
      
      it('should create Funkyard Single', function(done) {
        superagent
        .post(API_ROUTE + 'albums')
        .field('name', 'Funkyard Single')
        .field('artists[0][artistId]', artists['Arrowhead']._id)
        .field('artists[0][name]', artists['Arrowhead'].name)
        .attach('image', './test/assets/arrowhead-and-zenta_-_funkyard-single.jpg')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).not.equal(null);
          expect(res.body.name).equal('Funkyard Single');
          expect(res.body.createdBy.name).equal('monolith');
          
          albums['Funkyard Single'] = res.body;
          
          done();
        });
      });
      
    }); // /albums POST
    
    describe('/albums/{albumId} PUT', function() {
      it('should got authorization error while updating album Funkyard Single', function(done) {
        superagent
        .put(API_ROUTE + 'albums/' + albums['Funkyard Single']._id)
        .send({ name: 'Funkyard Single', genres: [{ name: 'Glitch Hop', genreId: genres['Glitch Hop']._id }] })
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should update Funkyard Single', function(done) {
        superagent
        .put(API_ROUTE + 'albums/' + albums['Funkyard Single']._id)
        .send({
          name: 'Funkyard Single',
            artists: [{
              artistId: artists['Arrowhead']._id,
              name: artists['Arrowhead'].name
            }, {
              artistId: artists['Zenta']._id,
              name: artists['Zenta'].name
            }]
        })
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).not.equal(null);
          expect(res.body._id).equal(albums['Funkyard Single']._id);
          expect(res.body.artists[0].artistId).to.equal(artists['Arrowhead']._id);
          expect(res.body.artists[1].artistId).to.equal(artists['Zenta']._id);
          expect(res.body.name).equal('Funkyard Single');
          expect(res.body.imgPath).to.match(new RegExp('^/img/albums/funkyard-single'));
          
          albums['Funkyard Single'] = res.body;
          
          done();
        });
      });
      
      it('should update Funkyard Single image and genres', function(done) {
        superagent
        .put(API_ROUTE + 'albums/' + albums['Funkyard Single']._id)
        .attach('image', './test/assets/arrowhead-and-zenta_-_funkyard-single_1.jpg')
        .field('genres[0][name]', 'EDM')
        .field('genres[0][genreId]', genres['EDM']._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).not.equal(null);
          expect(res.body._id).equal(albums['Funkyard Single']._id);
          expect(res.body.artists[0].artistId).to.equal(artists['Arrowhead']._id);
          expect(res.body.artists[1].artistId).to.equal(artists['Zenta']._id);
          expect(res.body.genres[0].genreId).to.equal(genres['EDM']._id);
          expect(res.body.name).equal('Funkyard Single');
          expect(res.body.imgPath).to.match(new RegExp('^/img/albums/funkyard-single'));
          
          albums['Funkyard Single'] = res.body;
          
          done();
        });
      });
    }); // /albums/{albumId} PUT
    
    describe('/albums/{albumId} DELETE', function() {
      it('should get authorization error while deleting album Funkyard Single', function(done) {
        superagent
        .del(API_ROUTE + 'albums/' + albums['Funkyard Single']._id)
        .set('Authorization', 'Bearer ' + token)
        .end(function (err, res) {
          expect(err).not.equal(null);
          done();
        });
      });
    }); // /albums/{albumId} DELETE
    
    describe('/albums/{albumId}/rate', function() {
      
      it('should get authorization error while rating albums Funkyard Single ', function(done) {
        superagent
        .post(API_ROUTE + 'albums/' + albums['Funkyard Single']._id + '/rate/sadfsfg')
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should get Bad Request while rate albums Funkyard Single with wrong rate param', function(done) {
        superagent
        .post(API_ROUTE + 'albums/' + albums['Funkyard Single']._id + '/rate/sadfsfg')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(400);
          done();
        });
      });
      
      it('should rate albums Funkyard Single', function(done) {
        superagent
        .post(API_ROUTE + 'albums/' + albums['Funkyard Single']._id + '/rate/5')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body.rating).equal(5);
          done();
        });
      });
      
      it('should rate albums Funkyard Single secondary', function(done) {
        superagent
        .post(API_ROUTE + 'albums/' + albums['Funkyard Single']._id + '/rate/7')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body.rating).equal(7);
          done();
        });
      });
      
    }); // /albums/{albumId}/rate
    
  }); // /albums
  
  describe('/songs', function() {
    
    describe('/songs POST', function() {
      
      it('should got authorization error while creating Funkyard', function(done) {
        superagent
        .post(API_ROUTE + 'songs')
        .send({ name: 'Funkyard' })
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should create Funkyard', function(done) {
        superagent
        .post(API_ROUTE + 'songs')
        .field('name', 'Funkyard')
        .field('albums[0][albumId]', albums['Funkyard Single']._id)
        .field('albums[0][name]', albums['Funkyard Single'].name)
        .attach('audio', './test/assets/Nico Vega-Gravity.mp3')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).not.equal(null);
          expect(res.body.name).equal('Funkyard');
          expect(res.body.createdBy.name).equal('monolith');
          expect(res.body.albums[0].albumId).to.equal(albums['Funkyard Single']._id);
          
          songs['Funkyard'] = res.body;
          
          done();
        });
      });
      
    }); // /songs POST
    
    describe('/songs PUT', function() {
      it('should got authorization error while updating album Funkyard', function(done) {
        superagent
        .put(API_ROUTE + 'songs/' + songs['Funkyard']._id)
        .attach('audio', './test/assets/arrowhead-and-zentra_-_funkyard.mp3')
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should update Funkyard succesfully', function(done) {
        superagent
        .put(API_ROUTE + 'songs/' + songs['Funkyard']._id)
        .attach('audio', './test/assets/arrowhead-and-zentra_-_funkyard.mp3')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).not.equal(null);
          expect(res.body._id).equal(songs['Funkyard']._id);
          expect(res.body.albums[0].albumId).to.equal(albums['Funkyard Single']._id);
          expect(res.body.name).equal('Funkyard');
          
          songs['Funkyard'] = res.body;
          
          done();
        });
      });
    }); // /songs PUT
    
    describe('/songs DELETE', function() {
      it('should got authorization error while deleting album Funkyard', function(done) {
        superagent
        .del(API_ROUTE + 'songs/' + songs['Funkyard']._id)
        .set('Authorization', 'Bearer ' + token)
        .end(function (err, res) {
          expect(err).not.equal(null);
          done();
        });
      });
    }); // /songs DELETE
    
    describe('/songs/{songId}/rate', function() {
      
      it('should got authorization error while rating songs Funkyard ', function(done) {
        superagent
        .post(API_ROUTE + 'songs/' + songs['Funkyard']._id + '/rate/sadfsfg')
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should got Not Allowed while rate songs Funkyard with wrong rate param', function(done) {
        superagent
        .post(API_ROUTE + 'songs/' + songs['Funkyard']._id + '/rate/sadfsfg')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(403);
          done();
        });
      });
      
      it('should rate song Funkyard', function(done) {
        superagent
        .post(API_ROUTE + 'songs/' + songs['Funkyard']._id + '/rate/5')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body.rating).equal(5);
          done();
        });
      });
      
      it('should rate song Funkyard secondary', function(done) {
        superagent
        .post(API_ROUTE + 'songs/' + songs['Funkyard']._id + '/rate/7')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body.rating).equal(7);
          done();
        });
      });
      
    }); // /songs rate
    
    describe('/songs/{songId}/media', function() {
      
      it('sould get media url to Funkyard', function(done) {
        superagent
        .get(API_ROUTE + 'songs/' + songs['Funkyard']._id + '/media')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body.url).not.null;
          expect(res.body.listened).equal(1);
          done();
        });
      });
      
      it('sould increment listened to 2', function(done) {
        superagent
        .get(API_ROUTE + 'songs/' + songs['Funkyard']._id + '/media')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body.url).not.null;
          expect(res.body.listened).equal(2);
          done();
        });
      });
      
    }); // /songs/{songId}/media
    
  }); // /songs
});