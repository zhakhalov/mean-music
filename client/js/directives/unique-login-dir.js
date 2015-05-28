(function (ng) {
  var uniqueLogin = function (modelName) {
    return function ($q, UserSvc) {
      return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
          ctrl.$asyncValidators[modelName] = function (modelValue) {
            return ctrl.$isEmpty(modelValue) 
              ? $q.when()
              : $q(function (resolve, reject) {
              UserSvc.checkLogin(modelValue, function (exists) {
                ((exists) ? reject : resolve)();
              }, function (err) {
                console.error(err);
              });  
            });
          };
        }
      };
    };
  };
  
  ng.module('app')
  .directive('uniqueUsername', ['$q', 'UsersSvc', uniqueLogin('uniqueUsername')])
  .directive('uniqueEmail', ['$q', 'UsersSvc', uniqueLogin('uniqueEmail')]);
})(window.angular);