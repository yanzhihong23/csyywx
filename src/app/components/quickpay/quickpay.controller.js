'use strict';

angular.module('csyywx')
	.controller('QuickpayCtrl', function($scope, $rootScope, $state, orderService, PayApi, $ionicLoading, utils, balanceService) {
		$scope.order = orderService.order;

		$scope.$on('payPassword', function(evt, password) {
			$scope.order.payPassword = password;

			$ionicLoading.show();
			PayApi.quickPay($scope.order).success(function(data) {
				$ionicLoading.hide();
				if(+data.flag === 1) {
					// update balance
					balanceService.update();
					// reinit order, get a new order id
					$rootScope.$broadcast('initOrder');
					$state.go('tabs.info');
				} else {
					utils.alert({
						title: '付款失败',
						content: data.msg,
						callback: function() {
							$scope.$broadcast('resetPayPassword');
						}
					});
				}
			})
		})
	})