'use strict';

angular.module('csyywx')
	.controller('SettingCtrl', function($scope, $state, UserApi, userConfig, utils, settingService) {
		$scope.userData = settingService.setting;

		$scope.logout = function() {
			utils.confirm({
				content: '确认退出登录',
				onOk: function() {
					userConfig.logout();
				}
			})
		};
	})