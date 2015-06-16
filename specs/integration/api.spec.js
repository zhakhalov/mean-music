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
      
      it('should got authorization error while creating tag "EDM"', function(done) {
         superagent
        .post(API_ROUTE + 'genres')
        .send({ name: 'EDM' })
        .end(function(err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should create tag "EDM"', function(done) {
         superagent
        .post(API_ROUTE + 'genres')
        .send({ name: 'EDM' })
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.body.name).equal('edm');
          done();
        });
      });
      
    }); // /genres POST
    
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
        .field('genres[]', 'edm')
        .field('genres[]', 'glitch hop')
        // .send({ name: 'Arrowhead', genres: [ 'edm', 'glitch hop' ] })
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).not.equal(null);
          expect(res.body.name).equal('Arrowhead');
          expect(res.body.createdBy.name).equal('monolith');
          
          artists['Arrowhead'] = res.body;
          
          done();
        });
      });
      
      it('should create Zenta', function(done) {
        superagent
        .post(API_ROUTE + 'artists')
        .send({ name: 'Zenta', genres: [ 'edm', 'glitch hop' ] })
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
        .send({ name: 'Arrowhead', img: 'img/arrowhead.jpg', tags: [ 'glitch hop' ] })
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).not.equal(null);
          expect(res.body._id).equal(artists['Arrowhead']._id);
          expect(res.body.name).equal('Arrowhead');
          expect(res.body.img).equal('img/arrowhead.jpg');
          
          artists['Arrowhead'] = res.body;
          
          done();
        });
      });
      
      it('should update Zenta succesfully', function(done) {
        superagent
        .put(API_ROUTE + 'artists/' + artists['Zenta']._id)
        .send({ name: 'Zenta', img: 'img/zenta.jpg', tags: [ 'edm' ] })
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).not.equal(null);
          expect(res.body._id).equal(artists['Zenta']._id);
          expect(res.body.name).equal('Zenta');
          expect(res.body.img).equal('img/zenta.jpg');
          
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
      
      it('should got authorization error while creating Funkyard Single', function(done) {
        superagent
        .post(API_ROUTE + 'albums')
        .send({ name: 'Funkyard Single' })
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should create Funkyard Single', function(done) {
        superagent
        .post(API_ROUTE + 'albums')
        .send({ name: 'Funkyard Single' })
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
        .send({ name: 'Funkyard Single', img: 'img/arrowhead-and-zenta_-_funkyard-single.jpg.jpg' })
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should update Funkyard Single succesfully', function(done) {
        superagent
        .put(API_ROUTE + 'albums/' + albums['Funkyard Single']._id)
        .send({
          name: 'Funkyard Single',
          img: 'img/arrowhead-and-zenta_-_funkyard-single.jpg.jpg',
          artists: [ artists['Arrowhead']._id, artists['Zenta']._id ]
        })
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).not.equal(null);
          expect(res.body._id).equal(albums['Funkyard Single']._id);
          expect(res.body.artists).to.contain(artists['Arrowhead']._id);
          expect(res.body.artists).to.contain(artists['Zenta']._id);
          expect(res.body.name).equal('Funkyard Single');
          expect(res.body.img).equal('img/arrowhead-and-zenta_-_funkyard-single.jpg.jpg');
          
          albums['Funkyard Single'] = res.body;
          
          done();
        });
      });
    }); // /albums/{albumId} PUT
    
    describe('/albums/{albumId} DELETE', function() {
      it('should got authorization error while deleting album Funkyard Single', function(done) {
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
      
      it('should got authorization error while rating albums Funkyard Single ', function(done) {
        superagent
        .post(API_ROUTE + 'albums/' + albums['Funkyard Single']._id + '/rate/sadfsfg')
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should got Not Allowed while rate albums Funkyard Single with wrong rate param', function(done) {
        superagent
        .post(API_ROUTE + 'albums/' + albums['Funkyard Single']._id + '/rate/sadfsfg')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(403);
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
        .send({ name: 'Funkyard', path: 'audio/arrowhead-and-zentra_-_funkyard.mp3' })
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).not.equal(null);
          expect(res.body.name).equal('Funkyard');
          expect(res.body.createdBy.name).equal('monolith');
          
          songs['Funkyard'] = res.body;
          
          done();
        });
      });
      
    }); // /songs POST
    
    describe('/songs PUT', function() {
      it('should got authorization error while updating album Funkyard', function(done) {
        superagent
        .put(API_ROUTE + 'songs/' + songs['Funkyard']._id)
        .send({ name: 'Funkyard', img: 'img/arrowhead-and-zenta_-_funkyard-single.jpg.jpg' })
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should update Funkyard succesfully', function(done) {
        superagent
        .put(API_ROUTE + 'songs/' + songs['Funkyard']._id)
        .send({
          name: 'Funkyard',
          img: 'img/arrowhead-and-zenta_-_funkyard-single.jpg.jpg',
          artists: [ artists['Arrowhead']._id, artists['Zenta']._id ],
          albums: [albums['Funkyard Single']._id]
        })
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).not.equal(null);
          expect(res.body._id).equal(songs['Funkyard']._id);
          expect(res.body.artists).to.contain(artists['Arrowhead']._id);
          expect(res.body.artists).to.contain(artists['Zenta']._id);
          expect(res.body.albums).to.contain(albums['Funkyard Single']._id);
          expect(res.body.name).equal('Funkyard');
          expect(res.body.img).equal('img/arrowhead-and-zenta_-_funkyard-single.jpg.jpg');
          
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