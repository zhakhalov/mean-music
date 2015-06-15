var mongoose = require('mongoose');

var VoteSchema = require('./vote-schema.js');

var ArtistSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },                           //  Name of the artist.
  img: { type: String },                                                          //  URL of an image on artist's page.
  desc: { type: String },                                                         //  About artist.
  genres: [{type: String, trim: true }],                                          //  Genres.
  tags: [{type: String, trim: true }],                                            //  Tags.
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
//                                  EXPORTS
// -----------------------------------------------------------------------
module.exports = mongoose.model('Artist', ArtistSchema);