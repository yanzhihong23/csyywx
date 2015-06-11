'use strict';

angular.module('csyywx')
  .controller('RetrievePayPasswordCtrl', function($scope, $rootScope, $ionicLoading, UserApi, userConfig, utils) {
    var sessionId =  userConfig.getSessionId();

    $scope.newPassword = '';
    $scope.repeatPassword = '';

    var step = [{
      index: 0,
      title: '第一步：请输入新的支付密码'
    },{
      index: 1,
      title: '第二步：请确认新的支付密码'
    }];

    // 初始化
    resetError();
    resetStep();

    $rootScope.$on('payPassword', function(evt, password) {

      if ($scope.step.index === 0) {
        step0(password);
      } else if ($scope.step.index === 1) {
        step1(password);
      }

    });

    function step0(password) {
      $scope.newPassword = password;
      $rootScope.$broadcast('resetPayPassword');
      $scope.step = step[1];
    }

    function step1(password) {
      $scope.repeatPassword = password;
      if ($scope.repeatPassword !== $scope.newPassword) {
        $scope.error = {
          show: true,
          content: '两次输入支付密码不相同'
        };
        $rootScope.$broadcast('resetPayPassword');
        resetStep();
      } else {
        $ionicLoading.show();
        UserApi.retrievePayPassword({
          sessionId: sessionId,
          newPassword: $scope.newPassword
        }).success(function(data) {
          $ionicLoading.hide();
          console.log(data);
          if (+data.flag === 1) {
            utils.alert({
              content: '修改成功',
              callback: utils.goBack
            });
          } else {
            utils.alert({
              content: data.msg,
              callback: function() {
                $rootScope.$broadcast('resetPayPassword');
                resetStep();
                resetError();
              }
            });
          }
        });
      }
    }

    $rootScope.$on('pressKey', function(evt, key) {
      console.log("===%s pressed==", key);
      if ($scope.error.show) {
        resetError();
      }
    });

    function resetStep() {
      $scope.step = step[0];
    }

    function resetError() {
      $scope.error = {
        show: false,
        content: ''
      };
    }

  })
;