(function (ng) {
  ng.module('app')
  .factory('Artist', ['$http', '$q', 'REST_API_ROUTE', 'MediaResource', 'AuthSvc',
    function Artist ($http, $q, REST_API_ROUTE, MediaResource, AuthSvc) {
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
  .service('ArtistsSvc', [ '_', 'ResourceSvc', 'Artist',
    function ArtistsSvc ( _, ResourceSvc, Artist) {
      var self =  ResourceSvc(Artist);
      
      // add custom service functins here...
      self.exists = Artist.exists;
      
      return self;
    }])
})(window.angular);