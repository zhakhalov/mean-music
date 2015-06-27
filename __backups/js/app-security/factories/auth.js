(function (ng) {
  ng.module('app.security')
  .factory('Auth', ['REST_API_ROUTE', '$q', '$http',
    function (REST_API_ROUTE, $q, $http) {
      return function () {
        var self = this;
        
        /**
         * @function
         * Sing in user
         * @param login {String} user's login
         * @param password {String} user's password
         * @param success {Function} success callback
         * @param error {Function} error callback
         * @return {Promise}
         */
        self.signIn = function (login, password) {
          return $q(function (resolve, reject) {
            $http.post(REST_API_ROUTE + 'auth/signin', { login: login, password: password })
            .success(function (res) {
              resolve(res);
            })
            .error(function (res) {
              reject(res);
            });
          });
        };
        
        /**
         * @function
         * Register user
         * @param user {{ username: String, password: String, email: String }} user
         * @param success {Function} success callback
         * @param error {Function} error callback
         * @return {Promise}
         */
        self.signUp = function (user) {
          return $q(function (resolve, reject) {
            $http.post(REST_API_ROUTE + 'auth/signup', user)
            .success(function (res) {
              resolve(res);
            })
            .error(function (res) {
              reject(res);
            });
          });
        };
      };
    }]);
})(window.angular);