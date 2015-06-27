(function (ng) {
  ng.module('app', ['ngMessages',
                    'ngRoute',
                    'ui.bootstrap',
                    'ui.bootstrap-slider',
                    'ui.bootstrap.popover',
                    'flow',
  ])
  .constant('REST_API_ROUTE', '/api/')
  .constant('CLEAR_CACHE_DEBOUNCE', 1000 * 60 * 60)
  .run(['$rootScope', '$location', 'AuthSvc', 
    function ($rootScope, $location, AuthSvc) {
      $rootScope.$on('$routeChangeStart', function (evt, next, prev) {
        if (next && next.$$route && next.$$route.secure) {
          
        }
      })
    }])
})(window.angular);