(function (ng) {
  ng.module('app')
  .controller('VolumeCtrl', [ '$scope',
    function ($scope) {
      $scope.volume = $scope.$parent.audio.volume * 100;
      $scope.volumeAdjust = function () {
        $scope.$parent.audio.volume = $scope.volume / 100;
      };
    }])
  .controller('PlayerCtrl',[ '$scope', '$http',
    function PlayerCtrl ($scope, $http) {
      var seeking = false;
      $scope.audio = new Audio();
      $scope.audio.volume = 0.1;
      $scope.volume = $scope.audio.volume * 100;
      $scope.playlist = [
        'audio/apex-rise_-_cherry-blossom-trees.mp3',
        'audio/arrowhead-and-zentra_-_funkyard.mp3',
        'audio/high-maintenance-ft-katies-ambition_-_let-you-go.mp3'
      ];
      $scope.current = $scope.playlist[0];
      
      $http.get('api/media?filename=' + $scope.current)
      .success(function (data) {
        $scope.audio.src = data;
      })
      .error(function (err) {
        
      })
      
      /**
       * Handle clickcing play/pause button
       */
      $scope.togglePlaying = function () {
        if ($scope.audio.paused) {
          $scope.audio.play($scope.audio.currentTime);
        } else {
          $scope.audio.pause();
        }
      };
      /**
       * On time update event handler
       */
      $scope.audio.ontimeupdate = function () {
        if (seeking) { 
          return;
        }
        $scope.time = $scope.audio.currentTime / $scope.audio.duration * 1000;
        $scope.$apply();
      };
      
      $scope.audio.onended = function () {
        $scope.current = ($scope.playlist[$scope.playlist.indexOf($scope.current) + 1] || $scope.playlist[0]);
        $http.get('api/media?filename=' + $scope.current)
        .success(function (data) {
          $scope.audio.src = data;
          $scope.audio.play();
        })
        .error(function (err) {
          
        })
      }
      
      /**
       * Start seeking on sliderbar handler.
       */
      $scope.startSeeking = function () {
        seeking = true;
      };
      
      /**
       * Stop seeking on sliderbar handler.
       */
      $scope.stopSeeking = function () {
        seeking = false;
        $scope.audio.currentTime = ($scope.time / 1000 * $scope.audio.duration) || 0;
      };
      
      $scope.slideVolume = function () {
         $scope.audio.volume = $scope.volume / 100;
      };
    }]);
})(window.angular);