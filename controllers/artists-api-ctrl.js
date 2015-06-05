// ----- node_modules
var _ = require('lodash');
var Q = require('q');

// ----- config
var aritstsDbCfg = global.__require('./config/db-cfg.js').artists;
var albumsDbCfg = global.__require('./config/db-cfg.js').albums;
var songsDbCfg = global.__require('./config/db-cfg.js').songs;

// ----- custom modules
var security = global.__require('./modules/security');

// ----- models
var ArtistModel = global.__require('./models/artist-model.js');
var AlbumModel = global.__require('./models/album-model.js');
var SongModel = global.__require('./models/song-model.js');

module.exports = function (router) {
  router
  .get('/artists/removeall', function (req, res, next) {
    if (!process.env.DEV) { return next(_.assign(new Error('DEV server only'), { status: 403 })); }
    ArtistModel.remove().exec(function (err) {
      if (err) {
        next(err);
      } else {
        res.send('All users succesfully removed.');
      }
    });
  })
  .get('/artists', function (req, res, next) {
    var query = _.defaults(req.query, aritstsDbCfg.defaultQuery);
    
    ArtistModel
    .find(query.query)
    .sort(query.sort)
    .skip(query.skip)
    .limit(query.limit)
    .select(query.select)
    .lean()
    .exec(function (err, docs) {
      if (err) {
        next(err);
      } else {
        res.send(docs);
      }
    });
  })
  .post('/artists', security.ensureAuthenticated, function (req, res, next) {
    var model = new ArtistModel(_.assign(req.body, {
      createdBy: { name: req.user.name, userId: req.user._id },
      updatedBy: { name: req.user.name, userId: req.user._id }
    }));
    model.save(function (err, doc) {
      if (err) {
        next(err);
      } else {
        res.send(doc);
      }
    });
  })
  .get('/artists/:artistId', function (req, res, next) {
    ArtistModel.findById(req.params.artistId).lean().exec(function (err, doc) {
      if (err) {
        next(err);
      } else if (!doc) {
        res.send(doc);
      }
    });
  })
  .put('/artists/:artistId', security.ensureAuthenticated, function (req, res, next) {
    req.body = _.omit(req.body, aritstsDbCfg.preventUpdate);
    req.body.updatedAt = new Date();
    req.body.updatedBy = { name: req.user.name, userId: req.user._id };
    
    ArtistModel.update({ _id: req.params.artistId }, req.body, function (err, numAffected) {
      if (err) {
        next(err);
      } else if (!numAffected) {
        next(_.assign(new Error('No artist found with artistId: ' + req.params.artistId), { status: 404 }));
      } else {
        res.send('ok');
      }
    });
  })
  .delete('/artist/:artistId', security.ensureAuthenticated, security.ensureInRole('admin', 'owner'), function (req, res, next) {
    ArtistModel.remove({ _id: req.params.artistId }, function (err) {
      if (err) {
        next(err);
      } else {
        res.send('ok');
      }
    });
  })
  .get('/artists/:artistId/albums', function (req, res, next) {
    Q.promise(function (resolve, reject) {
      ArtistModel
      .findById(req.params.artistId)
      .exec(function (err, artist) {
        if (err) {
          reject(err);
        } else if (!artist) {
          reject(_.assign(new Error('No artist found with artistId: ' + req.params.artistId), { status: 404 }));
        } else {
          resolve(artist);
        }
      });
    })
    .then(function (artist) {
      var query = _.defaults(req.query, albumsDbCfg.defaultQuery);
      AlbumModel
      .find({_id:{ $in: artist.albums }})
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit)
      .select(query.select)
      .lean()
      .exec(function(err, albums) {
        if (err) {
          next(err);
        } else {
          res.send(albums);
        }
      });
    })
    .then(function (albums) {
      res.send(albums);
    }, function (err) {
      next(err);
    });
  })
  .put('/artists/:artistId/albums/:albumId', security.ensureAuthenticated, function (req, res, next) {
    Q.promise(function(resolve, reject) {
      AlbumModel
      .findById(req.params.albumId)
      .exec(function (err, album) {
        if (err) {
          reject(err);
        } else if (!album) {
          reject(_.assign(new Error('No album found with artistId: ' + req.params.albumId), { status: 404 }));
        } else {
          resolve(album);
        }
      });
    })
    .then(function(album) {
      ArtistModel
    })
    AlbumModel
    .findById(req.params.albumId)
    .exec(function(err, album) {
      if (err) {
        next(err);
      } else if (!album) {
        next(_.assign(new Error('No album found with id: ' + req.params.artistId), { status: 404 }));
      }
      ArtistModel.update({ _id: req.params.artistId }, { $addToSet: { albums: req.params.albumId } }, function(err, numAffected) {
        if (err)  {
          next(err);
        } else if (!numAffected) {
          next(_.assign(new Error('No artist found with artistId: ' + req.params.artistId), { status: 404 }));
        } else {
          res.send('ok');
        }
      });    
    });
  })
  .delete('/artists/:artistId/albums/:albumId', security.ensureAuthenticated, function (req, res, next) {
    ArtistModel.update({ _id: req.params.artistId }, { $addToSet: { albums: req.params.albumId } }, function(err, numAffected) {
      if (err)  {
        next(err);
      } else if (!numAffected) {
        next(_.assign(new Error('No artist found with artistId: ' + req.params.artistId), { status: 404 }));
      } else {
        res.send('ok');
      }
    });
  })
  .get('/artists/:artistId/songs', function (req, res, next) {
    Q.promise(function (resolve, reject) {
      ArtistModel
      .findById(req.params.artistId)
      .exec(function (err, artist) {
        if (err) {
          reject(err);
        } else if (!artist) {
          reject(_.assign(new Error('No artist found with artistId: ' + req.params.artistId), { status: 404 }));
        } else {
          resolve(artist);
        }
      });
    })
    .then(function (artist) {
      var query = _.defaults(req.query, songsDbCfg.defaultQuery);
      SongModel
      .find({_id:{ $in: artist.songs }})
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit)
      .select(query.select)
      .lean()
      .exec(function(err, albums) {
        if (err) {
          next(err);
        } else {
          res.send(albums);
        }
      });
    })
    .then(function (albums) {
      res.send(albums);
    }, function (err) {
      next(err);
    });
  })
  .put('/artists/:artistId/songs/:songId', security.ensureAuthenticated, function (req, res, next) {
    ArtistModel.update({ _id: req.params.artistId }, { $addToSet: { songs: req.params.albumId } }, function(err, numAffected) {
      if (err)  {
        next(err);
      } else if (!numAffected) {
        next(_.assign(new Error('No artist found with artistId: ' + req.params.artistId), { status: 404 }));
      } else {
        res.send('ok');
      }
    });
  })
  .delete('/artists/:artistId/songs/:songId', function (req, res, next) {
    ArtistModel.update({ _id: req.params.artistId }, 
      { $pull: { songs: req.params.albumId },
        updatedAt: new Date(),
        updatedBy: { userId: req.user.id, name: req.user.name }},
        function(err, numAffected) {
      if (err)  {
        next(err);
      } else if (!numAffected) {
        next(_.assign(new Error('No artist found with artistId: ' + req.params.artistId), { status: 404 }));
      } else {
        res.send('ok');
      }
    });
  })
};