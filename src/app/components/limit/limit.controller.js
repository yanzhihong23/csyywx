'use strict';

angular.module('csyywx')
	.controller('LimitCtrl', function($scope, localStorageService, userConfig) {
		var limit = localStorageService.get('limit');

		$scope.limit = +userConfig.getBasicInfo().isInvest ? limit.firstRecharge : limit.quickRecharge;
	})