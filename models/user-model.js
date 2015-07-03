var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: { type:String },                        //  Displayed name for users registered via sign up.
  email: { type:String },                       //  User's email for users registered via sign up.
  password: { type:String },                    //  Hashsed password for users registered via sign up.
  avatar: { type:String },                      //  User's avatar filename.
  about: { type:String },                       //  Short information about user.
  roles: { type:Array, default: ['user'] },     //  Autorization roles
});

// -----------------------------------------------------------------------
//                                  EXPORTS
// -----------------------------------------------------------------------
module.exports = mongoose.model('User', UserSchema);