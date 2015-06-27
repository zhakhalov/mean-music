(function (ng) {
  ng.module('app')
  .controller('AlbumsCtrl', [ '$scope', '$routeParams', 'AlbumsSvc',
    function AlbumsCtrl ($scope, $routeParams, AlbumsSvc) {
      
    }])
  .controller('AlbumsSearchCtrl', [ '$scope', '$routeParams', 'AlbumsSvc',
    function AlbumsSearchCtrl ($scope, $routeParams, AlbumsSvc) {
      var search = $routeParams.search;
      
    }])
  .controller('AlbumCreateCtrl', [ '$scope', '$routeParams', 'AlbumsSvc',
    function AlbumCreateCtrl ($scope, $routeParams, AlbumsSvc) {
      
    }])
  .controller('AlbumCtrl', [ '$scope', '$routeParams', 'AlbumsSvc',
    function AlbumCtrl ($scope, $routeParams, AlbumsSvc) {
      var album = $routeParams.album;
      
    }])
  .controller('AlbumEditCtrl', [ '$scope', '$routeParams', 'AlbumsSvc',
    function AlbumEditCtrl ($scope, $routeParams, AlbumsSvc) {
      var album = $routeParams.album;
      
    }])
})(window.angular);