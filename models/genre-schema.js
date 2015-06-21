var mongoose = require('mongoose');


var schema = mongoose.Schema({
  genreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true },  // Album _id.
  name: { type:String, required: true }
});

// -----------------------------------------------------------------------
//                                  EXPORTS
// -----------------------------------------------------------------------
module.exports = schema;