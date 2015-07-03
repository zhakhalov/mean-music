var mongoose = require('mongoose');
var q = require('q');
var fs = require('fs');
var _ = require('lodash');
var slugify = require('transliteration').slugify;

var logger = global.__require('modules/logger');
var storage = global.__require('modules/storage');

var VoteSchema = require('./vote-schema.js');
var AlbumModel = require('./album-model.js');
var ArtistModel = require('./artist-model.js');

var schema = mongoose.Schema({
  path: { type: String },                                                           //  Path to audio file at Dropbox.
  name: { type: String, required: true, trim: true },                                               //  Song name.
  duration: { type: Number, min: 0, default: 0 },                                                   //  Song duration.
  raters: [VoteSchema],                                                                             //  Raters.
  rating: { type: Number, min: 0, max: 10, default: 0 },                                            //  Rating.
  listened: { type: Number, min: 0, default: 0 },                                                   //  How many times song was listened.
});

schema.post('remove', function (doc) {
  
});


/**
 * @function
 * Set albums for song.
 * @param {[ObjectId]} genres
 * @param {function (err)} cb Callback function.
 */
schema.methods.setAlbums = function (albums, cb) {
  var self = this;
  q.all([
    // remove
    q.promise(function(resolve, reject) {
      AlbumModel.update(
        { _id: { $nin: albums }, songs: self._id },
        { $pull: { songs: self._id }},
        { multi: true })
      .exec(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }),
    // add
    q.promise(function(resolve, reject) {
      AlbumModel.update(
        { _id: { $in: albums }, songs: { $ne: self._id } },
        { $push: { songs: self._id }},
        { multi: true })
      .exec(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }),
  ])
  .then(function () {
    cb(null);
  }, function (err) {
    cb(err);
  });
};

/**
 * Get artisrs for song
 */
schema.methods.getArtists = function (cb) {
  var self = this;
  // fetch albums ids
  q.promise(function(resolve, reject) {
    AlbumModel.find({ songs: self._id })
    .select('_id')
    .lean()
    .exec(function (err, docs) {
      ((null == err) ? resolve : reject)((null == err) ? _.map(docs, function (entry) { return entry._id }) : err);
    });
  })
  // fetch artists
  .then(function(ids) { return q.promise(function (resolve, reject) {
    ArtistModel.find({ albums: { $in: ids }})
    .sort('name')
    .lean()
    .exec(function (err, docs) {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });
  })})
  .then(function(artists) {
    cb(null, artists);
  }, function (err) {
    cb(err);
  });
};

/**
 * Set image file for
 */
schema.methods.setAudio = function (file, cb) {
  var self = this;
  
  // verify mimetype
  if (!/^audio\/.*$/i.test(file.mimetype)) {
    return cb(_.assign(new Error('Wrong mimetype'), { status: 400 }));
  }
  
  // delete old file
  q.promise(function(resolve, reject) {
    if (!self.path || 0 === self.path.length) {
      resolve();
    } else {
      storage.remove(self.path, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }
  })
  // get artists
  .then(function () { return q.promise(function(resolve, reject) {
    self.getArtists(function (err, artists) {
      if (err) {
        reject(err);
      } else {
        resolve(artists);
      }
    });
  })})
  // generate album file path
  .then(function (artists) { return q.promise(function(resolve, reject) {
    var path = 'audio/' + artists.map(function (entry) { return slugify(entry.name) }).join('-and-') + '_-_' + slugify(self.name) + '.' + file.extension;
    resolve(path);
  })})
  // upload file data
  .then(function (path) { return q.promise(function(resolve, reject) {
    fs.readFile(file.path, function (err, data) {
      if (err) {
        reject(err);
      } else {
        storage.upload(path, data, function (err, meta) {
          ((null == err) ? resolve : reject)((null == err) ? meta.path : err);
        });
      }
    });
  })})
  // self.save
  .then(function (path) { return q.promise(function(resolve, reject) {
    self.path = path;
    self.save(function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  })})
  .then(function() {
    cb(null, self);
  }, function(err) {
    cb(err);
  });
};

/**
 * Rate album
 */
schema.methods.rate = function (raterId, rate, cb) {
  var self = this;
  
  var pull = _.find(self.raters, function (rater) {
    return raterId == rater.userId;
  });
  // replace existing vote
  self.raters.pull(pull);
  self.raters.push({
    userId: raterId,
    rate: rate 
  });
  self.rating = _.sum(self.raters.map(function (entry) { return entry.rate })) / self.raters.length;
  self.save(function(err) {
    if (err) {
      cb(err);
    } else {
      cb(null, self);
    }
  });
};

/**
 * Get link to media file
 */
schema.methods.getMedia = function (cb) {
  var self = this;
  q.promise(function(resolve, reject) {
    storage.media(self.path, function (err, url) {
      ((null == err) ? resolve : reject)((null == err) ? url : err);
    });
  })
  // increment listened field and save
  .then(function (url) { return q.promise(function(resolve, reject) {
    self.listened += 1;
    self.save(function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  })})
  .then(function (url) {
    cb(null, { url: url, listened: self.listened });
  }, function(err) {
    cb(err);
  });
};

// -----------------------------------------------------------------------
//                                  EXPORTS
// -----------------------------------------------------------------------
module.exports = mongoose.model('Song', schema);