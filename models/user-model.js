var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: { type:String },                        //  Displayed name for users registered via sign up.
  email: { type:String },                       //  User's email for users registered via sign up.
  password: { type:String },                    //  Hashsed password for users registered via sign up.
  avatar: { type:String },                      //  User's avatar filename.
  about: { type:String },                       //  Short information about user.
  roles: { type:Array, default: ['user'] },     //  Autorization roles
  googleId: { type:String },                    //  Google OAuth profile.id
  facebookId: { type:String },                  //  Facebook Oauth profile.id
  createdAt: { type:Date, default: Date.now },  //  Registration date.
  updatedAt: { type:Date, default: Date.now }   //  Last update date.
});

// -----------------------------------------------------------------------
//                                  EXPORTS
// -----------------------------------------------------------------------
module.exports = mongoose.model('User', UserSchema);