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
    
    describe('POST /genres ', function() {
      
      it('should get [Not Authorized] error while creating genre "EDM"', function(done) {
         superagent
        .post(API_ROUTE + 'genres')
        .send({ 
          genre: { name: 'EDM' }
        })
        .end(function(err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should get [Bad Request] while creating genre "EDM"', function(done) {
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
        .field('genre[name]', 'EDM')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.body.name).equal('EDM');
          genres['EDM'] = res.body;
          done();
        });
      });
      
      it('should create genre "Glitch Hop" with uploading image', function(done) {
         superagent
        .post(API_ROUTE + 'genres')
        .field('genre[name]', 'Glitch Hop')
        .attach('image', './test/assets/glitch-hop.png')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.body.name).equal('Glitch Hop');
          genres['Glitch Hop'] = res.body;
          done();
        });
      });
      
    }); // POST /genres 
    
    describe('PUT /genres/{id}', function() {
      
      it('should get [Not Authorized] error while updating genre EDM', function(done) {
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
          expect(res.body.name).equal('EDM');
          expect(res.body.imgPath).to.match(/^\/img\/genres\/edm.*$/);
          
          genres['EDM'] = res.body;
          
          done();
        });
      });
    }); // PUT /genres/{id} 
    
    describe('GET /genres/{id}', function() {
      it('should get direct link to image for "EDM"', function(done) {
        superagent
        .get(API_ROUTE + 'genres/' + genres['EDM']._id)
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).equal(genres['EDM']._id);
          
          superagent
          .get(res.body.img)
          .end(function(err, res) {
            expect(err).equal(null);
            expect(res.status).equal(200);
            expect(res.headers['content-type']).match(/^image\/.*$/i);
            done();
          });
        });
      });
    }) // GET /genres/{id} 
    
  }); // /genres
  
  describe('/artists', function() {
    
    describe('POST /artists', function() {
      
      it('should get [Not Authorized] error while creating "Arrowhead"', function(done) {
         superagent
        .post(API_ROUTE + 'artists')
        .send({ 
          genre: { name: 'Arrowhead' }
        })
        .end(function(err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should get [Bad Request] while creating "Arrowhead"', function(done) {
         superagent
        .post(API_ROUTE + 'artists')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).not.to.be.null;
          expect(res.status).to.equal(400);
          done();
        });
      });
      
      it('should create "Arrowhead" without image', function(done) {
         superagent
        .post(API_ROUTE + 'artists')
        .field('artist[name]', 'Arrowhead')
        .field('genres[0]', genres['EDM']._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.body.name).equal('Arrowhead');
          artists['Arrowhead'] = res.body;
          done();
        });
      });
      
      it('should create "Zenta" with uploading image', function(done) {
         superagent
        .post(API_ROUTE + 'artists')
        .field('artist[name]', 'Zenta')
        .field('genres[0]', genres['EDM']._id)
        .field('genres[1]', genres['Glitch Hop']._id)
        .attach('image', './test/assets/zenta.jpg')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.body.name).equal('Zenta');
          artists['Zenta'] = res.body;
          done();
        });
      });
      
    }); // POST /artists 
    
    describe('PUT /artists/{id}', function() {
      
      it('should get [Not Authorized] error while updating "Arrowhead"', function(done) {
        superagent
        .put(API_ROUTE + 'artists/' + artists['Arrowhead']._id)
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should update image for "Arrowhead"', function(done) {
        superagent
        .put(API_ROUTE + 'artists/' + artists['Arrowhead']._id)
        .attach('image', './test/assets/zenta.jpg')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.body._id).equal(artists['Arrowhead']._id);
          expect(res.body.name).equal('Arrowhead');
          artists['Arrowhead'] = res.body;
          done();
        });
      });
      
    });// PUT /artists/{id}
    
    describe('GET /artists/{id}', function() {
      
      it('should get direct image for "Arrowhead"', function(done) {
        superagent
        .get(API_ROUTE + 'artists/' + artists['Arrowhead']._id)
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).equal(artists['Arrowhead']._id);
          
          superagent
          .get(res.body.img)
          .end(function(err, res) {
            expect(err).equal(null);
            expect(res.status).equal(200);
            expect(res.headers['content-type']).match(/^image\/.*$/i);
            done();
          });
        });
      });
      
    }); // GET /artists/{id}
  });
  
  describe('/albums', function() {
    
    describe('POST /albums', function() {
      
      it('should get [Not Authorized] error while creating "Arrowhead"', function(done) {
         superagent
        .post(API_ROUTE + 'albums')
        .send({ 
          genre: { name: 'Funkyard Single' }
        })
        .end(function(err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should get [Bad Request] while creating "Funkyard Single"', function(done) {
         superagent
        .post(API_ROUTE + 'albums')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).not.to.be.null;
          expect(res.status).to.equal(400);
          done();
        });
      });
      
      it('should create "Funkyard Single" without image', function(done) {
         superagent
        .post(API_ROUTE + 'albums')
        .field('album[name]', 'Funkyard Single')
        .field('genres[0]', genres['EDM']._id)
        .field('genres[1]', genres['Glitch Hop']._id)
        .field('artists[0]', artists['Arrowhead']._id)
        .field('artists[1]', artists['Zenta']._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.body.name).equal('Funkyard Single');
          albums['Funkyard Single'] = res.body;
          done();
        });
      });
      
    }); // POST /albums
    
    describe('PUT /albums/{id}', function() {
      
      it('should get [Not Authorized] error while updating "Funkyard Single"', function(done) {
        superagent
        .put(API_ROUTE + 'albums/' + albums['Funkyard Single']._id)
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should update image for "Funkyard Single"', function(done) {
        superagent
        .put(API_ROUTE + 'albums/' + albums['Funkyard Single']._id)
        .attach('image', './test/assets/arrowhead-and-zenta_-_funkyard-single.jpg')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.body._id).equal(albums['Funkyard Single']._id);
          expect(res.body.name).equal('Funkyard Single');
          albums['Funkyard Single'] = res.body;
          done();
        });
      });
      
    }); // PUT /albums/{id}
    
    describe('GET /albums/{id}', function() {
      
      it('should get "Funkyard Single"', function(done) {
        superagent
        .get(API_ROUTE + 'albums/' + albums['Funkyard Single']._id)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.body._id).equal(albums['Funkyard Single']._id);
          expect(res.body.imgPath).equal('/img/albums/arrowhead-and-zenta_-_funkyard-single.jpg');
          albums['Funkyard Single'] = res.body;
          done();
        });  
      });
      
      it('should get image for "Funkyard Single"', function(done) {
        superagent
        .get(albums['Funkyard Single'].img)
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.headers['content-type']).match(/^image\/.*$/i);
          
          done();
        });
      });
      
    }); // PUT /albums/{id}
     
  }); // /albums
  
  describe('/songs', function() {
    
    describe('POST /songs', function() {
      
      it('should get [Not Authorized] error while creating "Funkyard"', function(done) {
        superagent
        .post(API_ROUTE + 'albums')
        .send({ 
          genre: { name: 'Funkyard Single' }
        })
        .end(function(err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should get [Bad Request] w/o name while creating "Funkyard"', function(done) {
        superagent
        .post(API_ROUTE + 'songs')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).not.to.be.null;
          expect(res.status).to.equal(400);
          done();
        });
      });
      
      it('should get [Bad Request] w/o audio while creating "Funkyard"', function(done) {
        superagent
        .post(API_ROUTE + 'songs')
        .field('song[name]', 'Funkyard')
        // .field('albums[0]', albums['Funkyard Single']._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).not.to.be.null;
          expect(res.status).to.equal(400);
          done();
        });
      });
      
      it('should create "Funkyard" w/ audio', function(done) {
        superagent
        .post(API_ROUTE + 'songs')
        .field('song[name]', 'Funkyard')
        // .field('albums[0]', albums['Funkyard Single']._id)
        .attach('audio', './test/assets/Nico Vega-Gravity.mp3')
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.body.name).equal('Funkyard');
          expect(res.body.path).equal('/audio/_-_funkyard.mp3');
          songs['Funkyard'] = res.body;
          done();
        });
      });
      
    }); // POST /songs
    
    describe('PUT /songs/{id}', function() {
      it('should get [Not Authorized] error while updating "Funkyard"', function(done) {
        superagent
        .put(API_ROUTE + 'songs/' + songs['Funkyard']._id)
        .field('albums[0]', albums['Funkyard Single']._id)
        .end(function (err, res) {
          expect(err).not.equal(null);
          expect(res.status).equal(401);
          done();
        });
      });
      
      it('should update albums for "Funkyard"', function(done) {
        superagent
        .put(API_ROUTE + 'songs/' + songs['Funkyard']._id)
        .field('albums[0]', albums['Funkyard Single']._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.body._id).equal(songs['Funkyard']._id);
          expect(res.body.name).equal('Funkyard');
          songs['Funkyard'] = res.body;
          done();
        });
      });
      
      it('should update audio file for "Funkyard"', function(done) {
        superagent
        .put(API_ROUTE + 'songs/' + songs['Funkyard']._id)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .attach('audio', './test/assets/arrowhead-and-zentra_-_funkyard.mp3')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.body._id).equal(songs['Funkyard']._id);
          expect(res.body.name).equal('Funkyard');
          expect(res.body.path).equal('/audio/arrowhead-and-zenta_-_funkyard.mp3');
          songs['Funkyard'] = res.body;
          done();
        });
      });
      
    }); // PUT /songs/{id}
    
    describe('GET /songs/{id}', function() {
      
      it('should get "Funkyard"', function(done) {
        superagent
        .get(API_ROUTE + 'songs/' + songs['Funkyard']._id)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body._id).equal(songs['Funkyard']._id);
          expect(res.body.name).equal('Funkyard');
          
          done();
        });
      });
      
      it('should get "Funkyard" listen url', function(done) {
        superagent
        .get(API_ROUTE + 'songs/' + songs['Funkyard']._id + '/listen')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body.url).not.equal(null);
          expect(res.body.listened).equal(1);
          
          done();
        });
      });
      
      it('should get "Funkyard" listen url and increment it', function(done) {
        superagent
        .get(API_ROUTE + 'songs/' + songs['Funkyard']._id + '/listen')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body.url).not.equal(null);
          expect(res.body.listened).equal(2);
          
          done();
        });
      });
      
      it('should get audio for "Funkyard" from url', function(done) {
        superagent
        .get(API_ROUTE + 'songs/' + songs['Funkyard']._id + '/listen')
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.status).equal(200);
          expect(res.body.url).not.equal(null);
          expect(res.body.listened).equal(3);
          
          superagent
          .get(res.body.url)
          .end(function(err, res) {
            expect(err).equal(null);
            expect(res.status).equal(200);
            expect(res.headers['content-type']).match(/^audio\/.*$/i);
            
            done();
          });
        });
      });
      
    }); // GET /songs/{id}
  }); // /songs
  
  describe('rates', function() {
    var users = {};
    
    describe('shoud register 4 users', function() {
      
      it('should sign up "Archie"', function(done) {
        superagent
        .post(API_ROUTE + 'auth/signup')
        .send({ name: 'Archie', email: 'archie@email.com',  password: '123456' })
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).to.equal(200);
          expect(res.body.user).to.be.not.undefined;
          expect(res.body.token).to.be.not.undefined;
          expect(res.body.user.name).to.be.equal('Archie');
          expect(res.body.user.email).to.be.equal('archie@email.com');
          
          users['Archie'] = res.body;
          
          done();
        });
      });  
      
      it('should sign up "One Two"', function(done) {
        superagent
        .post(API_ROUTE + 'auth/signup')
        .send({ name: 'One Two', email: 'one_two@email.com',  password: '123456' })
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).to.equal(200);
          expect(res.body.user).to.be.not.undefined;
          expect(res.body.token).to.be.not.undefined;
          expect(res.body.user.name).to.be.equal('One Two');
          expect(res.body.user.email).to.be.equal('one_two@email.com');
          
          users['One Two'] = res.body;
          
          done();
        });
      });  
      
      it('should sign up "Bob"', function(done) {
        superagent
        .post(API_ROUTE + 'auth/signup')
        .send({ name: 'Bob', email: 'bob@email.com',  password: '123456' })
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).to.equal(200);
          expect(res.body.user).to.be.not.undefined;
          expect(res.body.token).to.be.not.undefined;
          expect(res.body.user.name).to.be.equal('Bob');
          expect(res.body.user.email).to.be.equal('bob@email.com');
          
          users['Bob'] = res.body;
          
          done();
        });
      });  
      
      it('should sign up "Mumbles"', function(done) {
        superagent
        .post(API_ROUTE + 'auth/signup')
        .send({ name: 'Mumbles', email: 'mumbles@email.com',  password: '123456' })
        .set('Accept', 'application/json')
        .end(function (err, res) {
          expect(err).equal(null);
          expect(res.status).to.equal(200);
          expect(res.body.user).to.be.not.undefined;
          expect(res.body.token).to.be.not.undefined;
          expect(res.body.user.name).to.be.equal('Mumbles');
          expect(res.body.user.email).to.be.equal('mumbles@email.com');
          
          users['Mumbles'] = res.body;
          
          done();
        });
      });  
      
    }); // shoud register 4 users
    
    describe('rate "EDM"', function() {
      
      it('shoud rate by 3', function(done) {
         superagent
        .post(API_ROUTE + 'genres/' + genres['EDM']._id + '/rate/3')
        .set('Authorization', 'Bearer ' + users['Archie'].token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.body.rate).equal(3);
          done();
        });
      });
      
      it('shoud rate by 5 same user', function(done) {
         superagent
        .post(API_ROUTE + 'genres/' + genres['EDM']._id + '/rate/5')
        .set('Authorization', 'Bearer ' + users['Archie'].token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.body.rate).equal(5);
          done();
        });
      });
      
      it('shoud rate by 3', function(done) {
         superagent
        .post(API_ROUTE + 'genres/' + genres['EDM']._id + '/rate/3')
        .set('Authorization', 'Bearer ' + users['Mumbles'].token)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          expect(err).equal(null);
          expect(res.body.rate).equal(4);
          done();
        });
      });
      
    }); // rate "EDM"
    
  }) // rates
});