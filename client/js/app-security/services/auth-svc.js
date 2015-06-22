(function (ng) {
  ng.module('app.security')
  .service('AuthSvc', [ 'REST_API_ROUTE', 'TOKEN_STORAGE', 'AUTH_SCHEMA', 'Auth', '$q', '$window', '$http',
    function (REST_API_ROUTE, TOKEN_STORAGE, AUTH_SCHEMA, Auth, $q, $window, $http) {
      var _auth = new Auth();
      var _token = null;
      var self = this;

      try {
        _token = JSON.parse($window.localStorage)[TOKEN_STORAGE];
      } catch (err) {

      }

      self.refreshToken = function() {
        return $q(function (resolve, reject) {
          $http.get(REST_API_ROUTE + 'auth/refresh', {}, { headers: { Authorization: self.header() } })
          .success(function (res) {
            _token = $window.localStorage = res.token;
            resolve(true);
          })
          .error(function (res) {
            self.signOut();
            reject(res);
          });
        });
      };
      
      /**
       * @kind function
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
            resolve(res);
          }, function (err) {
            reject(err);
          });
        });
      };
      /**
       * Register user
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
       * Check is user authenticated
       * @returns {Boolean} Is user authenticated
       */
      self.isAuthenticated = function () {
        return null != _token;
      };
      /**
       * Gets/sets authorization token
       * @param token {String} Authorization token
       * @returns {String} Authorization token
       */
      self.token = function (token) {
        if ('undefined' !== typeof token) {
          _token = token;
          try {
            var storage = JSON.parse($window.localStorage);
            storage[TOKEN_STORAGE] = token;
            $window.localStorage = JSON.stringify(storage);
          } catch (err) {
            storage = { };
            storage[TOKEN_STORAGE] = token;
            $window.localStorage = JSON.stringify(storage);
          }
        }
        return _token;
      };
      /**
       * Gets authorization header 'Brear <token>'
       * @returns {String} Authorization header
       */
      self.header = function () {
        return AUTH_SCHEMA + ' ' + _token;
      };
    }]);
})(window.angular);