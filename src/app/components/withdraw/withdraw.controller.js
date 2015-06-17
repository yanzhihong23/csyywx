'use strict';

angular.module('csyywx')
	.controller('WithdrawCtrl', function($scope, $state, $ionicActionSheet, $ionicLoading, userConfig, PayApi, utils, withdrawService) {
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
					obj.availableAmount = obj.isAvailable && obj.availableAmount;
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
				content: $scope.item.description,
				cssClass: 'popup-large'
			});
		};

		$scope.submit = function() {
			var order = {
				sessionId: sessionId,
				orderId: orderId,
				productCode: $scope.item.productCode,
				arrivalAmount: $scope.withdraw.result,
				fee: $scope.withdraw.fee,
				amount: $scope.withdraw.amount,
				userCardCode: card.userCardCode,
				storablePan: card.shortNumber,
				card: card
			};
			console.log(card);

			withdrawService.order = order;

			$state.go('tabs.district');
		};

	})
	.controller('DistrictCtrl', function($scope, $state, PayApi, withdrawService, balanceService, $ionicLoading, utils) {
		var order = withdrawService.order;
		$scope.selected = withdrawService.selected;
		$scope.card = withdrawService.order.card;

		$scope.select = function(type) {
			$state.go('tabs.selectDistrict', {type: type});
		};

		$scope.submit = function() {
			$ionicLoading.show();
			order.provinceId = $scope.selected.province.provinceId;
			order.cityId = $scope.selected.city.cityId;
			order.card = null;

			PayApi.withdraw(order).success(function(data) {
				$ionicLoading.hide();
				if(+data.flag === 1) {
					// update balance service
					balanceService.update();
					utils.alert({
						content: '您的提现申请已提交，1-2个工作日内将到账，请及时查看您的银行卡信息~',
						callback: function() {
							utils.goBack(-2);
						}
					});
				} else {
					utils.alert({
						content: data.msg
					});
				}
			});

		};
	})
	.controller('SelectDistrictCtrl', function($scope, $stateParams, withdrawService, utils) {
		var isProvince = $stateParams.type === 'province';

		if(isProvince) {
			$scope.title = '选择省份';
			$scope.items = withdrawService.province.map(function(obj) {
				obj.name = obj.provinceName;
				return obj;
			});
		} else {
			$scope.title = '选择城市';
			$scope.items = withdrawService.city.filter(function(obj) {
				return withdrawService.selected.province ? obj.provinceId === withdrawService.selected.province.provinceId : true;
			}).map(function(obj) {
				obj.name = obj.cityName;
				return obj;
			});
		}

		$scope.select = function(index) {
			if(isProvince) {
				withdrawService.selectProvince($scope.items[index]);
				var cityList = withdrawService.city.filter(function(obj) {
					return obj.provinceId === $scope.items[index].provinceId;
				});

				withdrawService.selectCity(cityList[0]);
			} else {
				withdrawService.selectCity($scope.items[index]);
			}

			utils.goBack();
		};
	})