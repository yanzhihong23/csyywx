'use strict';

angular.module('csyywx')
	.controller('LimitCtrl', function($scope, localStorageService, userConfig) {
		$scope.limit = localStorageService.get('limit');

		$scope.tab = +userConfig.getBasicInfo().isInvest;
	})