'use strict';

angular.module('csyywx')
	.controller('QuickpayCtrl', function($scope, orderService) {
		$scope.order = orderService.order;
		console.log(orderService.order);
	})