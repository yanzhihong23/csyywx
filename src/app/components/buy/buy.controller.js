'use strict';

angular.module('csyywx')
	.controller('BuyCtrl', function($scope, $ionicLoading, UserApi, PayApi, userConfig) {

		$scope.api = {
			sessionId: userConfig.getSessionId()
		};

		// 需要提交的表单数据
		$scope.form = {
			term: 10, // 期限
			increaseRate: 2, // 加息
			amount: '' // 投资金额
		};

		// 其他数据
		$scope.other = {
			interest: 0.00, // 基本收益率
			totalInterest: 0.00, // 百分数
			level: 1, // 期限层级
			minAmount: 10, // 最小投资金额
			maxAmount: 200000, // 最大投资金额
			left: 0, // 悬浮滑块移动距离
			isSetSalaryDay: 0, // 是否设置过加息日
			isBetweenSalaryDate: 1, // 当前日期是否在加息日中
			back: { // 到期可收回
				total: 0.00,
				int: '0', // 整数部分
				dec: '.00元' // 小数部分
			}
		};

		// 滑块数据
		$scope.range = {
			terms: []
		};

		//
		var Func = {

			changeInterest: function() {
				var level = $scope.other.level;
				var terms = $scope.range.terms;
				$scope.form.increaseRate = terms[level].increaseRate;
				$scope.other.interest = terms[level].interest;
				$scope.other.totalInterest = ($scope.other.interest + $scope.form.increaseRate).toFixed(2);
			},

			// 更改期限
			changeTerm: function() {
				var level = $scope.other.level;
				var terms = $scope.range.terms;
				terms.forEach(function(self) {
					if (self.active) {
						self.active = false;
					}
				});

				terms[level].active = true;
			},

			// 更改滑块移动距离
			changeLeft: function() {
				var term = $scope.form.term;
				$scope.other.left = term*1.83 + '%';
			},

			// 更改最大投资金额
			changeMaxAmount: function() {
				var level = $scope.other.level;
				var terms = $scope.range.terms;
				$scope.other.maxAmount = terms[level].maxAmount;
			},

			// 计算到期可收回
			changeBack: function() {
				var level = $scope.other.level;
				var terms = $scope.range.terms;
				$scope.other.back.total = $scope.form.amount * ($scope.other.interest + $scope.form.increaseRate)/100/365 * terms[level].days;
				//if (isNaN($scope.other.back.total)) {
				//	$scope.other.back.int = '金额超过上限';
				//	$scope.other.back.dec = '';
				//} else {
				//	$scope.other.back.int = Math.floor($scope.other.back.total);
				//	$scope.other.back.dec = '.' + (100*($scope.other.back.total.toFixed(2) - $scope.other.back.int)).toFixed(0) + '元';
				//}
			},

			checkAmount: function() {

				$scope.form.amount = parseFloat($scope.form.amount);
				var dec = ($scope.form.amount+'').split('.')[1];
				if (dec && dec.length > 2) {
					$scope.form.amount = Math.floor(100*$scope.form.amount)/100;
				}

				if ($scope.form.amount > $scope.other.maxAmount) {
					$scope.form.amount = $scope.other.maxAmount;
				}
			},

			// api返回数据
			// 期限利率对象 monthRates
			monthRates: function(data) {
				data.forEach(function(self) {
					var each = {};
					each.term = self.monthName;
					each.interest = self.productRate;
					each.maxAmount = self.investAmountMax;
					each.days = self.countDays;
					each.increaseRate = self.increaseRate;

					$scope.range.terms.push(each);
				});
			},
			// 返回其他数据
			otherData: function(data) {
				$scope.other.minAmount = +data.productRule.investAmountMin;
				$scope.other.isSetSalaryDay = data.isSetSalaryDay;
				$scope.other.isBetweenSalaryDate = data.isBetweenSalaryDate;
			},

			watches: function() {
				$scope.$watch('form.term', function() {
					var len = $scope.range.terms.length;
					var term = $scope.form.term;
					if (len === 0) return;
					$scope.other.level = (Math.abs(term-100/len/2)/100*len).toFixed(0);

					Func.changeLeft();
				});
				$scope.$watch('other.level', function() {
					var level = $scope.other.level;
					var terms = $scope.range.terms;
					if (!terms[level]) return;
					Func.changeTerm();
					Func.changeInterest();
					Func.changeMaxAmount();
					Func.changeBack();
				});

				$scope.$watch('form.amount', function() {
					if ($scope.form.amount === '') {
						return;
					}
					if (/\.$/.test($scope.form.amount)) {
						$scope.form.amount.replace(/\.+$/, '.');
						return;
					}

					Func.changeBack();

					Func.checkAmount();
				});
			},

			others: function() {
				$scope.inputBlur = function() {
					if ($scope.form.amount < $scope.other.minAmount && $scope.form.amount !== '') {
						$scope.form.amount = $scope.other.minAmount;
					}
				};

				window.addEventListener('touchend', function() {
					//	停止滑动
					var len = $scope.range.terms.length;
					var level = $scope.other.level;
					if (len === 0) return;
					$scope.form.term = level/len*100 + 100/len/2;
					if (+level === 0) {
						$scope.form.term = 1;
					}
					if (+level === len -1) {
						$scope.form.term = 99;
					}
					$scope.$apply();
				});

				window.addEventListener('touchstart', function() {
					//	滑块bug，投资金额焦点导致滑块不能滑动
					document.getElementById('amount').blur();
				});
			}

		};

		$ionicLoading.show();
		PayApi.getProductCode({sessionId: ''})
			.success(function(data) {
				console.log(data);
				$ionicLoading.hide();
				if (+data.flag === 1) {
					$scope.api.productCode = data.data.productCode;
					$ionicLoading.show();
					PayApi.initOrder($scope.api)
						.success(function(data) {
							console.log(data);
							$ionicLoading.hide();
							if (+data.flag === 1) {
								Func.monthRates(data.data.monthRates);
								Func.otherData(data.data);
								Func.watches();
								Func.others();
							}
						})
					;
				}
			})
		;

	});