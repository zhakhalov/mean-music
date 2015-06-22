(function (ng) {
  ng.module('app.config', [])
  // ============================ CONSTANTS ============================
  .constant('REST_API_ROUTE', '/api/')
  .constant('TOKEN_STORAGE', '__token__')
  .constant('AUTH_SCHEMA', 'Bearer')
  .constant('CLEAR_CACHE_DEBOUNCE', 5 * 60 * 1000)
})(window.angular);