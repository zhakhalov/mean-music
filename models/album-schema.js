var mongoose = require('mongoose');

var schema = mongoose.Schema({
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },  // Album _id.
  name: { type:String, required: true },
});

// -----------------------------------------------------------------------
//                                  EXPORTS
// -----------------------------------------------------------------------
module.exports = schema;