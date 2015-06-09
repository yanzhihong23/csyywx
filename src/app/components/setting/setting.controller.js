'use strict';

angular.module('csyywx')
	.controller('SettingCtrl', function($scope, $state, UserApi, userConfig, utils, settingService) {
		$scope.userData = settingService.setting;

		$scope.logout = function() {
			userConfig.logout();
		};
	})