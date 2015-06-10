'use strict';

angular.module('csyywx')
  .controller('ForgetPasswordCtrl', function($scope, $stateParams, $ionicLoading, UserApi, utils) {
    var resendCountdown = utils.resendCountdown($scope);

    $scope.user = {
      phone: $stateParams.phone,
      invalidVcode: false,
      approach: 2
    };


    $scope.sendVcode = function() {
      $ionicLoading.show();
      UserApi.sendCheckCode($scope.user)
        .success(function(data) {
          console.log("ss")
          $ionicLoading.hide();
          if(+data.flag === 1) {
            resendCountdown();
            $scope.user.sessionId = data.data.sessionId;
          }
        });
    };

    $scope.submit = function() {

    };

  })
;