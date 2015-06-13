(function (ng) {
  ng.module('app')
  .factory('User', ['$resource', 'AuthSvc', 'REST_API_ROUTE',
    function ($resource, AuthSvc, REST_API_ROUTE) {
      return $resource(REST_API_ROUTE + 'users/:userId',
        { userId: '@userId' },
        {
          query: {
            method: 'GET',
            isArray: true
          },
          get: {
            method: 'GET'
          },
          getMe: {
            url: REST_API_ROUTE + 'users/me',
            method: 'GET',
            headers: { 'Authorization': AuthSvc.header }
          },
          updateMe: {
            url: REST_API_ROUTE + 'users/me',
            method: 'PUT',
            headers: { 'Authorization': AuthSvc.header }
          }
        });
    }]);
})(window.angular);