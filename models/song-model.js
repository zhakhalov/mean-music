var mongoose = require('mongoose');

var VoteSchema = require('./vote-schema.js');
var AlbumSchema = require('./album-schema.js');

var schema = mongoose.Schema({
  path: { type: String, required: true },                                                           //  Path to audio file at Dropbox.
  name: { type: String, required: true, trim: true },                                               //  Song name.
  duration: { type: Number, min: 0, default: 0 },                                                   //  Song duration.
  desc: { type: String },                                                                           //  About this song.
  albums: { type: [AlbumSchema], required: true, minLength: 1 },   //  Albums.
  tags: {type: [String], lowercase: true, trim: true },                                             //  Tags.
  raters: [VoteSchema],                                                                             //  Raters.
  rating: { type: Number, min: 0, max: 10, default: 0 },                                            //  Rating.
  listened: { type: Number, min: 0, default: 0 },                                                   //  How many times song was listened.
  createdBy: {                                                                                      //  Creator of song.
    name: { type: String, required: true },                                                         //  Name of user.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }                   //  UserId.
  },
  updatedBy: {                                                                                      //  User that updated Song last.
    name: { type: String, required: true },                                                         //  Name of user.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }                   //  UserId.
  },
  createdAt: { type:Date, default: Date.now },                                                      //  Creation date.
  updatedAt: { type:Date, default: Date.now }                                                       //  Last update date.
});

// -----------------------------------------------------------------------
//                                  SCHEMA.STATICS
// -----------------------------------------------------------------------

/** 
 * Find model by kabab-cased url. Example "depeche-mode" -> /depeche\s+mode/i
 * @param {String} url
 * @param {Function} fn
 */
schema.statics.findOneByURL= function (url, fn) {
  this.while( 'name', new RegExp(url.replace(/\-/g, '\\s+'), 'i')).exec(fn);
};


// -----------------------------------------------------------------------
//                                  EXPORTS
// -----------------------------------------------------------------------
module.exports = mongoose.model('Song', schema);