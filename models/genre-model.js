var mongoose = require('mongoose');

var VoteSchema = require('./vote-schema.js');

var GenreSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },               //  Genre name.
  img: { type: String },                                                          //  Path to image file at Dropbox.
  raters: [VoteSchema],                                                           //  Raters.
  rating: { type: Number, min: 0, max: 10, default: 0 },                          //  Rating.
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

module.exports = mongoose.model('Genre', GenreSchema);