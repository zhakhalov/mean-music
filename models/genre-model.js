var mongoose = require('mongoose');

var GenreSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }, //  Genre name.
  createdAt: { type:Date, default: Date.now },                      //  Creation date.
  updatedAt: { type:Date, default: Date.now }                       //  Last update date.
});

module.exports = mongoose.model('Genre', GenreSchema);