'use strict';

angular.module('csyywx')
	.controller('LimitCtrl', function($scope, localStorageService) {
		$scope.limit = localStorageService.get('limit');

		$scope.tab = 0;
	})