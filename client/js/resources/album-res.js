(function (ng) {
  ng.module('app')
  .factory('Album', ['$http', '$q', 'AuthSvc', 'REST_API_ROUTE',
    function Album ($http, $q, AuthSvc, REST_API_ROUTE) {
      
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
         * Rate album.
         * @param {Number} rate Rating.
         * @return {Promise}
         */
        self.$rate = function (rate) {
          return $q(function (resolve, reject) {
            $http.post(REST_API_ROUTE + 'albums/' + self._id + '/rate/' + rate, {}, {
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
        
        /**
         * @function
         * Update instance at server by PUT method. Update all fields of instance with responce.
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
            
            $http.put(REST_API_ROUTE + 'albums/' + self._id, data, {
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
            
            $http.post(REST_API_ROUTE + 'albums', data, {
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
       * Gets array of album instances.
       * @return {Promise}
       */
      Resource.query = function (query) {
        return $q(function(resolve, reject) {
          query = query = {};
          $http.get(REST_API_ROUTE + 'albums?' + ng.element.param(query))
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
       * Gets album instance by id.
       * @params {String} id. Album _id.
       * @return {Promise}
       */
      Resource.get = function (id) {
        return $q(function(resolve, reject) {
          $http.get(REST_API_ROUTE + 'albums/' + id)
          .success(function(data) {
            resolve(new Resource(ng.extend(data, { $resoved: true })));
          })
          .error(function(data, status) {
            reject(data);  
          });
        });
      };
      
      return Resource;
    }]);
})(window.angular);