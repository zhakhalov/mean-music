// Underscore.js/Lodash.js wrapper

(function (ng, _) {
  ng.module('app')
  .factory('_', [
    function () {
      return _;
    }]);
})(window.angular, window._);