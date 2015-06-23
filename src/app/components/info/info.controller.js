'use strict';

angular.module('csyywx')
	.controller('InfoCtrl', function($scope, $state, balanceService, utils, userConfig) {
		$scope.viewBalanceDetail = function(type) {
			$state.go('tabs.balance', {type: type});
		};

		$scope.viewExperience = function() {
			$state.go('tabs.experience');
			// utils.alert({
			// 	content: '活动尚未开启，敬请期待！'
			// });
		};

		$scope.experienceAlert = function() {
			utils.alert({
				title: '邀请码: ' + userConfig.getBasicInfo().ownerActivityId,
				content: '邀请好友投资即可获得2000元体验金，最低可1元起投哦~'
			});
		};

		$scope.balance = balanceService.balance;

	});