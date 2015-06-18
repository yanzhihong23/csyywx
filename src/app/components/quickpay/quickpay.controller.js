'use strict';

angular.module('csyywx')
	.controller('QuickpayCtrl', function($scope, $rootScope, $state, orderService, PayApi, $ionicLoading, utils, balanceService, $filter) {
		$scope.order = orderService.order;
		$rootScope.success = {};

		$scope.$on('payPassword', function(evt, password) {
			$scope.order.payPassword = password;

			$ionicLoading.show();
			PayApi.quickPay($scope.order).success(function(data) {
				$ionicLoading.hide();
				if(+data.flag === 1) {
					$rootScope.success = data.data;
					$rootScope.success.remandAmount = +data.data.transAmount - +$scope.order.amount;

					utils.alert({
					  title: '您已成功付款 ' + $filter('currency')($scope.order.amount, '') + ' 元',
					  cssClass: 'popup-large',
					  contentUrl: 'app/templates/success.html',
					  callback: function() {
					  	utils.goInfo();
					  }
					});

					// update balance
					balanceService.update();
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