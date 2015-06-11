'use strict';

angular.module('csyywx')
	.controller('QuickpayCtrl', function($scope, $rootScope, orderService) {
		$scope.order = orderService.order;
		console.log(orderService.order);

		$rootScope.$on('payPassword', function(evt, password) {
			console.log(password);
			$rootScope.$broadcast('resetPayPassword');
		})
	})