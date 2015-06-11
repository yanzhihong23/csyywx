'use strict';

angular.module('csyywx')
	.controller('QuickpayCtrl', function($scope, $rootScope, $state, orderService, PayApi, $ionicLoading, utils, balanceService) {
		$scope.order = orderService.order;

		$rootScope.$on('payPassword', function(evt, password) {
			$scope.order.payPassword = password;

			$ionicLoading.show();
			PayApi.quickPay($scope.order).success(function(data) {
				$ionicLoading.hide();
				if(+data.flag === 1) {
					// update balance service
					balanceService.update();
					$state.go('tabs.info');
				} else {
					utils.alert({
						title: '付款失败',
						content: data.msg,
						callback: function() {
							$rootScope.$broadcast('resetPayPassword');
						}
					});
				}
			})
		})
	})