'use strict';

angular.module('csyywx')
  .controller('RetrievePasswordCtrl', function($scope, $state, $stateParams, $ionicLoading, userConfig, utils, UserApi) {

    $scope.user = {
      phone: $stateParams.phone
    };

    var sessionId = userConfig.getSessionId();

    $scope.invalidVcode = false;

    $scope.passwordValidate = function(password) {
      return $scope.invalidVcode = !utils.isPasswordValid(password);
    };


    $scope.pwd = {
      newPassword: '',
      repeatPassword: ''
    };

    function clear() {
      $scope.pwd = {
        newPassword: '',
        repeatPassword: ''
      };
    }


    $scope.submit = function() {
      $ionicLoading.show();
      UserApi.retrievePassword({
        sessionId: sessionId,
        newPassword: $scope.pwd.newPassword
      }).success(function(data) {
        $ionicLoading.hide();
        console.log(data);
        if (+data.flag === 1) {
          utils.alert({
            content: '修改成功',
            callback: function() {
                //utils.goBack();
              userConfig.setUser({
                phone: $scope.user.phone,
                password: $scope.pwd.newPassword
              });
              userConfig.autoLogin();
              utils.disableBack();
              $state.go('tabs.home');
            }
          });
        } else {
          utils.alert({
            content: data.msg,
            callback: clear
          });
        }
      });
    };

  })
;