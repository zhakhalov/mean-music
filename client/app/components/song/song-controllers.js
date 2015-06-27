(function (ng) {
  ng.module('app')
  .controller('SongCreateCtrl', [ '$scope', '$routeParams', 'GenresSvc',
    function SongCreateCtrl ($scope, $routeParams, GenresSvc) {
      
    }])
  .controller('SongEditCtrl', [ '$scope', '$routeParams', 'GenresSvc',
    function SongEditCtrl ($scope, $routeParams, GenresSvc) {
      var song = $routeParams.genre;
      
      $scope.song = {};
      var audio = new Audio();
      audio.addEventListener('canplaythrough', function () {
        $scope.song.duration = audio.duration;
        $scope.duration = Math.floor($scope.song.duration / 60) + ':' + Math.round($scope.song.duration % 60);
        $scope.$apply();
      });
      
    }])
})(window.angular);