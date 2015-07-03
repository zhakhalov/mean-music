var mongoose = require('mongoose');
var q = require('q');
var fs = require('fs');
var _ = require('lodash');
var slugify = require('transliteration').slugify;

var logger = global.__require('modules/logger');
var storage = global.__require('modules/storage');

var GenreModel = require('./genre-model.js');
var VoteSchema = require('./vote-schema.js');

var schema = mongoose.Schema({
  name: { type: String, required: true, unique: true },                                                                 //  Name of the artist.
  img: { type: String },                                                                                                //  URL of an image on artist's page.
  imgPath: { type: String },                                                                                            //  Path to image file at Dropbox.
  albums: { type: [mongoose.Schema.Types.ObjectId], ref: 'Album' },                                                     //  Albums.
  songs: { type: [mongoose.Schema.Types.ObjectId], ref: 'Song' },                                                       //  Songs.
  raters: [VoteSchema],                                                                                                 //  Raters.
  rating: { type: Number, min: 0, max: 10, default: 0 },                                                                //  Rating.
  listened: { type: Number, min: 0, default: 0 },                                                                       //  How many times song was listened.
});

schema.post('remove', function (doc) {
  
});

/**
 * @function
 * Set genres for artist.
 * @param {[ObjectId]} genres
 * @param {function (err)} cb Callback function.
 */
schema.methods.setGenres = function (genres, cb) {
  var self = this;
  q.all([
    q.promise(function(resolve, reject) {
      GenreModel.update(
        { _id: { $nin: genres }, artists: self._id },
        { $pull: { artists: self._id }},
        { multi: true })
      .exec(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }),
    q.promise(function(resolve, reject) {
      GenreModel.update(
        { _id: { $in: genres }, artists: { $ne: self._id } },
        { $push: { artists: self._id }},
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

schema.methods.getGenres = function (cb) {
  var self = this;
  GenreModel.find({ artists: self._id })
  .lean()
  .sort('name')
  .exec(function (err, docs) {
    if (err) {
      cb(err);
    } else {
      cb(null, docs);
    }
  });
};

schema.methods.getAlbums = function (skip, take, cb) {
  var self = this;
};

/**
 * @function
 * Set image file for
 */
schema.methods.setImage = function (file, cb) {
  var self = this;
  
  // verify mimetype
  if (!/^image\/.*$/i.test(file.mimetype)) {
    return cb(_.assign(new Error('Wrong mimetype'), { status: 400 }));
  }
  
  // delete old image
  q.promise(function(resolve, reject) {
    if (!self.imgPath || 0 === self.imgPath.length) {
      resolve();
    } else {
      storage.remove(self.imgPath, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }
  })
  // generate album file path
  .then(function (path) { return q.promise(function(resolve, reject) {
    var path = 'img/artists/' + slugify(self.name) + '.' + file.extension;
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
  // get url to file
  .then(function (path) { return q.promise(function(resolve, reject) {
    storage.url(path, function (err, url) {
      if (err) {
        reject(err);
      } else {
        // replace queryarg to get direct link
        resolve({ path: path, url: url.replace(/dl=0$/, 'raw=1') });
      }
    });
  })})
  // self.save
  .then(function (result) { return q.promise(function(resolve, reject) {
    self.imgPath = result.path;
    self.img = result.url;
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
 * @function
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

// -----------------------------------------------------------------------
//                                  EXPORTS
// -----------------------------------------------------------------------
module.exports = mongoose.model('Artist', schema);