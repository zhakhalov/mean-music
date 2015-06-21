(function (describe, it, expect, before, after) {
  
  var AuthSvc;
  var Artist;
  var Album;
  var Song;
  
  var artist;
  var album;
  var song;
  
  describe('Get services', function () {
    it('should get services', function () {
      var $injector = window.angular.injector(['app']);
      AuthSvc = $injector.get('AuthSvc');
      Artist = $injector.get('Artist');
      Album = $injector.get('Album');
      Song = $injector.get('Song');
      
      expect(AuthSvc).not.toBeNull();
      expect(Artist).not.toBeNull();
      expect(Album).not.toBeNull();
      expect(Song).not.toBeNull();
    });
  });
  
  describe('Authenticate service', function() {
    
    it('should authenticate as monolith', function (done) {
      AuthSvc.signIn('user@email.com', '123456')
      .then( function () {
        done();
      }, function (err) {
        expect(err).toBeNull();
        done();
      });
    });
    
  }); // Authenticate
  
  describe('Artist resource', function () {
    
    it('should create Artist instance', function() {
      artist = new Artist({
        name: 'Nico Vega'
      }); 
      
      expect(artist.name).toEqual('Nico Vega');
      expect(artist.$save).not.toBeUndefined();
    });
    
    it('should save new Artist at server', function (done) {
      artist
      .$save()
      .then(function () {
        expect(artist.name).toEqual('Nico Vega');
        done();
      }, function (err) {
        expect(err).toBeNull();
        done();
      });
    });
    
    it('should update instance', function (done) {
      artist.img = 'img/nico-vega.jpg';
      expect(artist.$update).not.toBeUndefined();
      artist.$update()
      .then(function () {
        expect(artist.name).toEqual('Nico Vega');
        expect(artist.img).toEqual('img/nico-vega.jpg');
        done();
      }, function (err) {
        expect(err).toBeNull();
        done();
      });
    });
    
    it('should get instance by id', function (done) {
      Artist.get(artist._id)
      .then(function (res) {
        res;
        expect(res._id).toEqual(artist._id);
        expect(res.name).toEqual('Nico Vega');
        artist = res;
        done();
      }, function (err) {
        expect(err).toBeNull();
        done();
      });
    });
    
    it('should rate instance', function (done) {
      artist.$rate(8)
      .then(function () {
        expect(artist.name).toEqual('Nico Vega');
        expect(artist.rating).toEqual(8);
        done();
      }, function (err) {
        expect(err).toBeNull();
        done();
      });
    });
    
  }); // Artist resource
  
  describe('Album resource', function () {
    
    it('should create Album instance', function() {
      album = new Album({
        name: 'Nico Vega',
        artists: [artist._id]
      }); 
      
      expect(album.name).toEqual('Nico Vega');
      expect(album.artists).toContain(artist._id);
      expect(album.$save).not.toBeUndefined();
    });
    
    it('should save new Album at server', function (done) {
      album
      .$save()
      .then(function () {
        expect(album.name).toEqual('Nico Vega');
        expect(album.artists).toContain(artist._id);
        done();
      }, function (err) {
        expect(err).toBeNull();
        done();
      });
    });
    
    it('should update instance', function (done) {
      album.img = 'img/nico-vega_-_nico-vega.jpg';
      album.release = new Date();
      album.release.setYear(2009)
      album.$update()
      .then(function () {
        expect(album.name).toEqual('Nico Vega');
        expect(album.img).toEqual('img/nico-vega_-_nico-vega.jpg');
        expect(album.release.getYear()).toEqual(2009);
        done();
      }, function (err) {
        expect(err).toBeNull();
        done();
      });
    });
    
    it('should get instance by id', function (done) {
      Album.get(album._id)
      .then(function (res) {
        res;
        expect(res._id).toEqual(album._id);
        expect(res.name).toEqual('Nico Vega');
        album = res;
        done();
      }, function (err) {
        expect(err).toBeNull();
        done();
      });
    });
    
    it('should rate instance', function (done) {
      album.$rate(8)
      .then(function () {
        expect(album.name).toEqual('Nico Vega');
        expect(album.rating).toEqual(8);
        done();
      }, function (err) {
        expect(err).toBeNull();
        done();
      });
    });
    
  }); // Album resource
  
  describe('Song resource', function () {
    
    it('should create Album instance', function() {
      song = new Song({
        name: 'Gravity',
        artists: [artist._id],
        albums: [album._id],
        path: 'audio/nico-vega_-_gravity.mp3'
      }); 
      
      expect(song.name).toEqual('Gravity');
      expect(song.artists).toContain(artist._id);
      expect(song.$save).not.toBeUndefined();
    });
    
    it('should save new Song at server', function (done) {
      song
      .$save()
      .then(function () {
        expect(song.name).toEqual('Gravity');
        expect(song.artists).toContain(artist._id);
        expect(song.albums).toContain(album._id);
        done();
      }, function (err) {
        expect(err).toBeNull();
        done();
      });
    });
    
    it('should update instance', function (done) {
      song.img = 'img/nico-vega_-_nico-vega.jpg';
      song.duration = 162;
      song.$update()
      .then(function () {
        expect(song.name).toEqual('Gravity');
        expect(song.img).toEqual('img/nico-vega_-_nico-vega.jpg');
        expect(song.duration).toEqual(162);
        done();
      }, function (err) {
        expect(err).toBeNull();
        done();
      });
    });
    
    it('should get instance by id', function (done) {
      Song.get(song._id)
      .then(function (res) {
        res;
        expect(res._id).toEqual(song._id);
        expect(res.name).toEqual('Gravity');
        song = res;
        done();
      }, function (err) {
        expect(err).toBeNull();
        done();
      });
    });
    
    it('should rate instance', function (done) {
      song.$rate(8)
      .then(function () {
        expect(song.name).toEqual('Gravity');
        expect(song.rating).toEqual(8);
        done();
      }, function (err) {
        expect(err).toBeNull();
        done();
      });
    });
    
    it('should get url to stream', function (done) {
        song.$media()
        .then(function () {
          expect(song.url).not.toBeNull();
          done();
        }, function (err) {
          expect(err).toBeNull();
          done();
        });
      });
    
  }); // Song resource
  
})(window.describe, window.it, window.expect, window.before, window.after);