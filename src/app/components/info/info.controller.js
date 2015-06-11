'use strict';

angular.module('csyywx')
	.controller('InfoCtrl', function($scope, $state, balanceService, utils) {
		$scope.viewBalanceDetail = function(type) {
			$state.go('tabs.balance', {type: type});
		};

		$scope.viewExperience = function() {
			utils.alert({
				content: '活动尚未开启，敬请期待！'
			});
		};

		$scope.balance = balanceService.balance;

	});