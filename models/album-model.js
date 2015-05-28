var mongoose = require('mongoose');

var VoteSchema = require('./vote-schema.js');

var AlbumSchema = mongoose.Schema({
  name: { type: String, required: true },                                             //  Album name.
  year: { type: String },                                                             //  Release year.
  image: { type: String },                                                            //  URL of album thumb image.
  artist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true }],  //  Artist ID.
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],                     //  Songs.
  raters: [VoteSchema],                                                               //  Raters.
  rating: { type: Number, min: 0, max: 10, default: 0 },                              //  Rating.
  createdAt: { type:Date, default: Date.now },                                        //  Registration date.
  updatedAt: { type:Date, default: Date.now }                                         //  Last update date.
});

module.exports = mongoose.model('Album', AlbumSchema);