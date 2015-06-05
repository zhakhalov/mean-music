var mongoose = require('mongoose');

var VoteSchema = require('./vote-schema.js');

var SongSchema = mongoose.Schema({
  fileId: { type: String, required: true },                                       //  Id of file in storage
  name: { type: String, required: true, trim: true },                             //  Song name.
  duration: { type: Number },                                                     //  Song duration.
  img: { type: String },                                                          //  URL of album thumb image.
  desc: { type: String },                                                         //  About song.
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

SongSchema.pre('save', function (next) {
  
});

module.exports = mongoose.model('Song', SongSchema);