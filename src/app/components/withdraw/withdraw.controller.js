'use strict';

angular.module('csyywx')
	.controller('WithdrawCtrl', function($scope, $ionicActionSheet, $ionicLoading, userConfig, PayApi, utils, balanceService) {
		var	sessionId = userConfig.getSessionId(), orderId, card;

		$scope.withdraw = {
			fee: 0,
			result: 0,
			invalid: false
		};

		PayApi.initWithdraw({sessionId: sessionId}).success(function(data) {
			if(+data.flag === 1) {
				$scope.items = data.data.productEntity.map(function(obj) {
					obj.text = obj.productName;
					obj.availableAmount = obj.isAvailable && $scope.item.availableAmount;
					return obj;
				});

				$scope.item = $scope.items[0];
				$scope.balanceAvailable = +$scope.item.availableAmount;
				// save order id
				orderId = data.data.orderid;

				if(+data.data.isBindCard) {
					card = data.data.bindCardList[0];
				}
			}
		});

		$scope.selectItem = function() {
			var hideSheet = $ionicActionSheet.show({
				buttons: $scope.items,
				titleText: '提现项目',
				cancelText: '取消',
				buttonClicked: function(index) {
					$scope.item = $scope.items[index];
					$scope.balanceAvailable = +$scope.item.availableAmount;
					$scope.withdraw.amount = null;
					hideSheet();
	     	}
			});
		};

		$scope.$watch('withdraw.amount', function(val) {
			if(/\.$/.test(val)) return;
			val = Math.min(parseFloat(val), $scope.balanceAvailable);
			$scope.withdraw.invalid = val < 2;
			$scope.withdraw.amount = val;
			$scope.withdraw.fee = +val ? getFee(+val) : 0;
			$scope.withdraw.result = Math.max((val || 0) - $scope.withdraw.fee, 0);
		});

		var getFee = function(amount) {
			return Math.floor(amount/49999)*3 + (amount%49999 < 20000 ? 1 : 3);
		};

		$scope.showTip = function() {
			utils.alert({
				content: $scope.item.description
			});
		};

		$scope.submit = function() {
			$ionicLoading.show();
			var params = {
				sessionId: sessionId,
				orderId: orderId,
				productCode: $scope.item.productCode,
				arrivalAmount: $scope.withdraw.result,
				fee: $scope.withdraw.fee,
				amount: $scope.withdraw.amount,
				userCardCode: card.userCardCode,
				storablePan: card.shortNumber,
				provinceId: card.provinceId,
				cityId: card.cityId,
				bankBranchId: card.bankBranchId
			};

			PayApi.withdraw(params).success(function(data) {
				$ionicLoading.hide();
				if(+data.flag === 1) {
					// update balance service
					balanceService.update();
					utils.alert({
						content: '提现申请已提交',
						callback: function() {
							utils.goBack();
						}
					});
				} else {
					utils.alert({
						content: data.msg
					});
				}
			})
		};

	})