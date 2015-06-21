var mongoose = require('mongoose');
var _ = require('lodash');

var VoteSchema = require('./vote-schema.js');
var ArtistSchema = require('./artist-schema.js');
var GenreModel = require('./genre-schema.js');

var schema = mongoose.Schema({
  name: { type: String, required: true },                                                                               //  Album name.
  release: { type: Date },                                                                                              //  Release date.
  img: { type: String },                                                                                                //  URL of album thumb image.
  imgPath: { type: String },                                                                                            //  Path to image file at Dropbox.
  desc: { type: String },                                                                                               //  About album.
  artists: { type: [ArtistSchema], required: true, minLength: 1},                                                       //  Artists.
  genres: [GenreModel],                                                                                                 //  Genres.
  tags: [{type: String, lowercase: true, trim: true }],                                                                 //  Tags.
  raters: [VoteSchema],                                                                                                 //  Raters.
  rating: { type: Number, min: 0, max: 10, default: 0 },                                                                //  Rating.
  createdBy: {                                                                                                          //  User that created Album.
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  updatedBy: {                                                                                                          //  User that updated Album last.
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  createdAt: { type:Date, default: Date.now },                                                                          //  Creation date.
  updatedAt: { type:Date, default: Date.now }                                                                           //  Last update date.
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
module.exports = mongoose.model('Album', schema);