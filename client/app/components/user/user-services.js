(function (ng) {
  ng.module('app')
  .factory('User', ['$http', '$q', 'REST_API_ROUTE', 'Resource', 'AuthSvc',
    function User ($http, $q, REST_API_ROUTE, Resource, AuthSvc) {
      var url = REST_API_ROUTE + 'users';
      var _resource = Resource(url, { authorization: AuthSvc.header });  
      var $resource = function (instance) {
        var self = new _resource(instance);
        // non-static functions here...
        
        /**
         * @function
         * Update instance at server by PUT method. Update all fields of instance with responce.
         * @return {Promise}
         */
        self.$update = function () {
          return self.$$promise(function(resolve, reject) {
            if (!self.$me) {
              return reject(new Error('Cannot update another user'));
            }
            $http.put(REST_API_ROUTE + 'users/me', self.$$getData(),
            {
              headers: { 
                Authorization: AuthSvc.header(),
                'Content-Type': undefined
              },
              transformRequest: ng.identity
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
        
        return self;
      };
      
      
      ng.extend($resource, _resource);
      // static functions here...
      
      /**
       * @function
       * Checks availability of creating artist with name
       * @param {String} name Name for check.
       * @return {Promise}
       */
      $resource.exists = function (name) {
        return $q(function (resolve, reject) {
          $http.get(url + '/exists', {
            params: {
              name: name
            }
          })
          .success(function (data) {
            resolve(data);
          })
          .error(function (err) {
            reject(err);
          });
        });
      };
      
      /**
       * @function
       * Gets information about current user.
       * @return {Promise}
       */
      $resource.getMe = function () {
        return $q(function(resolve, reject) {
          $http.get(REST_API_ROUTE + 'users/me', {
            headers: { Authorization: AuthSvc.header() }
          })
          .success(function(data) {
            resolve(new $resource(ng.extend(data, { $resoved: true, $me: true })));
          })
          .error(function(data, status) {
            reject(data);  
          });
        });
      };
      
      return $resource;
    }])
  .service('UsersSvc', [ '_', 'ResourceSvc', 'User',
    function UsersSvc ( _, ResourceSvc, User) {
      var self = new ResourceSvc(User);
      
      self.exists = User.exists;
      
      return self;
    }])
})(window.angular);