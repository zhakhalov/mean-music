(function (ng) {
  ng.module('app')
  .controller('VolumeCtrl', [ '$scope',
    function ($scope) {
      $scope.volume = $scope.$parent.audio.volume * 100;
      $scope.volumeAdjust = function () {
        $scope.$parent.audio.volume = $scope.volume / 100;
      };
    }])
  .controller('PlayerCtrl',[ '$scope',
    function PlayerCtrl ($scope) {
      var seeking = false;
      $scope.audio = new Audio();
      $scope.audio.volume = 0.1;
      $scope.audio.src = 'https://0d1124559f89251f4d4540672a4a322e13fabfcd-www.googledrive.com/host/0B8xrBhjRcdvdWEJ1ZzlpWkVtQ28/high-maintenance-let-you-go-feat-katies-ambition.mp3';
      $scope.togglePlaying = function () {
        if ($scope.audio.paused) {
          $scope.audio.play($scope.audio.currentTime);
        } else {
          $scope.audio.pause();
        }
      };
      $scope.audio.ontimeupdate = function () {
        if (seeking) { 
          return;
        }
        $scope.time = $scope.audio.currentTime / $scope.audio.duration * 1000;
        $scope.$apply();
      };
      
      $scope.startSeeking = function () {
        seeking = true;
      };
      
      $scope.stopSeeking = function () {
        seeking = false;
        $scope.audio.currentTime = ($scope.time / 1000 * $scope.audio.duration) || 0;
      };
    }]);
})(window.angular);