'use strict';

angular.module('csyywx')
	.controller('BuyCtrl', function($scope, $state, $ionicLoading, UserApi, PayApi, userConfig, $timeout, orderService) {
		var sessionId = userConfig.getSessionId(), productCode, level, orderId, hasPayPassword, card;

		$scope.salaryDaySet = false;
		$scope.inSalaryDays = false;
		$scope.terms = [];
		$scope.order = {
			minAmount: 1,
			amount: null,
			range: 45.82,
			reward: 0
		};
		// init
		$ionicLoading.show();
		PayApi.getProductCode({sessionId: ''})
			.success(function(data) {
				$ionicLoading.hide();
				if (+data.flag === 1) {
					// save product code
					productCode = data.data.productCode;
					$ionicLoading.show();
					PayApi.initOrder({
						sessionId: userConfig.getSessionId(),
						productCode: productCode
					}).success(function(data) {
							$ionicLoading.hide();
							if (+data.flag === 1) {
								$scope.salaryDaySet = !!data.data.isSetSalaryDay;
								$scope.inSalaryDays = !!data.data.isBetweenSalaryDate;
								initRange(data.data.monthRates);
								// save order id
								orderId = data.data.orderid;
								hasPayPassword = !!data.data.userDetail.hasPayPassword;
								card = data.data.bindCardList && data.data.bindCardList[0];

								$timeout(function() {
									rangePositionFix();
								}, 100);
							}
						})
					;
				}
			});

		var initRange = function(data) {
			$scope.terms = data.map(function(obj) {
				return {
					name: obj.monthName,
					annualYield: (obj.productRate*100 + obj.monthRate*100 + ($scope.inSalaryDays ? obj.increaseRate*100 : 0))/100,
					maxAmount: +obj.investAmountMax,
					days: +obj.countDays,
					desc: obj.description,
					systemMonthRateId: obj.systemMonthRateId
				}
			});

			$scope.$watch('order.range', function(val) {
				var len = $scope.terms.length;
				$scope.order.left = val*1.83 + '%';
				level = (Math.abs(val-100/len/2)/100*len).toFixed(0);

				if(!$scope.terms.length) return;

				$scope.terms.forEach(function(self) {
					if (self.active) {
						self.active = false;
					}
				});

				$scope.terms[level].active = true;

				var term = $scope.terms[level];
				$scope.order.name = term.name;
				$scope.order.annualYield = term.annualYield;
				$scope.order.maxAmount = term.maxAmount;
				$scope.order.days = term.days;
				$scope.order.desc = term.desc;
				$scope.order.systemMonthRateId = term.systemMonthRateId;

				calculate();
			});

			$scope.$watch('order.amount', function(val) {
				calculate();
			});
		};

		var calculate = function() {
			$scope.order.amount = Math.min(parseFloat($scope.order.amount), $scope.order.maxAmount);
			$scope.order.reward = +$scope.order.amount*$scope.order.annualYield/100/365*$scope.order.days || 0;
		};

		var rangePositionFix = function() {
			var len = $scope.terms.length;
			if (len === 0) return;
			$scope.order.range = level/len*100 + 100/len/2;
			if (+level === 0) {
				$scope.order.range = 1;
			}
			if (+level === len -1) {
				$scope.order.range = 99;
			}
			$scope.$apply();
		};

		angular.element(document.querySelector('#BUY'))
			.bind('touchstart', function() {
				document.getElementById('amount').blur();
			})
			.bind('touchend', function() {
				rangePositionFix();
			});


		$scope.submit = function() {
			console.log('hasCard: ' + !!card);
			console.log('hasPayPassword: ' + hasPayPassword);

			console.log($scope.order);
			orderService.order = {
				sessionId: sessionId,
				orderid: orderId,
				productCode: productCode,
				amount: $scope.order.amount,
				systemMonthRateId: $scope.order.systemMonthRateId
			};

			if(card) {
				if(!hasPayPassword) {
					$state.go('tabs.setPayPassword');
				} else {
					// go to quick pay
					orderService.order.userCardCode = card.userCardCode;
					orderService.order.storablePan = card.shortNumber;
					orderService.order.bankName = card.bankName;
					orderService.order.tailNo = card.bankCardNumber;
					console.log('quick pay')
					$state.go('tabs.quickpay');
				}
			} else {
				// go to bind and pay
				$state.go('tabs.pay');
			}
		};

	});