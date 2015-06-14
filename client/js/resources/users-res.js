(function (ng) {
  ng.module('app')
  .factory('User', ['$http', '$q', 'AuthSvc', 'REST_API_ROUTE',
    function User ($http, $q, AuthSvc, REST_API_ROUTE) {
      /**
       * @constructor
       * Create instance of Resource from instance data.
       * @param
       */
      var Resource = function (instance) {
        var self = this;
        ng.extend(self, instance || {});
        
        /**
         * @function
         * Update instance of current user at server by PUT method. Update all fields of instance with responce.
         * @return {Promise}
         */
        self.$update = function () {
          return $q(function(resolve, reject) {
            var data = ng.extend({}, self);
            
            delete data.$rate;
            delete data.$media,
            delete data.$updade;
            delete data.$save;
            delete data.$resolved;
            delete data.$me;
            
            $http.put(REST_API_ROUTE + 'users/me' + self._id, data, {
              headers: { Authorization: AuthSvc.header() }
            })
            .success(function (data) {
              ng.extend(self, data);
              resolve(self);
            })
            .error(function (data) {
              reject(data);
            });
          });
        };
        
        /**
         * @function
         * Save instance at server by POST method.
         * @return {Promise}
         */
        self.$save = function () {
          return $q(function(resolve, reject) {
            var data = ng.extend({}, self);
            
            delete data.$rate;
            delete data.$media,
            delete data.$updade;
            delete data.$save;
            delete data.$resolved;
            delete data.$me;
            
            $http.post(REST_API_ROUTE + 'users', data, {
              headers: { Authorization: AuthSvc.header() }
            })
            .success(function (data) {
              ng.extend(self, data);
              self.$resolved = true;
              resolve(self);
            })
            .error(function (data) {
              reject(data);
            });
          });
        };
      };
      
      /**
       * @function
       * Gets array of user instances.
       * @return {Promise}
       */
      Resource.query = function (query) {
        return $q(function(resolve, reject) {
          query = query = {};
          $http.get(REST_API_ROUTE + 'users?' + ng.element.param(query))
          .success(function(data) {
            ng.forEach(data, function (entry, idx) {
              data[idx] = new Resource(ng.extend(entry, { $resoved: true }));
            });
            resolve(data);
          })
          .error(function(data, status) {
            reject(data);  
          });
        });
      };
      
      /**
       * @function
       * Gets user instance by id.
       * @params {String} id. User _id.
       * @return {Promise}
       */
      Resource.get = function (id) {
        return $q(function(resolve, reject) {
          $http.get(REST_API_ROUTE + 'users/' + id)
          .success(function(data) {
            resolve(new Resource(ng.extend(data, { $resoved: true })));
          })
          .error(function(data, status) {
            reject(data);  
          });
        });
      };
      
      /**
       * @function
       * Gets information about current user.
       * @return {Promise}
       */
      Resource.getMe = function () {
        return $q(function(resolve, reject) {
          $http.get(REST_API_ROUTE + 'users/me', {
            headers: { Authorization: AuthSvc.header() }
          })
          .success(function(data) {
            resolve(new Resource(ng.extend(data, { $resoved: true, $me: true })));
          })
          .error(function(data, status) {
            reject(data);  
          });
        });
      };
      
      return Resource;
    }]);
})(window.angular);