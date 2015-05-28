(function (ng) {
  ng.module('app')
  .service('UsersSvc', [ 'REST_API_ROUTE', '$http', '$resource', '$q', 'AuthSvc',
    function (REST_API_ROUTE, $http, $resource, $q, AuthSvc) {
      var _users = {};
      var _userId;
      var self = this;
      /**
       * Gets user by [_id].
       * @param id{String} User _id.
       * @return {Promise}
       */
      self.getUser = function (id) {
        return $q(function (resolve, reject) {
          if (id in _users) {
            resolve(_users[id]);
          } else {
            var User = $resource(REST_API_ROUTE + 'users/:id');
            User.get({ id: id })
            .$promise.then(function (user) {
              _users[id] = user;
              resolve(user);
            }, function (err) {
              reject(err);
            });
          }
        });
      };
      /**
       * Gets user's profile.
       * @return {Promise}
       */
      self.getMe = function () {
        return $q(function (resolve, reject) {
          if (_userId in _users) {
            resolve(_users[_userId]);
          } else {
            var User = $resource(REST_API_ROUTE + 'users/me',
            {},
            {
              get: { method: 'GET', headers: { Authorization: AuthSvc.header } },
              update: { method: 'PUT', headers: { Authorization: AuthSvc.header } },
            });
            User.get()
            .$promise.then(function (user) {
              _users[_userId] = user;
              resolve(user);
            }, function (err) {
              reject(err);
            });
          }
        });
      };
      /**
       * Validates unique email async.
       * @param login {String} User's username or email.
       * @return {Promise}
       */
      self.checkLogin = function (login) {
        return $q(function (resolve, reject) {
          $http.get(REST_API_ROUTE + 'users/exists?login=' + login)
          .success(function (data) {
            resolve(data);
          })
          .error(function (err) {
            reject(err);
          });
        });
      };
      /**
       * Gets/Sets current user.
       * @param user current user.
       * @return {Object} Current user.
       */
      self.user = function (user) {
        if ('undefined' === typeof user) { return _users[_userId]; }
        _userId = user._id;
        _users[_userId] = user;
      };
    }]);
})(window.angular);