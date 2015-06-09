'use strict';

angular.module('csyywx')
	.controller('SettingCtrl', function($scope, $state, UserApi, userConfig) {
		$scope.userData = {};

		UserApi.getUserData({sessionId: userConfig.getSessionId()})
			.success(function(data) {
				if(+data.flag === 1) {
					$scope.userData = data.data.userData;
				}
			});

		$scope.logout = function() {
			userConfig.logout();
			$state.go('tabs.home');
		};
	})