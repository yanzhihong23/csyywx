'use strict';

angular.module('csyywx')
  .controller('ForgetPasswordCtrl', function($scope, $state, $stateParams, $ionicLoading, UserApi, userConfig, utils) {
    var resendCountdown = utils.resendCountdown($scope);

    var checkCode = 2015;
    $scope.pay = +$stateParams.type === 3;   // 3支付

    $scope.user = {
      phone: $stateParams.phone,
      invalidVcode: false,
      approach: $stateParams.type,
      certificateNumber: ''
    };


    $scope.sendVcode = function() {
      $ionicLoading.show();
      UserApi.sendCheckCode($scope.user)
        .success(function(data) {
          $ionicLoading.hide();
          if(+data.flag === 1) {
            resendCountdown();
            $scope.user.sessionId = data.data.sessionId;
          }
        });
    };

    $scope.submit = function() {
      $ionicLoading.show();
      UserApi.securityCheck({
        sessionId: $scope.user.sessionId,
        phone: $scope.user.phone,
        certificateNumber: $scope.pay ? $scope.user.certificateNumber : '', // id, for retrieve pay password
        checkCode: checkCode, // 2015, for dev test,
        type: +$stateParams.type-1 // 1:login, 2: pay
      }).success(function(data) {
        $ionicLoading.hide();
        console.log(data);
        if (+data.flag === 1) {
          if ($scope.pay) {
            $state.go('tabs.retrievePayPassword');
          } else {
            $state.go('tabs.retrievePassword');
          }
        } else {
          alert(data.msg)
        }
      });
    };

  })
;