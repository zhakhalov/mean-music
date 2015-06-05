var mongoose = require('mongoose');

var VoteSchema = require('./vote-schema.js');

var AlbumSchema = mongoose.Schema({
  name: { type: String, required: true },                                         //  Album name.
  year: { type: String },                                                         //  Release year.
  img: { type: String },                                                          //  URL of album thumb image.
  desc: { type: String },                                                         //  About album.
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],                 //  Songs.
  genres: [{type: String, lowercase: true, trim: true }],                         //  Genres.
  tags: [{type: String, trim: true }],                                            //  Tags.
  raters: [VoteSchema],                                                           //  Raters.
  rating: { type: Number, min: 0, max: 10, default: 0 },                          //  Rating.
  createdBy: {                                                                    //  User that created Song.
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  updatedBy: {                                                                    //  User that updated Song last.
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  createdAt: { type:Date, default: Date.now },                                    //  Creation date.
  updatedAt: { type:Date, default: Date.now }                                     //  Last update date.
});

module.exports = mongoose.model('Album', AlbumSchema);