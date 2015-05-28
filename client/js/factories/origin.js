// origin URL <protocol>://<address>:<port>

(function (ng) {
  ng.module('app')
   .factory('origin', ['$location',
    function ($location) {
      return $location.protocol() + '://' + $location.host() + ':' + $location.port();
    }]);
})(window.angular);