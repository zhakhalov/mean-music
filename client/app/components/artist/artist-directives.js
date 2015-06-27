(function (ng) {
  ng.module('app')
  .directive('uniqueArtist', [ '$q', 'ArtistsSvc',
    function uniqueArtist ($q, ArtistsSvc) {
      return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
          ctrl.$asyncValidators.uniqueArtist = function (modelValue) {
            return ctrl.$isEmpty(modelValue) 
            ? $q.when()
            : $q(function (resolve, reject) {
              ArtistsSvc.exists(modelValue)
              .then(function (exists) {
                ((exists) ? reject : resolve)();
              }, function (err) {
                console.error(err);
              });  
            });
          };
        }
      };
    }])
})(window.angular);