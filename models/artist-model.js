var mongoose = require('mongoose');

var VoteSchema = require('./vote-schema.js');
var GenreSchema = require('./genre-schema.js');

var schema = mongoose.Schema({
  name: { type: String, required: true, unique: true },                           //  Name of the artist.
  img: { type: String },                                                          //  URL of an image on artist's page.
  imgPath: { type: String },                                                      //  Path to image file at Dropbox.
  desc: { type: String },                                                         //  About artist.
  genres: {type: [GenreSchema], trim: true, lowercase: true },                    //  Genres.
  tags: [{type: String, trim: true, lowercase: true }],                           //  Tags.
  raters: [VoteSchema],                                                           //  Raters.
  rating: { type: Number, min: 0, max: 10, default: 0 },                          //  Rating.
  createdBy: {                                                                    //  User that created Artist.
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  updatedBy: {                                                                    //  User that updated Artist last.
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  createdAt: { type:Date, default: Date.now },                                    //  Creation date.
  updatedAt: { type:Date, default: Date.now }                                     //  Last update date.
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
module.exports = mongoose.model('Artist', schema);