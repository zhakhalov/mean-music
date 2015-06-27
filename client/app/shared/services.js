(function (ng, _) {
  ng.module('app')
  .service('_', [
    function lodash () {
      var self = _.noConflict();
      // custom lodash mixins goes here ...
      
      return self;
    }])
  .service('AuthSvc', [ 'REST_API_ROUTE', 'Auth', '$q', '$window', '$http',
    function AuthSvc (REST_API_ROUTE, Auth, $q, $window, $http) {
      
      var AUTH_SCHEMA = 'Bearer ';
      var TOKEN_STORAGE = '__auth_token__';
      
      var _auth = new Auth();
      var _token = null;
      var self = this;

      _token = $window.localStorage.getItem(TOKEN_STORAGE);

      /**
       * @function
       * Refresh access token from server.
       * @return {Promise}
       */
      self.refreshToken = function() {
        return $q(function (resolve, reject) {
          $http.get(REST_API_ROUTE + 'auth/refresh', {}, { headers: { Authorization: self.header() } })
          .success(function (res) {
            _token = res.token;
            $window.localStorage.setItem(TOKEN_STORAGE, _token);
            resolve(true);
          })
          .error(function (res) {
            self.signOut();
            reject(res);
          });
        });
      };
      
      /**
       * @function
       * Sing in user
       * @param {String} login user's login
       * @param {String} password user's password
       * @return {Promise}
       */
      self.signIn = function (login, password) {
        return $q(function (resolve, reject) {
          _auth.signIn(login, password)
          .then( function (res) {
            _token = res.token;
            $window.localStorage.setItem(TOKEN_STORAGE, _token);
            resolve(res);
          }, function (err) {
            reject(err);
          });
        });
      };
      
      /**
       * @function
       * Register new user
       * @param {Object} user Registered user
       * @param {String} user.name  Name
       * @param {String} user.email Email
       * @param {String} user.password Password
       * @return {Promise}
       */
      self.signUp = function (user) {
        return $q(function (resolve, reject) {
          _auth.signUp(user)
          .then(function (res) {
            _token = res.token;
            resolve(res);
          }, function (err) {
            reject(err);
          });
        });
      };
      
      /**
       * @function
       * Sign out user
       */
      self.signOut = function () {
        _token = null;
        try {
          var storage = JSON.parse($window.localStorage);
          delete storage[TOKEN_STORAGE];
          $window.localStorage = JSON.stringify(storage);
        } catch (err) {

        }
      };
      
      /**
       * @function
       * Check is user authenticated
       * @returns {Boolean} Is user authenticated
       */
      self.isAuthenticated = function () {
        return null != _token;
      };
      
      /**
       * @function
       * Gets/sets authorization token
       * @param token {String} Authorization token
       * @returns {String} Authorization token
       */
      self.token = function (token) {
        if (ng.isUndefined(token)) {
          _token = token;
          $window.localStorage.setItem(TOKEN_STORAGE, _token);
        }
        return _token;
      };
      
      /**
       * @function
       * Gets authorization header 'Brear <token>'
       * @returns {String} Authorization header
       */
      self.header = function () {
        return AUTH_SCHEMA + _token;
      };
    }])
})(window.angular, window._)