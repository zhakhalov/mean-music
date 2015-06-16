var mongoose = require('mongoose');

var TagSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, lowercase: true },  //  Tag name.
  createdBy: {                                                                        //  User which created Genre.
    name: { type: String, required: true },                                           //  Name of user.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }     //  UserId.
  },
  createdAt: { type:Date, default: Date.now },                                        //  Creation date.
});

// -----------------------------------------------------------------------
//                                  EXPORTS
// -----------------------------------------------------------------------
module.exports = mongoose.model('Tag', TagSchema);