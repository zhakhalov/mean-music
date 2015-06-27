(function (ng) {
  ng.module('app.config', [])
  // ============================ CONSTANTS ============================
  .constant('REST_API_ROUTE', '/api/')
  .constant('CLEAR_CACHE_DEBOUNCE', 5 * 60 * 1000)
})(window.angular);