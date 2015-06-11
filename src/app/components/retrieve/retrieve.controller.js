'use strict';

angular.module('csyywx')
  .controller('RetrievePasswordCtrl', function($scope, $ionicLoading, userConfig, utils, UserApi) {

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
            callback: utils.goBack
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