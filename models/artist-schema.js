var mongoose = require('mongoose');

var schema = mongoose.Schema({
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },  // Album _id.
  name: { type:String, required: true },
});

// -----------------------------------------------------------------------
//                                  EXPORTS
// -----------------------------------------------------------------------
module.exports = schema;