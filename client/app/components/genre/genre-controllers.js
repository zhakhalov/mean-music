(function (ng) {
  ng.module('app')
  .controller('GenresCtrl', [ '$scope', '$routeParams', 'GenresSvc',
    function GenresCtrl ($scope, $routeParams, GenresSvc) {
      
    }])
  .controller('GenresSearchCtrl', [ '$scope', '$routeParams', 'GenresSvc',
    function GenresSearchCtrl ($scope, $routeParams, GenresSvc) {
      var search = $routeParams.search;
      
    }])
  .controller('GenreCreateCtrl', [ '$scope', '$routeParams', 'GenresSvc',
    function GenreCreateCtrl ($scope, $routeParams, GenresSvc) {
      
    }])
  .controller('GenreCtrl', [ '$scope', '$routeParams', 'GenresSvc',
    function GenreCtrl ($scope, $routeParams, GenresSvc) {
      var genre = $routeParams.genre;
      
    }])
  .controller('GenreEditCtrl', [ '$scope', '$routeParams', 'GenresSvc',
    function GenreEditCtrl ($scope, $routeParams, GenresSvc) {
      var genre = $routeParams.genre;
      
    }])
})(window.angular);