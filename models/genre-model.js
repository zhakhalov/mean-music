var mongoose = require('mongoose');

var VoteSchema = require('./vote-schema.js');

var schema = mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, lowercase: true },  //  Genre name.
  desc: { type: String },                                                             //  Description of genre.
  img: { type: String },                                                              //  Url to image.
  imgPath: { type: String },                                                          //  Path to image file at Dropbox.
  raters: [VoteSchema],                                                               //  Raters.
  rating: { type: Number, min: 0, max: 10, default: 0 },                              //  Rating.
  createdBy: {                                                                        //  User which created Genre.
    name: { type: String, required: true },                                           //  Name of user.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }     //  UserId.
  },
  updatedBy: {                                                                        //  User which updated Genre last.
    name: { type: String, required: true },                                           //  Name of user.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }     //  UserId.
  },
  createdAt: { type:Date, default: Date.now },                                        //  Creation date.
  updatedAt: { type:Date, default: Date.now }                                         //  Last update date.
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
module.exports = mongoose.model('Genre', schema);