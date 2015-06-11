'use strict';

angular.module('csyywx')
  .controller('LoginCtrl', function($scope, $rootScope, $state, $stateParams, $ionicLoading, UserApi, userConfig, utils, balanceService, settingService) {
    $scope.user = {
    	phone: $stateParams.phone
    };

    $scope.submit = function() {
    	$ionicLoading.show();
    	UserApi.login($scope.user).success(function(data) {
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
          // update balance and setting services
          balanceService.update();
          settingService.update();
    		} else {
					utils.alert({
						content: data.msg
					});
				}
    	})
    }
  })
;