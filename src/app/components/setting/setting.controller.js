'use strict';

angular.module('csyywx')
	.controller('SettingCtrl', function($scope, $state, UserApi, userConfig, utils) {
		$scope.userData = {
			bank: {
				url: 'tabs.addCard',
				name: '未认证'
			}
		};

		UserApi.getUserData({sessionId: userConfig.getSessionId()})
			.success(function(data) {
				if(+data.flag === 1) {
					$scope.userData = data.data.userData;
					if($scope.userData.bankList.length) {
						var bank = $scope.userData.bankList[0];
						$scope.userData.bank = {
							name: bank.bankName + '(' + bank.cardCode + ')',
							url: ''
						};
					}
				}
			});

		$scope.logout = function() {
			userConfig.logout();
			$state.go('tabs.home');
		};
	})