(function (ng) {
  ng.module('app')
  .factory('Album', ['$http', '$q', 'REST_API_ROUTE', 'MediaResource', 'AuthSvc',
    function Album ($http, $q, REST_API_ROUTE, MediaResource, AuthSvc) {
      var url = REST_API_ROUTE + 'albums';
      var _resource = MediaResource(url, AuthSvc.header);  
      var $resource = function (instance) {
        var self = new _resource(instance);
        // non-static functions here...
        
        return self;
      };
      
      
      ng.extend($resource, _resource);
      // static functions here...
      
      return $resource;
    }])
  .service('AlbumsSvc', [ '_', 'ResourceSvc', 'Album',
    function AlbumsSvc ( _, ResourceSvc, Album) {
      return new ResourceSvc(Album);
    }])
})(window.angular);