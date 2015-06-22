(function (ng) {
  ng.module('app.model')
  .factory('Genre', ['$http', '$q', 'REST_API_ROUTE', 'MediaResource', 
    function Genre ($http, $q, REST_API_ROUTE, MediaResource) {
      var url = REST_API_ROUTE + 'genres';
      var Res = MediaResource(url);  
      var resource = function (instance) {
        var self = new Res(instance);
        
        return self;
      };
      
      // add static functions;
      ng.extend(resource, Res);
      
      return resource;
    }])
  .factory('Artist', ['$http', '$q', 'REST_API_ROUTE', 'MediaResource', 
    function Artist ($http, $q, REST_API_ROUTE, MediaResource) {
      var url = REST_API_ROUTE + 'artists';
      var Res = MediaResource(url);  
      var resource = function (instance) {
        var self = new Res(instance);
        
        return self;
      };
      
      // add static functions;
      ng.extend(resource, Res);
      
      return resource;
    }])
  .factory('Album', ['$http', '$q', 'REST_API_ROUTE', 'MediaResource', 
    function Album ($http, $q, REST_API_ROUTE, MediaResource) {
      var url = REST_API_ROUTE + 'albums';
      var Res = MediaResource(url);  
      var resource = function (instance) {
        var self = new Res(instance);
        
        return self;
      };
      
      // add static functions;
      ng.extend(resource, Res);
      
      return resource;
    }])
  .factory('Song', ['$http', '$q',  'REST_API_ROUTE', 'MediaResource',
    function Song ($http, $q, REST_API_ROUTE, MediaResource) {
      var url = REST_API_ROUTE + 'songs';
      var Res = MediaResource(url);  
      var resource = function (instance) {
        var self = new Res(instance);
        
        /**
         * @function
         * Get link to audio stream and update listened field.
         * @return {Promise}
         */
        self.$media = function () {
          return $q(function (resolve, reject) {
            $http.get(url + '/' + self._id + '/media')
            .success(function (data) {
              ng.extend(self, data);
              resolve(self.url);
            })
            .error(function (data, status) {
              reject(data);
            });
          });
        };
        
        return self;
      };
      
      // add static functions;
      ng.extend(resource, Res);
      
      return resource;
    }])
  .factory('User', ['$http', '$q',  'REST_API_ROUTE', 'Resource', 'AuthSvc', 
    function User ($http, $q, REST_API_ROUTE, Resource, AuthSvc) {
      var url = REST_API_ROUTE + 'users';
      var Res = Resource(url);  
      var resource = function (instance) {
        var self = new Res(instance);
        
        /**
         * @function
         * Update instance at server by PUT method. Update all fields of instance with responce.
         * @return {Promise}
         */
        self.$update = function () {
          return $q(function(resolve, reject) {
            if (!self.$me) {
              return reject(new Error('Cannot update another user'));
            }
            $http.put(REST_API_ROUTE + 'users/me' + self._id, self.$$getData(),
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
      
      // add static functions;
      ng.extend(resource, Res);
      
      /**
       * @function
       * Gets information about current user.
       * @return {Promise}
       */
      resource.getMe = function () {
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
      
      return resource;
    }]);
})(window.angular);