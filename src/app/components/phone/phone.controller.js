'use strict';

angular.module('csyywx')
  .controller('PhoneCtrl', function($scope, $state, $stateParams, $ionicLoading, UserApi) {
    $scope.clicked = false;
    $scope.user = {};
    if($stateParams.inviteCode) {
      $scope.showTip = true;
    }

    $scope.submit = function() {
      $scope.clicked = true;
      $ionicLoading.show();
      UserApi.checkUser($scope.user)
        .success(function(data) {
          $scope.clicked = false;
          $ionicLoading.hide();
          if(+data.flag === 1) {
            if(+data.data.isOldUser) {
              $state.go('tabs.login', {phone: $scope.user.phone});
            } else {
              $state.go('tabs.register', {phone: $scope.user.phone, inviteCode: $stateParams.inviteCode});
            }
          }
        })
    };
  })
;