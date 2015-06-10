'use strict';

angular.module('csyywx')
	.controller('BuyCtrl', function($scope, $ionicLoading, UserApi, PayApi, userConfig) {
		var sessionId = userConfig.getSessionId(), productCode, level;

		$scope.salaryDaySet = false;

		$scope.order = {
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
					productCode = data.data.productCode;
					$ionicLoading.show();
					PayApi.initOrder({
						sessionId: userConfig.getSessionId(),
						productCode: productCode
					}).success(function(data) {
							$ionicLoading.hide();
							if (+data.flag === 1) {
								initRange(data.data.monthRates);
								$scope.salaryDaySet = data.data.isSetSalaryDay;
							}
						})
					;
				}
			});

		var initRange = function(data) {
			$scope.terms = data.map(function(obj) {
				return {
					name: obj.monthName,
					annualYield: (obj.productRate*100 + obj.monthRate*100 + obj.increaseRate*100)/100,
					minAmount: 1,
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

		angular.element(document.querySelector('#BUY'))
			.bind('touchstart', function() {
				document.getElementById('amount').blur();
			})
			.bind('touchend', function() {
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
			});


		$scope.submit = function() {
			console.log($scope.order);
		};

	});