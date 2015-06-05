'use strict';

angular.module('csyywx')
	.controller('BuyCtrl', function($scope, UserApi, PayApi) {

		$scope.api = {
			sessionId: ''
		};

		PayApi.getProductCode({sessionId: ''})
			.success(function(data) {
				console.log(data);
				if (+data.flag === 1) {
					$scope.api.productCode = data.data.productCode;
					PayApi.initOrder($scope.api)
						.success(function(data) {
							console.log(data);
						})
					;
				}
			})
		;

		// 需要提交的表单数据
		$scope.form = {
			term: 10, // 期限
			addInterest: 2, // 加息
			amount: '' // 投资金额
		};

		// 其他数据
		$scope.other = {
			interest: 0, // 基本收益率
			totalInterest: 0, // 百分数
			level: 1, // 期限层级
			maxAmount: 200000, // 最大投资金额
			left: 0, // 悬浮滑块移动距离
			back: { // 到期可收回
				total: 1000.97,
				int: '1000', // 整数部分
				dec: '.97元' // 小数部分
			}
		};

		// 滑块数据
		$scope.range = {
			terms: [{
				term: '7天', // 时间
				interest: 0.7, // 收益
				maxAmount: '200000', // 最高投资金额
				days: 7
			},{
				term: '1月',
				interest: 1,
				maxAmount: '200000',
				days: 30
			},{
				term: '2月',
				interest: 2,
				maxAmount: '200000',
				days: 61
			},{
				term: '3月',
				interest: 3,
				maxAmount: '200000',
				days: 91
			},{
				term: '4月',
				interest: 4,
				maxAmount: '200000',
				days: 122
			},{
				term: '5月',
				interest: 5,
				maxAmount: '200000',
				days: 152
			},{
				term: '6月',
				interest: 6,
				maxAmount: '200000',
				days: 183
			},{
				term: '7月',
				interest: 7,
				maxAmount: '200000',
				days: 213
			},{
				term: '8月',
				interest: 8,
				maxAmount: '500000',
				days: 244
			},{
				term: '9月',
				interest: 9,
				maxAmount: '600000',
				days: 274
			},{
				term: '10月',
				interest: 10,
				maxAmount: '700000',
				days: 305
			},{
				term: '11月',
				interest: 11,
				maxAmount: '800000',
				days: 335
			},{
				term: '12月',
				interest: 12,
				maxAmount: '900000',
				days: 365
			}]
		};

		//
		var Func = {

			changeInterest: function() {
				var level = $scope.other.level;
				var terms = $scope.range.terms;
				$scope.other.interest = terms[level].interest;
				$scope.other.totalInterest = ($scope.other.interest + $scope.form.addInterest).toFixed(2);
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
				$scope.other.back.total = $scope.form.amount * ($scope.other.interest + $scope.form.addInterest)/100/365 * terms[level].days;
				if (isNaN($scope.other.back.total)) {
					$scope.other.back.int = '金额超过上限';
					$scope.other.back.dec = '';
				} else {
					$scope.other.back.int = Math.floor($scope.other.back.total);
					$scope.other.back.dec = '.' + (100*($scope.other.back.total.toFixed(2) - $scope.other.back.int)).toFixed(0) + '元';
				}
			},

			checkAmount: function() {
				if ($scope.form.amount === '') {
					return;
				}
				if (/\.$/.test($scope.form.amount)) {
					return;
				}

				$scope.form.amount = parseFloat($scope.form.amount);
				var dec = ($scope.form.amount+'').split('.')[1];
				if (dec && dec.length > 2) {
					$scope.form.amount = Math.floor(100*$scope.form.amount)/100;
				}

				if ($scope.form.amount > $scope.other.maxAmount) {
					$scope.form.amount = $scope.other.maxAmount;
				}
			}

		};

		$scope.$watch('form.term', function() {
			var len = $scope.range.terms.length;
			var term = $scope.form.term;
			$scope.other.level = (Math.abs(term-100/len/2)/100*len).toFixed(0);

			Func.changeLeft();
		});
		$scope.$watch('other.level', function() {
			Func.changeTerm();
			Func.changeInterest();
			Func.changeMaxAmount();
			Func.changeBack();
		});

		$scope.$watch('form.amount', function() {
			Func.changeBack();

			Func.checkAmount();
		});

		window.addEventListener('touchend', function() {
		//	停止滑动
		});

	});