var mongoose = require('mongoose');

var VoteSchema = require('./vote-schema.js');

var SongSchema = mongoose.Schema({
  path: { type: String, required: true },                                         //  Path to audio file at Dropbox.
  name: { type: String, required: true, trim: true },                             //  Song name.
  duration: { type: Number, min: 0, default: 0 },                                 //  Song duration.
  img: { type: String },                                                          //  url to image.
  desc: { type: String },                                                         //  About this song.
  artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],             //  Artists.
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],               //  Albums.
  genres: [{type: String, lowercase: true, trim: true }],                         //  Genres.
  tags: [{type: String, trim: true }],                                            //  Tags.
  raters: [VoteSchema],                                                           //  Raters.
  rating: { type: Number, min: 0, max: 10, default: 0 },                          //  Rating.
  listened: { type: Number, min: 0, default: 0 },                                 //  How many times song was listened.
  createdBy: {                                                                    //  Creator of song.
    name: { type: String, required: true },                                       //  Name of user.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } //  UserId.
  },
  updatedBy: {                                                                    //  User that updated Song last.
    name: { type: String, required: true },                                       //  Name of user.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } //  UserId.
  },
  createdAt: { type:Date, default: Date.now },                                    //  Creation date.
  updatedAt: { type:Date, default: Date.now }                                     //  Last update date.
});

// -----------------------------------------------------------------------
//                                  EXPORTS
// -----------------------------------------------------------------------
module.exports = mongoose.model('Song', SongSchema);