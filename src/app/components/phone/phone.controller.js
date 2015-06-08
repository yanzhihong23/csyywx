'use strict';

angular.module('csyywx')
  .controller('PhoneCtrl', function($scope, $state, $ionicLoading, UserApi) {
    $scope.clicked = false;
    $scope.user = {};

    $scope.submit = function() {
      $scope.clicked = true;
      $ionicLoading.show();
      UserApi.checkUser($scope.user)
        .success(function(data) {
          $ionicLoading.hide();
          if(+data.flag === 1) {
            if(+data.data.isOldUser) {
              $state.go('tabs.login', {phone: $scope.user.phone});
            } else {
              $state.go('tabs.register', {phone: $scope.user.phone});
            }
          }
        })
    };
  })
;