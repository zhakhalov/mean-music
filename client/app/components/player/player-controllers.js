(function(ng) {
  ng.module('app')
    .controller('PlayerCtrl', ['$scope', '$rootScope',
      function PlayerCtrl($scope, $rootScope) {

        // constants
        $scope.TIME_SCALE = 1000;
        $scope.VOLUME_SCALE = 100;


        // private vars
        var _seeking = false;

        $scope.audio = new Audio();
        $scope.audio.volume = 0.1;
        $scope.isPlayEnabled = false;
        $scope.current = null;
        $scope.loopMode = 'none'; // 'loop-queue', 'loop-one', 'shuffle'
        $scope.volume = $scope.audio.volume * $scope.VOLUME_SCALE;

        // *************************** GLOBAL EVENTS HANDLING

        $rootScope.$on('player:set-queue', function(evt, queue) {
          $scope.queue = queue;
        });
        $rootScope.$on('player:play', function(evt, song) {
          $scope.current = song;
        });

        // *************************** BUTTON HANDLING

        /**
         * Handle clickc play/pause button
         */
        $scope.playClick = function() {
          if ($scope.audio.paused) {
            $scope.audio.play($scope.audio.currentTime);
          } else {
            $scope.audio.pause();
          }
        };

        /**
         * Handle click next button
         */
        $scope.nextClick = function() {

        };

        /**
         * Handle click prev button
         */
        $scope.prevClick = function() {

        };

        /**
         * Handle click queue-mode
         */
        $scope.queueModeClick = function() {

        };

        // *************************** AUDION EVENTS

        /**
         * On time update event handler
         */
        $scope.audio.ontimeupdate = function() {
          if (_seeking) {
            return;
          }
          $scope.time = $scope.audio.currentTime / $scope.audio.duration * $scope.TIME_SCALE;
          $scope.$apply();
        };

        /**
         * On audio ended event handler
         */
        $scope.audio.onended = function() {

        };

        // *************************** TIME SLIDER EVENTS

        /**
         * Start seeking on sliderbar handler.
         */
        $scope.startSeeking = function() {
          _seeking = true;
        };

        /**
         * Stop seeking on sliderbar handler.
         */
        $scope.stopSeeking = function() {
          _seeking = false;
          $scope.audio.currentTime = ($scope.time / $scope.TIME_SCALE * $scope.audio.duration) || 0;
        };

        // *************************** VOLUME SLIDER EVENTS

        $scope.slideVolume = function() {
          $scope.audio.volume = $scope.volume / $scope.VOLUME_SCALE;
        };
      }
    ]);
})(window.angular)