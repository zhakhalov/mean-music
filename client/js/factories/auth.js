(function (ng) {
  ng.module('app')
  .factory('Auth', ['REST_API_ROUTE', '$q', '$http',
    function (REST_API_ROUTE, $q, $http) {
      return function () {
        var self = this;
        /**
         * Sing in user
         * @param login {String} user's login
         * @param password {String} user's password
         * @param success {Function} success callback
         * @param error {Function} error callback
         * @return {Promise}
         */
        self.signIn = function (login, password, success, error) {
          return $q(function (resolve, reject) {
            $http.post(REST_API_ROUTE + 'auth/signin', { login: login, password: password })
            .success(function (res) {
              if (typeof success === 'function') {
                success(res);
              }
              resolve(res);
            })
            .error(function (res) {
              reject(res);
              if (typeof error === 'function') {
                error(res);
              }
            });
          });
        };
        /**
         * Register user
         * @param user {{ username: String, password: String, email: String }} user
         * @param success {Function} success callback
         * @param error {Function} error callback
         * @return {Promise}
         */
        self.signUp = function (user, success, error) {
          return $q(function (resolve, reject) {
            $http.post(REST_API_ROUTE + 'auth/signup', user)
            .success(function (res) {
              if (typeof success === 'function') {
                success(res);
              }
              resolve(res);
            })
            .error(function (res) {
              if (typeof error === 'function') {
                error(res);
              }
              reject(res);
            });
          });
        };
      };
    }]);
})(window.angular);