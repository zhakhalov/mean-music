var mongoose = require('mongoose');

var VoteSchema = require('./vote-schema.js');

var SongSchema = mongoose.Schema({
  fileId: { type: String, required: true },                             //  Id of file in storage
  name: { type: String, required: true, trim: true },                   //  Song name.
  duration: { type: Number },                                           //  Song duration.
  artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],   //  Artist ID/artists
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],     //  Album ID/albums.
  raters: [VoteSchema],                                                 //  Raters.
  rating: { type: Number, min: 0, max: 10, default: 0 },                //  Rating.
  createdAt: { type:Date, default: Date.now },                          //  Creation date.
  updatedAt: { type:Date, default: Date.now }                           //  Last update date.
});

SongSchema.pre('save', function (next) {
  
});

module.exports = mongoose.model('Song', SongSchema);