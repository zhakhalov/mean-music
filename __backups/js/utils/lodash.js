(function (ng, _) {
  ng.module('lodash', [])
  .service('_', [
    function () {
      return _.noConflict();
    }]);
})(window.angular, window._);