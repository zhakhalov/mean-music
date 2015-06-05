(function (ng) {
  ng.module('app')
  .service('ArtistsSvc', [ 'REST_API_ROUTE', 'DEFAULT_ARTIST_QUERY', '$http', '$resource', '$q', 'AuthSvc', '_',
    function (REST_API_ROUTE, DEFAULT_ARTIST_QUERY, $http, $resource, $q, AuthSvc, _) {
      var self = this;
      var Artist = $resource(REST_API_ROUTE + 'artists/:id',
        { id: '@id' },
        {
          query: {
            method: 'GET', 
            isArray: true,
            params: {
              
            }
          },
          get: {
            method: 'GET'
          }
        })
      
      /**
       * @function Requests artists from server.
       * @param {object} opts Query arguments
       * @param {object} opts.query MongoDB#Query
       * @param {string} opts.attrs Requested attributes
       * @param {string} opts.sort SortBy
       * @param {number} opts.skip Number of rows to skip
       * @param {number} opts.limit Limit rows.
       * @return {Promise}
       */
      self.getArtist = function (opts) {
        Artist.$query(opts).$promise
      }
    }])
})(window.angular);