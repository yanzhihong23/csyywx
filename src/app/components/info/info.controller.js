'use strict';

angular.module('csyywx')
	.controller('InfoCtrl', function($scope, $state, balanceService) {
		$scope.viewBalanceDetail = function(type) {
			$state.go('tabs.balance', {type: type});
		};

		$scope.balance = balanceService.balance;
	});