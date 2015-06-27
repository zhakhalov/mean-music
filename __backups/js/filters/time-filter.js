(function (ng) {
  ng.module('app')
  .filter('time', 
    [function () {
      return function (input) {
        var min = Math.floor(input / 60);
        var sec = Math.floor(input % 60);
        return ((min < 10) ? '0' : '') + min.toString() + ':' + ((sec < 10) ? '0' : '') + sec.toString();
      };
    }]);
})(window.angular);