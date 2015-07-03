var mongoose = require('mongoose');
var q = require('q');
var fs = require('fs');
var _ = require('lodash');
var slugify = require('transliteration').slugify;

var storage = global.__require('modules/storage');

var VoteSchema = require('./vote-schema.js');

var schema = mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },                                                     //  Genre name.
  desc: { type: String },                                                                                               //  Description of genre.
  img: { type: String },                                                                                                //  Url to image.
  imgPath: { type: String },                                                                                            //  Path to image file at Dropbox.
  artists: { type: [mongoose.Schema.Types.ObjectId], ref: 'Artist' },                                                   //  Artists.
  albums: { type: [mongoose.Schema.Types.ObjectId], ref: 'Albums' },                                                    //  Albums.
  raters: [VoteSchema],                                                                                                 //  Raters.
  rating: { type: Number, min: 0, max: 10, default: 0 },                                                                //  Rating.
});

/**
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
  // generate image file path
  .then(function (path) { return q.promise(function(resolve, reject) {
    var path = 'img/genres/' + slugify(self.name) + '.' + file.extension;
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
module.exports = mongoose.model('Genre', schema);