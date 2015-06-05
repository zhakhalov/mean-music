(function (ng) {
  ng.module('app')
    // --------------------------- AuthCtrl ---------------------------
  .controller('AuthCtrl', ['$scope', '$rootScope', 'AuthSvc', '$modal',
    function ($scope, $rootScope, AuthSvc, $modal) {
      var self = this;
      $scope.pending = false;
      $scope.isAuthenticated = AuthSvc.isAuthenticated();
      // ------------------ $rootScope.$on
      $rootScope.$on('authenticated', function () {
        if (self.modal && AuthSvc.isAuthenticated()) { self.modal.dismiss(); }
        $scope.isAuthenticated = AuthSvc.isAuthenticated();
      });
      // ------------------ buttons
      $scope.showModal = function () {
        self.modal = $modal.open({ templateUrl: 'templates/modals/auth-modal.html', size: 'sm' });
      };
      $scope.signOut = function () {
        AuthSvc.signOut();
        $scope.isAuthenticated = AuthSvc.isAuthenticated();
      };
    }])
    // --------------------------- SignInCtrl ---------------------------
  .controller('SignInCtrl', ['$scope', '$rootScope', 'AuthSvc',
    function ($scope, $rootScope, AuthSvc) {
      $scope.loginErr = false;
      $scope.pending = false;
      // ------------------ buttons
      $scope.signIn = function () {
        $scope.pending = true;
        AuthSvc.signIn($scope.login, $scope.password)
        .then(function () {
          $scope.pending = false;
          $rootScope.$emit('authenticated');
        }, function () {
          $scope.pending = false;
          $scope.loginErr = true;
        });
      };
    }])
    // --------------------------- SignUpCtrl ---------------------------
  .controller('SignUpCtrl', ['$scope', '$rootScope', 'AuthSvc',
    function ($scope, $rootScope, AuthSvc) {
      $scope.loginErr = false;
      $scope.pending = false;
      $scope.user = { username: '', email:'', password: ''};
      // ------------------ buttons
      $scope.signUp = function () {
        $scope.pending = true;
        AuthSvc.signUp($scope.user)
        .then(function () {
          $scope.user = { username: '', email: '', password: '' };
          $scope.pending = false;
          $rootScope.$emit('authenticated');
          $scope.signup.$setPristine();
        }, function () {
          $scope.pending = false;
          $scope.loginErr = true;
        });
      };
    }]);
})(window.angular);