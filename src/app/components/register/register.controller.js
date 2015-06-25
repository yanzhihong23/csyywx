'use strict';

angular.module('csyywx')
  .controller('RegisterCtrl', function($scope, $rootScope, $state, $stateParams, $ionicLoading, UserApi, userConfig, utils, balanceService, settingService) {
  	var resendCountdown = utils.resendCountdown($scope);
    $scope.passwordPattern = utils.passwordPattern;

    $scope.user = {
    	phone: $stateParams.phone,
      inviteCode: $stateParams.inviteCode,
      invalidVcode: false
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

      if($stateParams.inviteCode) {
        $scope.user.userType = 'tiyanjin+wx+1';
      }

    	UserApi.registerByActivity($scope.user).success(function(data) {
    		$ionicLoading.hide();
    		if(+data.flag === 1) {
    			// save basic info
    			userConfig.setBasicInfo(data.data);
    			// save user
    			userConfig.setUser({
    				phone: $scope.user.phone,
    				password: $scope.user.password
    			});

    			$rootScope.$broadcast('loginSuc');
          if($stateParams.inviteCode) {
            utils.goInfo();
          }
    		} else if(+data.flag === 3) { // invalid vcode
    			$scope.user.invalidVcode = true;
    		} else {
          utils.alert({
            content: data.msg
          });
        }
    	});

    };

  })
;