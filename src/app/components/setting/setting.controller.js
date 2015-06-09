'use strict';

angular.module('csyywx')
	.controller('SettingCtrl', function($scope, UserApi, userConfig) {
		UserApi.getUserData({sessionId: userConfig.getSessionId()})
			.success(function(data) {
				if(+data.flag === 1) {
					$scope.userData = data.data.userData;
				}
			})
	})