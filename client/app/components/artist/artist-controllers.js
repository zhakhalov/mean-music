(function (ng) {
  'use strict';
  var ARTIST_PAGE_LIMIT = 10;
  
  ng.module('app')
  .controller('ArtistsCtrl', [ '$scope', '$routeParams', 'ArtistsSvc',
    function ArtistsCtrl ($scope, $routeParams, ArtistsSvc) {
      
    }])
  .controller('ArtistsSearchCtrl', [ '$scope', '$routeParams', 'ArtistsSvc',
    function ArtistsSearchCtrl ($scope, $routeParams, ArtistsSvc) {
      
      $scope.search = $routeParams.search;
      $scope.page = parseFloat($routeParams.page || 1); 
      
    }])
  .controller('ArtistCreateCtrl', [ '$scope', '$routeParams', 'ArtistsSvc', 'Artist', '$location',
    function ArtistCreateCtrl ($scope, $routeParams, ArtistsSvc, Artist, $location) {
      $scope.artist = new Artist();
      $scope.onFileAdded = function ($file, $event, $flow) {
        $flow.files = [];
        
        if(0 === $file.file.type.indexOf('image/')) {
          $scope.image = $file;
          $scope.aritst.image = $file.file;
        }
      };
      
      $scope.save = function () {
        $scope.pending = true;
        ArtistsSvc.save($scope.artist)
        .then(function () {
          $scope.pending = false;
          $location.path('/artist/' + $scope.artist._id);
        }, function (err) {
          
        })
      };
    }])
  .controller('ArtistCtrl', [ '$scope', '$routeParams', 'ArtistsSvc',
    function ArtistCtrl ($scope, $routeParams, ArtistsSvc) {
      var aritst = $routeParams.aritst;
      
    }])
  .controller('ArtistEditCtrl', [ '$scope', '$routeParams', 'ArtistsSvc',
    function ArtistEditCtrl ($scope, $routeParams, ArtistsSvc) {
      var aritst = $routeParams.aritst;
      
    }])
})(window.angular);