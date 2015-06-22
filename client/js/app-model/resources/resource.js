(function (ng) {
  ng.module('app.model')
  .factory('Resource', ['$http', '$q', 'AuthSvc', 'REST_API_ROUTE', 'FormData', '_',
    function ($http, $q, AuthSvc, REST_API_ROUTE, FormData, _) {
      
      return function (url) {
        /**
         * @constructor
         * Create instance of Resource from instance data.
         * @param {Object} instance
         */
        var Resource = function (instance) {
          var self = this;
          ng.extend(self, instance || {});
          
          /**
           * @function
           * Get instance from server by id
           * @return {Promise}
           */
          self.$get = function () {
            return $q.promise(function (resolve, reject) {
              $http.get(url + '/' + self._id)
              .success(function(data) {
                ng.extend(self, data);
                resolve(self);
              })
              .error(function(data, status) {
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
              
              $http.post(url, self.$$getData(), {
                headers: { 
                  Authorization: AuthSvc.header(),
                  'Content-Type': undefined
                },
                transformRequest: ng.identity
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
          
          /**
           * @function
           * Update instance at server by PUT method. Update all fields of instance with responce.
           * @return {Promise}
           */
          self.$update = function () {
            return $q(function(resolve, reject) {
              
              $http.put(url + '/' + self._id, self.$$getData(),
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
          
          /**
           * Remove all service functions and fields.
           */
          self.$$getData = function () {
            var omit = _.chain(self)
              .keys()
              .filter(function (entry) {
                return '$' === entry[0];
              }).value();
              var data = _.omit(self, omit);
              return FormData(data);
          };
        };
        
        /**
         * @function
         * Gets array of song instances.
         * @return {Promise}
         */
        Resource.query = function (query) {
          return $q(function(resolve, reject) {
            query = query = {};
            $http.get(url + '?' + ng.element.param(query))
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
         * Gets song instance by id.
         * @params {String} id. Song _id.
         * @return {Promise}
         */
        Resource.get = function (id) {
          return $q(function(resolve, reject) {
            $http.get(url + '/' + id)
            .success(function(data) {
              resolve(new Resource(ng.extend(data, { $resoved: true })));
            })
            .error(function(data, status) {
              reject(data);  
            });
          });
        };
        
        return Resource;
      };
    }])
  .factory('MediaResource', ['Resource', 'AuthSvc', '$http', '$q',
    function MediaResource (Resource, AuthSvc, $http, $q) {
      return function (url) {
        var Res = Resource(url);  
        var resource = function (instance) {
          var self = new Res(instance);
          
          /**
           * @function
           * Rate song.
           * @param {Number} rate Rating.
           * @return {Promise}
           */
          self.$rate = function (rate) {
            return $q(function (resolve, reject) {
              $http.post(url + '/' + self._id + '/rate/' + rate, {}, {
                headers: { Authorization: AuthSvc.header() }
              })
              .success(function (data) {
                self.rating = data.rating;
                resolve(self);
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
      };
    }])
})(window.angular);