'use strict';

angular.module('csyywx')
  .controller('RegisterCtrl', function($scope, $rootScope, $state, $stateParams, $ionicLoading, UserApi, userConfig, utils, balanceService, settingService) {
  	var resendCountdown = utils.resendCountdown($scope);

    $scope.user = {
    	phone: $stateParams.phone,
    	invalidVcode: false,
    	invalidPassword: false,
    	passwordMismatch: false
    };

    $scope.passwordValidate = function(password) {
      $scope.user.invalidPassword = !utils.isPasswordValid(password);
		};

		$scope.$watch('user.passwordConfirm', function(val) {
			var password = $scope.user.password;
			if(val && val.length >= password.length) {
				if(val !== password) {
					$scope.user.passwordMismatch = true;
					$scope.user.passwordMatch = false;
				} else {
					$scope.user.passwordMatch = true;
				}
			} else {
				$scope.user.passwordMatch = false;
			}
		});

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
    	UserApi.register($scope.user).success(function(data) {
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
          
    		} else if(+data.flag === 3) { // invalid vcode
    			$scope.user.invalidVcode = true;
    		}
    	});

    };

  })
;