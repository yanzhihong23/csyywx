'use strict';

angular.module('csyywx')
  .controller('PasswordCtrl', function($scope, $ionicLoading, $ionicPopup, UserApi, userConfig, utils) {

    var sessionId = userConfig.getSessionId();

    $scope.invalidVcode = false;

    $scope.passwordValidate = function(password) {
      return $scope.invalidVcode = !utils.isPasswordValid(password);
    };


    $scope.pwd = {
      currentPassword: '',
      newPassword: '',
      repeatPassword: ''
    };

    $scope.showAlert = function(content) {
      var alertPopup = $ionicPopup.alert({
        title: '错误提醒!',
        template: content,
        cssClass: 'text-center',
        okText: '确认',
        okType: 'button-assertive'
      });
      alertPopup.then(function(res) {
        console.log('close error alert');
      });
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
          utils.goBack();
        } else {
          $scope.showAlert(data.msg);
        }
      });
    }
  })
;