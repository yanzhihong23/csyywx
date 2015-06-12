'use strict';

angular.module('csyywx')
  .controller('PasswordCtrl', function($scope, $ionicLoading, $ionicPopup, UserApi, userConfig, utils) {

    var sessionId = userConfig.getSessionId();

    $scope.passwordPattern = utils.passwordPattern;

    $scope.pwd = {
      currentPassword: '',
      newPassword: '',
      repeatPassword: ''
    };

    $scope.submit = function() {
      $ionicLoading.show();
      UserApi.changePassword({
        sessionId: sessionId,
        oldPassword: $scope.pwd.currentPassword,
        newPassword: $scope.pwd.newPassword
      }).success(function(data) {
        $ionicLoading.hide();
        console.log(data);
        if (+data.flag === 1) {
          utils.alert({
            content: '密码修改成功',
            callback: function() {
              utils.goBack();
            }
          });
        } else {
          utils.alert({
            content: data.msg
          });
        }
      });
    }
  })
;