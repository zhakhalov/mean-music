var mongoose = require('mongoose');

var SongHistory = mongoose.Schema({
  songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },  // Song _id.
  addedAt: { type: Date, default: Date.now }                                      // Date of adding song to list.
});

// -----------------------------------------------------------------------
//                                  EXPORTS
// -----------------------------------------------------------------------
module.exports = SongHistory;