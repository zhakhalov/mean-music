(function (ng) {
  ng.module('app')
  .factory('AudioCtx', ['$window',
    function ($window) {
      return $window.AudioContext || $window.webkitAudioContext;
    }])
  .controller('PlayerCtrl',[ '$scope',
    function PlayerCtrl ($scope) {
      $scope.isPlaying = false;
      $scope.togglePlaying = function () {
        $scope.isPlaying
      };
      $scope.timeFormatter = function (val) {
        return Math.floor(val / 60).toString() + ':' + Math.floor(val % 60);
      }
    }]);
})(window.angular);