var mongoose = require('mongoose');

var VoteSchema = mongoose.Schema({
  voter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Voter ID.
  rate: { type: Number, required: true, min: 0, max: 10 },                      // Rate value.
  votedAt: { type: Date, default: Date.now }                                    // Vote date.       
});

module.exports = VoteSchema;