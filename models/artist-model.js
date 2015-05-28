var mongoose = require('mongoose');

var VoteSchema = require('./vote-schema.js');

var ArtistSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },               //  Name of artist.
  image: { type: String },                                            //  URL of image on artist's page.
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],   //  Albums.
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],     //  Artist's albums.
  raters: [VoteSchema],                                               //  Raters.
  rating: { type: Number, min: 0, max: 10, default: 0 },              //  Rating.
  createdAt: { type:Date, default: Date.now },                        //  Creation date.
  updatedAt: { type:Date, default: Date.now }                         //  Last update date.
});

module.exports = mongoose.model('Artist', ArtistSchema);