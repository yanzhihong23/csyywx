'use strict';

angular.module('csyywx')
	.controller('BuyCtrl', function($scope, $rootScope, $ionicPlatform, $state, $ionicLoading, UserApi, PayApi, userConfig, $timeout, orderService, utils, localStorageService, settingService, productService) {
		var sessionId = userConfig.getSessionId(), productCode, level, orderId, card, touchRange=false;
		var setting = settingService.setting;

		$scope.isAndroidWechat = $rootScope.wechat && $ionicPlatform.is('android');
		// $scope.isAndroidWechat = $ionicPlatform.is('android');

		var init = function() {
			$scope.salaryDaySet = false;
			$scope.inSalaryDays = false;
			$scope.terms = [];
			$scope.order = {
				minAmount: 1,
				amount: null,
				range: 80,
				reward: 0
			};
			// get data
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
									// save order id
									orderId = data.data.orderid;
									// hasPayPassword = !!+data.data.userDetail.hasPayPassword;
									card = data.data.bindCardList && data.data.bindCardList[0];

									initRange(data.data.monthRates);
									// va len = data.data.monthRates.length;
									// len/100*

									if(!$scope.isAndroidWechat) {
										$timeout(function() {
											rangePositionFix();
										}, 100);
									}

									localStorageService.add('limit', data.data.limitExplain);
								}
							})
						;
					}
				});
		};

		var initRange = function(data) {
			$scope.terms = data.map(function(obj) {
				return {
					name: obj.monthName,
					annualYield: (obj.productRate*100 + obj.monthRate*100 + ($scope.inSalaryDays ? obj.increaseRate*100 : 0))/100,
					maxAmount: (card && card.rechargeLimit > 0) ? Math.min(card.rechargeLimit, +obj.investAmountMax) : +obj.investAmountMax ,
					days: +obj.countDays,
					desc: obj.description,
					systemMonthRateId: obj.systemMonthRateId
				};
			});

			console.log($ionicPlatform.is('android'))

			if($scope.isAndroidWechat) { // android wechat
				productService.products = $scope.terms;
				$scope.selected = productService.selected;
				$scope.$watch('selected', function(val) {
					if(angular.isDefined(val.level)) {
						level = val.level;
						changeLevel();
					}
				}, true)
			} else {
				angular.element(document.querySelector('#BUY'))
					.bind('touchend', function() {
						if (touchRange) {
							rangePositionFix();
							touchRange = false;
						}
					});
				angular.element(document.getElementById('range_item'))
					.bind('touchstart', function() {
						document.getElementById('amount').blur();
						touchRange = true;
					});
			}

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

				changeLevel()

				calculate();
			});

			$scope.$watch('order.amount', function(val) {
				calculate();
			});
		};

		var changeLevel = function() {
			var term = $scope.terms[level];
			$scope.order.name = term.name;
			$scope.order.annualYield = term.annualYield;
			$scope.order.maxAmount = term.maxAmount;
			$scope.order.days = term.days;
			$scope.order.desc = term.desc;
			$scope.order.systemMonthRateId = term.systemMonthRateId;
		};

		var calculate = function() {
			$scope.order.amount = Math.min(parseFloat($scope.order.amount), $scope.order.maxAmount);
			$scope.order.reward = +$scope.order.amount*$scope.order.annualYield/100/365*$scope.order.days || 0;
		};

		var rangePositionFix = function() {
			var len = $scope.terms.length;
			if (len === 0) return;
			//$scope.order.range = level/(len)*100 + 100/len/2;
			$scope.order.range = checkPosition() ? checkPosition() : level/(len)*100 + 100/len/2;
			if (+level <= 0) {
				$scope.order.range = 1;
			}
			console.log(+level, len-1, +level>len-1)
			if (+level >= len -1) {
				$scope.order.range = 99;
			}
			$scope.$apply();
		};

		function checkPosition() {
			var activeEle = document.querySelector('.terms .active-position');
			var padding = 11;
			var width = window.innerWidth;
			var hopePosition = +((activeEle.offsetLeft - padding)/(width - 2*padding-24/320*width)*100);
			if (width>=768) {
				return false;
			} else {
				return hopePosition;
			}
		}

		$scope.selectItem = function() {
			$state.go('tabs.selectItem');
		};


		$scope.submit = function() {
			orderService.order = {
				sessionId: sessionId,
				orderId: orderId,
				productCode: productCode,
				amount: $scope.order.amount,
				systemMonthRateId: $scope.order.systemMonthRateId
			};

			if(card) {
				if(!setting.payPassword) {
					utils.confirm({
						title: '温馨提示',
						content: '您还未设置支付密码',
						okText: '去设置',
						onOk: function() {
							$state.go('tabs.setPayPasswordBuy');
						}
					})
				} else {
					// go to quick pay
					orderService.order.userCardCode = card.userCardCode;
					orderService.order.storablePan = card.shortNumber;
					orderService.order.bankName = card.bankName;
					orderService.order.tailNo = card.bankCardNumber;
					$state.go('tabs.quickpay');
				}
			} else {
				// go to bind and pay
				$state.go('tabs.pay');
			}
		};

		$scope.$on('$ionicView.beforeEnter', function(){
			// init();
    });

		init();
	})
	.controller('SelectItemCtrl', function($scope, productService, utils) {
		$scope.items = productService.products;

		$scope.select = function(index) {
			productService.selected.level = index;
			utils.goBack();
		};
	})
	.service('productService', function() {
		this.products = [];

		this.selected = {};
	})