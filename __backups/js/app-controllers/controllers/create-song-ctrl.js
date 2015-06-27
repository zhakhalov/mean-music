(function (ng) {
  ng.module('app')
  .controller('CreateSongCtrl', ['$scope', '_', '$http', 'FormData', '$window',
    function CreateSongCtrl ($scope, _, $http, FormData, $window) {
      $scope.song = {};
      var audio = new Audio();
      audio.addEventListener('canplaythrough', function () {
        $scope.song.duration = audio.duration;
        $scope.duration = Math.floor($scope.song.duration / 60) + ':' + Math.round($scope.song.duration % 60);
        $scope.$apply();
      });
      
      $scope.addArtist = function (artist) {
        $scope.song.artists = $scope.song.artists || [];
        $scope.song.artists.push($scope.artist);
      }
      
      $scope.rmArtist = function (artist) {
        $scope.song.artists = $scope.song.artists || [];
        $scope.song.artists = _.without($scope.song.artists, artist);
      }
      
      $scope.onFileAdded = function ($file, $event, $flow) {
        $flow.files = [];
        
        if(0 === $file.file.type.indexOf('audio/')) {
          $scope.song.audio = $file.file;
          audio.src = $window.URL.createObjectURL($file.file);
        }
        if(0 === $file.file.type.indexOf('image/')) {
          $scope.image = $file;
          $scope.song.image = $file.file;
        }
      };
      
      $scope.save = function (){
        $http.post('/', FormData($scope.song), {
          headers: {
            'Content-type': undefined
          }
        });
      };
    }]);
})(window.angular);