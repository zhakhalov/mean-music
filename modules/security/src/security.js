// ----- dependencies
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var hash = require('password-hash');
var _ = require('lodash');

// ----- config
var securityCfg = global.__require('./config/security-cfg');

// ----- models
var UserModel = global.__require('./models/user-model');

/**
 * Sign In user.
 * @param credentials {login: {String}, password: {String}} Login credentials.
 */
function signIn (credentials, fn) {
  UserModel.findOne({ $or: [{ username: credentials.login }, { email: credentials.login }] }, function (err, user) {
    if (err) {
      fn(err);
    } else if (!user) {
      err = new Error ('Login: [' + credentials.login + '] not found!');
      err.status = 401;
      fn(err);
    } else if (!hash.verify(credentials.password, user.password)) {
      err = new Error ('Password not valid!');
      err.status = 401;
      fn(err);
    } else {
      fn(null, {
        user: user.toObject(), 
        token: token({
          id: user.id || user._id,
          username: user.username,
          email: user.email,
          roles: user.roles
        })
      });
    }
  });
}

/**
 * Sign Up user.
 * @param user {UserModel} User to sin up.
 * @return {String} Authorization token.
 */
function signUp (user, fn) {
  UserModel.findOne({ email: user.email }, function (err, doc) {
    if (err) {
      fn(err);
    } else if (doc) {
      err = new Error ('Login alredy used!');
      err.status = 409;
      fn(err);
    } else {
      user.password = hash.generate(user.password);
      user = new UserModel(user);
      user.save(function (err, doc) {
        if (err) {
          fn(err);
        } else {
          fn(null, {
            user: user.toObject(), 
            token: module.exports.token({
              id: user.id || user._id,
              username: user.username,
              email: user.email,
              roles: user.roles
            })
          });
        }
      });
    }
  });
}

/**
 * Generate token authorization token from payload.
 * @param payload {UserModel} Token payload.
 * @return {String} Authorization token.
 */
function token (payload) {
  return jwt.sign(payload, securityCfg.secret, { expiresInMinutes: securityCfg.expiresInMinutes });
}

/**
 * Verify user in roles.
 * @param user {Object} User.
 * @params roles {String|[String]} Allowed roles.
 */
function isInRoles(user, roles) {
  roles = _.isArray(roles) ? roles : Array.prototype.slice.call(arguments, 1);
  return _.intersection(user.roles, roles).length === roles.length;
}

/**
 * User role-based autorization filter middleware.
 * @params roles {String|[String]} Allowed roles.
 */
function ensureInRole (roles) {
  return function (req, res, next) {
    if (isInRoles(req.user, roles)) {
      next();
    } else {
      var err = new Error('Role autorization failed');
      err.status = 403;
      next (err);
    }
  };
}

/**
 * Check equality req.param.id to req.user.id autorization filter middleware.
 * @params roles {String|[String]} Allowed roles.
 */
function TokenIdMiddleware (req, res, next) {
  if (req.params.id === req.user.id) {
    next();
  } else {
    var err = new Error('Trying access to another\'s id');
    err.status = 403;
    next (err);
  }
}

module.exports = {
  signIn: signIn,
  signUp: signUp,
  token: token,
  ensureAuthenticated: expressJwt({ secret: securityCfg.secret }),
  TokenIdMiddleware: TokenIdMiddleware,
  ensureInRole: ensureInRole,
};