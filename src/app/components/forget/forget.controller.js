'use strict';

angular.module('csyywx')
  .controller('ForgetPasswordCtrl', function($scope, $state, $stateParams, $ionicLoading, UserApi, userConfig, utils, settingService) {
    var resendCountdown = utils.resendCountdown($scope);

    $scope.pay = +$stateParams.type === 3;   // 3支付

    $scope.user = {
      phone: $stateParams.phone || userConfig.getUser().phone,
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
            userConfig.setSessionId(data.data.sessionId);
          }
        });
    };

    $scope.submit = function() {
      $ionicLoading.show();
      UserApi.securityCheck({
        sessionId: $scope.user.sessionId,
        phone: $scope.user.phone,
        certificateNumber: $scope.pay ? $scope.user.certificateNumber : '', // id, for retrieve pay password
        checkCode: $scope.user.vcode, // 2015, for dev test,
        type: +$stateParams.type-1 // 1:login, 2: pay
      }).success(function(data) {
        $ionicLoading.hide();
        console.log(data);
        if (+data.flag === 1) {
          if ($scope.pay) {
            $state.go('tabs.retrievePayPassword');
          } else {
            console.log($scope.user.phone)
            $state.go('tabs.retrievePassword', {
              phone: $scope.user.phone
            });
          }
        } else {
          alert(data.msg)
        }
      });
    };

  })
;