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

    $scope.$on('payPassword', function(evt, password) {

      if ($scope.step.index === 0) {
        step0(password);
      } else if ($scope.step.index === 1) {
        step1(password);
      }

    });

    function step0(password) {
      $scope.newPassword = password;
      clearPayPasswordWidget();
      $scope.step = step[1];
    }

    function step1(password) {
      $scope.repeatPassword = password;
      if ($scope.repeatPassword !== $scope.newPassword) {
        $scope.error = {
          show: true,
          content: '两次输入支付密码不相同'
        };
        clearPayPasswordWidget();
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
              callback: function() {
                utils.goBack(-2);
              }
            });
          } else {
            utils.alert({
              content: data.msg,
              callback: function() {
                clearPayPasswordWidget();
                resetStep();
                resetError();
              }
            });
          }
        });
      }
    }

    $scope.$on('keyboard', function(evt, key) {
      console.log("===%s pressed==", key);
      if (key !== 'ok' && $scope.error.show) {
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

    function clearPayPasswordWidget() {
      $scope.$broadcast('resetPayPassword');
    }

  })
;