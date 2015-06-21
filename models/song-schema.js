var mongoose = require('mongoose');

var schema = mongoose.Schema({
  songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },  // Song _id.
  name: { type:String, required: true },
  duration: { type:String, required: true },
});

// -----------------------------------------------------------------------
//                                  EXPORTS
// -----------------------------------------------------------------------
module.exports = schema;