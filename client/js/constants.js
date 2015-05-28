(function (ng) {
  ng.module('app')
  // ============================ CONSTANTS ============================
  .constant('REST_API_ROUTE', '/api/')
  .constant('TOKEN_STORAGE', '__token__')
  .constant('AUTH_SCHEMA', 'Bearer');
})(window.angular);