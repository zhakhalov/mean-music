(function (ng) {
  ng.module('app')
  .factory('Artist', ['$http', '$q', 'REST_API_ROUTE', 'MediaResource', 'AuthSvc', '_',
    function Artist ($http, $q, REST_API_ROUTE, MediaResource, AuthSvc, _) {
      var url = REST_API_ROUTE + 'artists';
      var _resource = MediaResource(url,  { authorization: AuthSvc.header });  
      var $resource = function (instance) {
        var self = new _resource(instance);
        // add non-static functions here...
        
        return self;
      };
      
      
      ng.extend($resource, _resource);
      // add static functions here...
      
      /**
       * Get top rated artists
       */
      $resource.getTopRated = function (skip, limit) {
        return $q(function (resolve, reject) {
          $resource.query({ sort: '-rating', skip: skip || 0, limit: limit || 10})
          .then(function (artists) {
            resolve(artists);
          }, function (err) {
            reject(err);
          });
          $resource.$clearCache();
        });
      };
      
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
      
      return $resource;
    }])
  .service('ArtistsSvc', [ '_', '$q', '$http', 'ResourceSvc', 'Artist',
    function ArtistsSvc ( _, $q, $http, ResourceSvc, Artist) {
      var self = new ResourceSvc(Artist);
      ng.extend(self, Artist);
      // add custom service functions here...
      
      return self;
    }])
})(window.angular);